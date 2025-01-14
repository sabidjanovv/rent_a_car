import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './models/like.model';
import { User } from '../user/models/user.model';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like) private likeModel: typeof Like,
    @InjectModel(User) private userModel: typeof User,
  ) {}
  create(createLikeDto: CreateLikeDto) {
    return this.likeModel.create(createLikeDto);
  }

  async findAll() {
    const likes = await this.likeModel.findAll();
    return {
      data: likes,
      total: likes.length
    }
  }

  async findByUserId(userId: number) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new BadRequestException(
        `User with ID: ${userId} not found. (Id: ${userId} bo'lgan foydalanuvchi topilmadi.)`,
      );
    }
    const likes = await this.likeModel.findAll({ where: { user_id: userId } });
    return {
      data: likes,
      total: likes.length
    }
  }

  findOne(id: number) {
    return this.likeModel.findByPk(id);
  }

  async remove(id: number) {
    return this.likeModel.destroy({where:{id}})
  }
}
