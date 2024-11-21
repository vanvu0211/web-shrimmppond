import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Select from 'react-select';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Chart from 'react-apexcharts';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Evista() {
  const navigate = useNavigate();
  const [selectedPondType, setSelectedPondType] = useState(null);
  const [pondOptions, setPondOptions] = useState([]);
  const [pondTypes, setPondTypes] = useState([]);
  const [selectedPond, setSelectedPond] = useState(null);
  const [selectedPonds, setSelectedPonds] = useState([]);
  const [pondData, setPondData] = useState({});
  const [loading, setLoading] = useState(false);

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: { type: 'line', height: 350, zoom: { enabled: true, type: 'x' } },
      xaxis: { type: 'datetime', labels: { rotate: -45, rotateAlways: true } },
      yaxis: { title: { text: '' } },
      colors: ['#FF4560', '#00E396'],
      stroke: { curve: 'straight' },
      annotations: { yaxis: [] },
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(null);
  const [activePondName, setActivePondName] = useState('');
  const [startDate, setStartDate] = useState(new Date()); // default to today
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1))); // default to tomorrow

  const parameterLimits = {
    Ph: { min: 7.5, max: 8.5 },
    O2: { min: 3.0, max: 7.0 },
    Temperature: { min: 25, max: 33 },
  };

  useEffect(() => {
    // Add custom CSS to adjust the z-index of the apexcharts toolbar
    const style = document.createElement('style');
    style.innerHTML = '.apexcharts-toolbar { z-index: 0 !important; }';
    document.head.appendChild(style);

    Modal.setAppElement('#root');
    fetchPondTypes();
  }, []);

  useEffect(() => {
    if (selectedPondType) fetchPonds();
  }, [selectedPondType]);

  const fetchPondTypes = async () => {
    const url = 'https://shrimppond.runasp.net/api/PondType?pageSize=200&pageNumber=1';
    try {
      const response = await axios.get(url);
      setPondTypes(
        response.data.map((type) => ({
          value: type.pondTypeId,
          label: type.pondTypeName,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch pond types:', error);
    }
  };

  const fetchPonds = async () => {
    const url = 'https://shrimppond.runasp.net/api/Pond?pageSize=200&pageNumber=1';
    try {
      const response = await axios.get(url);
      setPondOptions(
        response.data
          .filter((pond) => pond.pondTypeName === selectedPondType.label)
          .map((pond) => ({ value: pond.pondId, label: pond.pondId }))
      );
    } catch (error) {
      console.error('Failed to fetch ponds:', error);
    }
  };

  const fetchAllParameters = async (pond) => {
    setLoading(true);
    try {
      const phData = await fetchData('Ph', pond);
      const o2Data = await fetchData('O2', pond);
      const tempData = await fetchData('Temperature', pond);

      setPondData((prevData) => ({
        ...prevData,
        [pond]: { Ph: phData, O2: o2Data, Temperature: tempData },
      }));
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (parameter, pond) => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const url = `https://shrimppond.runasp.net/api/Environment?pondId=${pond}&name=${parameter}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&pageSize=200&pageNumber=1`;
    try {
      const response = await axios.get(url);
      // Reverse the array to get data from bottom to top
      return response.data.reverse();
    } catch (error) {
      console.error(`Failed to fetch data for ${parameter}:`, error);
      return [];
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  };

  const handlePondTypeChange = (selectedOption) => setSelectedPondType(selectedOption);
  const handlePondChange = (selectedOption) => setSelectedPond(selectedOption.value);

  const addPond = () => {
    if (selectedPond && !selectedPonds.includes(selectedPond)) {
      setSelectedPonds([...selectedPonds, selectedPond]);
      fetchAllParameters(selectedPond);
    }
  };

  const deletePond = (pond) => {
    setSelectedPonds(selectedPonds.filter((p) => p !== pond));
    setPondData((prevData) => {
      const newData = { ...prevData };
      delete newData[pond];
      return newData;
    });
  };

  const getAnnotations = (parameter) => {
    const limits = parameterLimits[parameter];
    return limits
      ? {
          yaxis: [
            { y: limits.min, borderColor: '#FF4560', label: { text: `Min: ${limits.min}` } },
            { y: limits.max, borderColor: '#00E396', label: { text: `Max: ${limits.max}` } },
          ],
        }
      : {};
  };

  const renderCharts = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin border-t-blue-500"></div>
          <p className="text-lg text-gray-500">Loading data...</p>
        </div>
      );
    }
    return selectedPonds.map((pond) => (
      <div key={pond} className="chart-container">
        <div className="flex justify-between items-center">
          <h2 className="font-bold">{pond}</h2>
          <button
            onClick={() => deletePond(pond)}
            className="text-red-500 hover:text-red-700 focus:outline-none"
          >
            <FaTrash />
          </button>
        </div>
        <div className="flex space-x-4">
          {Object.keys(pondData[pond] || {}).map((param) => {
            const data = pondData[pond][param].map((d) => ({
              x: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              y: parseFloat(d.value),
            }));

            let yAxisTitle = '';
            let yAxisStyle = {};
            if (param === 'O2') {
              yAxisTitle = 'mg/L';
            } else if (param === 'Temperature') {
              yAxisTitle = '℃';
              // Make "℃" bold and larger
              yAxisStyle = {
                fontWeight: 'bold', 
                fontSize: '18px', // Increase font size for "℃"
              };
            }

            return (
              <div key={param} className="parameter-chart w-1/3">
                <h3
                  className="text-center font-bold cursor-pointer"
                  onClick={() => {
                    setActiveChart({ param, data });
                    setActivePondName(pond);
                    setIsModalOpen(true);
                  }}
                >
                  {param}
                </h3>
                <Chart
                  options={{
                    ...chartData.options,
                    xaxis: { categories: data.map((d) => d.x) },
                    annotations: getAnnotations(param),
                    yaxis: {
                      title: {
                        text: yAxisTitle,
                        style: yAxisStyle, // Apply custom styles for "℃"
                      },
                    },
                  }}
                  series={[{ name: param, data: data.map((d) => d.y) }]}
                  type="line"
                  height={200}
                />
              </div>
            );
          })}
        </div>
      </div>
    ));
  };

  const closeModal = () => setIsModalOpen(false);

  // Function to handle the startDate change and update endDate automatically
  const handleStartDateChange = (date) => {
    setStartDate(date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1); // Set endDate to 1 day after startDate
    setEndDate(nextDay);
  };

  // Function to handle the "7 ngày" button click
  const handle7DaysClick = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    setStartDate(sevenDaysAgo);
    setEndDate(today); // Set to today
  };

  // Function to handle the "1 ngày" button click
  const handle1DayClick = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setStartDate(today); // Set startDate to today
    setEndDate(tomorrow); // Set endDate to tomorrow
  };

  return (
    <div className="flex w-full bg-gray-50 h-screen overflow-hidden">
      <aside>
        <Sidebar />
      </aside>
      <div className="flex-grow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-black-700">Thông số môi trường</h1>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Select options={pondTypes} onChange={handlePondTypeChange} placeholder="Chọn loại ao" value={selectedPondType} />
            <Select options={pondOptions} onChange={handlePondChange} placeholder="Chọn ao" value={pondOptions.find((option) => option.value === selectedPond)} />
            <DatePicker selected={startDate} onChange={handleStartDateChange} dateFormat="yyyy-MM-dd" className="px-4 py-2 border rounded" />
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} dateFormat="yyyy-MM-dd" className="px-4 py-2 border rounded" />
            <button
              onClick={handle1DayClick}
              className="px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded"
            >
              1 ngày
            </button>
            <button
              onClick={handle7DaysClick}
              className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded"
            >
              7 ngày
            </button>
          </div>
          <button onClick={addPond} className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded">
            <FaPlus className="inline-block mr-2" /> Thêm ao
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 bg-white p-4 rounded-lg shadow-md overflow-y-auto" style={{ height: '70%' }}>
          {renderCharts()}
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{ content: { width: '60%', maxWidth: '600px', height: '80%', maxHeight: '500px', margin: 'auto', overflow: 'auto' } }}
        >
          <div className="flex justify-end">
            <button onClick={closeModal} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Close</button>
          </div>
          <h2 className="text-lg font-bold">{activePondName} - {activeChart?.param}</h2>
          <Chart
            options={{
              ...chartData.options,
              xaxis: { categories: activeChart?.data.map((d) => d.x) },
              annotations: getAnnotations(activeChart?.param),
              yaxis: {
                title: {
                  text: activeChart?.param === 'Temperature' ? '℃' : activeChart?.param === 'O2' ? 'mg/L' : '',
                  style: (activeChart?.param === 'Temperature' || activeChart?.param === 'O2') ? { fontWeight: 'bold', fontSize: '18px' } : {}
                },
              },
            }}
            series={[{ name: activeChart?.param, data: activeChart?.data.map((d) => d.y) }]}
            type="line"
            height={400}
          />
        </Modal>
      </div>
    </div>
  );
}

export default Evista;
