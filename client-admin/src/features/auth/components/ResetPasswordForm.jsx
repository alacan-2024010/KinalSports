import {useForm} from "react-hook-form";
import { useAuthStore } from "../store/authStore.js";
import { useSearchParams } from "react-router-dom";

export const ResetPasswordForm = () =>{
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const resetPassword = useAuthStore(state => state.resetPassword);

    const {register, handleSubmit, watch, formState: {errors}} = useForm();

    const onSubmit = async(data) =>{
        const res = await resetPassword(token, data.password);
        
        if(res.success){
            alert("Contraseña actualizada");
        }else{
            alert(res.error);
        }
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label className="block text-sm font-medium mb-1">
                    Nueva Contraseña
                </label>

                <input 
                    type="password"
                    className="w-full px-3 py-2 border rounded-lg"
                    {...register("password",{
                        required: "La contraseña es obligatoria",
                        minLength: {
                            value: 8,
                            message: "La contraseña debe tener al menos 8 caracteres"
                        }
                    })} 
                />

                {errors.password &&(
                    <p className="text-red-500 text-sm">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Confirmar contraseña
                </label>
            

            <input 
                type="password"
                className="w-full px-3 py-2 border rounded-lg"
                {...register("confirmPassword",{
                    validate: value =>
                        value === watch("password") || "Las contraseñas no coinciden"
                })}
            />

            {errors.confirmPassword &&(
                <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                </p>
            )}
            </div>

            <button
                type="submit"
                className="w-full bg-main-blue text-white py-2 rounded-lg"
            >
                Cambiar contraseña
            </button>

        </form>
    )
}