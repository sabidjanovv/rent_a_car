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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
// import { PaymentCreateGuard } from '../common/guards/payment-create.guard';
// import { AdminGuard } from '../common/guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentCreateGuard } from '../common/guards/payment-create.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(PaymentCreateGuard)
  @ApiOperation({ summary: "To'lovni yaratish" })
  @ApiResponse({ status: 201, description: "To'lov muvaffaqiyatli yaratildi." })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Barcha to'lovlarni olish" })
  @ApiResponse({ status: 200, description: "To'lovlar ro'yxati." })
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "ID orqali to'lovni olish" })
  @ApiParam({
    name: 'id',
    description: "To'lovning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({ status: 200, description: "Topilgan to'lov ma'lumotlari." })
  @ApiResponse({ status: 404, description: "To'lov topilmadi." })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "To'lovni yangilash" })
  @ApiParam({
    name: 'id',
    description: "To'lovning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "To'lov muvaffaqiyatli yangilandi.",
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: "To'lov topilmadi." })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: "To'lovni o'chirish" })
  @ApiParam({
    name: 'id',
    description: "To'lovning unikal ID raqami",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "To'lov muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: "To'lov topilmadi." })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
