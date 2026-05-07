import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AaaService } from './aaa.service';
import { CreateAaaDto } from './dto/create-aaa.dto';
import { UpdateAaaDto } from './dto/update-aaa.dto';
import { RequireLogin, RequirePermissions } from 'src/custom-decorator';

@Controller('aaa')
@RequireLogin()
export class AaaController {
  constructor(private readonly aaaService: AaaService) { }

  @Post()
  @RequirePermissions('create_aaa')
  create(@Body() createAaaDto: CreateAaaDto) {
    return this.aaaService.create(createAaaDto);
  }

  @Get()
  @RequirePermissions('query_aaa')
  findAll() {
    return this.aaaService.findAll();
  }

  @Get(':id')
  @RequirePermissions('query_aaa')
  findOne(@Param('id') id: string) {
    return this.aaaService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('update_aaa')
  update(@Param('id') id: string, @Body() updateAaaDto: UpdateAaaDto) {
    return this.aaaService.update(+id, updateAaaDto);
  }

  @Delete(':id')
  @RequirePermissions('delete_aaa')
  remove(@Param('id') id: string) {
    return this.aaaService.remove(+id);
  }
}
