import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CustomersModule } from './customers/customers.module.js';
import { FieldsModule } from './fields/fields.module.js';
import { BookingsModule } from './bookings/bookings.module.js';

@Module({
  imports: [CustomersModule, FieldsModule, BookingsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
