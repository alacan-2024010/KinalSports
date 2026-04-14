import axios from "axios";

const axiosAuth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    timeout: 8000, // Tiempo de espera para la respuesta (8 segundos)
    headers:{
        "Content-Type": "application/json"
    }
});

export { axiosAuth };