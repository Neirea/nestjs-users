import {
    ForbiddenException,
    Injectable,
    NotFoundException,
    Req,
} from '@nestjs/common';
import { User, Role, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import CustomRequest from 'src/interfaces/custom-requests.interface';
import testUsers from './test-users';
import { hashPassword } from 'src/utils/password';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findMany(@Req() request: CustomRequest) {
        const { role: userRole, id } = request.user;
        if (userRole === Role.ADMIN) {
            return this.prisma.user.findMany();
        }
        if (userRole === Role.BOSS) {
            return this.getSubordinateHierarchy(id);
        }
        // handle the remaining USER role
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async changeBoss(
        @Req() request: CustomRequest,
        userId: string,
        newBossId: string,
    ) {
        const currentBoss = request.user;
        // subject is self
        if (currentBoss.id === userId) return;
        // Find the user being updated
        const userToUpdate = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        //same boss as before
        if (userToUpdate.boss_id === newBossId) return;
        if (!userToUpdate) {
            throw new NotFoundException('User not found');
        }
        const boss = await this.prisma.user.findUnique({
            where: { id: newBossId },
        });
        if (!boss) {
            throw new NotFoundException('Boss user not found');
        }

        // Check if the current user is the boss and if the target user is their subordinate
        const subordinates = await this.getSubordinateHierarchy(currentBoss.id);
        const isSubordinate = subordinates.some((user) => user.id === userId);
        if (!isSubordinate) {
            throw new ForbiddenException(
                'You can only change the boss for your subordinates',
            );
        }

        // Update to new boss
        await this.prisma.user.update({
            where: { id: userToUpdate.id },
            data: {
                boss_id: newBossId,
            },
        });
        // check if old boss doesn't have any subordinates left
        const oldBossSubordinates = await this.prisma.user.findMany({
            where: {
                boss_id: userToUpdate.boss_id,
            },
        });
        if (!oldBossSubordinates.length) {
            await this.prisma.user.update({
                where: { id: userToUpdate.boss_id },
                data: {
                    role: Role.USER,
                },
            });
        }

        // check if new boss was a user
        if (boss.role !== Role.BOSS) {
            await this.prisma.user.update({
                where: { id: boss.id },
                data: {
                    role: Role.BOSS,
                },
            });
        }
    }

    // populate db with test users once
    async populateUsers() {
        const existingUsers = await this.prisma.user.findMany();
        if (existingUsers.length) return;

        // Create users and passwords
        for (const user of testUsers) {
            const hash = await hashPassword(user.password);
            await this.prisma.user.create({
                data: {
                    username: user.username,
                    password: {
                        create: {
                            hash,
                        },
                    },
                    role: user.role,
                },
            });
        }

        // Update boss relationships
        for (const user of testUsers) {
            if (user.boss) {
                await this.prisma.user.update({
                    where: { username: user.username },
                    data: {
                        boss: {
                            connect: { username: user.boss },
                        },
                    },
                });
            }
        }
    }

    async findOne(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
            include: { password: true },
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async getSubordinateHierarchy(bossId: string): Promise<User[]> {
        const query = Prisma.sql`
          WITH RECURSIVE subordinate_hierarchy AS (
            SELECT * FROM "User" WHERE id = ${bossId}
            UNION ALL
            SELECT u.* FROM "User" u JOIN subordinate_hierarchy sh ON u.boss_id = sh.id
          )
          SELECT * FROM subordinate_hierarchy;
        `;

        const subordinates = await this.prisma.$queryRaw<User[]>(query);

        return subordinates;
    }
}
