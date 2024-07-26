import { TUserRoles } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

class UsersDTO {
  id: number;

  user_id: string;

  name: string;

  email: string;

  password?: string;

  avatar: string;

  role: TUserRoles;

  created_at: Date;

  updated_at: Date;
}

class TLogin {
  @IsOptional()
  @IsEmail()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @MinLength(6, { message: 'Password must be at least 6 characters!' })
  password: string;
}

class TRegister {
  user_id: string;

  @IsNotEmpty()
  @MinLength(4, { message: 'Name must be at least 4 characters!' })
  @MaxLength(20, { message: 'Name must less than 20 characters!' })
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters!' })
  @MaxLength(20, { message: 'Password must less than 20 characters!' })
  password: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password confirmation must be at least 6 characters!',
  })
  @MaxLength(20, {
    message: 'Password confirmation must less than 20 characters!',
  })
  password_confirmation?: string;
}

class TUpdateUser {
  @IsOptional()
  @MinLength(4, { message: 'Name must be at least 4 characters!' })
  @MaxLength(20, { message: 'Name must less than 20 characters!' })
  name?: string;

  @IsOptional()
  @MaxLength(100, { message: 'Name must less than 100 characters!' })
  avatar?: string;
}

class TAdminUpdateUser {
  @IsOptional()
  @MinLength(4, { message: 'Name must be at least 4 characters!' })
  @MaxLength(20, { message: 'Name must less than 20 characters!' })
  name?: string;

  @IsOptional()
  @MaxLength(100, { message: 'Name must less than 100 characters!' })
  avatar?: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters!' })
  @MaxLength(20, { message: 'Password must less than 20 characters!' })
  password?: string;

  @IsOptional()
  role?: TUserRoles;
}

class TUpdatePassword {
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters!' })
  @MaxLength(20, { message: 'Password must less than 20 characters!' })
  password: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password confirmation must be at least 6 characters!',
  })
  @MaxLength(20, {
    message: 'Password confirmation must less than 20 characters!',
  })
  password_confirmation: string;
}

const userResponse: UsersDTO = {
  id: 1,
  user_id: 'string',
  name: 'string',
  email: 'string',
  avatar: 'string',
  role: 'user',
  created_at: new Date(),
  updated_at: new Date(),
};

export {
  UsersDTO,
  TLogin,
  TRegister,
  TUpdateUser,
  TUpdatePassword,
  TAdminUpdateUser,
  userResponse,
};
