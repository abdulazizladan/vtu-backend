// src/reports-management/ticket-comment.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { Ticket } from './ticket.entity';
  import { User } from '../../users-management/entities/user.entity';
  
  @Entity('ticket_comments')
  export class TicketComment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('text')
    content: string; // The text of the admin's response
  
    // Relation back to the ticket
    @ManyToOne(() => Ticket, (ticket) => ticket.comments, { onDelete: 'CASCADE' })
    ticket: Ticket;
  
    // Relation to the User (likely an Admin) who posted the comment
    @ManyToOne(() => User, (user) => user.comments)
    user: User;
  
    @CreateDateColumn()
    createdAt: Date;
  }