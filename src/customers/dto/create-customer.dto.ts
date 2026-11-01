import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,3}[\d\s-]{6,15}$/) // format: +<country code> <number>, e.g., +1 123-456-7890
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;
}
