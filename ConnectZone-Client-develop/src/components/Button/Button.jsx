import React from 'react'
import { twMerge } from 'tailwind-merge'

const Button = ({ type = '', className = '', onClick, children }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={
                twMerge(`px-6 py-2.5 text-white text-lg rounded-3xl flex items-center font-medium `, className)}>
            {children}
        </button >
    )
}

export default Button