import{create} from "zustand";
import { 
    getFields as getFieldsRequest,
    createField as createFieldRequest
} from "../../../shared/api";

export const useFieldStore = create((set,get) =>({
    fields: [],
    loading: false,
    error: null,

    getFields: async() =>{
        try {
            set({loading: true, error: null})
            const response = await getFieldsRequest();
            console.log(response)

            set({
                fields: response.data.data,
                loading: false,
                error: null
            })
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener canchas",
                loading: false
            })
        }
    },

    createField: async(formData)=>{
        try {
            set({loading: true, error: null})
            
            const response = await createFieldRequest(formData);
            console.log(response)

            set({
                fields: [response.data.data, ...get().fields],
                loading: false,
            })

            
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear cancha",
                loading: false
            })
        }
    }
}))