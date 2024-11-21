import { useState, memo } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import useCallApi from '../../hooks/useCallApi'; // Hook đã có sẵn
import { DashboardRequestApi } from '../../services/api';

function DeleteModal({ setIsDeleteModal, pondTypeName, onDeleteSuccess }) { 
    const [confirmPondTypeName, setConfirmPondTypeName] = useState(''); // Lưu tên khối nhập để xác nhận
    const [errorMessage, setErrorMessage] = useState(''); // Lưu thông báo lỗi
    const [isLoading, setIsLoading] = useState(false); // Xử lý trạng thái đang tải
    const callApi = useCallApi();

    

    const handleCloseModal = (e) => {
        if (e.target === e.currentTarget) {
            setIsDeleteModal(false);
        }
    };

    const handleInputChange = (e) => {
        setConfirmPondTypeName(e.target.value); // Cập nhật tên khối được nhập để xác nhận
        setErrorMessage(''); // Reset lại thông báo lỗi nếu người dùng nhập lại
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra nếu tên khối nhập trùng với tên khối muốn xóa
        if (confirmPondTypeName.trim() === pondTypeName) {
            setIsLoading(true); // Bật trạng thái loading

            callApi(
                () => DashboardRequestApi.pondTypeRequest.deletePondTypeRequest(pondTypeName), // Gọi API để xóa PondType
                (res) => {
                    setIsLoading(false); // Tắt trạng thái loading
                    onDeleteSuccess(); // Gọi callback khi thành công
                    setIsDeleteModal(false); // Đóng Modal
                    setConfirmPondTypeName(''); // Reset lại input
                },
                'Khối đã được xóa thành công!', // Thông báo thành công
                (err) => { // Xử lý lỗi
                    setIsLoading(false); // Tắt trạng thái loading
                    setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!'); // Hiển thị lỗi
                    console.error('Error:', err);}
              );              
        } else {
            setErrorMessage('Tên khối không khớp!'); // Lỗi nếu tên khối không khớp
        }
    };

    return (
        <div 
            className={cl("fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-20")} 
            onClick={handleCloseModal} // Sự kiện click đóng modal
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[400px] min-h-[200px] border-2 border-black">
                {/* Nút đóng modal */}
                <i 
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsDeleteModal(false)} // Đóng modal khi click nút đóng
                >
                    <IoCloseSharp />
                </i>

                {/* Tiêu đề */}
                <header className="text-xl font-bold text-center uppercase mb-4">Xóa khối</header>

                {/* Form nhập tên khối để xác nhận */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="confirmPondTypeName" className="block text-left font-semibold mb-2">Nhập lại tên khối để xóa:</label>
                        <input 
                            type="text" 
                            id="confirmPondTypeName" 
                            name="confirmPondTypeName" 
                            placeholder="Nhập lại tên khối"
                            value={confirmPondTypeName} // Liên kết giá trị với state confirmPondTypeName
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
                                'opacity-50 cursor-not-allowed': !confirmPondTypeName || isLoading // Disable nếu không có dữ liệu hoặc đang tải
                            })}
                            disabled={!confirmPondTypeName || isLoading} // Không cho submit khi không có dữ liệu
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(DeleteModal);
