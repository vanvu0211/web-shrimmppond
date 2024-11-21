import { useState, memo } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import useCallApi from '../../hooks/useCallApi'; // Hook đã có sẵn
import { DashboardRequestApi } from '../../services/api'; // API service đã có sẵn

function DeleteCard({setIsDeleteCard, pondId, onDeleteCardSuccess }) { 
    const [confirmPondId, setConfirmPondId] = useState(''); // State để lưu giá trị nhập từ ô input
    const [errorMessage, setErrorMessage] = useState(''); // Lưu thông báo lỗi
    const [isLoading, setIsLoading] = useState(false); // Xử lý trạng thái đang tải
    const callApi = useCallApi(); // Hook gọi API

    // Đóng modal khi nhấn ra ngoài
    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsDeleteCard(false); // Đóng modal
        }
    };

    const handleInputChange = (e) => {
        setConfirmPondId(e.target.value); // Cập nhật giá trị nhập từ input
        setErrorMessage(''); // Xóa thông báo lỗi khi người dùng nhập liệu
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra nếu dữ liệu nhập vào khớp với pondId
        if (confirmPondId.trim() === pondId) {
            setIsLoading(true); // Bật trạng thái loading

            // Gọi API để xóa pondId
            callApi(
                () => DashboardRequestApi.pondRequest.deletePondRequest(pondId), // Gọi API xóa pond theo pondId
                (res) => {
                    setIsLoading(false); // Tắt loading khi hoàn thành
                    onDeleteCardSuccess(); // Gọi callback khi xóa thành công
                    setIsDeleteCard(false); // Đóng modal sau khi xóa thành công
                    setConfirmPondId(''); // Reset lại input
                },
                'Pond đã được xóa thành công!', // Thông báo thành công
                (err) => { // Xử lý lỗi
                    setIsLoading(false); // Tắt loading
                    setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!'); // Hiển thị lỗi
                    console.error('Error:', err);
                }
            );
        } else {
            setErrorMessage('ID không khớp!'); // Thông báo lỗi nếu không khớp
        }
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-20" // Đảm bảo popup đè toàn bộ màn hình
            onClick={handleCloseModal} // Đóng modal khi nhấn ra ngoài
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[400px] min-h-[200px] border-2 border-black">
            {/* Nút đóng component (nếu cần) */}
                <i 
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsDeleteCard(false)} // Đóng modal khi click nút
                >
                    <IoCloseSharp />
                </i>

                {/* Tiêu đề */}
                <header className="text-xl font-bold text-center uppercase mb-4">Xóa Pond</header>

                {/* Form nhập ID */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="confirmPondId" className="block text-left font-semibold mb-2">Nhập lại ID để xóa:</label>
                        <input 
                            type="text" 
                            id="confirmPondId" 
                            name="confirmPondId" 
                            placeholder="Nhập lại ID của Pond"
                            value={confirmPondId} // Liên kết với state confirmPondId
                            onChange={handleInputChange} // Gọi khi người dùng nhập
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
                        />
                    </div>

                    {/* Hiển thị lỗi */}
                    {errorMessage && (
                        <p className="text-red-600 text-center mb-4">{errorMessage}</p>
                    )}

                    {/* Nút xác nhận */}
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            className={cl("bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md shadow-md w-40", {
                                'opacity-50 cursor-not-allowed': !confirmPondId || isLoading // Disable nếu không có dữ liệu hoặc đang tải
                            })}
                            disabled={!confirmPondId || isLoading} // Không cho submit khi không có dữ liệu
                        >
                            {isLoading ? 'Đang xóa...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(DeleteCard);
