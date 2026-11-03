import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { BookingResponse } from './interfaces/booking.interface.js';

@Controller('customers/:customerId/bookings')
export class CustomerBookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  findByCustomer(
    @Param('customerId', ParseUUIDPipe) customerId: string,
  ): BookingResponse[] {
    return this.bookingsService.findByCustomerId(customerId);
  }
}
