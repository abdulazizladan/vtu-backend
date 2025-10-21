import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MonnifyModule } from './monnify/monnify.module';

@Module({
  imports: [MonnifyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
