import { type ICustomer } from '@/shared/model/customer.model';

export interface IBook {
  id?: number;
  name?: string | null;
  title?: string | null;
  price?: number | null;
  customer?: ICustomer | null;
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public name?: string | null,
    public title?: string | null,
    public price?: number | null,
    public customer?: ICustomer | null,
  ) {}
}
