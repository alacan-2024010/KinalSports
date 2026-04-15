import {create} from "zustand";
import { persist} from "zustand/middleware";
import {login as loginRequest} from "../../../shared/api";

export const useAuthStore = create(
    persist(
        (set,get) => ({
            user: null,
            token: null,
            expiresAt: null,
            loading: false,
            error: null,
            isAuthenticated: false,
        
            login: async (data) => {
                try {
                    set({ loading: true, error: null });

                    const { data: response } = await loginRequest(data);

                    set({ 
                        user: response.userDetails,
                        token: response.token,
                        expiresAt: response.expiresAt,
                        loading: false,
                        error: null,
                        isAuthenticated: true
                    });

                    return { success: true };

                } catch (error) {
                    console.error("Error en el login:", error);

                    const message = error.response?.data?.message || "Error desconocido";

                    set({ error: message, loading: false });

                    return {
                        success: false,
                        error: message
                    }
                }
            }
        })
    )
)