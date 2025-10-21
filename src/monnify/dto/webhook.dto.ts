// dto/webhook.dto.ts
import { IsString, IsNumber, IsObject, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum WebhookEventType {
  SUCCESSFUL_TRANSACTION = 'SUCCESSFUL_TRANSACTION',
  FAILED_TRANSACTION = 'FAILED_TRANSACTION',
  SUCCESSFUL_DISBURSEMENT = 'SUCCESSFUL_DISBURSEMENT',
  FAILED_DISBURSEMENT = 'FAILED_DISBURSEMENT',
  TRANSACTION_EXPIRED = 'TRANSACTION_EXPIRED'
}

export class WebhookEventDataDto {
  @ApiProperty({
    description: 'Transaction reference',
    example: 'MNFY|202310|002|123456'
  })
  @IsString()
  transactionReference: string;

  @ApiProperty({
    description: 'Payment reference',
    example: 'PAY_REF_123456'
  })
  @IsString()
  paymentReference: string;

  @ApiProperty({
    description: 'Amount paid',
    example: 5000.50
  })
  @IsNumber()
  amountPaid: number;

  @ApiProperty({
    description: 'Total payable amount',
    example: 5000.50
  })
  @IsNumber()
  totalPayable: number;

  @ApiProperty({
    description: 'Settlement amount',
    example: 4850.50
  })
  @IsNumber()
  settlementAmount: number;

  @ApiProperty({
    description: 'Payment date and time',
    example: '2024-01-15T10:30:00.000Z'
  })
  @IsString()
  paidOn: string;

  @ApiProperty({
    description: 'Payment status',
    example: 'PAID'
  })
  @IsString()
  paymentStatus: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'CARD'
  })
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional({
    description: 'Customer information',
    example: {
      email: 'john.doe@example.com',
      name: 'John Doe'
    }
  })
  @IsOptional()
  @IsObject()
  customer?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: {
      orderId: 'ORD-12345',
      productType: 'VTU_AIRTIME'
    }
  })
  @IsOptional()
  @IsObject()
  metaData?: Record<string, any>;
}

export class WebhookDto {
  @ApiProperty({
    description: 'Type of webhook event',
    enum: WebhookEventType,
    example: WebhookEventType.SUCCESSFUL_TRANSACTION
  })
  @IsEnum(WebhookEventType)
  eventType: WebhookEventType;

  @ApiProperty({
    description: 'Event data payload'
  })
  @IsObject()
  eventData: WebhookEventDataDto;
}