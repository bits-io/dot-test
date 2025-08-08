import { IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export default class LoginDto {
    @MinLength(3)
    @IsNotEmpty()
    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'secret123' })
    password: string;
}