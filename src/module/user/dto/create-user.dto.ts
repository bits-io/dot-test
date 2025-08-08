import { IsEmail, IsNotEmpty } from "class-validator";
import UserType from "../enums/user-type";
import { ApiProperty } from "@nestjs/swagger";

export default class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'john@example.com' })
    email: string;
    
    @IsNotEmpty()
    @ApiProperty({ example: 'secret123' })
    password: string;    
}