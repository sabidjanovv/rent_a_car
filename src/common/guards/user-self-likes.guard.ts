import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserSelfLikesGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
        message: "Sizda bunday huquq yo'q!, Active emassiz, Avtivlashtirish uchun email'ga yuborilgan link ustiga bosing!",
      });
    }

    if (Number(payload.id) !== Number(req.body.user_id)) {
      throw new ForbiddenException("Sizda bunday huquq yo'q!");
    }

    return true;
  }
}
