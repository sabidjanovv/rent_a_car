import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Owner } from './models/owner.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([Owner]), JwtModule.register({})],
  controllers: [OwnersController],
  providers: [OwnersService],
})
export class OwnersModule {}
