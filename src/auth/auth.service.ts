import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { comparePassword } from 'src/utils/password';
import CustomRequest from 'src/interfaces/custom-requests.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOne(username);
        if (user && comparePassword(password, user.password.hash)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async registerUser(username: string, password: string) {
        const duplicateUser = await this.usersService.findOne(username);
        if (duplicateUser) {
            throw new ConflictException(
                `Username '${username}' already exists`,
            );
        }
        const createUser = {
            username: username,
            password: {
                create: {
                    hash: password,
                },
            },
        };
        return this.usersService.createUser(createUser);
    }

    exitSession(req: CustomRequest, res: Response) {
        if (req.session) {
            //deletes from session from Redis too
            req.session.destroy((err: any) => {
                if (err) {
                    throw new BadRequestException('Failed to logout');
                }
            });
        }
        res.clearCookie('sid', {
            sameSite:
                process.env.NODE_ENV === 'production' ? 'none' : undefined,
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200).send();
    }
}
