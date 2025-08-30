import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

const Icon = ({
  icon: IconComponent,
  size = 24,
  color = 'currentColor',
  className = '',
  href,
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
      className={combinedClassName}
      {...props}
    />
  );

  const wrapper = (
    <div className="flex items-center justify-center border border-stock w-10 h-10 rounded-radius">
      {iconElement}
    </div>
  );

  return href ? <Link href={href}>{wrapper}</Link> : wrapper;
};

export default Icon;