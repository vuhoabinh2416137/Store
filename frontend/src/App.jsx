import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import OrderModal from './components/OrderModal';
import Login from './components/Login';
import Register from './components/Register';
import api from './api/axios';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alert, setAlert] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth status
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Scroll effect
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleBuyClick = (product) => {
    if (!user) {
      setAlert({ type: 'error', message: 'Bạn cần đăng nhập để đặt hàng!' });
      setIsLoginModalOpen(true);
      return;
    }
    setSelectedProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = async (formData) => {
    try {
      await api.post('/orders', {
        productId: selectedProduct.id,
        ...formData
      });
      setIsOrderModalOpen(false);
      setAlert({ type: 'success', message: 'Đặt hàng thành công! Chúng tôi sẽ sớm liên hệ với bạn.' });
    } catch (error) {
      setIsOrderModalOpen(false);
      setAlert({ type: 'error', message: 'Đặt hàng thất bại. Vui lòng thử lại.' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setAlert({ type: 'success', message: 'Đăng xuất thành công!' });
  };

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <a href="#" className="logo">LUX<span>BED</span></a>
          <nav className="navbar">
            <a href="#home">Trang Chủ</a>
            <a href="#products">Sản Phẩm</a>
            {user && user.roles && user.roles.includes('ROLE_MANAGER') && (
               <a href="#" style={{color: 'var(--primary-color)'}}>Quản Trị</a>
            )}
            {user ? (
              <>
                <span style={{marginLeft: '30px', color: 'var(--text-secondary)'}}>Chào, {user.fullName}</span>
                <a href="#" onClick={(e) => {e.preventDefault(); handleLogout();}}>Đăng Xuất</a>
              </>
            ) : (
              <a href="#" onClick={(e) => {e.preventDefault(); setIsLoginModalOpen(true);}}>Đăng Nhập</a>
            )}
          </nav>
        </div>
      </header>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          <span>{alert.message}</span>
          <button className="close-btn" onClick={() => setAlert(null)}>&times;</button>
        </div>
      )}

      <Hero />
      <ProductList products={products} onBuyClick={handleBuyClick} />

      <footer className="footer" id="contact">
        <div className="container">
          <p>&copy; 2026 LUXBED. All rights reserved.</p>
        </div>
      </footer>

      {isOrderModalOpen && (
        <OrderModal 
          product={selectedProduct} 
          onClose={() => setIsOrderModalOpen(false)} 
          onSubmit={handleOrderSubmit} 
        />
      )}

      {isLoginModalOpen && (
        <Login 
          onLoginSuccess={(userData) => {
            setUser(userData);
            setIsLoginModalOpen(false);
            setAlert({ type: 'success', message: `Chào mừng ${userData.fullName} quay trở lại!` });
          }}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      )}

      {isRegisterModalOpen && (
        <Register 
          onRegisterSuccess={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
            setAlert({ type: 'success', message: 'Đăng ký thành công! Vui lòng đăng nhập.' });
          }}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}
    </div>
  );
}

export default App;
