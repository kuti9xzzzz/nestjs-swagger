import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CatsDTO, createCatsDTO, updateCatsDTO } from '../dtos/cats.dto';

@Injectable()
export class CatsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CatsDTO[]> {
    const cats = await this.prisma.cats.findMany();
    return cats;
  }

  async findById(id: number): Promise<CatsDTO> {
    const cat = await this.prisma.cats.findUnique({ where: { id } });
    return cat;
  }

  async create(data: createCatsDTO): Promise<CatsDTO> {
    try {
      const cat = await this.prisma.cats.create({ data });
      return cat;
    } catch (e) {
      console.log(e);
      throw new HttpException('error', HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, data: updateCatsDTO) {
    if (Object.keys(data).length == 0) {
      return await this.findById(id);
    }
    try {
      const cat = await this.prisma.cats.update({ where: { id }, data });
      return cat;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async delete(id: number) {
    try {
      const user = await this.prisma.cats.delete({ where: { id } });
      return user;
    } catch (error) {
      throw new NotFoundException('Pet not found!');
    }
  }
}
