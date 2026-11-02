import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldDto } from './create-field.dto.js';

export class UpdateFieldDto extends PartialType(CreateFieldDto) {}
