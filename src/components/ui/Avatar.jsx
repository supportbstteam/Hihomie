import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const Avatar = ({src, alt, size, title }) => {

    const sizeStyle = {
        xs: "w-6 h-6",
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    }
    const classes = clsx(
        sizeStyle[size],
    )
  return (
        <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${src}`}
            alt={alt || "User"}
            className={`${classes} rounded-full cursor-pointer object-cover hover:scale-110 transition-all`}
            title={title || "User"}
            width={32}
            height={32}
        />
  )
}

export default Avatar