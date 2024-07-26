import {
  Body,
  Controller,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOAuth2, ApiParam, ApiTags } from '@nestjs/swagger';
import { CatsService } from '../services/cats.service';
import { catBody, updateCatsDTO } from '../dtos/cats.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/role';

@ApiTags('Cats')
@ApiOAuth2(['pets:write'])
@Controller('api/v1/cats')
export class PutCatsController {
  constructor(private catsService: CatsService) {}

  @Put('/:id')
  @ApiParam({
    name: 'id',
    description: 'Cat ID',
    type: 'string',
  })
  @ApiBody({
    type: updateCatsDTO,
    examples: { example: { value: catBody } },
  })
  @UseGuards(AuthGuard)
  async update_user(
    @Param() param: { id: string },
    @Body() body: updateCatsDTO,
  ) {
    return await this.catsService.update(+param.id, body);
  }

  @Delete('/:id')
  @Roles(['admin'])
  @ApiParam({
    name: 'id',
    description: 'Cat ID',
    type: 'string',
  })
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async delete_cat(@Param() param: { id: string }) {
    return await this.catsService.delete(+param.id);
  }
}
