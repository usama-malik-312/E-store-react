import { Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const { Title } = Typography;

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prevIsLoggingInRef = useRef(isLoggingIn);
  const hasRedirectedRef = useRef(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    // Reset redirect flag when leaving login page
    if (location.pathname !== "/login") {
      hasRedirectedRef.current = false;
      return;
    }

    // Only redirect if we're on the login page and login just completed
    // Check if login just finished (was loading, now not loading, and authenticated)
    if (
      prevIsLoggingInRef.current &&
      !isLoggingIn &&
      isAuthenticated &&
      !hasRedirectedRef.current
    ) {
      hasRedirectedRef.current = true;
      navigate("/users", { replace: true });
    }
    prevIsLoggingInRef.current = isLoggingIn;
  }, [isAuthenticated, isLoggingIn, navigate, location.pathname]);

  const onSubmit = async (data: LoginFormData) => {
    login(data);
    // Navigation will happen automatically via useEffect after state updates
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <div className="text-center mb-8">
            <Title level={2} className="mb-2">
              Electric Store
            </Title>
            <Typography.Text type="secondary">
              Management System
            </Typography.Text>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email or Username
              </label>
              <Controller
                name="identifier"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Enter your email or username"
                    status={errors.identifier ? "error" : ""}
                  />
                )}
              />
              {errors.identifier && (
                <Typography.Text type="danger" className="text-xs mt-1 block">
                  {errors.identifier.message}
                </Typography.Text>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Enter your password"
                    status={errors.password ? "error" : ""}
                  />
                )}
              />
              {errors.password && (
                <Typography.Text type="danger" className="text-xs mt-1 block">
                  {errors.password.message}
                </Typography.Text>
              )}
            </div>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isLoggingIn}
              className="mb-4"
            >
              Sign In
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
