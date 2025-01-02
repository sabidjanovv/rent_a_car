import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserSelfLikesGuard } from '../common/guards/user-self-likes.guard';
import { UserSelfLikesDeleteGuard } from '../common/guards/user-self-delete-likes.guard';

@ApiTags('LIkes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  findAll() {
    return this.likesService.findAll();
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.likesService.findOne(id);
  }

  @UseGuards(UserSelfLikesGuard)
  @Get('user/:id')
  findByUserId(@Param('id') id: number) {
    return this.likesService.findByUserId(id);
  }

  @UseGuards(UserSelfLikesDeleteGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.likesService.remove(id);
  }
}
