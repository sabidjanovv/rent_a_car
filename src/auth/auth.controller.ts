import { Controller, Post, Body, Res, Param, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Admin } from '../admin/models/admin.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { Response, Request } from 'express';
import { SignInDto } from './dto/admin-signin.dto';
import { CookieGetter } from '../common/decorators/cookieGetter.decorator';
import { User } from '../user/models/user.model';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AdminCreatorGuard)
  @Post('admin-signup')
  @ApiOperation({ summary: 'Add a new admin (created by is_creator)' })
  @ApiResponse({
    status: 201,
    description: 'Create Admin',
    type: Admin,
  })
  async adminSignUp(
    @Body() createAdminDto: CreateAdminDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.adminSignUp(createAdminDto, res);
    return res.status(201).json(result);
  }

  @Post('admin-signin')
  @ApiOperation({ summary: 'Admin login to the system' })
  @ApiResponse({
    status: 200,
    description: 'Admin signin',
    type: Admin,
  })
  async adminSignIn(@Body() adminSignInDto: SignInDto, @Res() res: Response) {
    return this.authService.adminSignIn(adminSignInDto, res);
  }

  @ApiOperation({ summary: 'Refresh token to update credentials' })
  @Post('/refreshToken/:id')
  async refreshToken(
    @Param('id') id: number,
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshToken(id, refresh_token, res);
  }

  @Post('admin-signout/:id')
  @ApiOperation({ summary: 'Admin logout from the system' })
  @ApiResponse({
    status: 200,
    description: 'Admin signout',
  })
  async adminSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    return this.authService.adminSignOut(refreshToken, res, +id);
  }

  // ========================== USER =========================
  @Post('user-signup')
  @ApiOperation({ summary: "Yangi user qo'shish" })
  @ApiResponse({
    status: 201,
    description: 'Create user',
    type: User,
  })
  async userSignUp(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    const result = await this.authService.userSignUp(createUserDto, res);
    return res.status(201).json(result);
  }

  @ApiOperation({ summary: 'Userni aktivlashtirish uchun link' })
  @Get('activate/:link')
  activateUser(@Param('link') link: string, @Res() res: Response) {
    return this.authService.activateUser(link, res);
  }

  @Post('user-signin')
  @ApiOperation({ summary: 'user tizimga kirish' })
  @ApiResponse({
    status: 200,
    description: 'user signin',
    type: User,
  })
  async userSignIn(@Body() userSignInDto: SignInDto, @Res() res: Response) {
    return this.authService.userSignIn(userSignInDto, res);
  }

  @Post('user-signout/:id')
  @ApiOperation({ summary: 'user tizimdan chiqishi' })
  @ApiResponse({
    status: 200,
    description: 'user signout',
  })
  async userSignOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param('id') id: string, // Correct usage of decorator
  ) {
    const refreshToken = req.cookies['refresh_token'];

    return this.authService.userSignOut(refreshToken, res, +id);
  }
}
