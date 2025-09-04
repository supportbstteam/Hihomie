import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

const Icon = ({
  icon: IconComponent,
  variant = "primary",
  size = 24,
  color = "#99A1B7",
  className ,
  href,
  onClick,
  ...props
}) => {
  if (!IconComponent) {
    console.warn('No icon component passed to <Icon />');
    return null;
  }

    const variantStyles = {
    primary:
      `flex items-center justify-center   w-5 h-7  ${onClick ? "cursor-pointer":""} `,
    outline:
      `flex items-center justify-center border border-stock w-10 h-10 rounded-radius ${onClick ? "cursor-pointer":""} `,
  };

  const defaultClasses = '';
  const combinedClassName = clsx(defaultClasses, className);

  const iconElement = (
    <IconComponent
      size={size}
      width={size}
      height={size}
      stroke={color}
      fill="none"  
      // onClick={onClick}
      className={combinedClassName}
      {...props}
    />
  );
  const classes = clsx(
    variantStyles[variant],
    onClick ? "cursor-pointer": "",
    className
  );

  const wrapper = (
    <div onClick={onClick} className={classes}>
      {iconElement}
    </div>
  );

  return href ? <Link href={href} onClick={onClick}>{wrapper}</Link> : wrapper;
};

export default Icon;