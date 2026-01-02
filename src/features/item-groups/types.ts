export interface ItemGroup {
  id: number;
  group_name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateItemGroupData {
  group_name: string;
  description?: string;
}

export interface UpdateItemGroupData {
  group_name?: string;
  description?: string;
}

export interface ItemGroupsFilters {
  search?: string;
  sort?: string;
}


