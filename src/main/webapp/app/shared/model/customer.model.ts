export interface ICustomer {
  id?: number;
  name?: string | null;
  orderId?: number | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public name?: string | null,
    public orderId?: number | null,
  ) {}
}
