export interface Store {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStoreData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
}

export interface UpdateStoreData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  status?: string;
}

export interface StoresFilters {
  search?: string;
  sort?: string;
}


