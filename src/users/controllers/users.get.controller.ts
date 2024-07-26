import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import {
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { userResponse, UsersDTO } from '../dto/user.dto';
import { Roles } from 'src/decorators/role';
import { AuthGuard } from 'src/auth/auth.guard';
import { SwaggerSuccessfulResponse200 } from 'src/swagger';

@ApiTags('Users')
@ApiOAuth2(['read'])
@Controller('api/v1/users')
export class GetUsersController {
  constructor(private usersService: UsersService) {}

  @Get('/profile')
  @ApiOperation({
    summary: 'Get profile',
    description: "Get current user's profile",
  })
  @ApiResponse(SwaggerSuccessfulResponse200([userResponse]))
  @UseGuards(AuthGuard)
  async get_profile(@Request() req: any) {
    return req.user;
  }

  @Get('/')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users',
  })
  @ApiResponse(SwaggerSuccessfulResponse200([userResponse]))
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async get_users(): Promise<UsersDTO[]> {
    const users = await this.usersService.findAll();
    return users;
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get user',
    description: 'Retrieve a user',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
  })
  @ApiResponse(SwaggerSuccessfulResponse200([userResponse]))
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async get_user(@Param() param: { id: string }): Promise<UsersDTO> {
    const user = await this.usersService.findById(+param.id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    delete user.password;
    return user;
  }
}
