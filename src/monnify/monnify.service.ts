// monnify.service.ts
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface InitializeTransactionDto {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentDescription: string;
  currencyCode?: string;
  contractCode?: string;
  redirectUrl?: string;
  paymentMethods?: string[];
}

export interface TransactionResponse {
  transactionReference: string;
  paymentReference: string;
  merchantName: string;
  apiKey: string;
  enabledPaymentMethod: string[];
  checkoutUrl: string;
}

export interface MonnifyAuthResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    accessToken: string;
    expiresIn: number;
  };
}

export interface MonnifyTransactionResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: TransactionResponse;
}

export interface TransactionStatusResponse {
  requestSuccessful: boolean;
  responseMessage: string;
  responseCode: string;
  responseBody: {
    transactionReference: string;
    paymentReference: string;
    amountPaid: string;
    totalPayable: string;
    settlementAmount: string;
    paidOn: string;
    paymentStatus: string;
    paymentDescription: string;
    currency: string;
    paymentMethod: string;
    product: {
      type: string;
      reference: string;
    };
    cardDetails: any;
    accountDetails: any;
    accountPayments: any[];
    customer: {
      email: string;
      name: string;
    };
    metaData: any;
  };
}

@Injectable()
export class MonnifyService {
  private readonly baseUrl = 'https://sandbox.monnify.com';
  private readonly apiKey = 'MK_TEST_ZW2QZQQY0R';
  private readonly secretKey = '0876759920';
  private accessToken: string;
  private tokenExpiry: Date;
  private readonly logger = new Logger(MonnifyService.name);

  constructor(private httpService: HttpService) {}

  private async ensureAuthenticated(): Promise<void> {
    if (!this.accessToken || this.isTokenExpired()) {
      await this.authenticate();
    }
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return new Date() >= this.tokenExpiry;
  }

  async authenticate(): Promise<string> {
    try {
      const credentials = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString('base64');
      
      const response = await firstValueFrom(
        this.httpService.post<MonnifyAuthResponse>(
          `${this.baseUrl}/api/v1/auth/login`,
          {},
          {
            headers: {
              'Authorization': `Basic ${credentials}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      if (response.data.requestSuccessful && response.data.responseBody) {
        this.accessToken = response.data.responseBody.accessToken;
        
        // Set token expiry (usually 1 hour, but we'll set 55 minutes for safety)
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 55);
        this.tokenExpiry = expiryTime;
        
        this.logger.log('Monnify authentication successful');
        return this.accessToken;
      } else {
        throw new HttpException(
          `Authentication failed: ${response.data.responseMessage}`,
          HttpStatus.UNAUTHORIZED
        );
      }
    } catch (error) {
      this.logger.error('Monnify authentication failed', error.stack);
      throw new HttpException(
        `Authentication failed: ${error.message}`,
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async initializeTransaction(transactionData: InitializeTransactionDto): Promise<TransactionResponse> {
    await this.ensureAuthenticated();

    try {
      const payload = {
        amount: transactionData.amount,
        customerName: transactionData.customerName,
        customerEmail: transactionData.customerEmail,
        paymentDescription: transactionData.paymentDescription,
        currencyCode: transactionData.currencyCode || 'NGN',
        contractCode: transactionData.contractCode || '4934121693', // Default test contract code
        redirectUrl: transactionData.redirectUrl || 'http://localhost:3000/payments/callback',
        paymentMethods: transactionData.paymentMethods || ['CARD', 'ACCOUNT_TRANSFER']
      };

      const response = await firstValueFrom(
        this.httpService.post<MonnifyTransactionResponse>(
          `${this.baseUrl}/api/v1/merchant/transactions/init-transaction`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      if (response.data.requestSuccessful && response.data.responseBody) {
        this.logger.log(`Transaction initialized: ${response.data.responseBody.transactionReference}`);
        return response.data.responseBody;
      } else {
        throw new HttpException(
          `Transaction initialization failed: ${response.data.responseMessage}`,
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      this.logger.error('Transaction initialization failed', error.stack);
      throw new HttpException(
        `Transaction initialization failed: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getTransactionStatus(transactionReference: string): Promise<TransactionStatusResponse['responseBody']> {
    await this.ensureAuthenticated();

    try {
      const response = await firstValueFrom(
        this.httpService.get<TransactionStatusResponse>(
          `${this.baseUrl}/api/v2/transactions/${encodeURIComponent(transactionReference)}`,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      if (response.data.requestSuccessful && response.data.responseBody) {
        return response.data.responseBody;
      } else {
        throw new HttpException(
          `Failed to fetch transaction status: ${response.data.responseMessage}`,
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      this.logger.error('Failed to fetch transaction status', error.stack);
      throw new HttpException(
        `Failed to fetch transaction status: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async verifyTransaction(transactionReference: string): Promise<TransactionStatusResponse['responseBody']> {
    // Verification is similar to getting transaction status
    return await this.getTransactionStatus(transactionReference);
  }

  async getBanks(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(
          `${this.baseUrl}/api/v1/banks`,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      if (response.data.requestSuccessful && response.data.responseBody) {
        return response.data.responseBody;
      } else {
        throw new HttpException(
          `Failed to fetch banks: ${response.data.responseMessage}`,
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      this.logger.error('Failed to fetch banks', error.stack);
      throw new HttpException(
        `Failed to fetch banks: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async validateAccount(accountNumber: string, bankCode: string): Promise<any> {
    await this.ensureAuthenticated();

    try {
      const response = await firstValueFrom(
        this.httpService.get<any>(
          `${this.baseUrl}/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`,
          {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
      );

      if (response.data.requestSuccessful && response.data.responseBody) {
        return response.data.responseBody;
      } else {
        throw new HttpException(
          `Account validation failed: ${response.data.responseMessage}`,
          HttpStatus.BAD_REQUEST
        );
      }
    } catch (error) {
      this.logger.error('Account validation failed', error.stack);
      throw new HttpException(
        `Account validation failed: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}