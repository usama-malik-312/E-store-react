export interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSupplierData {
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateSupplierData {
  name?: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface SuppliersFilters {
  search?: string;
  sort?: string;
}

