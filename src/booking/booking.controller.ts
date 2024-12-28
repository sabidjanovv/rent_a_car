import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
// import { CustomerBookingGuard } from '../common/guards/customer-booking.guard';
// import { AdminGuard } from '../common/guards/admin.guard';
// import { BookingFindOneGuard } from '../common/guards/booking-findone.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // @UseGuards(CustomerBookingGuard)
  @ApiOperation({ summary: 'Yangi booking yaratish' })
  @ApiResponse({
    status: 201,
    description: 'Booking muvaffaqiyatli yaratildi.',
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha bookinglarni olish' })
  @ApiResponse({ status: 200, description: "Bookinglar ro'yxati." })
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  // @UseGuards(BookingFindOneGuard)
  @ApiOperation({ summary: 'Bookingni ID orqali olish' })
  @ApiParam({
    name: 'id',
    description: 'Bookingning unikal ID raqami',
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Topilgan booking ma'lumotlari." })
  @ApiResponse({ status: 404, description: 'Booking topilmadi.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  // @UseGuards(BookingFindOneGuard)
  @ApiOperation({ summary: 'Bookingni bekor qilish' })
  @ApiParam({
    name: 'id',
    description: 'Bookingning unikal ID raqami',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Booking muvaffaqiyatli bekor qilindi.',
  })
  @ApiResponse({ status: 404, description: 'Booking topilmadi.' })
  @Get(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.bookingService.cancel(+id);
  }

  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Booking ma'lumotlarini yangilash" })
  @ApiParam({
    name: 'id',
    description: 'Bookingning unikal ID raqami',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Booking muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: 'Booking topilmadi.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Bookingni o'chirish" })
  @ApiParam({
    name: 'id',
    description: 'Bookingning unikal ID raqami',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Booking muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Booking topilmadi.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
