import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller.js';
import { BookingsService } from './bookings.service.js';
import { CustomersModule } from '../customers/customers.module.js';
import { FieldsModule } from '../fields/fields.module.js';
import { CustomerBookingsController } from './customer-bookings.controller.js';
import { FieldAvailabilityController } from './field-availability.controller.js';

@Module({
  controllers: [
    BookingsController,
    CustomerBookingsController,
    FieldAvailabilityController,
  ],
  imports: [CustomersModule, FieldsModule],
  providers: [BookingsService],
})
export class BookingsModule {}
