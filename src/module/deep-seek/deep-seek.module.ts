import { Module } from '@nestjs/common';
import { DeepSeekService } from './deep-seek.service';
import { DeepSeekController } from './deep-seek.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  controllers: [DeepSeekController],
  providers: [DeepSeekService],
  exports: [DeepSeekService],
})
export class DeepSeekModule {}
