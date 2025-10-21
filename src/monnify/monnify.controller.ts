// monnify.controller.ts
import { 
    Controller, 
    Post, 
    Get, 
    Body, 
    Param, 
    Query, 
    HttpStatus,
    Res,
    UsePipes,
    ValidationPipe,
    HttpCode
  } from '@nestjs/common';
  import { Response } from 'express';
  import { 
    MonnifyService
  } from './monnify.service';
  //import { 
    //CreateTransactionDto,
    //TransactionQueryDto,
    //AccountValidationQueryDto,
    //WebhookDto,
    //ApiResponseDto,
    //TransactionResponseDto
  //} from './';
  import { CreateTransactionDto } from './dto/create-transaction.dto';
  import { AccountValidationQueryDto } from './dto/query-params.dto';
  import { WebhookDto } from './dto/webhook.dto';
  import { ApiResponseDto } from './dto/response.dto';
  import { TransactionQueryDto } from './dto/query-params.dto';
  import { TransactionResponseDto } from './dto/response.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
  
  @ApiTags('payments')
  @Controller('payments')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  export class MonnifyController {
    constructor(private readonly monnifyService: MonnifyService) {}
  
    @Post('initialize')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Initialize a new payment transaction' })
    @ApiBody({ type: CreateTransactionDto })
    @ApiResponse({ 
      status: 201, 
      description: 'Transaction initialized successfully',
      type: ApiResponseDto<TransactionResponseDto>
    })
    @ApiResponse({ 
      status: 400, 
      description: 'Invalid request parameters' 
    })
    async initializeTransaction(
      @Body() createTransactionDto: CreateTransactionDto
    ): Promise<ApiResponseDto<TransactionResponseDto>> {
      try {
        // Assuming CreateTransactionDto needs to be mapped to InitializeTransactionDto
        // and required properties like customerName and customerEmail are present in the body.

        const { customerName, customerEmail, ...rest } = createTransactionDto as any;
        const initializeTransactionDto = {
          ...rest,
          customerName,
          customerEmail,
        };

        const transaction = await this.monnifyService.initializeTransaction(initializeTransactionDto);

        return {
          success: true,
          message: 'Transaction initialized successfully',
          //data: createTransactionDto,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to initialize transaction',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
  
    @Get('transaction/:reference')
    @ApiOperation({ summary: 'Get transaction status by reference' })
    @ApiResponse({ 
      status: 200, 
      description: 'Transaction status retrieved successfully' 
    })
    async getTransactionStatus(
      @Param('reference') reference: string
    ): Promise<ApiResponseDto<any>> {
      try {
        const transactionStatus = await this.monnifyService.getTransactionStatus(reference);
        
        return {
          success: true,
          message: 'Transaction status retrieved successfully',
          data: transactionStatus,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to retrieve transaction status',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
  
    @Get('banks')
    @ApiOperation({ summary: 'Get list of supported banks' })
    @ApiResponse({ 
      status: 200, 
      description: 'Banks retrieved successfully' 
    })
    async getBanks(): Promise<ApiResponseDto<any[]>> {
      try {
        const banks = await this.monnifyService.getBanks();
        
        return {
          success: true,
          message: 'Banks retrieved successfully',
          data: banks,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          message: 'Failed to retrieve banks',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
  
    @Get('validate-account')
    @ApiOperation({ summary: 'Validate bank account details' })
    async validateAccount(
      @Query() query: AccountValidationQueryDto
    ): Promise<ApiResponseDto<any>> {
      try {
        const accountInfo = await this.monnifyService.validateAccount(
          query.accountNumber,
          query.bankCode
        );
        
        return {
          success: true,
          message: 'Account validated successfully',
          data: accountInfo,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          success: false,
          message: 'Account validation failed',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
  
    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Handle Monnify webhook notifications' })
    @ApiBody({ type: WebhookDto })
    async handleWebhook(
      @Body() webhookDto: WebhookDto,
      @Res() res: Response
    ): Promise<void> {
      try {
        const { eventType, eventData } = webhookDto;
  
        // Process webhook based on event type
        switch (eventType) {
          case 'SUCCESSFUL_TRANSACTION':
            await this.processSuccessfulPayment(eventData);
            break;
          case 'FAILED_TRANSACTION':
            await this.processFailedPayment(eventData);
            break;
          default:
            console.log('Unhandled webhook event type:', eventType);
        }
  
        res.status(HttpStatus.OK).json({ 
          success: true, 
          message: 'Webhook processed successfully' 
        });
      } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: 'Webhook processing failed' 
        });
      }
    }
  
    private async processSuccessfulPayment(eventData: any): Promise<void> {
      // Implement your business logic
      console.log('Processing successful payment:', eventData.transactionReference);
    }
  
    private async processFailedPayment(eventData: any): Promise<void> {
      // Implement your business logic
      console.log('Processing failed payment:', eventData.transactionReference);
    }
  }