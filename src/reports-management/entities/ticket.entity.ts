// src/reports-management/ticket.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { User } from '../../users-management/entities/user.entity';
  import { TicketComment } from '../entities/ticket-comment.entity';
  
  // Enums for clarity and data integrity
  export enum TicketPriority {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    CRITICAL = 'Critical',
  }
  
  export enum TicketStatus {
    ACTIVE = 'Active',      // Initial status when created by user
    RESOLVED = 'Resolved',  // Set by Admin
    CANCELED = 'Canceled',  // Set by Admin
  }
  
  @Entity('tickets')
  export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column('text')
    description: string;
  
    // Priority set by the user on creation (can be updated by admin)
    @Column({
      type: 'text',
      default: 'medium',
    })
    priority: string;
  
    // Status is updated by the Admin
    @Column({
      type: 'text',
      default: 'active',
    })
    status: TicketStatus;
  
    // Optional: URL or file path for the attachment
    @Column({ nullable: true })
    attachmentUrl: string;
  
    // Relation to the User who created the ticket (User role)
    @ManyToOne(() => User, (user) => user.tickets)
    creator: User;
  
    // Relation to the comments/responses for this ticket
    @OneToMany(() => TicketComment, (comment) => comment.ticket)
    comments: TicketComment[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }