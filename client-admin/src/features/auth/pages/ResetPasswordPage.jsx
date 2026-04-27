import { ResetPasswordForm } from "../components/ResetPasswordForm";

export const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          Restablecer contraseña
        </h2>

        <ResetPasswordForm />
      </div>
    </div>
  );
};