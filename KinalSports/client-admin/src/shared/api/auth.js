import {axios} from "./api";

export const login = async (data)=> { 
    return await axios.post(
        "/auth/login",
        data
    )
}