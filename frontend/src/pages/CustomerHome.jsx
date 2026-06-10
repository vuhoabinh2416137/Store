import React from 'react';
import Hero from '../components/Hero';
import ProductList from '../components/ProductList';

function CustomerHome({ products, onBuyClick }) {
  return (
    <>
      <Hero />
      <ProductList products={products} onBuyClick={onBuyClick} />
    </>
  );
}

export default CustomerHome;
