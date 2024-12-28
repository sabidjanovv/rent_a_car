import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RentalHistory } from './models/rental_history.model'; // Adjust the path if needed
import { CreateRentalHistoryDto } from './dto/create-rental_history.dto';
import { UpdateRentalHistoryDto } from './dto/update-rental_history.dto';

@Injectable()
export class RentalHistoryService {
  constructor(
    @InjectModel(RentalHistory)
    private readonly rentalHistoryModel: typeof RentalHistory,
  ) {}

  async create(createRentalHistoryDto: CreateRentalHistoryDto) {
    return await this.rentalHistoryModel.create(createRentalHistoryDto);
  }

  async findAll() {
    const histories = await this.rentalHistoryModel.findAll();
    return {
      data: histories,
      total: histories.length,
    }
  }

  async findOne(id: number) {
    const rentalHistory = await this.rentalHistoryModel.findByPk(id);
    if (!rentalHistory) {
      throw new NotFoundException(
        `Rental history record with ID ${id} not found`,
      );
    }
    return this.rentalHistoryModel.findByPk(id, { include: { all: true } });
  }

  async update(id: number, updateRentalHistoryDto: UpdateRentalHistoryDto) {
    const rentalHistory = await this.rentalHistoryModel.findByPk(id);
    if (!rentalHistory) {
      throw new NotFoundException(
        `Rental history record with ID ${id} not found`,
      );
    }
    return await rentalHistory.update(updateRentalHistoryDto);
  }

  async remove(id: number) {
    const rentalHistory = await this.rentalHistoryModel.findByPk(id);
    if (!rentalHistory) {
      throw new NotFoundException(
        `Rental history record with ID ${id} not found`,
      );
    }
    await rentalHistory.destroy();
  }
}
