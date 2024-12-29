import { Injectable, NotFoundException } from '@nestjs/common';
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
    return { cars: allCars, total: allCars.length };
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
      free_cars: allFreeCars,
      total: allFreeCars.length,
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
