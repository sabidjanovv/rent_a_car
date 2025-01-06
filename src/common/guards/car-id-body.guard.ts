import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { User } from '../../user/models/user.model';
import { Car } from '../../cars/models/car.model';
import { CarsService } from '../../cars/cars.service';
// import { OfficeService } from "../../office/office.service";
// import { Office } from "../../office/models/office.model";
// import { userService } from "../../owner/owner.service";
// import { Owner } from "../../owner/models/owner.model";

@Injectable()
export class CarBodyIdGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly carService: CarsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const [bearer, token] = authHeaders.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Unauthorized user');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    if (!payload) {
      throw new UnauthorizedException('Unauthorized user');
    }

    if (payload.is_owner !== true) {
      throw new ForbiddenException({
        message: "Sizda bunday huquq yo'q!, Owner emassiz!",
      });
    }

    const carId = req.body.car_id;
    // console.log(carId)
    const car = await this.carService.findOne(carId);

    if (!car || !(car instanceof Car)) {
      throw new ForbiddenException("car topilmadi yoki noto'g'ri turda!");
    }

    // const car_id = car.id;

    if (Number(payload.id) !== Number(car.user_id)) {
      // console.log(payload.id, car.user_id);

      throw new ForbiddenException("Siz faqat o'zingizni boshqara olasiz!");
    }

    // if (payload.is_active !== true && payload.is_owner == !true) {
    //   throw new ForbiddenException({
    //     message: "Sizda bunday huquq yo'q!, Active emassiz!",
    //   });
    // }

    return true;
  }
}
