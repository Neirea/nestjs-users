import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import CustomRequest from 'src/interfaces/custom-requests.interface';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @UseGuards(AuthenticatedGuard)
    getAllUsers(@Req() req: CustomRequest) {
        return this.usersService.findMany(req);
    }

    @Patch('change-boss')
    @Roles(Role.BOSS)
    @UseGuards(RolesGuard)
    @UseGuards(AuthenticatedGuard)
    changeBoss(
        @Req() req: CustomRequest,
        @Body() data: { userId: string; newBossId: string },
    ) {
        return this.usersService.changeBoss(req, data.userId, data.newBossId);
    }

    @Post('populate')
    populateUsers() {
        return this.usersService.populateUsers();
    }
}
