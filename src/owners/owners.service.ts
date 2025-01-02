import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Owner } from './models/owner.model';

@Injectable()
export class OwnersService {
  constructor(@InjectModel(Owner) private ownerModel: typeof Owner){}
  create(createOwnerDto: CreateOwnerDto) {
    return this.ownerModel.create(createOwnerDto);
  }

  findAll() {
    return this.ownerModel.findAll();
  }

  async findOne(id: number) {
    const owner = await this.ownerModel.findByPk(id);
    if (!owner) {
      throw new NotFoundException(`Owner with ID: ${id} not found!`);
    }
    return owner;
  }

  async update(id: number, updateOwnerDto: UpdateOwnerDto) {
    const owner = await this.ownerModel.findByPk(id);
    if (!owner) {
      throw new NotFoundException(`Owner with ID: ${id} not found!`);
    }
    return this.ownerModel.update(updateOwnerDto, { where: { id } });
  }

  async remove(id: number) {
    const owner = await this.ownerModel.findByPk(id);
    if (!owner) {
      throw new NotFoundException(`Owner with ID: ${id} not found!`);
    }
    return this.ownerModel.destroy({ where: { id } });
  }
}
