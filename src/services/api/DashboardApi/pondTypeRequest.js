import axiosClient from "./axiosClient"

const DashboardRequestApi = {
    pondTypeRequest: {
        getPondTypeRequest: async () => await axiosClient.get("/PondType?pageSize=200&pageNumber=1"),

        createPondTypeRequest: async (data) => await axiosClient.post("/PondType", data),

        deletePondTypeRequest: async (name) => await axiosClient.delete(`/PondType?PondTypeName=${name}`),
    },
    pondRequest: {
        getPondRequest: async () => await axiosClient.get("/Pond?pageSize=200&pageNumber=1"),
        getPondRequestById: async (id ="", pondName = "") => await axiosClient.get(`/Pond?pondId=${id}&pondTypeName=${pondName}&pageSize=200&pageNumber=1`),
        getPondRequestByStatus: async (status ="") => await axiosClient.get(`Pond?pondStatus=${status}&pageSize=200&pageNumber=1 `),
        
        createPondRequest: async (data) => await axiosClient.post("Pond/CreatePond", data),
        updatePondRequest: async (data) => await axiosClient.put("/Pond/ActivePond", data),
        deletePondRequest: async (id) => await axiosClient.delete(`Pond?PondId=${id}`),
        getHarvestTime: async (data) => await axiosClient.get(`/Pond/GetHarvestTime?pondId=${data}`),
    },
    timeRequest: {
        setTimeRequest: async (data) => await axiosClient.post("/TimeSetting", data),
    },
    setTimeRequest: {
        historySetTime: async () => await axiosClient.get("/TimeSetting")
    }

}


export default DashboardRequestApi;