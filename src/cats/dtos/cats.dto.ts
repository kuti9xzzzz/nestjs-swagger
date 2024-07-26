import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

class CatsDTO {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

class createCatsDTO {
  @IsNotEmpty()
  @MinLength(4, { message: 'Name must be at least 4 characters!' })
  @MaxLength(20, { message: 'Name must be less than 20 characters!' })
  name: string;
}

class updateCatsDTO {
  @IsOptional()
  @MinLength(4, { message: 'Name must be at least 4 characters!' })
  @MaxLength(20, { message: 'Name must be less than 20 characters!' })
  name?: string;
}

const catsResponse: CatsDTO = {
  id: 1,
  name: 'string',
  created_at: new Date(),
  updated_at: new Date(),
};

const catBody = {
  name: 'example',
};

export { CatsDTO, createCatsDTO, updateCatsDTO, catsResponse, catBody };
