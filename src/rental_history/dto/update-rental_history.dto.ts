import { PartialType } from '@nestjs/swagger';
import { CreateRentalHistoryDto } from './create-rental_history.dto';

export class UpdateRentalHistoryDto extends PartialType(CreateRentalHistoryDto) {}
