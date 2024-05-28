import React from 'react'

function Button({title, onClick, variant, disabled, type, fullWidth}) {
    let className = 'gradient-btn text-white'
    if (fullWidth) {
        className += ' w-full '
    }

    if (variant === 'outlined') {
        className = className.replace('gradient-btn text-white', 'gradient-btn-variant text-primary')
    }


  return (
    <button className= {className} type={type} onClick={onClick} disabled={disabled}>
    {title}
    </button>
  )
}

export default Button
