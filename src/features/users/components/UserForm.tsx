import { Input, Select, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, CreateUserData, UpdateUserData } from "../types";
import { useRoles } from "@/features/roles/hooks";

const { Option } = Select;

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const createUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  full_name: z.string().min(1, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
  phone: z.string().optional(),
});

const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  full_name: z.string().min(1, "Full name is required"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0 || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
  role: z.string().min(1, "Role is required"),
  phone: z.string().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;
type UserFormData = CreateUserFormData | UpdateUserFormData;

export const UserForm = ({
  user,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: UserFormProps) => {
  // Fetch roles for dropdown
  const { data: rolesData, isLoading: rolesLoading } = useRoles({}, 1, 100);
  const roles = (rolesData as any)?.data || [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(isEdit ? updateUserSchema : createUserSchema),
    defaultValues: {
      email: user?.email || "",
      full_name: user?.full_name || "",
      password: "",
      role: user?.role || "",
      phone: user?.phone || "",
    },
  });

  const onFormSubmit = (data: UserFormData) => {
    const submitData: CreateUserData | UpdateUserData = {
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      phone: data.phone || undefined,
    };

    // Only include password if it's provided (for edit) or required (for create)
    if (!isEdit) {
      (submitData as CreateUserData).password = data.password as string;
    } else if (data.password && data.password.trim() !== "") {
      (submitData as UpdateUserData).password = data.password as string;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email *</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter email"
                status={errors.email ? "error" : ""}
                disabled={isEdit} // Email usually can't be changed
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <Controller
            name="full_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter full name"
                status={errors.full_name ? "error" : ""}
              />
            )}
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Password {isEdit ? "(leave blank to keep current)" : "*"}
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                placeholder={isEdit ? "Enter new password" : "Enter password"}
                status={errors.password ? "error" : ""}
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Role *</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="large"
                placeholder="Select role"
                className="w-full"
                status={errors.role ? "error" : ""}
                loading={rolesLoading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {roles.map((role: any) => (
                  <Option key={role.id} value={role.code || role.name}>
                    {role.name}
                  </Option>
                ))}
              </Select>
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter phone number"
                status={errors.phone ? "error" : ""}
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? "Update" : "Create"} User
          </Button>
        </div>
      </div>
    </form>
  );
};
