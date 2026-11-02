import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { FieldsService } from './fields.service.js';
import { CreateFieldDto } from './dto/create-field.dto.js';
import { UpdateFieldDto } from './dto/update-field.dto.js';
import { ReplaceFieldDto } from './dto/replace-field.dto.js';

@Controller('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Get()
  findAll() {
    return this.fieldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.fieldsService.findOne(id);
  }

  @Post()
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(createFieldDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    return this.fieldsService.update(id, updateFieldDto);
  }

  @Put(':id')
  replace(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() replaceFieldDto: ReplaceFieldDto,
  ) {
    return this.fieldsService.replace(id, replaceFieldDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.fieldsService.delete(id);
  }
}
