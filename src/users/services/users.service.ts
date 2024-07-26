import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TAdminUpdateUser, TRegister, UsersDTO } from '../dto/user.dto';
import { TUserRoles } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<UsersDTO[]> {
    const users = await this.prisma.users.findMany({
      where: { deleted_at: null },
    });
    return users;
  }

  async findById(id: number): Promise<UsersDTO> {
    const user = await this.prisma.users.findUnique({
      where: { id, deleted_at: null },
    });
    return user;
  }

  async findByEmail(email: string): Promise<UsersDTO> {
    const user = await this.prisma.users.findUnique({
      where: { email, deleted_at: null },
    });
    return user;
  }

  async create(data: TRegister): Promise<UsersDTO> {
    try {
      const user = await this.prisma.users.create({ data });
      return user;
    } catch (error) {
      console.log(error);
      if (error.code == 'P2002') {
        throw new BadRequestException('Email already taken!');
      }
      throw new BadRequestException();
    }
  }

  async update(id: number, data: TAdminUpdateUser) {
    try {
      const user = await this.prisma.users.update({
        where: { id, deleted_at: null },
        data,
      });
      return user;
    } catch (error) {
      console.log(error);
      if (error.code == 'P2002') {
        throw new BadRequestException('Email already taken!');
      }
      throw new BadRequestException('User not found!');
    }
  }

  async update_password(id: number, password: string) {
    try {
      const user = await this.prisma.users.update({
        where: { id, deleted_at: null },
        data: { password },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('User not found!');
    }
  }

  async update_role(id: number, role: TUserRoles) {
    try {
      const user = await this.prisma.users.update({
        where: { id, deleted_at: null },
        data: { role },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('User not found!');
    }
  }

  async soft_delete(id: number) {
    try {
      const user = await this.prisma.users.update({
        where: { id, deleted_at: null },
        data: { deleted_at: new Date() },
      });
      return user;
    } catch (error) {
      console.log(error);
      if (error.code == 'P2002') {
        throw new BadRequestException('Email already taken!');
      }
      throw new BadRequestException('User not found!');
    }
  }
}
