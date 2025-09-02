import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

const Icon = ({
  icon: IconComponent,
  size = 24,
  color = 'currentColor',
  className = '',
  href,
  onClick,
  ...props
}) => {
  if (!IconComponent) {
    console.warn('No icon component passed to <Icon />');
    return null;
  }

  const defaultClasses = '';
  const combinedClassName = clsx(defaultClasses, className);

  const iconElement = (
    <IconComponent
      size={size}
      width={size}
      height={size}
      color={color}
      fill={color}
      // onClick={onClick}
      className={combinedClassName}
      {...props}
    />
  );

  const wrapper = (
    <div onClick={onClick} className={`flex items-center justify-center border border-stock w-10 h-10 rounded-radius ${onClick ? "cursor-pointer":""} `}>
      {iconElement}
    </div>
  );

  return href ? <Link href={href} onClick={onClick}>{wrapper}</Link> : wrapper;
};

export default Icon;