// src/reports-management/tickets.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../entities/ticket.entity';
import { TicketComment } from '../entities/ticket-comment.entity';
import { CreateTicketDto } from '../DTO/create-ticket.dto'; // You'll need DTOs
import { UpdateTicketStatusDto } from '../DTO/update-ticket.dto';
// Assuming User entity is accessible for type safety, though we only use the ID/Role
// import { UserRole } from '../user/user.entity'; 

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(TicketComment)
    private commentsRepository: Repository<TicketComment>,
  ) {}

  // --- REGULAR USER FUNCTIONALITIES ---

  /**
   * Allows a regular user to create a new ticket.
   * @param createTicketDto Data for the new ticket (title, description, priority, attachmentUrl)
   * @param creatorId The ID of the user creating the ticket
   * @returns The newly created Ticket object
   */
  async createTicket(createTicketDto: CreateTicketDto, creatorId: number): Promise<Ticket> {
    const newTicket = this.ticketsRepository.create({
      ...createTicketDto,
      creator: { id: creatorId }, // TypeORM automatically handles linking by ID
      status: TicketStatus.ACTIVE,
    });

    return this.ticketsRepository.save(newTicket);
  }

  /**
   * Retrieves all tickets created by a specific user.
   * @param userId The ID of the user
   * @returns A list of tickets created by the user
   */
  async findUserTickets(userId: number): Promise<Ticket[]> {
    return this.ticketsRepository.find({
      where: { creator: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['comments'], // Include comments for the user view
    });
  }

  /**
   * Retrieves a single ticket, ensuring it belongs to the requesting user.
   * @param ticketId The ID of the ticket
   * @param userId The ID of the user requesting access
   * @returns The ticket object
   */
  async findOneUserTicket(ticketId: number, userId: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
      relations: ['creator', 'comments', 'comments.user'], // Load creator and comments/commenter
    });

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found.`);
    }

    // Security check: Ensure the requesting user is the creator
    if (ticket.creator.id !== userId) {
      throw new ForbiddenException('You do not have permission to view this ticket.');
    }

    return ticket;
  }

  // --- ADMIN FUNCTIONALITIES ---

  /**
   * Retrieves all tickets in the system (Admin access only).
   * @returns A list of all tickets
   */
  async findAllTickets(): Promise<Ticket[]> {
    // Admin access doesn't need to check userId, but the route should be protected by a Role Guard
    return this.ticketsRepository.find({
      order: { status: 'ASC', createdAt: 'DESC' },
      relations: ['creator'],
    });
  }

  /**
   * Updates the status of a ticket (Resolved or Canceled).
   * @param ticketId The ID of the ticket to update
   * @param updateTicketStatusDto The new status
   * @returns The updated Ticket object
   */
  async updateTicketStatus(
    ticketId: number,
    updateTicketStatusDto: UpdateTicketStatusDto,
  ): Promise<Ticket | null> {
    const { status } = updateTicketStatusDto;

    // Validation: Ensure the new status is valid for admin updates
    if (status !== TicketStatus.RESOLVED && status !== TicketStatus.CANCELED) {
      throw new BadRequestException(`Status must be '${TicketStatus.RESOLVED}' or '${TicketStatus.CANCELED}'`);
    }
    
    // Find and update in a single transaction (or two, depending on ORM preference)
    const result = await this.ticketsRepository.update(ticketId, { status });

    if (result.affected === 0) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found.`);
    }

    // Fetch the updated ticket
    return this.ticketsRepository.findOne({ where: { id: ticketId } });
  }

  /**
   * Adds an admin response (comment) to a ticket.
   * @param ticketId The ID of the ticket to comment on
   * @param content The text of the admin's response
   * @param adminId The ID of the admin posting the comment
   * @returns The newly created TicketComment object
   */
  async addAdminResponse(ticketId: number, content: string, adminId: number): Promise<TicketComment> {
    // 1. Check if the ticket exists
    const ticket = await this.ticketsRepository.findOne({ where: { id: ticketId } });
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${ticketId} not found.`);
    }

    // 2. Create the comment
    const comment = this.commentsRepository.create({
      content,
      ticket: { id: ticketId },
      user: { id: adminId }, // The admin is the 'user' posting the comment
    });

    // 3. Save and return
    return this.commentsRepository.save(comment);
  }
}