// dto/create-transaction.dto.ts
import { 
    IsEmail, 
    IsNumber, 
    IsString, 
    IsOptional, 
    IsArray, 
    Min, 
    MaxLength,
    IsEnum,
    ArrayMinSize,
    ValidateNested,
    Max
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
  
  export enum PaymentMethod {
    CARD = 'CARD',
    ACCOUNT_TRANSFER = 'ACCOUNT_TRANSFER',
    USSD = 'USSD',
    PHONE_NUMBER = 'PHONE_NUMBER'
  }
  
  export enum CurrencyCode {
    NGN = 'NGN',
    USD = 'USD',
    GBP = 'GBP',
    EUR = 'EUR'
  }
  
  export class CustomerDto {
    @ApiProperty({
      description: 'Full name of the customer',
      example: 'John Chukwuma Doe',
      maxLength: 100
    })
    @IsString()
    @MaxLength(100)
    name: string;
  
    @ApiProperty({
      description: 'Email address of the customer',
      example: 'john.doe@example.com'
    })
    @IsEmail()
    email: string;
  
    @ApiPropertyOptional({
      description: 'Phone number of the customer (with country code)',
      example: '+2348012345678'
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;
  }
  
  export class IncomeSplitConfigDto {
    @ApiProperty({
      description: 'Subaccount code to split income with',
      example: 'MFY_SUB_342226363226'
    })
    @IsString()
    subAccountCode: string;
  
    @ApiProperty({
      description: 'Percentage of amount to split with subaccount',
      example: 50.5,
      minimum: 0.1,
      maximum: 100
    })
    @IsNumber()
    @Min(0.1)
    @Max(100)
    feePercentage: number;
  
    @ApiPropertyOptional({
      description: 'Flat fee amount to split with subaccount',
      example: 100
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    feeAmount?: number;
  
    @ApiPropertyOptional({
      description: 'Whether the fee is borne by the subaccount',
      example: false
    })
    @IsOptional()
    @IsNumber()
    bearFee?: number;
  }
  
  export class CreateTransactionDto {
    @ApiProperty({
      description: 'Amount to be paid by the customer',
      example: 5000.50,
      minimum: 1
    })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    amount: number;
  
    @ApiProperty({
      description: 'Customer information',
      type: CustomerDto
    })
    @ValidateNested()
    @Type(() => CustomerDto)
    customer: CustomerDto;
  
    @ApiProperty({
      description: 'Description of the payment',
      example: 'Payment for VTU airtime purchase',
      maxLength: 200
    })
    @IsString()
    @MaxLength(200)
    paymentDescription: string;
  
    @ApiPropertyOptional({
      description: 'Currency code for the transaction',
      example: CurrencyCode.NGN,
      enum: CurrencyCode,
      default: CurrencyCode.NGN
    })
    @IsOptional()
    @IsEnum(CurrencyCode)
    currencyCode?: CurrencyCode;
  
    @ApiPropertyOptional({
      description: 'Monnify contract code',
      example: '4934121693'
    })
    @IsOptional()
    @IsString()
    contractCode?: string;
  
    @ApiPropertyOptional({
      description: 'URL to redirect to after payment',
      example: 'https://yourapp.com/payment/callback'
    })
    @IsOptional()
    @IsString()
    redirectUrl?: string;
  
    @ApiPropertyOptional({
      description: 'Payment methods to enable',
      example: [PaymentMethod.CARD, PaymentMethod.ACCOUNT_TRANSFER],
      enum: PaymentMethod,
      isArray: true,
      default: [PaymentMethod.CARD, PaymentMethod.ACCOUNT_TRANSFER]
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsEnum(PaymentMethod, { each: true })
    paymentMethods?: PaymentMethod[];
  
    @ApiPropertyOptional({
      description: 'Additional metadata for the transaction',
      example: {
        orderId: 'ORD-12345',
        productType: 'VTU_AIRTIME',
        network: 'MTN'
      }
    })
    @IsOptional()
    metadata?: Record<string, any>;
  
    @ApiPropertyOptional({
      description: 'Income split configuration',
      type: [IncomeSplitConfigDto]
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => IncomeSplitConfigDto)
    incomeSplitConfig?: IncomeSplitConfigDto[];
  }