import { axiosAdmin } from "./api";

export const getFields = async() =>{
    return axiosAdmin.get("/fields")
}

export const createField = async(data) =>{
    return axiosAdmin.post("/fields", data, {
        headers: {"Content-Type": "multipart/form-data"}
    })
}