import { Injectable } from '@nestjs/common';
import { CreateDeepSeekDto } from './dto/create-deep-seek.dto';
import { UpdateDeepSeekDto } from './dto/update-deep-seek.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class DeepSeekService {
  constructor(private readonly httpService: HttpService) { }

  async sendPromptToModel(prompt: string, model: string): Promise<string> {
    const url = `${process.env.DEEPSEEK_OLLAMA_URL}/api/generate`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          url,
          { model, prompt },
          { timeout: 360000 } // 360 seconds = 360000 ms
        )
      );

      const stream = response.data;
      const lines = stream.trim().split('\n');

      let fullResponse = '';
      for (const line of lines) {
        const json = JSON.parse(line);
        if (json?.response) {
          fullResponse += json.response;
        }
      }

      return fullResponse.trim();
    } catch (error) {
      const err = error as AxiosError | TimeoutError;
      throw err;
    }
  }
}
