import { Role } from '@prisma/client';

export default [
    { username: 'Jack', password: 'pass123', role: Role.ADMIN },
    { username: 'Eugene', password: 'pass123', role: Role.BOSS },
    {
        username: 'John',
        password: 'pass123',
        role: Role.BOSS,
        boss: 'Eugene',
    },
    {
        username: 'Emma',
        password: 'pass123',
        role: Role.BOSS,
        boss: 'Eugene',
    },
    { username: 'Kyle', password: 'pass123', role: Role.USER, boss: 'John' },
    { username: 'David', password: 'pass123', role: Role.USER, boss: 'John' },
    { username: 'Emily', password: 'pass123', role: Role.USER, boss: 'Emma' },
    {
        username: 'Fred',
        password: 'pass123',
        role: Role.USER,
        boss: 'Emma',
    },
];
