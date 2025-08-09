import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException } from '@nestjs/common';
import { DeepSeekService } from './deep-seek.service';
import { CreateDeepSeekDto } from './dto/create-deep-seek.dto';
import { UpdateDeepSeekDto } from './dto/update-deep-seek.dto';
import { ApiTags } from '@nestjs/swagger';
import { ChatDto } from './dto/chat.dto';

@ApiTags('deep-seek')
@Controller('deep-seek')
export class DeepSeekController {
  constructor(private readonly deepSeekService: DeepSeekService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    const { prompt, model } = chatDto;

    try {
      const response = await this.deepSeekService.sendPromptToModel(prompt, model);
      return { response };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch response');
    }
  }
}
