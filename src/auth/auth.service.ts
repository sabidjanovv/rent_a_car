import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Admin } from '../admin/models/admin.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Response } from 'express';
import { SignInDto } from './dto/admin-signin.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/models/user.model';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin) private adminModel: typeof Admin,
    @InjectModel(User) private userModel: typeof User,
    // @InjectModel(Customer) private customerModel: typeof Customer,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  //===================== TOKEN GENERATION ======================
  async generateToken(payload: any) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  //===================== REFRESH TOKEN ======================
  async refreshToken(id: number, refresh_token: string, res: Response) {
    try {
      const verified_token = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      if (!verified_token || id != verified_token.id) {
        throw new ForbiddenException('Forbidden or invalid refresh token');
      }

      const payload = { id: verified_token.id, login: verified_token.login };
      const token = this.jwtService.sign(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      });

      return { access_token: token };
    } catch (error) {
      throw new InternalServerErrorException('Error refreshing token');
    }
  }

  //===================== ADMIN SIGN UP ======================
  async adminSignUp(createAdminDto: CreateAdminDto, res: Response) {
    const existingAdmin = await this.adminModel.findOne({
      where: { login: createAdminDto.login },
    });
    const existingEmail = await this.adminModel.findOne({
      where: { email: createAdminDto.email },
    })
    if (existingAdmin) throw new BadRequestException('Admin already exists');
    if (existingEmail) throw new BadRequestException('Email already exists');

    if (createAdminDto.password !== createAdminDto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashed_password = await bcrypt.hash(createAdminDto.password, 7);
    const newAdmin = await this.adminModel.create({
      ...createAdminDto,
      hashed_password,
    });

    const tokens = await this.generateToken({
      id: newAdmin.id,
      login: newAdmin.login,
      is_active: newAdmin.is_active,
      is_admin: newAdmin.is_admin,
      is_creator: newAdmin.is_creator,
    });

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await newAdmin.update({ hashed_refresh_token });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    return {
      message: 'Admin successfully registered',
      admin: newAdmin,
      access_token: tokens.access_token,
    };
  }

  //===================== ADMIN SIGN IN ======================
  async adminSignIn(signInDto: SignInDto, res: Response) {
    const { login, password } = signInDto;
    const admin = await this.adminModel.findOne({ where: { login } });
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.hashed_password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const tokens = await this.generateToken({
      id: admin.id,
      login: admin.login,
      is_active: admin.is_active,
      is_admin: admin.is_admin,
      is_creator: admin.is_creator,
    });

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await admin.update({ hashed_refresh_token, is_active: true });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    return res.json({
      message: 'Admin signed in successfully',
      access_token: tokens.access_token,
    });
  }

  //===================== ADMIN SIGN OUT ======================
  async adminSignOut(refreshToken: string, res: Response, id: number) {
    const admin = await this.adminModel.findByPk(id);
    if (!admin) throw new UnauthorizedException('Admin not found');

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      admin.hashed_refresh_token,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await admin.update({ hashed_refresh_token: '' });

    res.clearCookie('refresh_token', { httpOnly: true });
    return { message: 'Admin signed out successfully', id };
  }

  // ======================= USER ========================

  async generateTokenUser(user: User) {
    const payload = {
      id: user.id,
      login: user.login,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);

    return { access_token, refresh_token };
  }

  async userSignUp(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });
    const existingLogin = await this.userModel.findOne({
      where: { login: createUserDto.login },
    });
    const existingPhone = await this.userModel.findOne({
      where: { phone_number: createUserDto.phone_number },
    })

    if (user) {
      throw new BadRequestException('Bunday user mavjud');
    }
    if (existingLogin) {
      throw new BadRequestException('Bunday login allaqachon mavjud');
    }
    if (existingPhone) {
      throw new BadRequestException('Bunday telefon raqam allaqachon mavjud');
    }

    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Parollar mos emas');
    }

    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.userModel.create({
      ...createUserDto,
      hashed_password,
    });
    const tokens = await this.generateTokenUser(newUser);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const activation_link = uuid.v4();
    const updatedUser = await this.userModel.update(
      { hashed_refresh_token, activation_link },
      { where: { id: newUser.id }, returning: true },
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    try {
      await this.mailService.sendMail(updatedUser[1][0]);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Xat yuborishda xatolik');
    }

    const response = {
      message:
        "user tizimga muvaffaqiyatli qo'shildi, Actilashtirish uchun emailga kelgan link ustiga bosing!",
      user: updatedUser[1][0],
      access_token: tokens.access_token,
    };

    return response;
  }

  async activateUser(link: string, res: Response) {
    try {
      const user = await this.userModel.findOne({
        where: { activation_link: link },
      });
      if (!user) {
        return res.status(400).send({ message: 'Foydalanuvchi topilmadi!' });
      }

      if (user.is_active) {
        return res
          .status(400)
          .send({ message: 'Foydalanuvchi allaqachon faollashtirilgan.' });
      }

      user.is_active = true;
      await user.save();

      res.send({
        is_active: user.is_active,
        message: 'Foydalanuvchi muvaffaqiyatli faollashtirildi.',
      });
    } catch (error) {
      console.log(error);
    }
  }

  async userSignIn(userSignInDto: SignInDto, res: Response) {
    const { login, password } = userSignInDto;
    const user = await this.userModel.findOne({
      where: { login },
    });

    if (!user) {
      throw new UnauthorizedException('user topilmadi');
    }

    const validPassword = await bcrypt.compare(password, user.hashed_password);
    if (!validPassword) {
      throw new UnauthorizedException("Noto'g'ri parol");
    }

    const tokens = await this.generateTokenUser(user);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      maxAge: +process.env.REFRESH_TIME_MS,
    });

    await this.userModel.update(
      { hashed_refresh_token },
      { where: { login: login } },
    );
    return res.json({
      message: 'Tizimga muvaffaqiyatli kirildi',
      access_token: tokens.access_token,
    });
  }

  async userSignOut(refreshToken: string, res: Response, id: number) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });

      const user = await this.userModel.findOne({
        where: { id: payload.id },
      });
      if (!user) {
        throw new UnauthorizedException('This user not found');
      }

      if (Number(id) !== Number(user.id)) {
        throw new BadRequestException('Invalid id or token');
      }

      const valid_refresh_token = await bcrypt.compare(
        refreshToken,
        user.hashed_refresh_token,
      );
      if (!valid_refresh_token) {
        throw new UnauthorizedException("So'rovda xatolik");
      }

      res.clearCookie('refresh_token', {
        httpOnly: true,
      });

      await this.userModel.update(
        { hashed_refresh_token: '', },
        { where: { id: payload.id } },
      );

      return { message: 'user success signout', id: payload.id };
    } catch (error) {
      throw new BadRequestException('Internal server error');
    }
  }

  // =========================== CUSTOMER =======================================

  // async generateTokenCustomer(customer: Customer) {
  //   const payload = {
  //     id: customer.id,
  //     login: customer.login,
  //     is_active: customer.is_active,
  //     is_customer: customer.is_customer,
  //   };

  //   const [access_token, refresh_token] = await Promise.all([
  //     this.jwtService.signAsync(payload, {
  //       secret: process.env.ACCESS_TOKEN_KEY,
  //       expiresIn: process.env.ACCESS_TOKEN_TIME,
  //     }),
  //     this.jwtService.signAsync(payload, {
  //       secret: process.env.REFRESH_TOKEN_KEY,
  //       expiresIn: process.env.REFRESH_TOKEN_TIME,
  //     }),
  //   ]);

  //   return { access_token, refresh_token };
  // }

  // async customerSignUp(createCustomerDto: CreateCustomerDto, res: Response) {
  //   const customer_login = await this.customerModel.findOne({
  //     where: { login: createCustomerDto.login },
  //   });

  //   const customer_phone_number = await this.customerModel.findOne({
  //     where: { phone_number: createCustomerDto.phone_number },
  //   });

  //   const customer_extra_phone_number = await this.customerModel.findOne({
  //     where: { extra_phone_number: createCustomerDto.extra_phone_number },
  //   });

  //   const customer_email = await this.customerModel.findOne({
  //     where: { email: createCustomerDto.email },
  //   });

  //   const customer_passport_number = await this.customerModel.findOne({
  //     where: { passport_number: createCustomerDto.passport_number },
  //   });

  //   const customer_license_number = await this.customerModel.findOne({
  //     where: { license_number: createCustomerDto.license_number },
  //   });

  //   if (
  //     customer_login ||
  //     customer_phone_number ||
  //     customer_extra_phone_number ||
  //     customer_email ||
  //     customer_passport_number ||
  //     customer_license_number
  //   ) {
  //     throw new BadRequestException(
  //       "Ma'lumotlar orasida ba'zi ma'lumot bilan avval ro'yxatdan o'tilgan!",
  //     );
  //   }

  //   if (createCustomerDto.password !== createCustomerDto.confirm_password) {
  //     throw new BadRequestException('Parollar mos emas');
  //   }

  //   const hashed_password = await bcrypt.hash(createCustomerDto.password, 7);
  //   const newCustomer = await this.customerModel.create({
  //     ...createCustomerDto,
  //     hashed_password,
  //   });

  //   const tokens = await this.generateTokenCustomer(newCustomer);
  //   const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
  //   const activation_link = uuid.v4();

  //   const updatedCustomer = await this.customerModel.update(
  //     { hashed_refresh_token, activation_link },
  //     { where: { id: newCustomer.id }, returning: true },
  //   );

  //   res.cookie('refresh_token', tokens.refresh_token, {
  //     httpOnly: true,
  //     maxAge: +process.env.REFRESH_TIME_MS,
  //   });

  //   try {
  //     await this.mailService.sendMailCustomer(updatedCustomer[1][0]);
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException('Xat yuborishda xatolik');
  //   }

  //   const response = {
  //     message:
  //       "Customer tizimga muvaffaqiyatli qo'shildi, active bo'lish uchun emailga yuborilgan url ustiga bosing!",
  //     customer: updatedCustomer[1][0],
  //     access_token: tokens.access_token,
  //   };

  //   return response;
  // }

  // async activateCustomer(link: string, res: Response) {
  //   try {
  //     const customer = await this.customerModel.findOne({
  //       where: { activation_link: link },
  //     });
  //     if (!customer) {
  //       return res.status(400).send({ message: 'Foydalanuvchi topilmadi!' });
  //     }

  //     if (customer.is_active) {
  //       return res
  //         .status(400)
  //         .send({ message: 'Foydalanuvchi allaqachon faollashtirilgan.' });
  //     }

  //     customer.is_active = true;
  //     customer.is_customer = true;
  //     await customer.save();

  //     res.send({
  //       is_active: customer.is_active,
  //       message: 'Foydalanuvchi muvaffaqiyatli faollashtirildi.',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async customerSignIn(customerSignInDto: SignInDto, res: Response) {
  //   const { login, password } = customerSignInDto;
  //   const customer = await this.customerModel.findOne({
  //     where: { login },
  //   });

  //   if (!customer) {
  //     throw new UnauthorizedException('customer topilmadi');
  //   }

  //   if (!customer.is_customer) {
  //     throw new UnauthorizedException(
  //       'Emailga yuborilgan link orqali tasdiqlang!',
  //     );
  //   }

  //   const validPassword = await bcrypt.compare(
  //     password,
  //     customer.hashed_password,
  //   );
  //   if (!validPassword) {
  //     throw new UnauthorizedException("Noto'g'ri parol");
  //   }

  //   const tokens = await this.generateTokenCustomer(customer);
  //   const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
  //   res.cookie('refresh_token', tokens.refresh_token, {
  //     httpOnly: true,
  //     maxAge: +process.env.REFRESH_TIME_MS,
  //   });

  //   await this.customerModel.update(
  //     { is_active: true, hashed_refresh_token },
  //     { where: { login: login } },
  //   );
  //   return res.json({
  //     message: 'Tizimga muvaffaqiyatli kirildi',
  //     access_token: tokens.access_token,
  //   });
  // }

  // async customerSignOut(refreshToken: string, res: Response, id: number) {
  //   try {
  //     const payload = await this.jwtService.verifyAsync(refreshToken, {
  //       secret: process.env.REFRESH_TOKEN_KEY,
  //     });

  //     const customer = await this.customerModel.findOne({
  //       where: { id: payload.id },
  //     });

  //     if (customer.hashed_refresh_token === '') {
  //       throw new UnauthorizedException('This customer already signed out');
  //     }

  //     if (!customer) {
  //       throw new UnauthorizedException('This customer not found');
  //     }

  //     if (Number(id) !== Number(customer.id)) {
  //       throw new BadRequestException('Invalid id or token');
  //     }

  //     const valid_refresh_token = await bcrypt.compare(
  //       refreshToken,
  //       customer.hashed_refresh_token,
  //     );
  //     if (!valid_refresh_token) {
  //       throw new UnauthorizedException("So'rovda xatolik");
  //     }

  //     res.clearCookie('refresh_token', {
  //       httpOnly: true,
  //     });

  //     await this.customerModel.update(
  //       { hashed_refresh_token: '', is_active: false }, // Data to update
  //       { where: { id: payload.id } }, // Options object with `where` clause
  //     );

  //     return { message: 'customer success signout', id: payload.id };
  //   } catch (error) {
  //     throw new BadRequestException('Internal server error');
  //   }
  // }
}
