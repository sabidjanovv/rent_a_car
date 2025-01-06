import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BookingService } from "../../booking/booking.service";

@Injectable()
export class BookingByIdGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly bookingService: BookingService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
      throw new UnauthorizedException("Unauthorized user");
    }

    const bearer = authHeaders.split(" ")[0];
    const token = authHeaders.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      throw new UnauthorizedException("Unauthorized user");
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
      throw new UnauthorizedException("Unauthorized user");
    }

    if (payload.is_active !== true) {
      throw new ForbiddenException({
        message: "Active emassiz! Active bo'lish uchun emailga yuborilgan link ustiga bosing!",
      });
    }

    // if (payload.is_customer !== true) {
    //   throw new ForbiddenException(
    //     "Sizda bunday huquq yo'q! Siz customer emassiz!"
    //   );
    // }

    const booking = await this.bookingService.findOne(req.params.id);
    const customerId = booking.customer_id;

    if (Number(payload.id) !== Number(customerId)) {
      throw new ForbiddenException(
        "Sizda bunday huquq yo'q! Siz faqat o'zingizni ma'lumotlaringizni ko'ra olasiz va o'zgartira olasiz"
      );
    }

    return true;
  }
}
