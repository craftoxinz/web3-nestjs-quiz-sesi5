import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Booking,
  BookingResponse,
  BookingStatus,
} from './interfaces/booking.interface.js';
import { CustomersService } from '../customers/customers.service.js';
import { FieldsService } from '../fields/fields.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { FieldStatus } from '../fields/interfaces/field.interface.js';

const OPENING_TIME = '08:00';
const CLOSING_TIME = '24:00';

@Injectable()
export class BookingsService {
  constructor(
    private readonly customersService: CustomersService,
    private readonly fieldsService: FieldsService,
  ) {}

  private readonly bookings: Booking[] = [
    {
      id: '9f992dcf-4fc0-4145-a645-889dfb958359',
      fieldId: 'c4a6b7cb-b40a-41b4-a154-21c5847869e8',
      customerId: '8b737a45-9b0b-485d-9189-e54f4547b138',
      date: '2030-01-15',
      startTime: '18:00',
      endTime: '19:00',
      status: BookingStatus.BOOKED,
      totalPrice: 150000,
      createdAt: new Date('2026-11-02T03:00:00.000Z'),
      updatedAt: new Date('2026-11-02T03:00:00.000Z'),
    },
    {
      id: 'fbac454c-ffea-4fbc-bc30-bc0b96095187',
      fieldId: 'c4a6b7cb-b40a-41b4-a154-21c5847869e8',
      customerId: 'd0e49e0a-9d51-4f2f-89cd-ecec1b7e07f6',
      date: '2030-01-15',
      startTime: '19:00',
      endTime: '21:00',
      status: BookingStatus.BOOKED,
      totalPrice: 300000,
      createdAt: new Date('2026-11-02T03:30:00.000Z'),
      updatedAt: new Date('2026-11-02T03:30:00.000Z'),
    },
    {
      id: '236eb399-bc6e-45ad-b4f1-85c43de9df79',
      fieldId: 'c4a6b7cb-b40a-41b4-a154-21c5847869e8',
      customerId: '5a58df14-e2da-4f08-9b82-f723f02b5edc',
      date: '2030-01-15',
      startTime: '18:00',
      endTime: '19:00',
      status: BookingStatus.CANCELLED,
      totalPrice: 150000,
      createdAt: new Date('2026-11-01T08:00:00.000Z'),
      updatedAt: new Date('2026-11-01T10:00:00.000Z'),
    },
    {
      id: '024aaffd-b935-4d3c-9d6d-b935b44ced9d',
      fieldId: '7fdef5d3-3d50-48d1-84b7-566e427e2948',
      customerId: '5a58df14-e2da-4f08-9b82-f723f02b5edc',
      date: '2030-01-17',
      startTime: '19:00',
      endTime: '21:00',
      status: BookingStatus.BOOKED,
      totalPrice: 400000,
      createdAt: new Date('2026-11-02T05:00:00.000Z'),
      updatedAt: new Date('2026-11-02T05:00:00.000Z'),
    },
    {
      id: '80bad8d3-124e-4880-a250-ae71828a9b7e',
      fieldId: '4ec6dcc2-5b1f-4fa1-b0de-b13aca95c312',
      customerId: 'b95acdd5-6897-4253-9bff-9e1bc34ced6a',
      date: '2026-10-30',
      startTime: '10:00',
      endTime: '12:00',
      status: BookingStatus.COMPLETED,
      totalPrice: 120000,
      createdAt: new Date('2026-10-27T02:00:00.000Z'),
      updatedAt: new Date('2026-10-30T06:00:00.000Z'),
    },
  ];

  findAll(): BookingResponse[] {
    return this.bookings.map((booking) => this.toResponse(booking));
  }

  findOne(id: string): BookingResponse {
    return this.toResponse(this.findBookingOrThrow(id));
  }

