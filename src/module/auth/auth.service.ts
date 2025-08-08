import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CryptoHelper from 'src/helpers/crypto-helper';
import { UserService } from '../user/user.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { MailerService } from '@nestjs-modules/mailer';
import { generateForgotPasswordToken, isValidEmail } from 'src/helpers/common';
import ResetPasswordDTO from './dto/reset-password.dto';
import { readFile } from 'fs/promises';
import { User } from '../user/entities/user.entity';
import axios from 'axios';
import InvoiceToken from './dto/invoice-token.dto';
import CreateUserDto from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly mailer: MailerService,
  ) { }

  async logIn(email: string, password: string, options?: { redirectLogin?: boolean }) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("Invalid username or password");
    }

    const isMatch = await CryptoHelper.compare(password, user.password?.password);
    if (!isMatch) {
      throw new BadRequestException("Invalid username or password");
    }

    const payload = { sub: user.email, firstName: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env['APP_KEY'] }),
      user: { ...user }
      // tenant: user.tenant
    };
  }

  async logInPortal(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("Invalid username or password");
    }

    const payload = { sub: user.email, firstName: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env['APP_KEY'] }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async postToApi(url: string, data: any): Promise<any> {
    try {
      const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers }).pipe(

          catchError((error) => {
            throw new HttpException(
              error.response?.data || 'Error occurred while posting to API',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
          })
        )
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async composeForgotPasswordMailBody(user: User) {
    let rawTemplate = "";
    const resetPasswordToken = generateForgotPasswordToken();
    await this.userService.setResetPasswordToken(user.id, resetPasswordToken);

    try {
      let fullName = user.email;

      console.log(user)

      rawTemplate = await readFile("files/mail-template/reset-password.html", { encoding: 'utf8' });
      rawTemplate = rawTemplate.replaceAll("{{Product Name}}", process.env['MAIL_FROM_NAME']);
      rawTemplate = rawTemplate.replaceAll("{{name}}", fullName);
      rawTemplate = rawTemplate.replaceAll("{{action_url}}", `${process.env['RESET_PASSWORD_URL']}?token=${resetPasswordToken}&baseUrl=${encodeURI(process.env['APP_URL'])}`);      
    } catch (error) {
      console.error(error);
      throw new BadRequestException("Unable to load mail template");
    }

    return rawTemplate;
  }

  async requestForgotPassword(email: string) {
    if (!isValidEmail(email)) {
      throw new BadRequestException("Email is not a valid email");
    }

    const user = await this.userService.findOneByEmail(email);
    if (user) {
      let mailBody = await this.composeForgotPasswordMailBody(user);
      const resp = await this.mailer.sendMail({
        from: process.env['MAIL_FROM_ADDRESS'],
        sender: process.env['MAIL_FROM_NAME'],
        subject: `Permintaan Pergantian Password di ${process.env['MAIL_FROM_NAME']}`,
        to: user.email,
        html: mailBody,
      });

      console.info(`Mailer : `, resp);
    }

    return { message: "Reset password link send to your email if registered" }
  }

  async resetPassword(dto: ResetPasswordDTO) {
    const user = await this.userService.findOneByResetToken(dto.token);
    if (!user) {
      throw new NotFoundException("Invalid token");
    }

    await this.userService.changePassword(user.id, dto.password, dto.confirmPassword);
    await this.userService.clearResetPasswordToken(user.id);

    return true;
  }
}
