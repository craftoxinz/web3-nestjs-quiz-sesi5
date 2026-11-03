import {
  IsDateString,
  IsUUID,
  Matches,
  ValidationArguments,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  fieldId: string;

  @IsUUID()
  customerId: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must be in YYYY-MM-DD format, e.g. 2023-01-31`;
    },
  })
  @IsDateString({ strict: true })
  date: string;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must be in HH:mm format, e.g. 10:00`;
    },
  })
  startTime: string;

  @Matches(/^(([01]\d|2[0-3]):[0-5]\d|24:00)$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must be in HH:mm format, e.g. 19:00`;
    },
  })
  endTime: string;
}
