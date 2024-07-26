import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOAuth2,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { TAdminUpdateUser, TUpdateUser, UsersDTO } from '../dto/user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/role';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import * as bcrypt from 'bcrypt';
import { TUserRoles } from '@prisma/client';

@ApiTags('Users')
@ApiOAuth2(['write'])
@Controller('api/v1/users')
export class PutUsersController {
  constructor(private usersService: UsersService) {}

  @Put('/update')
  @ApiOperation({
    summary: 'Update user',
    description: "Update user's name or user's avatar",
  })
  @ApiBody({
    type: TUpdateUser,
    examples: {
      example: { value: { name: 'hung', avatar: 'string' } },
    },
  })
  @UseGuards(AuthGuard)
  async update_user(
    @Request() req: { user: UsersDTO },
    @Body() data: TUpdateUser,
  ) {
    const user = await this.usersService.update(+req.user.id, data);
    delete user.password;
    return user;
  }

  @Put('/upload')
  @ApiOperation({
    summary: 'Upload image',
    description: "Upload user's image",
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload_file(
    @Request() req: { user: UsersDTO },
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new HttpException('Invalid file', HttpStatus.BAD_REQUEST);
    }
    const targetDir = path.join(
      __dirname,
      `../../../public/images/${req.user.user_id}`,
    );
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
      const targetPath = path.join(targetDir, file.originalname);
      fs.writeFile(targetPath, file.buffer, (err) => {
        if (err) {
          throw new HttpException(
            'Error saving file',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
      return {
        message: 'Successfully!',
        filepath: `images/${req.user.user_id}/${file.originalname}`,
      };
    } else {
      throw new HttpException(
        'Only .png, .jpg and .jpeg files are allowed!',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update user',
    description: "Update user's name or user's avatar",
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
  })
  @ApiBody({
    type: TAdminUpdateUser,
    examples: {
      example: {
        value: {
          name: 'hung',
          avatar: 'string',
          password: 'string',
          role: TUserRoles.user,
        },
      },
    },
  })
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async admin_update_user(
    @Param() param: { id: string },
    @Body() data: TAdminUpdateUser,
  ) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    if (
      data.role &&
      data.role !== TUserRoles.admin &&
      data.role !== TUserRoles.superadmin &&
      data.role !== TUserRoles.user
    ) {
      throw new BadRequestException('Invalid role!');
    }
    const user = await this.usersService.update(+param.id, data);
    delete user.password;
    return user;
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete a user',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
  })
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async soft_delete(@Param() param: { id: string }) {
    const user = await this.usersService.soft_delete(+param.id);
    delete user.password;
    return user;
  }
}
