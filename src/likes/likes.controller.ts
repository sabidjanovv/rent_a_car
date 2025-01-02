import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserSelfLikesGuard } from '../common/guards/user-self-likes.guard';
import { UserSelfLikesDeleteGuard } from '../common/guards/user-self-delete-likes.guard';

@ApiTags('Likes') // Corrected spelling
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(UserSelfLikesGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new like' })
  @ApiResponse({ status: 201, description: 'Like created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  create(@Body() createLikeDto: CreateLikeDto) {
    return this.likesService.create(createLikeDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve all likes (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all likes retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.likesService.findAll();
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a like by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the like' })
  @ApiResponse({ status: 200, description: 'Like retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  findOne(@Param('id') id: number) {
    return this.likesService.findOne(id);
  }

  @UseGuards(UserSelfLikesDeleteGuard)
  @Get('user/:id')
  @ApiOperation({ summary: 'Retrieve all likes by a specific user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User likes retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found or no likes found' })
  findByUserId(@Param('id') id: number) {
    return this.likesService.findByUserId(id);
  }

  @UseGuards(UserSelfLikesDeleteGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a like by ID (User only)' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the like to delete',
  })
  @ApiResponse({ status: 200, description: 'Like deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  remove(@Param('id') id: number) {
    return this.likesService.remove(id);
  }
}
