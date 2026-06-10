import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', description: '', price: '', imageUrl: '', additionalImages: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách sản phẩm');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct({ ...currentProduct, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(results => {
      setCurrentProduct({ ...currentProduct, additionalImages: [...(currentProduct.additionalImages || []), ...results] });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/products/${currentProduct.id}`, currentProduct);
      } else {
        await api.post('/products', currentProduct);
      }
      setIsEditing(false);
      setCurrentProduct({ name: '', description: '', price: '', imageUrl: '', additionalImages: [] });
      fetchProducts();
    } catch (err) {
      setError('Lỗi khi lưu sản phẩm');
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        setError('Lỗi khi xóa sản phẩm');
      }
    }
  };

  if (!user || !user.roles.includes('ROLE_MANAGER')) {
    return <div className="container" style={{marginTop: '100px'}}><h2>Bạn không có quyền truy cập trang này.</h2></div>;
  }

  return (
    <div className="container" style={{ marginTop: '100px', marginBottom: '50px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Quản Lý Sản Phẩm</h2>
        <button className="btn btn-primary" onClick={() => {setIsEditing(false); setCurrentProduct({ name: '', description: '', price: '', imageUrl: '', additionalImages: [] });}} style={{ background: '#26aa99' }}>
          + Thêm Sản Phẩm Mới
        </button>
      </div>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      
      <div className="admin-card" style={{ border: isEditing ? '2px solid var(--primary-color)' : '1px solid #eee' }}>
        <h3 style={{ color: isEditing ? 'var(--primary-color)' : 'inherit' }}>
          {isEditing ? `Đang Sửa Sản Phẩm: ID ${currentProduct.id}` : 'Biểu Mẫu Thêm Sản Phẩm Mới'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} required rows="3" />
          </div>
          <div className="form-group">
            <label>Giá</label>
            <input type="number" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Ảnh chính sản phẩm</label>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'block', marginTop: '10px'}} />
            {currentProduct.imageUrl && (
              <img src={currentProduct.imageUrl} alt="Preview" style={{ width: '100px', marginTop: '10px', borderRadius: '4px', border: '1px solid #eee' }} />
            )}
          </div>
          <div className="form-group">
            <label>Ảnh phụ (Gallery)</label>
            <input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} style={{display: 'block', marginTop: '10px'}} />
            {currentProduct.additionalImages && currentProduct.additionalImages.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {currentProduct.additionalImages.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={img} alt="Additional Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }} />
                    <button type="button" onClick={() => setCurrentProduct({...currentProduct, additionalImages: currentProduct.additionalImages.filter((_, index) => index !== i)})} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>x</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Lưu Cập Nhật' : 'Xác Nhận Thêm Mới'}</button>
            {isEditing && (
              <button type="button" className="btn btn-secondary" onClick={() => {setIsEditing(false); setCurrentProduct({ name: '', description: '', price: '', imageUrl: '', additionalImages: [] });}} style={{marginLeft: '10px'}}>
                Hủy Sửa
              </button>
            )}
          </div>
        </form>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#fafafa', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>ID</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Ảnh chính</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Ảnh phụ</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Tên</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Giá</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>Thao Tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{p.id}</td>
              <td style={{ padding: '10px' }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
              </td>
              <td style={{ padding: '10px' }}>
                {p.additionalImages && p.additionalImages.length > 0 ? (
                  <span>{p.additionalImages.length} ảnh</span>
                ) : (
                  <span style={{ color: '#999' }}>0</span>
                )}
              </td>
              <td style={{ padding: '10px' }}>{p.name}</td>
              <td style={{ padding: '10px' }}>₫{parseFloat(p.price).toLocaleString('vi-VN')}</td>
              <td style={{ padding: '10px' }}>
                <button onClick={() => handleEdit(p)} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '12px', marginRight: '5px' }}>Sửa</button>
                <button onClick={() => handleDelete(p.id)} className="btn btn-primary" style={{ background: '#ff4d4f', padding: '5px 10px', fontSize: '12px' }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
