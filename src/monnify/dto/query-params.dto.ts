// dto/query-params.dto.ts
import { IsString, IsOptional, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum TransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERPAID = 'OVERPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  ABANDONED = 'ABANDONED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
  EXPIRED = 'EXPIRED'
}

export class TransactionQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  size?: number = 20;

  @ApiPropertyOptional({
    description: 'Transaction reference to filter by',
    example: 'MNFY|202310|002|123456'
  })
  @IsOptional()
  @IsString()
  transactionReference?: string;

  @ApiPropertyOptional({
    description: 'Payment reference to filter by',
    example: 'PAY_REF_123456'
  })
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ApiPropertyOptional({
    description: 'Transaction status to filter by',
    enum: TransactionStatus,
    example: TransactionStatus.PAID
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Start date for filtering (YYYY-MM-DD)',
    example: '2024-01-01'
  })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (YYYY-MM-DD)',
    example: '2024-01-31'
  })
  @IsOptional()
  @IsString()
  toDate?: string;
}

export class AccountValidationQueryDto {
  @ApiPropertyOptional({
    description: 'Bank account number',
    example: '0690000032',
    required: true
  })
  @IsString()
  accountNumber: string;

  @ApiPropertyOptional({
    description: 'Bank code',
    example: '044',
    required: true
  })
  @IsString()
  bankCode: string;
}