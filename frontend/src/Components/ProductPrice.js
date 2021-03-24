import React from 'react'

const ProductPrice = (props) => {
    const formatter = new Intl.NumberFormat('hu-HU', {
        style: 'currency',
        currency: 'HUF',
        maximumFractionDigits: 0
    });
    const formattedPrice = formatter.format(props.price);

    return (
        <>
            {formattedPrice}
        </>
    )
}

export default ProductPrice
