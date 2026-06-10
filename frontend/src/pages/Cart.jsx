import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Cart({ user, setIsLoginModalOpen }) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '' });
  const [alert, setAlert] = useState(null);

  const handleCheckout = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsOrdering(true);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    try {
      // Vì hệ thống hiện tại nhận 1 product_id mỗi order, ta sẽ tạo nhiều order cho mỗi item trong cart
      // Hoặc lý tưởng nhất là sửa lại DB để order có nhiều items.
      // Tạm thời, tạo order cho item đầu tiên (để tránh lỗi DB cũ chưa sửa).
      // Nhưng theo chuẩn, ta tạo một mảng promises:
      const promises = cartItems.map(item => 
        api.post('/orders', {
          productId: item.product.id,
          customerName: orderForm.name,
          customerPhone: orderForm.phone,
          customerAddress: orderForm.address
        })
      );
      
      await Promise.all(promises);
      clearCart();
      setIsOrdering(false);
      setAlert("Đặt hàng thành công!");
    } catch (err) {
      setAlert("Có lỗi xảy ra khi đặt hàng.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ marginTop: '120px', textAlign: 'center', marginBottom: '100px' }}>
        <h2 style={{ marginBottom: '20px' }}>Giỏ Hàng Của Bạn Trống</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Tiếp Tục Mua Sắm</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '100px' }}>
      <h2>Giỏ Hàng Của Bạn</h2>
      {alert && <p style={{ color: 'green', margin: '15px 0' }}>{alert}</p>}
      
      <div style={{ display: 'flex', gap: '30px', marginTop: '20px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
        <div style={{ flex: '2' }}>
          {cartItems.map((item) => (
            <div key={item.product.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid #eee', marginBottom: '15px', borderRadius: '4px', background: '#fff' }}>
              <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              <div style={{ flex: '1', marginLeft: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{item.product.name}</h4>
                <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  ₫{item.product.price.toLocaleString('vi-VN')}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ padding: '5px 10px', background: '#eee', border: 'none', cursor: 'pointer' }}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ padding: '5px 10px', background: '#eee', border: 'none', cursor: 'pointer' }}>+</button>
              </div>
              <button onClick={() => removeFromCart(item.product.id)} style={{ marginLeft: '20px', padding: '5px 10px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xóa</button>
            </div>
          ))}
        </div>

        <div style={{ flex: '1' }}>
          <div style={{ padding: '20px', background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}>
            <h3>Tổng Tiền</h3>
            <div style={{ fontSize: '24px', color: 'var(--primary-color)', fontWeight: 'bold', margin: '20px 0' }}>
              ₫{getCartTotal().toLocaleString('vi-VN')}
            </div>
            {!isOrdering ? (
              <button className="btn btn-primary btn-block" onClick={handleCheckout}>Thanh Toán Bằng COD</button>
            ) : (
              <form onSubmit={submitOrder} style={{ marginTop: '20px' }}>
                <div className="form-group">
                  <input required placeholder="Họ và tên" value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <input required placeholder="Số điện thoại" value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <textarea required placeholder="Địa chỉ giao hàng" value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})}></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Xác Nhận Đặt Hàng</button>
                <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: '10px' }} onClick={() => setIsOrdering(false)}>Hủy</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
