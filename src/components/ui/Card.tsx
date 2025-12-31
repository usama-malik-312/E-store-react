import { ReactNode, HTMLAttributes } from "react";
import classNames from "classnames";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  padding = "md",
  className,
  ...props
}: CardProps) => {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4 md:p-6",
    lg: "p-6 md:p-8",
  };

  return (
    <div
      className={classNames(
        "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700",
        "transition-shadow duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 pt-4 md:pt-6 pb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="ml-4">{headerAction}</div>}
        </div>
      )}
      <div className={classNames(paddingStyles[padding])}>{children}</div>
    </div>
  );
};

