import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export default class ResetPasswordDTO {
    @IsNotEmpty()
    @ApiProperty({ example: 'token' })
    token: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'secret123' })
    password: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'secret123' })
    confirmPassword: string;
}