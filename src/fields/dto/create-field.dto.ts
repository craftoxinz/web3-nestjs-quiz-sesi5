import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  ValidationArguments,
} from 'class-validator';
import { FieldStatus, SportType } from '../interfaces/field.interface.js';

export class CreateFieldDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{3}-\d{3}$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must follow the pattern XXX-000, e.g. FTL-001`;
    },
  })
  name: string;

  @IsEnum(SportType)
  sportType: SportType;

  @IsInt()
  @IsPositive()
  pricePerHour: number;

  @IsEnum(FieldStatus)
  status: FieldStatus;
}
