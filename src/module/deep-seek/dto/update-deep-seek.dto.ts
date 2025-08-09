import { PartialType } from '@nestjs/swagger';
import { CreateDeepSeekDto } from './create-deep-seek.dto';

export class UpdateDeepSeekDto extends PartialType(CreateDeepSeekDto) {}
