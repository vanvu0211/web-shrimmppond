import React, { useState, useCallback, useEffect } from 'react';
import { FaEllipsisV} from 'react-icons/fa';
import { actions } from '../../utils/constants';
import { extraActions } from '../../utils/constants';
import DeleteCard from '../DeleteCard';
import cl from "classnames";
import ActiveCard from '../../components/ActiveCard';
import { useNavigate } from 'react-router-dom';
import useCallApi from '../../hooks/useCallApi';
import { HarvestRequest, DashboardRequestApi } from '../../services/api';

function Card({ pondId, status, onDeleteCardSuccess, onPutSucces }) {  
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [extra, setExtra] = useState(false);
  const [isDeleteCard, setIsDeleteCard] = useState(false);
  const [harvestTime, setHarvestTime] = useState(0);
  const [daysSinceStart, setDaysSinceStart] = useState(0); // State để lưu số ngày kể từ startDate

  const navigate = useNavigate();
  const callApi = useCallApi();

  const harvestData = useCallback(() => {
    callApi(
        [
          HarvestRequest.HarvestRequestApi.getHarvestTime(pondId),  // Get harvest time by pondId
        ],
        (res) => {
          setHarvestTime(res[0].harvestTime); // Set harvest time
        },
    );
}, [callApi, pondId]);

useEffect(() => {
    harvestData();
}, [harvestData, pondId]); // Re-fetch when pondId changes

  const fetchData = useCallback(() => {
    callApi([
      DashboardRequestApi.pondRequest.getPondRequestById(pondId),
    ], 
    (res) => {
      const startDate = new Date(res[0][0].startDate); // Truy cập đến startDate trong phần tử đầu tiên
      if (!isNaN(startDate)) { // Kiểm tra nếu startDate hợp lệ
        const currentDate = new Date();
        const timeDifference = currentDate - startDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        setDaysSinceStart(daysDifference); // Lưu số ngày vào state
      } else {
        setDaysSinceStart(0); // Hoặc giá trị mặc định nào đó
      }
    },
    (err) => {
      setIsLoading(false);
      // Kiểm tra và hiển thị lỗi chi tiết từ phản hồi API
      if (err.response && err.response.data && err.response.data.title) {
          setErrorMessage(err.response.data.title);
      } else {
          setErrorMessage('Đã có lỗi xảy ra, vui lòng thử lại!');
      }
  }
    );
  }, [callApi, pondId, status]);

  const handleHarvestClick = (pondId) => {
    // Điều hướng thẳng tới HarvestForm và truyền pondId qua state
    navigate('/harvest', { state: { pondId } });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="flex-1 flex flex-col transition-all rounded-xl max-w-48 relative w-[170px]">
        <div className={cl("flex justify-between w-full rounded-t-lg border border-black", {
          "bg-[#00A9EA]": status,
          "bg-gray-400" : !status
        })}>
          <h1 className="text-black text-2xl font-bold ml-3 self-center">{pondId}</h1>
          <div className="text-black text-right text-xl mr-3 font-bold my-[-4px]">
            {/* {status && <h2>{daysSinceStart}</h2>} */}
            <h2>{daysSinceStart}</h2>
            <h2>{harvestTime}</h2>
          </div>
        </div>

        {/* {status ? (
          <div className="flex flex-col w-full py-1 px-1 bg-white rounded-b-lg overflow-hidden transition-all duration-300 border border-black">
            <div className="flex gap-x-1">
              {actions.map((action) => (
                <div key={action.id} className={`w-8 h-7 ${action.bgColor} rounded-xl flex items-center justify-center`}>
                  {action.icon}
                </div>
              ))}
              <div className="flex items-center justify-center">
                <FaEllipsisV onClick={() => setExtra((prev) => !prev)} className="text-black text-xl cursor-pointer" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col py-1 px-1 bg-white rounded-b-lg overflow-hidden transition-all duration-300 border border-black h-11 w-40 items-center">
            <button 
              className="bg-green-400 hover:bg-green-500 rounded-xl mt-1 w-28 font-semibold h-6"
              onClick={() => setIsActiveModal(true)} // Sửa đổi callback
            >
              Kích hoạt
            </button>
          </div>
        )}

        {extra && (
          <div className="absolute bottom-0 left-0 flex flex-nowrap gap-x-1 bg-white p-1 rounded-lg z-0 border border-black max-w-48">
            {extraActions.map((extraAction) => (
              <div key={extraAction.id} 
                className={`w-7 h-7 ${extraAction.bgColor} rounded-xl flex items-center justify-center cursor-pointer`}
                onClick={() => {
                  if (extraAction.id === 5) setIsDeleteCard(true);
                  if (extraAction.id === 1) handleHarvestClick(pondId);
                }}
              >
                {extraAction.icon}
              </div>
            ))}
          </div>
        )} */}



        {status ? (
          <div className="flex flex-col w-full py-1 px-1 bg-white rounded-b-lg overflow-hidden transition-all duration-300 border border-black">
            <div className="flex gap-x-1">
              {extraActions.map((extraAction) => (
                <div key={extraAction.id} className={`w-8 h-7 ${extraAction.bgColor} rounded-xl flex items-center justify-center`}
                onClick={() => {
                  if (extraAction.id === 5) setIsDeleteCard(true);
                  if (extraAction.id === 1) handleHarvestClick(pondId);
                }}
                >
                  {extraAction.icon}
                </div>
              ))}
              {/* <div className="flex items-center justify-center">
                <FaEllipsisV onClick={() => setExtra((prev) => !prev)} className="text-black text-xl cursor-pointer" />
              </div> */}
            </div>
          </div>
        ) : (
          <div className="flex py-1 gap-x-1 px-1 bg-white rounded-b-lg overflow-hidden transition-all duration-300 border border-black items-center">
            <button 
              className="bg-green-400 hover:bg-green-500 rounded-xl mt-1 w-20 font-semibold h-6 flex-1"
              onClick={() => setIsActiveModal(true)} // Sửa đổi callback
            >
              Kích hoạt
            </button>
            {extraActions.find((action) => action.id === 5) && (
              <div
                className={`w-8 h-7 bg-gray-600 rounded-xl flex items-center justify-center cursor-pointer`}
                onClick={() => setIsDeleteCard(true)} // Xử lý khi nhấn vào action này
              >
                {extraActions.find((action) => action.id === 5).icon}
              </div>
            )}
          </div>
        )}

        {/* {extra && (
          <div className="absolute bottom-0 left-0 flex flex-nowrap gap-x-1 bg-white p-1 rounded-lg z-0 border border-black max-w-48">
            {extraActions.map((extraAction) => (
              <div key={extraAction.id} 
                className={`w-7 h-7 ${extraAction.bgColor} rounded-xl flex items-center justify-center cursor-pointer`}
                onClick={() => {
                  if (extraAction.id === 5) setIsDeleteCard(true);
                  if (extraAction.id === 1) handleHarvestClick(pondId);
                }}
              >
                {extraAction.icon}
              </div>
            ))}
          </div>
        )} */}

        {isDeleteCard && (
          <DeleteCard 
            pondId={pondId} 
            setIsDeleteCard={setIsDeleteCard}
            onDeleteCardSuccess={onDeleteCardSuccess}
          />
        )}

        {isActiveModal && (
          <ActiveCard
            setIsActiveModal={setIsActiveModal}
            onDeleteCardSuccess={onPutSucces}
            pondId={pondId}
          />
        )}
      </div>
    </>
  );
}

export default Card;
