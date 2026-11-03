export enum BookingStatus {
  BOOKED = 'booked',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface Booking {
  id: string;
  fieldId: string;
  customerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingResponse extends Booking {
  customerName: string;
  fieldName: string;
}
