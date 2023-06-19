import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { CreateUserDto } from './dto/users.dto';
import { PrismaService } from '../core/orm/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}
  async createUser(userData: CreateUserDto): Promise<User> {
    return this.prismaService.user.create({
      data: {
        name: userData.name,
        age: userData.age,
        email: userData.email,
        password: userData.password,
        city: userData.city,
        avatar: userData.avatar,
        status: userData.status,
      },
    });
  }
  async getUsersList(): Promise<User[]> {
    return this.prismaService.user.findMany({
      orderBy: { name: 'asc' },
      take: 3,
    });
  }
  async getUserById(userId: string) {
    return this.prismaService.user.findFirst({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        city: true,
        age: true,
      },
      // include: {
      //   pets: true,
      // },
    });
  }
  async findByUsername(userEmail: string) {
    return this.prismaService.user.findFirst({
      where: { email: userEmail },
    });
  }
}
