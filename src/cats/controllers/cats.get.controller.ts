import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiOAuth2,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CatsService } from '../services/cats.service';
import { CatsDTO, catsResponse } from '../dtos/cats.dto';
import {
  SwaggerSuccessfulResponse200,
  SwaggerNotFoundResponse,
} from 'src/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Cats')
@ApiOAuth2(['pets:read'])
@Controller('api/v1/cats')
export class GetCatsController {
  constructor(private catsService: CatsService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get all cats',
    description: 'Retrieve a list of all cats',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Error: Unauthorized',
    example: {
      message: 'Unauthorized',
      status: 401,
    },
  })
  @ApiForbiddenResponse({
    status: 403,
    description: 'Error: Forbidden',
    example: {
      statusCode: 403,
      message: 'Token expired',
    },
  })
  @ApiResponse(SwaggerSuccessfulResponse200([catsResponse]))
  async get_cats(): Promise<CatsDTO[]> {
    return await this.catsService.findAll();
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get a cat by ID',
    description: 'Retrieve a cat',
  })
  @ApiParam({
    name: 'id',
    description: 'Cat ID',
    type: 'string',
  })
  @ApiResponse(SwaggerSuccessfulResponse200(catsResponse))
  @ApiNotFoundResponse(SwaggerNotFoundResponse())
  async get_cat(@Param() param: { id: string }): Promise<CatsDTO> {
    const cat = await this.catsService.findById(+param.id);
    if (!cat) {
      throw new HttpException('Cat not found!', HttpStatus.NOT_FOUND);
    }
    return cat;
  }
}
