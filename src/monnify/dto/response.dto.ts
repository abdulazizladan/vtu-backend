// dto/response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Transaction initialized successfully'
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Response data'
  })
  data?: T;

  @ApiPropertyOptional({
    description: 'Error message if request failed',
    example: 'Invalid API credentials'
  })
  error?: string;

  @ApiPropertyOptional({
    description: 'Timestamp of the response',
    example: '2024-01-15T10:30:00.000Z'
  })
  timestamp?: string;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Transaction reference',
    example: 'MNFY|202310|002|123456'
  })
  transactionReference: string;

  @ApiProperty({
    description: 'Payment reference',
    example: 'PAY_REF_123456'
  })
  paymentReference: string;

  @ApiProperty({
    description: 'Merchant name',
    example: 'Your Merchant Name'
  })
  merchantName: string;

  @ApiProperty({
    description: 'API key for payment',
    example: 'MK_TEST_ZW2QZQQY0R'
  })
  apiKey: string;

  @ApiProperty({
    description: 'Enabled payment methods',
    example: ['CARD', 'ACCOUNT_TRANSFER']
  })
  enabledPaymentMethod: string[];

  @ApiProperty({
    description: 'Checkout URL for payment',
    example: 'https://checkout.monnify.com/payment/MNFY|202310|002|123456'
  })
  checkoutUrl: string;

  @ApiProperty({
    description: 'Amount to pay',
    example: 5000.50
  })
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'NGN'
  })
  currencyCode: string;
}