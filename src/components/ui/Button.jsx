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
  weight = "semibold",
  type ,
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
    sm: "px-7 py-2 text-sm min-w-[110px] font-medium",
    md: "px-6 py-[6px] text-[17px] min-w-[110px]",
    lg: "px-6 py-2 md:px-12 md:py-4 text-lg font-bold",
    xl: "px-6 py-2 md:px-14 md:py-3 text-lg md:text-[22px] font-bold",
    xxl: "px-6 py-3 md:px-[44px] md:py-[16px] text-lg md:text-[26px] font-bold",
    full: "w-full px-4 py-2 text-base",
    none: "p-0",
    icon: "text-lg  font-regular",
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
      "rounded-radius min-w-[90px] bg-primary text-white border-1 border-transparent hover:bg-white hover:text-black hover:border-black transition",
    secondary:
      "rounded-radius min-w-[90px] bg-[#F9F9F9] text-light border-2 border-stock hover:border-black hover:bg-primary hover:text-white hover:border-primary",
    outline:
      "rounded-radius min-w-[90px] border-1 border-stock text-black bg-transparent hover:bg-primary hover:text-white hover:border-primary transition",
    outlineWhite:
      "rounded-full min-w-[90px] border border-white text-white bg-transparent hover:bg-primary hover:text-white hover:border-primary transition",
    icon: "w-fit bg-transparent font-thin",
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
        type={type}
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
      type={type}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
