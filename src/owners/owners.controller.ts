import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Owners') // Grouping the API endpoints under "Owners"
@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new owner' })
  @ApiResponse({ status: 201, description: 'Owner created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all owners' })
  @ApiResponse({
    status: 200,
    description: 'List of all owners retrieved successfully',
  })
  findAll() {
    return this.ownersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an owner by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the owner' })
  @ApiResponse({ status: 200, description: 'Owner retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Owner not found' })
  findOne(@Param('id') id: string) {
    return this.ownersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an owner' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the owner' })
  @ApiResponse({ status: 200, description: 'Owner updated successfully' })
  @ApiResponse({ status: 404, description: 'Owner not found' })
  update(@Param('id') id: string, @Body() updateOwnerDto: UpdateOwnerDto) {
    return this.ownersService.update(+id, updateOwnerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an owner' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the owner' })
  @ApiResponse({ status: 200, description: 'Owner deleted successfully' })
  @ApiResponse({ status: 404, description: 'Owner not found' })
  remove(@Param('id') id: string) {
    return this.ownersService.remove(+id);
  }
}
