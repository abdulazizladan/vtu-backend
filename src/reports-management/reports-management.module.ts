import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketComment } from './entities/ticket-comment.entity';
import { TicketsService } from './tickets/tickets.service';
import { TicketsController } from './tickets/tickets.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Ticket, TicketComment])],
    providers: [TicketsService],
    controllers: [TicketsController],
    exports: [TicketsService]
})
export class ReportsManagementModule {}
