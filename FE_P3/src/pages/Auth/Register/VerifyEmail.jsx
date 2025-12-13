import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../providers/AuthProvider';
import Button from '../../../components/ui/Button';
import styles from './style.module.scss'; 

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useContext(AuthContext);
  
  const [status, setStatus] = useState('verifying'); 
  const [message, setMessage] = useState('Đang xác thực email...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Không tìm thấy mã xác thực. Vui lòng kiểm tra lại đường dẫn.');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        setMessage('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
      }
    };

    verify();
  }, [searchParams, verifyEmail]);

  return (
    <div className={styles.auth}>
      <div className={styles.auth__content} style={{ margin: 'auto', textAlign: 'center', padding: '40px' }}>
        <h2 className="mb-4">Xác thực tài khoản</h2>
        
        {status === 'verifying' && (
           <div className="spinner-border text-primary" role="status">
             <span className="visually-hidden">Loading...</span>
           </div>
        )}

        <p className={`mb-4 ${status === 'error' ? 'text-danger' : 'text-success'}`} style={{ fontSize: '1.1rem' }}>
            {message}
        </p>

        {status === 'success' && (
          <Button 
            content="Đến trang đăng nhập" 
            onClick={() => navigate('/dang-nhap')} 
          />
        )}

        {status === 'error' && (
          <Button 
            content="Quay lại đăng ký" 
            onClick={() => navigate('/dang-ky')} 
          />
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;