import { IsNotEmpty, IsEnum } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entity';

export class UpdateTicketStatusDto {
  @IsEnum(TicketStatus, { message: 'Status must be Active, Resolved, or Canceled.' })
  @IsNotEmpty()
  status: TicketStatus;
}