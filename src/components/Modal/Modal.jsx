import { useState, memo } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import useCallApi from '../../hooks/useCallApi';
import { DashboardRequestApi } from '../../services/api';

// Hàm tạo chuỗi ngẫu nhiên
const generateRandomId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

function Modal({  setIsModal, onPostSuccess }) { 
    const [blockName, setBlockName] = useState(''); // State để lưu giá trị của ô input
    const [errorMessage, setErrorMessage] = useState(''); // State lưu lỗi
    const [isLoading, setIsLoading] = useState(false); // State xử lý khi submit
    const callApi = useCallApi(); // Khởi tạo hook useCallApi

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsModal(false);
        }
    };

    const handleInputChange = (e) => {
        setBlockName(e.target.value); // Cập nhật state blockName với giá trị mới
        setErrorMessage(''); // Xóa thông báo lỗi khi người dùng nhập lại
    };

    const handleSubmit = (e) => {
        e.preventDefault();
     
        if (blockName.trim()) {
            const data = {
                pondTypeId: generateRandomId(), // Sinh ra chuỗi ký tự ngẫu nhiên
                pondTypeName: blockName.trim(), // Tên khối từ input
                farmName: "fablab"
            };
            
            setIsLoading(true); // Hiển thị trạng thái loading
     
            // Sử dụng hook useCallApi theo cách đúng
            callApi(
                () => DashboardRequestApi.pondTypeRequest.createPondTypeRequest(data), // API function
                (res) => { // Resolve function khi thành công
                    setIsLoading(false); // Tắt trạng thái loading
                    onPostSuccess(); // Gọi callback khi POST thành công
                    setIsModal(false); // Đóng Modal
                    setBlockName('');
                },
                'Khối đã được tạo thành công!', // Thông báo thành công
                (err) => { // Reject function khi lỗi
                    setIsLoading(false); // Tắt trạng thái loading khi gặp lỗi
                    setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!'); // Hiển thị lỗi
                    console.error('Error:', err);
                }
            );
        } else {
            setErrorMessage('Tên khối không được để trống!'); // Thông báo lỗi nếu tên khối trống
        }
    };

    return (
        <div 
            className={cl("fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-50")} 
            onClick={handleCloseModal} // Thêm sự kiện onClick vào div bao ngoài
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px] min-h-[200px] border-2 border-black">
                {/* Nút đóng modal */}
                <i 
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsModal(false)} // Đóng modal khi nhấn vào nút đóng
                >
                    <IoCloseSharp />
                </i>
                {/* Tiêu đề */}
                <header className="text-xl font-bold text-center uppercase mb-4">TẠO KHỐI AO</header>

                {/* Form nhập liệu */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="blockName" className="block text-left font-semibold mb-2">Tên khối:</label>
                        <input 
                            type="text" 
                            id="blockName" 
                            name="blockName" 
                            placeholder="Nhập tên khối"
                            value={blockName} // Liên kết giá trị của ô input với state blockName
                            onChange={handleInputChange} // Gọi hàm handleInputChange khi người dùng nhập liệu
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
                        />
                    </div>

                    {/* Thông báo lỗi */}
                    {errorMessage && (
                        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
                    )}

                    {/* Nút submit */}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            className={cl("bg-green-300 hover:bg-green-400 text-black py-2 px-4 rounded-md shadow-md w-40", {
                                'opacity-50 cursor-not-allowed': !blockName || isLoading // Disable nếu không có dữ liệu hoặc đang tải
                            })}
                            disabled={!blockName || isLoading} // Không cho submit nếu không có dữ liệu
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(Modal);
