import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Customer } from './interfaces/customer.interface.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { PutCustomerDto } from './dto/put-customer.dto.js';

@Injectable()
export class CustomersService {
  private readonly customers: Customer[] = [
    {
      id: '8b737a45-9b0b-485d-9189-e54f4547b138',
      name: 'Andi Pratama',
      phoneNumber: '+62 812-1111-2201',
      address: 'Jl. Merdeka No. 10, Bandung, Jawa Barat, Indonesia',
    },
    {
      id: 'd0e49e0a-9d51-4f2f-89cd-ecec1b7e07f6',
      name: 'Siti Nurhaliza',
      phoneNumber: '+62 813-2222-3302',
      address: 'Jl. Pemuda No. 25, Semarang, Jawa Tengah, Indonesia',
    },
    {
      id: 'd4b0fa49-f698-4bdd-b471-901af11a0716',
      name: 'Agus Wijaya',
      phoneNumber: '+62 857-3333-4403',
      address: 'Jl. Raya Kuta No. 8, Badung, Bali, Indonesia',
    },
  ];

  findAll(): Customer[] {
    return this.customers;
  }

  findOne(id: string): Customer {
    const customer = this.customers.find((customer) => customer.id === id);

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  create(createCustomerDto: CreateCustomerDto): Customer {
    this.assertPhoneNumberAvailable(createCustomerDto.phoneNumber);

    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      ...createCustomerDto,
    };

    this.customers.push(newCustomer);
    return newCustomer;
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto): Customer {
    const customer = this.findOne(id);

    if (updateCustomerDto.phoneNumber) {
      this.assertPhoneNumberAvailable(updateCustomerDto.phoneNumber, id);
    }

    Object.assign(customer, updateCustomerDto, { id });
    return customer;
  }

  replace(id: string, putCustomerDto: PutCustomerDto): Customer {
    const customer = this.findOne(id);

    this.assertPhoneNumberAvailable(putCustomerDto.phoneNumber, id);

    Object.assign(customer, putCustomerDto, { id });
    return customer;
  }

  delete(id: string): void {
    const index = this.customers.findIndex((customer) => customer.id === id);

    if (index === -1) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    this.customers.splice(index, 1);
  }

  private assertPhoneNumberAvailable(
    phoneNumber: string,
    excludeId?: string,
  ): void {
    const exists = this.customers.some(
      (customer) =>
        customer.phoneNumber === phoneNumber && customer.id !== excludeId,
    );

    if (exists) {
      throw new ConflictException(
        `Customer with phone number ${phoneNumber} already exists`,
      );
    }
  }
}
