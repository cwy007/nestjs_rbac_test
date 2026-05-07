import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { CreateBbbDto } from './dto/create-bbb.dto';
import { UpdateBbbDto } from './dto/update-bbb.dto';
import { RequireLogin, RequirePermissions } from 'src/custom-decorator';

@Controller('bbb')
@RequireLogin()
export class BbbController {
  constructor(private readonly bbbService: BbbService) { }

  @Post()
  @RequirePermissions('create_bbb')
  create(@Body() createBbbDto: CreateBbbDto) {
    return this.bbbService.create(createBbbDto);
  }

  @Get()
  @RequirePermissions('query_bbb')
  findAll() {
    return this.bbbService.findAll();
  }

  @Get(':id')
  @RequirePermissions('query_bbb')
  findOne(@Param('id') id: string) {
    return this.bbbService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('update_bbb')
  update(@Param('id') id: string, @Body() updateBbbDto: UpdateBbbDto) {
    return this.bbbService.update(+id, updateBbbDto);
  }

  @Delete(':id')
  @RequirePermissions('delete_bbb')
  remove(@Param('id') id: string) {
    return this.bbbService.remove(+id);
  }
}
