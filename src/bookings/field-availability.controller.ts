import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';

@Controller('fields/:fieldId/availability')
export class FieldAvailabilityController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  getAvailability(
    @Param('fieldId', ParseUUIDPipe) fieldId: string,
    @Query('date') date: string,
  ) {
    return this.bookingsService.getAvailability(fieldId, date);
  }
}
