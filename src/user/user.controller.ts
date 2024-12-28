import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PhoneUserDto } from './dto/phone-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailUserDto } from './dto/email-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User unique identifier' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User unique identifier' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User unique identifier' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  //================ BOT VERIFY =================
  // @Post('newotp')
  // newOtp(@Body() emailUserDto: EmailUserDto) {
  //   return this.userService.newOtp(emailUserDto);
  // }

  // @Post('verifyotp')
  // verifyOtp(@Body() verifyUserDto: VerifyOtpDto) {
  //   return this.userService.verifyOtp(verifyUserDto);
  // }

  //=========== EMAIL VERIFY ===================
  @Post('newotp')
  @ApiOperation({ summary: 'Generate a new OTP for user' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Failed to send OTP' })
  async newOtp(@Body() emailUserDto: EmailUserDto) {
    if (!emailUserDto.email) {
      throw new BadRequestException('Email is required');
    }

    try {
      const result = await this.userService.newOtp(emailUserDto.email);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verifyotp')
  @ApiOperation({ summary: 'Verify the OTP for user' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Failed to verify OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, otp, verification_key } = verifyOtpDto;

    if (!email || !otp || !verification_key) {
      throw new BadRequestException(
        'Email, OTP, and verification key are required',
      );
    }

    try {
      const result = await this.userService.verifyOtp(
        verification_key,
        otp,
        email,
      );
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
