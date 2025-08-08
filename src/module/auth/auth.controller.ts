import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Query, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import LoginDto from './dto/login.dto';
import { UserSession } from 'src/helpers/custom-decorators';
import { User } from '../user/entities/user.entity';
import ResetPasswordDTO from './dto/reset-password.dto';
import SettingDashboardDto from './dto/setting-dashboard.dto';
import InvoiceToken from './dto/invoice-token.dto';
import CreateUserDto from '../user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    @Post('/callbackportal/:code')
    async portal(@Param('code') code: string) {
        const portal = await this.authService.postToApi(process.env.PORTAL_APPS_API_HOST + '/api/oauth/token',
            {
                'client_id': process.env.CLIENT_ID,
                'client_secret': process.env.CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': process.env.REDIRECT_URI
            });
        if (portal.user) {
            return this.authService.logInPortal(portal.user.username);
        } else {
            throw new BadRequestException(portal.message);
        }
    }

    @Post('/login')
    login(@Body() login: LoginDto, @Query() q: { redirectLogin: string }) {
        return this.authService.logIn(login.email, login.password, {
            redirectLogin: !!q.redirectLogin
        });
    }

    @Post('/register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto);
    }

    @Get('/forgot-password')
    forgotPassword(@Query('email') email: string) {
        return this.authService.requestForgotPassword(email)
    }

    @Post('/forgot-password')
    async changePassword(@Body() dto: ResetPasswordDTO) {
        const ok = await this.authService.resetPassword(dto);

        return { ok };
    }

    @Get('/me')
    me(@UserSession() user: User) {        
        return {
            me: { ...user }
        };
    }


    @Get('/portal')
    @Redirect()
    redirecttoprtal() {
        const url = process.env.PORTAL_APPS_HOST + '/oauth2/auth?client_id=' + process.env.CLIENT_ID + '&redirect_uri=' + process.env.REDIRECT_URI + '&response_type=code&scope=profile&state=STATE'
        return { url }; // Dynamically set the URL based on your condition
    }

}
