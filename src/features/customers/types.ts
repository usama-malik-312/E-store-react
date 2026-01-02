export interface Customer {
  id: number;
  name: string;
  customer_code?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerData {
  name: string;
  customer_code?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}

export interface UpdateCustomerData {
  name?: string;
  customer_code?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}

export interface CustomersFilters {
  search?: string;
  status?: string;
  sort?: string;
}


