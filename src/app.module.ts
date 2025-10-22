import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonnifyModule } from './monnify/monnify.module';
import { ReportsManagementModule } from './reports-management/reports-management.module';
import { UsersManagementModule } from './users-management/users-management.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: __dirname + '/../db.sqlite', // Use absolute path to database file
      entities: [__dirname + '/**/entities/*.entity{.ts,.js}'], // A glob pattern to load your entities
      synchronize: true, // Auto-create database schema. Use with caution in production!
      logging: ['query', 'error', 'warn'], // Enable detailed SQL query logging
      logger: 'advanced-console' // Use advanced console logger
    }),
    UserModule,
    AuthModule,
    MonnifyModule,
    ReportsManagementModule,
    UsersManagementModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
