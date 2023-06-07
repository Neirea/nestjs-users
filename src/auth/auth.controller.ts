import {
    Controller,
    Post,
    UseGuards,
    Req,
    Res,
    Body,
    Delete,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import CustomRequest from 'src/interfaces/custom-requests.interface';
import { Response } from 'express';
import { AuthenticatedGuard } from './authenticated.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService: AuthService) {}

    @Post('register')
    async register(@Body() data: { username: string; password: string }) {
        return this.AuthService.registerUser(data.username, data.password);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: CustomRequest) {
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Delete('logout')
    async logout(@Req() req: CustomRequest, @Res() res: Response) {
        this.AuthService.exitSession(req, res);
    }
}
