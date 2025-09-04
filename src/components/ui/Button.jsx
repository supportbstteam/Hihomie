import React from "react";
import clsx from "clsx";
import Link from "next/link";

const Button = ({
  variant = "primary",
  className,
  icon,
  iconSize,
  iconClassName,
  href,
  children,
  width,
  size = "md",
  color,
  disabled = false,
  weight = "regular",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center text-center justify-center transition-colors cursor-pointer h-fit font-heading";

  const weightStyle = {
    thin: "font-thin",
    regular: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const sizeStyles = {
    xs: "px-3 py-1 text-xs",
    sm: "px-7 py-2 text-sm min-w-[110px]",
    md: "px-6 py-2 text-based min-w-[110px]",
    lg: "px-6 py-2 md:px-12 md:py-4 text-lg font-normal",
    xl: "px-6 py-2 md:px-14 md:py-3 text-lg md:text-2xl font-normal",
    full: "w-full px-4 py-2 text-base font-normal",
    none: "p-0",
    icon: "text-lg  font-normal",
    iconxxl: "text-xl md:text-[25px]",
  };

  const colorStyles = {
    black: "text-black",
    white: "text-white",
    gray: "text-gray-400",
    primary: "text-primary",
    secondary: "text-secondary",
  };

  const variantStyles = {
    primary:
      "rounded-radius min-w-[90px] bg-primary text-white border border-transparent hover:bg-primary/80 hover:text-white hover:border-primary/80 transition",
    secondary:
      "rounded-radius min-w-[90px] bg-white border-2 border-white hover:border-black hover:bg-primary hover:text-white hover:border-primary",
    outline:
      "rounded-radius min-w-[90px] border-1 border-stock text-black bg-transparent hover:bg-primary hover:text-white hover:border-primary transition",
    outlineWhite:
      "rounded-radius min-w-[90px] border border-white text-white bg-transparent hover:bg-primary hover:text-white hover:border-primary transition",
    icon: "w-fit bg-transparent ",
  };

  const renderedIcon =
    icon && React.isValidElement(icon)
      ? React.cloneElement(icon, {
          ...(iconSize ? { size: iconSize } : {}),
          className: clsx("shrink-0", icon.props.className, iconClassName),
        })
      : null;

  const content = (
    <span className="inline-flex items-center gap-4">
      {renderedIcon}
      {children}
    </span>
  );

  const classes = clsx(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    weightStyle[weight],
    color && colorStyles[color],
    disabled && "opacity-50 cursor-not-allowed",
    width && width !== "full" && `w-[${width}]`,
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;