import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/module/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { MailerConfig } from 'src/configs/mailer';

@Module({
    imports: [
        JwtModule.register({ secret: process.env['APP_KEY'] }),
        UserModule,
        HttpModule,
        MailerConfig,
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [JwtModule],
})
export class AuthModule { }
