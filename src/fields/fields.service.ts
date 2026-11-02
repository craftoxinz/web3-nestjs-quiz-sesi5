import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Field, FieldStatus, SportType } from './interfaces/field.interface.js';
import { CreateFieldDto } from './dto/create-field.dto.js';
import { UpdateFieldDto } from './dto/update-field.dto.js';
import { ReplaceFieldDto } from './dto/replace-field.dto.js';

@Injectable()
export class FieldsService {
  private readonly fields: Field[] = [
    {
      id: 'c4a6b7cb-b40a-41b4-a154-21c5847869e8',
      name: 'FTL-001',
      sportType: SportType.FUTSAL,
      pricePerHour: 150000,
      status: FieldStatus.AVAILABLE,
    },
    {
      id: 'd88e1da9-5500-4685-9bf5-a1afb18082b5',
      name: 'FTL-002',
      sportType: SportType.FUTSAL,
      pricePerHour: 150000,
      status: FieldStatus.AVAILABLE,
    },
    {
      id: '4ec6dcc2-5b1f-4fa1-b0de-b13aca95c312',
      name: 'BDM-001',
      sportType: SportType.BADMINTON,
      pricePerHour: 60000,
      status: FieldStatus.AVAILABLE,
    },
    {
      id: '7fdcae4e-bfc7-40fc-be86-acb13eb1ef65',
      name: 'BDM-002',
      sportType: SportType.BADMINTON,
      pricePerHour: 60000,
      status: FieldStatus.MAINTENANCE,
    },
    {
      id: '7fdef5d3-3d50-48d1-84b7-566e427e2948',
      name: 'BSK-001',
      sportType: SportType.BASKETBALL,
      pricePerHour: 200000,
      status: FieldStatus.AVAILABLE,
    },
  ];

  findAll(): Field[] {
    return this.fields;
  }

  findOne(id: string): Field {
    const field = this.fields.find((field) => field.id === id);

    if (!field) {
      throw new NotFoundException(`field with id ${id} not found`);
    }
    return field;
  }

  create(createFieldDto: CreateFieldDto): Field {
    this.assertFieldNameAvailable(createFieldDto.name);

    const newField: Field = {
      id: crypto.randomUUID(),
      ...createFieldDto,
    };

    this.fields.push(newField);
    return newField;
  }

  update(id: string, updateFieldDto: UpdateFieldDto): Field {
    const field = this.findOne(id);

    if (updateFieldDto.name) {
      this.assertFieldNameAvailable(updateFieldDto.name, id);
    }

    Object.assign(field, updateFieldDto, { id });
    return field;
  }

  replace(id: string, replaceFieldDto: ReplaceFieldDto): Field {
    const field = this.findOne(id);

    this.assertFieldNameAvailable(replaceFieldDto.name, id);

    Object.assign(field, replaceFieldDto, { id });
    return field;
  }

  delete(id: string): void {
    const index = this.fields.findIndex((field) => field.id === id);

    if (index === -1) {
      throw new NotFoundException(`field with id ${id} not found`);
    }

    this.fields.splice(index, 1);
  }

  private assertFieldNameAvailable(name: string, excludeId?: string): void {
    const exists = this.fields.some(
      (field) => field.name === name && field.id !== excludeId,
    );

    if (exists) {
      throw new ConflictException(`field with name ${name} already exists`);
    }
  }
}
