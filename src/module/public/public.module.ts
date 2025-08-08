import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    PostModule
  ],
  controllers: [PublicController],
  providers: [PublicService],
  exports: [PublicService]
})
export class PublicModule {}