  create(createBookingDto: CreateBookingDto): BookingResponse {
    const { fieldId, customerId, date, startTime, endTime } = createBookingDto;

    this.assertValidSlot(date, startTime, endTime);
    this.customersService.findOne(customerId);

    const field = this.fieldsService.findOne(fieldId);

    if (field.status !== FieldStatus.AVAILABLE) {
      throw new ConflictException(`field ${field.name} is not available`);
    }

    if (this.hasConflict(fieldId, date, startTime, endTime)) {
      throw new ConflictException('the selected time slot is already booked');
    }

    const totalPrice = this.calculateTotalPrice(
      startTime,
      endTime,
      field.pricePerHour,
    );

    const now = new Date();

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      ...createBookingDto,
      status: BookingStatus.BOOKED,
      totalPrice,
      createdAt: now,
      updatedAt: now,
    };
    this.bookings.push(newBooking);
    return this.toResponse(newBooking);
  }

  cancel(id: string): BookingResponse {
    const booking = this.findBookingOrThrow(id);

    if (booking.status !== BookingStatus.BOOKED) {
      throw new BadRequestException(
        `only bookings with status ${BookingStatus.BOOKED} can be cancelled`,
      );
    }

    booking.status = BookingStatus.CANCELLED;
    booking.updatedAt = new Date();
    return this.toResponse(booking);
  }

  findByCustomerId(customerId: string): BookingResponse[] {
    this.customersService.findOne(customerId);
    return this.bookings
      .filter((booking) => booking.customerId === customerId)
      .map((booking) => this.toResponse(booking));
  }

  getAvailability(fieldId: string, date: string) {
    const field = this.fieldsService.findOne(fieldId);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
      throw new BadRequestException('query date is required (YYYY-MM-DD)');
    }

    const bookedSlots = this.bookings
      .filter(
        (booking) =>
          booking.fieldId === fieldId &&
          booking.date === date &&
          booking.status === BookingStatus.BOOKED,
      )
      .map(({ startTime, endTime }) => ({ startTime, endTime }))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const availableSlots: { startTime: string; endTime: string }[] = [];

    if (field.status === FieldStatus.AVAILABLE) {
      let cursor = OPENING_TIME;
      for (const slot of bookedSlots) {
        if (slot.startTime > cursor) {
          availableSlots.push({ startTime: cursor, endTime: slot.startTime });
        }
        if (slot.endTime > cursor) cursor = slot.endTime;
      }
      if (cursor < CLOSING_TIME) {
        availableSlots.push({ startTime: cursor, endTime: CLOSING_TIME });
      }
    }

    return {
      fieldId,
      fieldName: field.name,
      status: field.status,
      date,
      bookedSlots,
      availableSlots,
    };
  }

  private findBookingOrThrow(id: string): Booking {
    const booking = this.bookings.find((booking) => booking.id === id);

    if (!booking) {
      throw new NotFoundException(`booking with id ${id} not found`);
    }
    return booking;
  }

  private toResponse(booking: Booking): BookingResponse {
    const customer = this.customersService
      .findAll()
      .find((customer) => customer.id === booking.customerId);

    const field = this.fieldsService
      .findAll()
      .find((field) => field.id === booking.fieldId);

    return {
      ...booking,
      customerName: customer?.name ?? 'unknown customer',
      fieldName: field?.name ?? 'unknown field',
    };
  }

  private toMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private calculateTotalPrice(
    startTime: string,
    endTime: string,
    pricePerHour: number,
  ): number {
    const durationInHours =
      (this.toMinutes(endTime) - this.toMinutes(startTime)) / 60;
    return Math.round(durationInHours * pricePerHour);
  }

  private assertValidSlot(
    date: string,
    startTime: string,
    endTime: string,
  ): void {
    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime');
    }

    if (startTime < OPENING_TIME || endTime > CLOSING_TIME) {
      throw new BadRequestException(
        `bookings are only allowed between ${OPENING_TIME} and ${CLOSING_TIME}`,
      );
    }

    const now = new Date();
    const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    const currentTime = now.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });

    if (date < today || (date === today && startTime <= currentTime)) {
      throw new BadRequestException('booking time must be in the future');
    }
  }

  private hasConflict(
    fieldId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): boolean {
    return this.bookings.some(
      (booking) =>
        booking.fieldId === fieldId &&
        booking.date === date &&
        booking.status === BookingStatus.BOOKED &&
        startTime < booking.endTime &&
        endTime > booking.startTime,
    );
  }
}
