import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './interfaces/customer.interface.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { PutCustomerDto } from './dto/put-customer.dto.js';

@Injectable()
export class CustomersService {
  private readonly customers: Customer[] = [
    {
      id: '8b737a45-9b0b-485d-9189-e54f4547b138',
      name: 'John Doe',
      phoneNumber: '+1 123-456-7890',
      address: '123 Main St, Anytown, USA',
    },
    {
      id: 'b95acdd5-6897-4253-9bff-9e1bc34ced6a',
      name: 'Budi Santoso',
      phoneNumber: '+62 812-3456-7890',
      address: 'Jl. Asia Afrika No. 12, Bandung, Jawa Barat, Indonesia',
    },
    {
      id: '5a58df14-e2da-4f08-9b82-f723f02b5edc',
      name: 'Ahmad Fauzi',
      phoneNumber: '+62 811-2345-6789',
      address: 'Jl. Diponegoro No. 56, Surabaya, Indonesia',
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
    const newCustomer: Customer = {
      id: crypto.randomUUID(),
      ...createCustomerDto,
    };

    this.customers.push(newCustomer);
    return newCustomer;
  }

  update(id: string, updateCustomerDto: UpdateCustomerDto): Customer {
    const customer = this.findOne(id);

    Object.assign(customer, updateCustomerDto, { id });
    return customer;
  }

  replace(id: string, putCustomerDto: PutCustomerDto): Customer {
    const customer = this.findOne(id);

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
}
