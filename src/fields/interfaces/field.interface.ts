export enum FieldStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  MAINTENANCE = 'maintenance',
}

export enum SportType {
  FUTSAL = 'futsal',
  BADMINTON = 'badminton',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
  VOLLEYBALL = 'volleyball',
}

export interface Field {
  id: string;
  name: string;
  sportType: SportType;
  pricePerHour: number;
  status: FieldStatus;
}
