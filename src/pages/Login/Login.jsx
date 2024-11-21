import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLogin }) {
  const [isRegister, setIsRegister] = useState(false); // Trạng thái Đăng nhập/Đăng ký
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Dùng cho Đăng ký
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Lấy danh sách tài khoản từ localStorage
  const getAccounts = () => JSON.parse(localStorage.getItem('accounts')) || [];

  // Hàm xử lý Đăng nhập
  const handleLogin = () => {
    const accounts = getAccounts();
    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
      setIsLogin(true);
      navigate('/status'); // Điều hướng về trang chính
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  // Hàm xử lý Đăng ký
  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    const accounts = getAccounts();

    if (accounts.some(acc => acc.username === username)) {
      setError('Tên đăng nhập đã tồn tại!');
      return;
    }

    // Thêm tài khoản mới vào danh sách
    const newAccount = { username, password };
    localStorage.setItem('accounts', JSON.stringify([...accounts, newAccount]));

    setError('');
    alert('Đăng ký thành công! Bạn có thể đăng nhập.');
    setIsRegister(false); // Quay lại màn hình Đăng nhập
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isRegister ? 'Đăng ký' : 'Đăng nhập'}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Tên đăng nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Nhập tên đăng nhập"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Nhập mật khẩu"
          />
        </div>
        {isRegister && (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="Nhập lại mật khẩu"
            />
          </div>
        )}
        <button
          onClick={isRegister ? handleRegister : handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {isRegister ? 'Đăng ký' : 'Đăng nhập'}
        </button>
        <p
          className="text-blue-500 mt-4 cursor-pointer text-center"
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
        >
          {isRegister
            ? 'Đã có tài khoản? Đăng nhập'
            : 'Chưa có tài khoản? Đăng ký'}
        </p>
      </div>
    </div>
  );
}

export default Login;
