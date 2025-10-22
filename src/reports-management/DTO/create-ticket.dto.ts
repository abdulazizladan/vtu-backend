import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TicketPriority)
  @IsOptional()
  priority: TicketPriority = TicketPriority.MEDIUM;

  @IsString()
  @IsOptional()
  attachmentUrl?: string; // URL or file path
}