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
import { RentalHistoryService } from './rental_history.service';
import { CreateRentalHistoryDto } from './dto/create-rental_history.dto';
import { UpdateRentalHistoryDto } from './dto/update-rental_history.dto';
// import { AdminGuard } from '../common/guards/admin.guard';
// import { CustomerRentalHistoryGuard } from '../common/guards/customer-rental-history.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Rental History')
@Controller('rental-history')
export class RentalHistoryController {
  constructor(private readonly rentalHistoryService: RentalHistoryService) {}

  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Yangi ijaraga olish tarixini qo'shish" })
  @ApiResponse({
    status: 201,
    description: "Ijara tarixi muvaffaqiyatli qo'shildi.",
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @Post()
  create(@Body() createRentalHistoryDto: CreateRentalHistoryDto) {
    return this.rentalHistoryService.create(createRentalHistoryDto);
  }

  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Barcha ijara tarixlarini olish' })
  @ApiResponse({ status: 200, description: "Ijara tarixlari ro'yxati." })
  @Get()
  findAll() {
    return this.rentalHistoryService.findAll();
  }

  // @UseGuards(CustomerRentalHistoryGuard)
  @ApiOperation({ summary: "ID bo'yicha ijara tarixini olish" })
  @ApiParam({
    name: 'id',
    description: 'Ijara tarixining unikal ID raqami',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Topilgan ijara tarixi.' })
  @ApiResponse({ status: 404, description: 'Ijara tarixi topilmadi.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rentalHistoryService.findOne(+id);
  }

  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Ijara tarixini yangilash' })
  @ApiParam({
    name: 'id',
    description: 'Ijara tarixining unikal ID raqami',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Ijara tarixi muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumotlar." })
  @ApiResponse({ status: 404, description: 'Ijara tarixi topilmadi.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRentalHistoryDto: UpdateRentalHistoryDto,
  ) {
    return this.rentalHistoryService.update(+id, updateRentalHistoryDto);
  }

  // @UseGuards(AdminGuard)
  @ApiOperation({ summary: "Ijara tarixini o'chirish" })
  @ApiParam({
    name: 'id',
    description: 'Ijara tarixining unikal ID raqami',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: "Ijara tarixi muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Ijara tarixi topilmadi.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentalHistoryService.remove(+id);
  }
}
