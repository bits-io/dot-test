import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "" })
    prompt: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "" })
    model: string;
}
