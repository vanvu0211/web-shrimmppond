import { useState, memo } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import cl from 'classnames';
import useCallApi from '../../hooks/useCallApi';
import { DashboardRequestApi } from '../../services/api';
import InputField from '../InputField';
import FileInputField from '../FileInputField';



function ActiveCard({ pondId, setIsActiveModal, onDeleteCardSuccess }) {
    const [seedId, setSeedId] = useState('');
    const [seedName, setSeedName] = useState('');
    const [originPondId, setOriginPondId] = useState(''); // Optional
    const [certificates, setCertificates] = useState([]); // For storing base64 strings
    const [sizeShrimp, setSizeShrimp] = useState(0);
    const [amountShrimp, setAmountShrimp] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const callApi = useCallApi();

    // Convert uploaded file (image/pdf) to base64
    // Convert file to base64 and remove the 'data:<MIME type>;base64,' part
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          // Get the base64 string and remove the data URL scheme (MIME type prefix)
          const base64String = reader.result.split(',')[1]; // Chỉ lấy phần base64 sau dấu ','
          setCertificates([base64String]); // Store base64 string without the MIME type
      };
      reader.readAsDataURL(file); // Convert file to base64
  }
};


    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (seedId && seedName && sizeShrimp > 0 && amountShrimp > 0) {
            const data = {
                pondId,
                seedId: seedId.trim(),
                seedName: seedName.trim(),
                originPondId: originPondId.trim() || '', // Optional
                certificates,
                sizeShrimp: parseFloat(sizeShrimp),
                amountShrimp: parseFloat(amountShrimp)
            };
            

            setIsLoading(true);

            callApi(
                () => DashboardRequestApi.pondRequest.updatePondRequest(data), // Adjust API request accordingly
                (res) => {
                    setIsLoading(false);
                    onDeleteCardSuccess(); // Callback on successful PUT
                    setIsActiveModal(false); // Close modal
                },
                'Cập nhật thành công!', // Success message
                (err) => {
                    setIsLoading(false);
                    setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại!');
                    console.error('Error:', err);
                }
            );
        } else {
            setErrorMessage('Các trường không được để trống và giá trị phải hợp lệ!');
        }
    };

    return (
        <div 
            className={cl("fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-30 z-20")}
            onClick={(e) => e.target === e.currentTarget && setIsActiveModal(false)} // Close modal if clicked outside
        >
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px] min-h-[400px] border-2 border-black">
                {/* Close button */}
                <i 
                    className="absolute top-0 right-0 text-2xl p-3 cursor-pointer hover:bg-gray-400 rounded-full"
                    onClick={() => setIsActiveModal(false)} 
                >
                    <IoCloseSharp />
                </i>

                {/* Title */}
                <header className="text-xl font-bold text-center uppercase mb-4">Kích hoạt Ao</header>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Seed ID and Seed Name on the same row */}
                    <div className="flex space-x-12 mb-2">
                        <InputField 
                            label="Mã lô"
                            id="seedId"
                            value={seedId}
                            onChange={handleInputChange(setSeedId)}
                            placeholder="Nhập mã lô"
                        />
                        <InputField 
                            label="Tên lô"
                            id="seedName"
                            value={seedName}
                            onChange={handleInputChange(setSeedName)}
                            placeholder="Nhập tên lô"
                        />
                    </div>

                    {/* Origin Pond ID */}
                    <InputField 
                        label="Mã Ao gốc"
                        id="originPondId"
                        value={originPondId}
                        onChange={handleInputChange(setOriginPondId)}
                        placeholder="Nhập mã ao gốc (có thể để trống)"
                    />

                    {/* Certificates */}
                    <FileInputField 
                        label="Giấy chứng nhận"
                        id="certificates"
                        onChange={handleFileChange}
                    />

                    {/* Size Shrimp and Amount Shrimp on the same row */}
                    <div className="flex space-x-12 mb-2">
                        <InputField 
                            label="Kích thước Tôm (cm)"
                            id="sizeShrimp"
                            type="number"
                            value={sizeShrimp}
                            onChange={handleInputChange(setSizeShrimp)}
                            placeholder="Nhập kích thước tôm"
                            min="0"
                        />
                        <InputField 
                            label="Số lượng Tôm (kg)"
                            id="amountShrimp"
                            type="number"
                            value={amountShrimp}
                            onChange={handleInputChange(setAmountShrimp)}
                            placeholder="Nhập số lượng tôm"
                            min="0"
                        />
                    </div>

                    {/* Error message */}
                    {errorMessage && (
                        <p className="text-red-600 text-center mb-2">{errorMessage}</p>
                        // <p className="text-red-600 text-center mb-2">{base64}</p>
                    )}

                    {/* Submit button */}
                    <div className="flex justify-center">
                        <button 
                            type="submit"
                            className={cl("bg-green-300 hover:bg-green-400 text-black py-2 px-4 rounded-md shadow-md w-40", {
                                'opacity-50 cursor-not-allowed': isLoading || !seedId || !seedName || sizeShrimp <= 0 || amountShrimp <= 0
                            })}
                            disabled={isLoading || !seedId || !seedName || sizeShrimp <= 0 || amountShrimp <= 0}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default memo(ActiveCard);
