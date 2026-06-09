import React from 'react';

function ProductList({ products, onBuyClick }) {
  return (
    <section className="products-section" id="products">
      <div className="container">
        <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
        
        <div className="products-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
                <div className="product-overlay">
                  <button 
                    className="btn btn-icon buy-btn"
                    onClick={() => onBuyClick(product)}
                  >
                    Mua Ngay
                  </button>
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-price">
                  <span>{parseFloat(product.price).toLocaleString('en-US')} VNĐ</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductList;
