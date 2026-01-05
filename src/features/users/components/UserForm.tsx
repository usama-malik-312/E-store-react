import { Input, Select, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, CreateUserData, UpdateUserData } from "../types";
import { useRoles } from "@/features/roles/hooks";
import { useTranslation } from "react-i18next";

const { Option } = Select;

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const getCreateUserSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t("validation.emailInvalid")).min(1, t("users.emailRequired")),
  full_name: z.string().min(1, t("users.usernameRequired")),
  password: z.string().min(6, t("users.passwordMinLength")),
  role: z.string().min(1, t("users.usernameRequired")),
  phone: z.string().optional(),
});

const getUpdateUserSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t("validation.emailInvalid")).min(1, t("users.emailRequired")),
  full_name: z.string().min(1, t("users.usernameRequired")),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 0 || val.length >= 6, {
      message: t("users.passwordMinLength"),
    }),
  role: z.string().min(1, t("users.usernameRequired")),
  phone: z.string().optional(),
});

type CreateUserFormData = z.infer<ReturnType<typeof getCreateUserSchema>>;
type UpdateUserFormData = z.infer<ReturnType<typeof getUpdateUserSchema>>;
type UserFormData = CreateUserFormData | UpdateUserFormData;

export const UserForm = ({
  user,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: UserFormProps) => {
  const { t } = useTranslation();
  const { data: rolesData, isLoading: rolesLoading } = useRoles({}, 1, 100);
  const roles = (rolesData as any)?.data || [];

  const createUserSchema = getCreateUserSchema(t);
  const updateUserSchema = getUpdateUserSchema(t);

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
          <label className="block text-sm font-medium mb-2">
            {t("common.email")} *
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("users.enterEmail")}
                status={errors.email ? "error" : ""}
                disabled={isEdit}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("users.fullName")} *
          </label>
          <Controller
            name="full_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("users.enterUsername")}
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
            {t("users.password")} {isEdit ? `(${t("common.close")} ${t("common.close")} ${t("common.close")})` : "*"}
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                size="large"
                placeholder={isEdit ? t("users.enterPassword") : t("users.enterPassword")}
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
          <label className="block text-sm font-medium mb-2">
            {t("users.role")} *
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                size="large"
                placeholder={t("users.selectRole")}
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
          <label className="block text-sm font-medium mb-2">
            {t("common.phone")}
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("users.enterPhone")}
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
            {t("common.cancel")}
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? t("common.update") : t("common.create")} {t("users.title").split(" ")[0]}
          </Button>
        </div>
      </div>
    </form>
  );
};
