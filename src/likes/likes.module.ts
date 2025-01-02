import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { Like } from './models/like.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { CarsModule } from '../cars/cars.module';
import { User } from '../user/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Like, User]), JwtModule.register({})],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService, SequelizeModule],
})
export class LikesModule {}
