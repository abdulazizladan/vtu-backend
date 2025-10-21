import { Module } from '@nestjs/common';
import { MonnifyService } from './monnify.service';
import { HttpModule} from '@nestjs/axios'
import { MonnifyController } from './monnify.controller';

@Module({
  imports: [HttpModule],
  providers: [MonnifyService],
  exports: [MonnifyService],
  controllers: [MonnifyController]
})
export class MonnifyModule {}
