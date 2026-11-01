import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,3}[\d\s-]{6,15}$/, {
    message:
      'Invalid phone number format, expected format: +<country code> <number>',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;
}
