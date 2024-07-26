import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOAuth2,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CatsService } from '../services/cats.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  CatsDTO,
  catsResponse,
  catBody,
  createCatsDTO,
} from '../dtos/cats.dto';
import { validationErrorResponse } from 'src/error.dto';
import {
  SwaggerBadRequestResponse,
  SwaggerSuccessfulResponse201,
} from 'src/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Cats')
@Controller('api/v1/cats')
export class PostCatsController {
  constructor(private catsService: CatsService) {}
  @Post('/')
  @ApiOAuth2(['pets:write'])
  @ApiOperation({
    summary: 'Create cat',
    description: 'Create a cat',
  })
  @ApiCreatedResponse(SwaggerSuccessfulResponse201(catsResponse))
  @ApiBadRequestResponse(SwaggerBadRequestResponse(validationErrorResponse))
  @ApiBody({
    type: createCatsDTO,
    examples: { example: { value: catBody } },
  })
  @UseGuards(AuthGuard)
  async create_cats(@Body() data: createCatsDTO): Promise<CatsDTO> {
    const cat = await this.catsService.create(data);
    return cat;
  }
}
