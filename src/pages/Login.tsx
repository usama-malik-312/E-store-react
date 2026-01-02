import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";

export const Login = () => {
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const prevIsLoggingInRef = useRef(isLoggingIn);
  const hasRedirectedRef = useRef(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const loginSchema = z.object({
    identifier: z.string().min(1, t("auth.emailOrUsername") + " " + t("validation.required")),
    password: z.string().min(6, t("validation.minLength").replace("{{min}}", "6")),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[450px]"
      >
        <Card
          className="shadow-[0px_4px_15px_rgba(0,0,0,0.1)] rounded-2xl border-0"
          padding="lg"
        >
          {/* Store Logo Placeholder */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-md mb-4">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Electric Store
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {t("navigation.pos")} & {t("navigation.inventory")} {t("navigation.settings")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email/Username Input */}
            <Controller
              name="identifier"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  label={t("auth.emailOrUsername")}
                  type="text"
                  placeholder={t("auth.enterEmailOrUsername")}
                  error={errors.identifier?.message}
                  required
                />
              )}
            />

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t("auth.password")}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("auth.enterPassword")}
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A10.05 10.05 0 015.12 5.12m3.46 3.46L12 12m-3.42-3.42L3 3m6.42 6.42L12 12m0 0l3.29-3.29M12 12l3.29 3.29M12 12l-3.29-3.29m6.58 6.58L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end -mt-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle forgot password logic here
                }}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {t("auth.forgotPassword")}
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              isLoading={isLoggingIn}
            >
              {t("auth.login")}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
