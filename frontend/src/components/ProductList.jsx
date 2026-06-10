import React from 'react';
import { Link } from 'react-router-dom';

function ProductList({ products }) {
  return (
    <section className="products-section" id="products">
      <div className="container">
        <h2 className="section-title">GỢI Ý HÔM NAY</h2>
        
        <div className="products-grid">
          {products.map((product) => (
            <Link to={`/product/${product.id}`} className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">
                  ₫{parseFloat(product.price).toLocaleString('vi-VN')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductList;
