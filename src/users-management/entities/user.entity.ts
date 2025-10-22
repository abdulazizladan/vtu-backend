// src/user/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../reports-management/entities/ticket.entity';
import { TicketComment } from '../../reports-management/entities/ticket-comment.entity'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // This column is crucial for RBAC (Role-Based Access Control)
  @Column({
    type: 'text',
    default: 'user',
  })
  role: UserRole;

  // Relation to the tickets they have created
  @OneToMany(() => Ticket, (ticket) => ticket.creator)
  tickets: Ticket[];

  // Relation to the comments they have posted (admin responses)
  @OneToMany(() => TicketComment, (comment) => comment.user)
  comments: TicketComment[];
}