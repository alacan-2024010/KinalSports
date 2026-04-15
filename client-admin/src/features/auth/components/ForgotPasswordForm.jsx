import { useForm } from "react-hook-form";

export const ForgotPasswordForm = ({ onSwitch }) => {
  const { register, handleSubmit ,formState:{errors}} = useForm();

  // Función que se ejecuta al enviar el formulario
  const onSubmit = (data) => {
    console.log("Email enviado para recuperar contraseña", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div >
        <label classname="block text-sm font-medium text-gray-800 mb-1.5">
          Email
        </label>

        <input 
          type="email" 
          placeholder="correo@ejemplo.com"
          className="w-full px-3 py-2 border rounded-lg"
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Ingresa un correo válido",
            },
          })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-main-blue text-white py-2 rounded-lg disabled:opacity-50  hover:opacity-90"
      >
        Enviar Correo
      </button>

      <p className="text-center text-sm text-gray-600">
        ¿Recordaste tu contraseña?{" "}
        <button
          type="button"
          className="text-main-blue font-medium hover:opacity-80"
          onClick={onSwitch}
        >
          Iniciar sesión
        </button>
      </p>
    </form>
  )
}


