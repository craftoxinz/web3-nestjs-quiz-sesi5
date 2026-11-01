import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidationArguments,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,3}[\d\s-]{6,15}$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must start with a country code, e.g. +62 812-3456-7890`;
    },
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;
}
