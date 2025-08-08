import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { User } from "src/module/user/entities/user.entity";

export class CreatePostDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'This content' })
    content: string;

    @IsOptional()
    author: User;
}
