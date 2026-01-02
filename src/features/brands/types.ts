export interface Brand {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandData {
  name: string;
  description?: string;
}

export interface UpdateBrandData {
  name?: string;
  description?: string;
}

export interface BrandsFilters {
  search?: string;
  sort?: string;
}


