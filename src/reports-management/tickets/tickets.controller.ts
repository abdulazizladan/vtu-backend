// src/reports-management/tickets.controller.ts
import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
  } from '@nestjs/swagger'; // 👈 Import Swagger decorators
  
  import { TicketsService } from './tickets.service';
  import { CreateTicketDto } from '../DTO/create-ticket.dto';
  import { UpdateTicketStatusDto } from '../DTO/update-ticket.dto';
  import { CreateCommentDto } from '../DTO/create-comment.dto';
  import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
  import { RolesGuard } from 'src/auth/roles.guard';
  import { Roles } from 'src/auth/roles.decorator';
  import { Role } from '../../auth/enums/role.enum'; // Import roles enum
  // Assuming these exist for response types (adjust path if needed)
  import { Ticket } from '../entities/ticket.entity'; 
  import { TicketComment } from '../entities/ticket-comment.entity';
  
  
  @ApiTags('Reports Management (Tickets)') // 👈 Controller documentation
  @ApiBearerAuth() // 👈 Indicates JWT token is required for all routes
  @Controller('tickets')
  @UseGuards(JwtAuthGuard)
  export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}
  
    // ------------------------------------------
    // 🟢 REGULAR USER ROUTES (Role: USER)
    // ------------------------------------------
  
    /**
     * User: Create a new issue ticket.
     */
    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.user) // 👈 Corrected role based on your comment
    @ApiOperation({ summary: 'User: Create a new issue ticket.' })
    @ApiResponse({ status: 201, description: 'Ticket successfully created.', type: Ticket })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden (Requires User role).' })
    async create(
      @Body() createTicketDto: CreateTicketDto,
      userId: number, // Assuming @GetUser('id') is handled by a custom decorator
    ) {
      return this.ticketsService.createTicket(createTicketDto, userId);
    }
  
    /**
     * User: View all tickets submitted by the current user.
     */
    @Get('mine')
    @UseGuards(RolesGuard)
    @Roles(Role.user)
    @ApiOperation({ summary: 'User: Retrieve all tickets submitted by the current user.' })
    @ApiResponse({ status: 200, description: 'List of user tickets.', type: [Ticket] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden (Requires User role).' })
    async findMine( 
        userId: number
    ) {
      return this.ticketsService.findUserTickets(userId);
    }
  
    /**
     * User: View a specific ticket, ensuring it belongs to them.
     */
    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.user)
    @ApiOperation({ summary: 'User: View a specific ticket (must be owned by the user).' })
    @ApiParam({ name: 'id', description: 'ID of the ticket.', type: String })
    @ApiResponse({ status: 200, description: 'The specific ticket.', type: Ticket })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden (Not the ticket owner or missing User role).' })
    @ApiResponse({ status: 404, description: 'Ticket not found.' })
    async findOneUserTicket(
      @Param('id') id: string,
        userId: number,
    ) {
      return this.ticketsService.findOneUserTicket(+id, userId);
    }
  
    // ------------------------------------------
    // 🛡️ ADMIN ROUTES (Role: ADMIN)
    // ------------------------------------------
  
    /**
     * Admin: View all tickets in the system.
     */
    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Admin: Retrieve all tickets in the system.' })
    @ApiResponse({ status: 200, description: 'List of all tickets.', type: [Ticket] })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden (Requires Admin role).' })
    async findAll() {
      return this.ticketsService.findAllTickets();
    }
  
    /**
     * Admin: Update the status of a ticket (Resolved/Canceled).
     */
    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.admin)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Admin: Update the status of a ticket (Resolved or Canceled).' })
    @ApiParam({ name: 'id', description: 'ID of the ticket to update.', type: String })
    @ApiBody({ type: UpdateTicketStatusDto })
    @ApiResponse({ status: 200, description: 'Ticket status successfully updated.', type: Ticket })
    @ApiResponse({ status: 400, description: 'Invalid status provided.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden (Requires Admin role).' })
    @ApiResponse({ status: 404, description: 'Ticket not found.' })
    async updateStatus(
      @Param('id') id: string,
      @Body() updateTicketStatusDto: UpdateTicketStatusDto,
    ) {
      return this.ticketsService.updateTicketStatus(+id, updateTicketStatusDto);
    }
  
    /**
     * Admin: Add a response/comment to a ticket.
     */
    @Post(':id/comments')
    @UseGuards(RolesGuard)
    @Roles(Role.admin)
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Admin: Add a response/comment to a ticket.' })
    @ApiParam({ name: 'id', description: 'ID of the ticket to comment on.', type: String })
    @ApiBody({ type: CreateCommentDto })
    @ApiResponse({ status: 201, description: 'Comment successfully added.', type: TicketComment })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden (Requires Admin role).' })
    @ApiResponse({ status: 404, description: 'Ticket not found.' })
    async addComment(
      @Param('id') id: string,
      @Body() createCommentDto: CreateCommentDto,
      adminId: number,
    ) {
      return this.ticketsService.addAdminResponse(
        +id,
        createCommentDto.content,
        adminId,
      );
    }
  }