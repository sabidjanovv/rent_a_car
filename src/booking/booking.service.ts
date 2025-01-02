import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking } from './models/booking.model';
import { CarsService } from '../cars/cars.service';
import { InjectModel } from '@nestjs/sequelize';
import { Car } from '../cars/models/car.model';
import { UserService } from '../user/user.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking)
    private readonly bookingModel: typeof Booking,
    private readonly carsService: CarsService,
    private readonly userService: UserService,
    @InjectModel(Car) private readonly carModel: Car,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { customer_id, car_id, start_date, end_date } = createBookingDto;

    // Bugungi sanani olish
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugungi kunning vaqt qismini nolga sozlash

    // start_date va end_date'ni Date turiga o‘tkazish
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Sana validatsiyasi
    if (startDate < today) {
      throw new BadRequestException(
        "Boshlanish sanasi bugungi kundan avval bo'lishi mumkin emas",
      );
    }

    if (endDate < today) {
      throw new BadRequestException(
        "Tugash sanasi bugungi kundan avval bo'lishi mumkin emas",
      );
    }

    // start_date va end_date o'rtasidagi farqni tekshirish
    if (endDate <= startDate) {
      throw new BadRequestException(
        "Ijaraning tugash sanasi boshlanish sanasidan keyingi sana bo'lishi kerak",
      );
    }

    // Foydalanuvchini topish
    const existingCustomer = await this.userService.findOne(customer_id);
    if (!existingCustomer) {
      throw new BadRequestException('Foydayanuvchi topilmadi');
    }

    // Avtomobilni topish va tekshirish
    const car = await this.carsService.findOne(car_id);
    if (!car) {
      throw new BadRequestException('Avtomobil topilmadi');
    }

    if (car.status === 'busy' || car.status === 'booked') {
      throw new BadRequestException(
        'Avtomobil allaqachon band qilingan yoki ijarada!',
      );
    }

    // Ijara narxini hisoblash
    const rentalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
    );
    const totalPrice = rentalDays * car.daily_price;

    // Avtomobil statusini yangilash
    await this.carModel.update({ status: 'booked' }, { where: { id: car_id } });

    // Booking yaratish
    const booking = new this.bookingModel({
      ...createBookingDto,
      start_date: createBookingDto.start_date,
      end_date: createBookingDto.end_date,
      total_price: totalPrice,
      total_day: rentalDays,
      status: 'procces',
    });

    return booking.save();
  }

  async findAll() {
    await this.carsService.findAllFreeCar();
    const bookings = await this.bookingModel.findAll({ include: { all: true } });
    return{
      data: bookings,
      total: bookings.length
    }
  }

  async findOne(id: number) {
    // console.log(typeof id)
    const booking = await this.bookingModel.findOne({
      where: { id },
      include: { all: true },
    });
    if (!booking) {
      throw new BadRequestException(`ID: ${id} booking mavjud emas!`);
    }
    return booking;
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const { car_id, start_date, end_date } = updateBookingDto;

    const existingBooking = await this.bookingModel.findOne({
      where: { id },
      include: { all: true },
    });
    if (!existingBooking) {
      throw new BadRequestException(`ID: ${id} booking mavjud emas!`);
    }

    // Sanalarni tekshirish
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const timeDiff = endDate.getTime() - startDate.getTime();

    if (timeDiff <= 0) {
      throw new BadRequestException(
        "Ijaraning tugash sanasi boshlanish sanasidan keyin bo'lishi kerak",
      );
    }

    const rentalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); // kunlarni hisoblash

    // Eski avtomobilni statusini yangilash
    if (car_id && car_id !== existingBooking.car_id) {
      await this.carModel.update(
        { status: 'free' },
        { where: { id: existingBooking.car_id } },
      );

      const newCar = await this.carsService.findOne(car_id);
      if (!newCar) {
        throw new BadRequestException('Yangi avtomobil topilmadi');
      }

      if (newCar.status === 'busy' || newCar.status === 'booked') {
        throw new BadRequestException(
          'Yangi avtomobil allaqachon band qilingan yoki ijarada!',
        );
      }

      await this.carModel.update(
        { status: 'booked' },
        { where: { id: car_id } },
      );
    }

    // Yangi umumiy narxni hisoblash
    const car = car_id
      ? await this.carsService.findOne(car_id)
      : existingBooking.car;
    const totalPrice = rentalDays * car.daily_price;

    // Bookingni yangilash
    const [affectedRows, updatedBookings] = await this.bookingModel.update(
      {
        ...updateBookingDto,
        start_date,
        end_date,
        total_price: totalPrice,
        total_day: rentalDays,
        status: 'procces',
      },
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedRows === 0) {
      throw new BadRequestException(
        `ID: ${id} bookingni yangilash muvaffaqiyatsiz`,
      );
    }

    return updatedBookings[0];
  }

  async cancel(id: number) {
    const booking = await this.bookingModel.findByPk(id);
    if (!booking) {
      throw new BadRequestException(`ID: ${id} booking mavjud emas!`);
    }

    await this.carModel.update(
      { status: 'free' },
      { where: { id: booking.car_id } },
    );
    booking.status = 'cancelled';

    return booking.save();
  }

  async remove(id: number) {
    const booking = await this.bookingModel.findByPk(id);
    if (!booking) {
      return { message: `ID: ${id} does not exist in the database` };
    }
    await this.bookingModel.destroy({ where: { id } });
    return { message: `ID: ${id} booking has been deleted successfully` };
  }
}
