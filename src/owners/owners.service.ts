import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return this.ownerModel.findByPk(id);
  }

  update(id: number, updateOwnerDto: UpdateOwnerDto) {
    return this.ownerModel.update(updateOwnerDto, { where: { id } });
  }

  remove(id: number) {
    return this.ownerModel.destroy({ where: { id } });
  }
}
