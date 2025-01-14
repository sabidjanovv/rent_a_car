import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './models/car.model';
import { InjectModel } from '@nestjs/sequelize';
import { Booking } from '../booking/models/booking.model';
import { Op } from 'sequelize';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car) private carModel: typeof Car,
    @InjectModel(Booking) private bookingModel: typeof Booking,
  ) {}

  async create(createCarDto: CreateCarDto) {
    createCarDto.model = createCarDto.model.toLowerCase();
    createCarDto.brand = createCarDto.brand.toLowerCase();
    return await this.carModel.create(createCarDto);
  }

  async findAll() {
    const today = new Date();

    // Retrieve all cars with their bookings
    const cars = await this.carModel.findAll({
      include: { all: true },
    });

    if (!cars.length) {
      throw new NotFoundException('Cars not found');
    }

    for (const car of cars) {
      if (car.status !== 'free') {
        // Fetch all bookings for the car
        const bookings = await this.bookingModel.findAll({
          where: { car_id: car.id },
        });

        const hasExpiredBooking = bookings.some(
          (booking) => new Date(booking.end_date) < today,
        );

        if (hasExpiredBooking) {
          const latestBooking = bookings.reduce((prev, current) => {
            return new Date(prev.end_date) > new Date(current.end_date)
              ? prev
              : current;
          });

          if (new Date(latestBooking.end_date) < today) {
            await this.carModel.update(
              { status: 'free' },
              { where: { id: car.id } },
            );
            // console.log(`Car with ID: ${car.id} status updated to 'free'`);
          }
        }
      }
    }

    const allCars = await this.carModel.findAll({
      include: { all: true },
    });

    // Return the updated list of cars
    return { data: allCars, total: allCars.length };
  }

  async findAllFreeCar() {
    const cars = await this.carModel.findAll({
      include: { all: true },
    });
    const today = new Date();

    const freeCars = await this.carModel.findAll({
      where: { status: 'free' },
      include: { all: true },
    });

    if (!freeCars.length) {
      throw new NotFoundException('No free cars found in the database.');
    }

    for (const car of cars) {
      if (car.status !== 'free') {
        const bookings = await this.bookingModel.findAll({
          where: { car_id: car.id },
        });

        const hasExpiredBooking = bookings.some(
          (booking) => new Date(booking.end_date) < today,
        );

        if (hasExpiredBooking) {
          const latestBooking = bookings.reduce((prev, current) => {
            return new Date(prev.end_date) > new Date(current.end_date)
              ? prev
              : current;
          });

          if (new Date(latestBooking.end_date) < today) {
            await this.carModel.update(
              { status: 'free' },
              { where: { id: car.id } },
            );
            // console.log(`Car with ID: ${car.id} status updated to 'free'`);
          }
        }
      }
    }

    const allFreeCars = await this.carModel.findAll({
      where: { status: 'free' },
      include: { all: true },
    });

    return {
      data: allFreeCars,
      total: allFreeCars.length,
    };
  }

  // async findByBrand(brand: string) {
  //   const cars = await this.carModel.findAll({
  //     where: { brand: brand.toLowerCase() },
  //     include: { all: true },
  //   });
  //   if (!cars.length) {
  //     throw new NotFoundException(`No cars found with the brand: ${brand}`);
  //   }
  //   return { data: cars, total: cars.length };
  // }

  // async findByModel(model: string) {
  //   const cars = await this.carModel.findAll({
  //     where: { model: model.toLowerCase() },
  //     include: { all: true },
  //   });

  //   if (!cars.length) {
  //     throw new NotFoundException(`No cars found with the model: ${model}`);
  //   }

  //   return { data: cars, total: cars.length };
  // }

  async findCarsByPriceRange(minPrice: number, maxPrice: number) {
    if (!minPrice || !maxPrice) {
      throw new NotFoundException('Please provide both minPrice and maxPrice.');
    }

    const cars = await this.carModel.findAll({
      where: {
        daily_price: {
          [Op.between]: [Number(minPrice), Number(maxPrice)],
        },
      },
      include: { all: true },
    });

    if (!cars.length) {
      throw new NotFoundException(
        'No cars found within the given price range.',
      );
    }

    return { data: cars, total: cars.length };
  }

  async findCarsByBrandAndModel(brand?: string, model?: string) {
    if (!brand && !model) {
      throw new BadRequestException(
        'At least one of "brand" or "model" must be provided.',
      );
    }

    const filters: any = {};
    if (brand) {
      filters.brand = { [Op.iLike]: brand.trim() };
    }
    if (model) {
      filters.model = { [Op.iLike]: model.trim() }; 
    }

    const cars = await this.carModel.findAll({
      where: filters,
      include: { all: true },
    });

    if (!cars.length) {
      const missingParams = [
        brand && `brand: ${brand}`,
        model && `model: ${model}`,
      ]
        .filter(Boolean)
        .join(' and ');

      throw new NotFoundException(`No cars found with the ${missingParams}.`);
    }

    return {
      data: cars,
      total: cars.length,
    };
  }

  async findOne(car_id: number) {
    const car = await this.carModel.findOne({
      where: { id: car_id },
      include: { all: true },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID: ${car_id} does not exist.`);
    }

    const bookings = await this.bookingModel.findAll({
      where: { car_id },
    });

    if (bookings.length > 0) {
      const today = new Date();

      // Check if any booking's end_date is in the past
      const hasExpiredBooking = bookings.some(
        (booking) => new Date(booking.end_date) < today,
      );

      if (hasExpiredBooking && car.status !== 'free') {
        const latestBooking = bookings.reduce((prev, current) => {
          return new Date(prev.end_date) > new Date(current.end_date)
            ? prev
            : current;
        });

        if (new Date(latestBooking.end_date) < today) {
          await this.carModel.update(
            { status: 'free' },
            { where: { id: car_id } },
          );
          // console.log(`Car with ID: ${car_id} status updated to 'free'`);
        }
      }
    }

    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const car = await this.carModel.update(updateCarDto, {
      where: { id },
      returning: true,
    });
    return car[1][0];
  }

  async remove(id: number) {
    const car = await this.carModel.findByPk(id);
    if (!car) {
      return { message: `ID: ${id} does not exist in the database` };
    }
    await this.carModel.destroy({ where: { id } });
    return { message: `ID: ${id} car has been deleted successfully` };
  }
}
