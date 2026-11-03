import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from './interfaces/customer.interface.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { ReplaceCustomerDto } from './dto/replace-customer.dto.js';

@Injectable()
export class CustomersService {
  private readonly customers: Customer[] = [
    {
      id: '8b737a45-9b0b-485d-9189-e54f4547b138',
      name: 'Andi Pratama',
      phoneNumber: '+62 812-1111-2201',
      address: 'Jl. Merdeka No. 10, Bandung, Jawa Barat, Indonesia',
      createdAt: new Date('2026-01-12T02:30:00.000Z'),
      updatedAt: new Date('2026-01-12T02:30:00.000Z'),
    },
    {
      id: 'd0e49e0a-9d51-4f2f-89cd-ecec1b7e07f6',
      name: 'Siti Nurhaliza',
      phoneNumber: '+62 813-2222-3302',
      address: 'Jl. Pemuda No. 25, Semarang, Jawa Tengah, Indonesia',
      createdAt: new Date('2026-02-03T07:15:00.000Z'),
      updatedAt: new Date('2026-04-21T03:12:00.000Z'),
    },
    {
      id: 'd4b0fa49-f698-4bdd-b471-901af11a0716',
      name: 'Agus Wijaya',
      phoneNumber: '+62 857-3333-4403',
      address: 'Jl. Raya Kuta No. 8, Badung, Bali, Indonesia',
      createdAt: new Date('2026-02-27T04:40:00.000Z'),
      updatedAt: new Date('2026-02-27T04:40:00.000Z'),
    },
    {
      id: 'b95acdd5-6897-4253-9bff-9e1bc34ced6a',
      name: 'Budi Santoso',
      phoneNumber: '+62 812-3456-7890',
      address: 'Jl. Asia Afrika No. 12, Bandung, Jawa Barat, Indonesia',
      createdAt: new Date('2026-03-19T09:05:00.000Z'),
      updatedAt: new Date('2026-08-05T06:40:00.000Z'),
    },
    {
      id: '5a58df14-e2da-4f08-9b82-f723f02b5edc',
      name: 'Ahmad Fauzi',
      phoneNumber: '+62 811-2345-6789',
      address: 'Jl. Diponegoro No. 56, Surabaya, Jawa Timur, Indonesia',
      createdAt: new Date('2026-04-08T03:50:00.000Z'),
      updatedAt: new Date('2026-04-08T03:50:00.000Z'),
    },
  ];

  findAll(): Customer[] {
    return this.customers;
  }

  findOne(id: string): Customer {
    const customer = this.customers.find((customer) => customer.id === id);

    if (!customer) {
      throw new NotFoundException(`customer with id ${id} not found`);
    }
    return customer;
  }

  create(createCustomerDto: CreateCustomerDto): Customer {
    this.assertPhoneNumberAvailable(createCustomerDto.phoneNumber);
    const now = new Date();

    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      ...createCustomerDto,
      createdAt: now,
      updatedAt: now,
    };

    this.customers.push(newCustomer);
    return newCustomer;
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto): Customer {
    const customer = this.findOne(id);

    if (updateCustomerDto.phoneNumber) {
      this.assertPhoneNumberAvailable(updateCustomerDto.phoneNumber, id);
    }

    Object.assign(customer, updateCustomerDto, { id, updatedAt: new Date() });
    return customer;
  }

  replace(id: string, replaceCustomerDto: ReplaceCustomerDto): Customer {
    const customer = this.findOne(id);

    this.assertPhoneNumberAvailable(replaceCustomerDto.phoneNumber, id);

    Object.assign(customer, replaceCustomerDto, { id, updatedAt: new Date() });
    return customer;
  }

  delete(id: string): void {
    const index = this.customers.findIndex((customer) => customer.id === id);

    if (index === -1) {
      throw new NotFoundException(`customer with id ${id} not found`);
    }
    this.customers.splice(index, 1);
  }

  private assertPhoneNumberAvailable(
    phoneNumber: string,
    excludeId?: string,
  ): void {
    const target = this.normalizePhoneNumber(phoneNumber);

    const exists = this.customers.some(
      (customer) =>
        this.normalizePhoneNumber(customer.phoneNumber) === target &&
        customer.id !== excludeId,
    );

    if (exists) {
      throw new ConflictException(
        `customer with phoneNumber ${phoneNumber} already exists`,
      );
    }
  }

  private normalizePhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[\s-]/g, '');
  }
}
