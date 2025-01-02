import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { CarGuard } from '../common/guards/car.guard';
import { CarByIdGuard } from '../common/guards/car-by-id.guard';
// import { CarGuard } from '../common/guards/car.guard';
// import { AdminGuard } from '../common/guards/admin.guard';
// import { HybridGuard } from '../common/guards/hybrid.guard';

@ApiTags('Cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @UseGuards(CarGuard)
  @Post()
  @ApiOperation({ summary: "Yangi mashina qo'shish" })
  @ApiResponse({
    status: 201,
    description: "Mashina muvaffaqiyatli qo'shildi.",
  })
  @ApiResponse({ status: 400, description: "Xato ma'lumot kiritildi." })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  // @UseGuards(HybridGuard)
  @Get()
  @ApiOperation({ summary: "Barcha mashinalar ro'yxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Mashinalar ro'yxati muvaffaqiyatli olindi.",
  })
  findAll() {
    return this.carsService.findAll();
  }

  // @UseGuards(HybridGuard)
  @Get('/free')
  @ApiOperation({ summary: "Barcha mashinalar ro'yxatini olish" })
  @ApiResponse({
    status: 200,
    description: "Mashinalar ro'yxati muvaffaqiyatli olindi.",
  })
  findAllFreeCar() {
    return this.carsService.findAllFreeCar();
  }

  @Get('price')
  @ApiOperation({ summary: "Narx oralig'idagi mashinalarni olish" })
  @ApiResponse({
    status: 200,
    description: 'Mashinalar muvaffaqiyatli olindi.',
  })
  @ApiResponse({ status: 400, description: 'Noto‘g‘ri parametrlar.' })
  async findCarsByPriceRange(
    @Query('min') min: string,
    @Query('max') max: string,
  ) {
    const minPrice = parseFloat(min);
    const maxPrice = parseFloat(max);

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      throw new Error("Min va max qiymatlar son bo'lishi kerak.");
    }

    return this.carsService.findCarsByPriceRange(minPrice, maxPrice);
  }

  @Get('brand/:brand')
  @ApiOperation({ summary: "brand orqali ma'lum bir mashinalarni olish" })
  @ApiParam({
    name: 'brand',
    description: "Olish kerak bo'lgan mashinalarning brandi",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Mashinalar muvaffaqiyatli olindi.',
  })
  @ApiResponse({ status: 404, description: 'Mashinalar topilmadi.' })
  findByBrand(@Param('brand') brand: string) {
    return this.carsService.findByBrand(brand);
  }

  @Get('model/:model')
  @ApiOperation({ summary: "model orqali ma'lum bir mashinalarni olish" })
  @ApiParam({
    name: 'model',
    description: "Olish kerak bo'lgan mashinalarning modeli",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Mashinalar muvaffaqiyatli olindi.',
  })
  @ApiResponse({ status: 404, description: 'Mashinalar topilmadi.' })
  findByModel(@Param('model') model: string) {
    return this.carsService.findByModel(model);
  }

  @Get(':id')
  @ApiOperation({ summary: "ID orqali ma'lum bir mashinani olish" })
  @ApiParam({
    name: 'id',
    description: "Olish kerak bo'lgan mashinaning IDsi",
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Mashina muvaffaqiyatli olindi.' })
  @ApiResponse({ status: 404, description: 'Mashina topilmadi.' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(+id);
  }

  @UseGuards(CarByIdGuard)
  @Patch(':id')
  @ApiOperation({ summary: "ID orqali ma'lum bir mashinani yangilash" })
  @ApiParam({
    name: 'id',
    description: "Yangilash kerak bo'lgan mashinaning IDsi",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Mashina muvaffaqiyatli yangilandi.',
  })
  @ApiResponse({ status: 404, description: 'Mashina topilmadi.' })
  @ApiResponse({ status: 400, description: "Xato ma'lumot kiritildi." })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(+id, updateCarDto);
  }

  @UseGuards(CarByIdGuard)
  @Delete(':id')
  @ApiOperation({ summary: "ID orqali ma'lum bir mashinani o'chirish" })
  @ApiParam({
    name: 'id',
    description: "O'chirilishi kerak bo'lgan mashinaning IDsi",
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: "Mashina muvaffaqiyatli o'chirildi.",
  })
  @ApiResponse({ status: 404, description: 'Mashina topilmadi.' })
  remove(@Param('id') id: string) {
    return this.carsService.remove(+id);
  }
}
