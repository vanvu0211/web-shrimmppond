import React, { useState, useCallback, useEffect, memo } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import PondSummary from '../../components/PondSummary/PondSummary';
import Modal from '../../components/Modal';
import DeleteModal from '../../components/DeleteModal';
import SetTime from '../../components/SetTime';
import { AiOutlineClockCircle } from 'react-icons/ai';
import useCallApi from '../../hooks/useCallApi';
import { useSelector } from 'react-redux';
import { DashboardRequestApi } from '../../services/api';
import CreateModal from '../../components/CreateModal'
import ImageModal from '../../components/ImageModal'
import { FaMapMarkerAlt  } from "react-icons/fa";
import oxygen from '../../assets/image/oxygen.png'
import { CiCirclePlus } from "react-icons/ci";
import Loading from '../../components/Loading';
import { ToastContainer, toast } from "react-toastify"; // Import thêm toast
import 'react-toastify/dist/ReactToastify.css';



function Dashboard() {
  const callApi = useCallApi();

  const expanded = useSelector((state) => state.sidebar.expanded);
  const [isModal, setIsModal] = useState(false);
  const [isCreateModal, setIsCreateModal] = useState(false)
  const [isSetTime, setIsSetTime] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [showImage ,setShowImage] = useState(false)
  const [activePonds, setActivePonds] = useState(0)
  const [pondTypes, setPondTypes] = useState([]); // State để lưu danh sách pondTypes
  const [ponds, setPonds] = useState([]); // State để lưu danh sách pondTypes
  const [selectedPondTypeName, setSelectedPondTypeName] = useState(''); // State để lưu tên khối được chọn để xóa


  const handleLoading = () => {setIsLoading(false)}
  
  // Hàm lấy dữ liệu PondType từ API
  const fetchData = useCallback(() => {
    callApi(
      [
        DashboardRequestApi.pondTypeRequest.getPondTypeRequest(),
        DashboardRequestApi.pondRequest.getPondRequest(),
        DashboardRequestApi.pondRequest.getPondRequestByStatus(1),
        handleLoading()
      ], 
      (res) => {
        setPondTypes(res[0]); // Lưu dữ liệu vào state pondTypes
        setPonds(res[1]); // Lưu dữ liệu vào state ponds
        setActivePonds(res[2].length)

      },
    );
  }, [callApi]);

  // Gọi hàm fetchData khi component được mount
  useEffect(() => {
    fetchData()
  }, [fetchData]);

  const handleSelected = (pondTypeName) => {
    setSelectedPondTypeName(pondTypeName); // Đặt tên khối được chọn
  };


  return (
    <div className="flex max-h-screen">
      <aside>
        <Sidebar />
      </aside>
      <div className="flex-1 flex flex-col transition-all m-2 rounded-xl items-center w-full mr-2 overflow-hidden max-h-screen mb-2">
        <div className="flex w-[90%] h-32 rounded-xl gap-3 justify-around mt-3">
          <div className="flex flex-col items-center justify-center w-[18%] h-full max-w-[90%] max-h-[90%] rounded-xl drop-shadow-xl bg-white">
            <h1 className="uppercase text-xl font-semibold">Tổng số ao</h1>
            <span className="font-bold text-5xl">{ponds.length}</span> {/* Hiển thị tổng số khối ao */}
          </div>
          <div className="flex flex-col items-center justify-center w-[20%] h-full max-w-[90%] max-h-[90%] rounded-xl drop-shadow-xl bg-white">
            <h1 className="uppercase text-xl font-semibold md:text-xl">Số ao nuôi</h1>
            <span className="font-bold text-5xl text-green-600/[.86]">{activePonds}</span> {/* Tùy chỉnh số ao nuôi */}
          </div>
          {/* <div className="flex flex-col items-center justify-center w-[20%] h-full max-w-[90%] max-h-[90%] rounded-xl drop-shadow-xl bg-white">
            <h1 className="uppercase text-xl font-semibold md:text-xl">Môi trường</h1>
            <span className="font-bold text-4xl">Biểu đồ</span>
          </div> */}
        </div>


        <div className ="w-[90%] max-h-[75%] overflow-hidden overflow-y-scroll no-scrollbar rounded-lg p-4 gap-y-3">
          {/* Hiển thị PondSummary cho từng pondType */}
        {pondTypes.map((pondType) => {
          // Lọc danh sách pond theo pondTypeId
          const filteredPonds = ponds.filter(pond => pond.pondTypeName === pondType.pondTypeName);

          return (
            
              <PondSummary
                onPutSucces = {fetchData}
                key={pondType.pondTypeId} 
                pondTypeName={pondType.pondTypeName} 
                ponds={filteredPonds} 
                setIsDeleteModal={setIsDeleteModal}
                setIsCreateModal={setIsCreateModal}
                onSelected={handleSelected} 
                onDeleteCardSuccess={fetchData}
              />

          );
        })}
        </div>
        

        <button className ="h-10 w-10 right-4 items-center rounded-2xl bottom-5 fixed bg-[#61CBF4]/[.90] flex justify-center">
          <CiCirclePlus
            onClick={() => { setIsModal(true); }}
            className='h-12 text-3xl text-black'
          >
          </CiCirclePlus>
          <div className="flex items-center justify-center text-black font-bold">     
                   <div className={`
                      absolute right-full rounded-md -px-2 -py-1 ml-6 whitespace-nowrap
                      bg-indigo-100 text-indigo-800
                      invisible opacity-20 -translate-x-3 transition-all
                      group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 group-hover:z-50
                    `}>Tạo khối</div>
              </div>
        </button>

        {/* <button
          onClick={() => { setIsModal(true); }}
          className="fixed bottom-5 w-1/6 rounded-2xl h-12 bg-[#61CBF4]/[.90] cursor-pointer"
        >
          <h1 className = "text-xl font-bold">Tạo khối</h1>
        </button> */}


        {isSetTime && <SetTime 
            setIsSetTime={setIsSetTime} 
            onPostSuccess={fetchData}
        />}


        {isModal && <Modal
          setIsModal={setIsModal}
          onPostSuccess={fetchData} // Truyền callback để fetch dữ liệu sau POST
        />}
        {isDeleteModal &&
          <DeleteModal 
             
            setIsDeleteModal={setIsDeleteModal} 
            pondTypeName={selectedPondTypeName} // Truyền tên khối được chọn vào modal
            onDeleteSuccess={fetchData} // Gọi lại khi xóa thành công
          />

        }

        {
        isCreateModal && <CreateModal 
          setIsCreateModal = {setIsCreateModal}
          onPostSuccess = {fetchData}
          pondTypeName = {selectedPondTypeName}
        />
        }
        
        {showImage && <ImageModal 
          setShowImage = {setShowImage}
        />}

        <div className = "fixed top-5 right-5 text-4xl flex gap-x-2">
          <AiOutlineClockCircle
            onClick = {() => setIsSetTime(true)}
            className = ""        
          />
          <FaMapMarkerAlt 
            onClick = {() => setShowImage(true)}
            className = " text-red-500"
          >
          </FaMapMarkerAlt>


        </div>

      </div>
          {isLoading && <Loading/>}
          <ToastContainer 
                        position="top-right" 
                        autoClose={3000} 
                        hideProgressBar={false} 
                        newestOnTop={false} 
                        closeOnClick 
                        pauseOnHover 
                    />
    </div>
  );
}

export default memo(Dashboard);
