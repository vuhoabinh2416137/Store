import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setMainImage(response.data.imageUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="container" style={{marginTop: '100px', textAlign: 'center'}}>Đang tải dữ liệu...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{marginTop: '100px', textAlign: 'center'}}>
        <h2>Sản phẩm không tồn tại</h2>
        <button className="btn btn-primary" style={{marginTop: '20px'}} onClick={() => navigate('/')}>Quay lại trang chủ</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    navigate('/cart');
  };

  return (
    <div className="container">
      <div className="product-details-container">
        <div className="product-details-image" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <img src={mainImage} alt={product.name} style={{ borderRadius: '4px', border: '1px solid #eee' }} />
          {product.additionalImages && product.additionalImages.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
              <img 
                src={product.imageUrl} 
                alt="thumbnail" 
                style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', border: mainImage === product.imageUrl ? '2px solid var(--primary-color)' : '1px solid #eee' }}
                onMouseEnter={() => setMainImage(product.imageUrl)}
              />
              {product.additionalImages.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`thumbnail-${index}`} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', border: mainImage === img ? '2px solid var(--primary-color)' : '1px solid #eee' }}
                  onMouseEnter={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-details-info">
          <h1 className="product-details-title">{product.name}</h1>
          
          <div className="product-details-price-box">
            <div className="product-details-price">
              ₫{parseFloat(product.price).toLocaleString('vi-VN')}
            </div>
          </div>
          
          <div className="product-details-desc">
            {product.description}
          </div>
          
          <div className="product-details-actions">
            <button className="btn btn-outline" onClick={handleAddToCart}>
              <i className="fas fa-cart-plus" style={{marginRight: '8px'}}></i>
              Thêm Vào Giỏ Hàng
            </button>
            <button className="btn btn-primary" onClick={handleBuyNow}>
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
