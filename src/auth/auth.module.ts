import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';

@Module({
    imports: [UsersModule, PassportModule.register({ session: true })],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        SessionSerializer,
        UsersService,
        PrismaService,
    ],
})
export class AuthModule {}
