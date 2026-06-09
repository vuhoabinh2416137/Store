import React, { useState } from 'react';

function OrderModal({ product, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Đặt Hàng Nhanh</h3>
          <button className="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="order-summary">
            <p>Sản phẩm: <strong>{product.name}</strong></p>
            <p>Giá: <strong>{parseFloat(product.price).toLocaleString('en-US')} VNĐ</strong></p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Họ và Tên</label>
              <input 
                type="text" 
                id="customerName" 
                name="customerName" 
                required 
                placeholder="Nhập họ và tên của bạn"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customerPhone">Số Điện Thoại</label>
              <input 
                type="tel" 
                id="customerPhone" 
                name="customerPhone" 
                required 
                placeholder="Nhập số điện thoại"
                value={formData.customerPhone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="customerAddress">Địa Chỉ Nhận Hàng</label>
              <textarea 
                id="customerAddress" 
                name="customerAddress" 
                rows="3" 
                required 
                placeholder="Nhập địa chỉ chi tiết"
                value={formData.customerAddress}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">Xác Nhận Đặt Hàng</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
