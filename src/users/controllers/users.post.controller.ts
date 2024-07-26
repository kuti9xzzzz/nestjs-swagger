import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import * as jwt from 'jsonwebtoken';
import { TLogin, TRegister, UsersDTO } from '../dto/user.dto';
import * as brcypt from 'bcrypt';
import * as uuid from 'uuid';

type TJWT = {
  access_token: string;
  token_type: string;
};

@ApiTags('Users')
@Controller('api/v1/users')
export class PostUsersController {
  constructor(private usersService: UsersService) {}

  @Post('/login')
  @ApiOperation({
    summary: 'Login',
    description: 'Login method',
  })
  @ApiBody({
    type: TLogin,
    examples: {
      example: { value: { email: 'hung@gmail.com', password: '123456' } },
    },
  })
  async login(@Body() data: TLogin): Promise<TJWT> {
    const user = await this.usersService.findByEmail(
      data.username ? data.username : data.email,
    );
    if (!user) {
      throw new BadRequestException('Invalid credentials!');
    }
    const compare = await brcypt.compare(data.password, user.password);
    if (!compare) {
      throw new BadRequestException('Invalid credentials!');
    }
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '10m' });
    return {
      access_token: token,
      token_type: 'bearer',
    };
  }

  @Post('/register')
  @ApiOperation({
    summary: 'Register',
    description: 'Register method',
  })
  @ApiBody({
    type: TRegister,
    examples: {
      example: {
        value: {
          name: 'hung',
          email: 'hung@gmail.com',
          password: '123456',
          password_confirmation: '123456',
        },
      },
    },
  })
  async register(@Body() data: TRegister): Promise<UsersDTO> {
    if (data.password !== data.password_confirmation) {
      throw new BadRequestException("Password doesn't match!");
    }
    const hashedPassword = await brcypt.hash(data.password, 12);
    data.password = hashedPassword;
    data.user_id = uuid.v4();
    delete data.password_confirmation;
    const user = await this.usersService.create(data);
    delete user.password;
    return user;
  }
}
