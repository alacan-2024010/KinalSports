import { useCallback } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { useVerifyEmail } from "../hooks/UseVerifyEmail";
import logo from "../../../assets/img/kinal.png"


export const VerifyEmailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const token = new URLSearchParams(location.search).get("token");
    const handleFinish = useCallback(() =>{
        setTimeout(() => {
            setTimeout(() => navigate("/"),2000)
            }, [navigate])
        })

        const { status, message } = useVerifyEmail(token, handleFinish);

        const displayMessage = 
            status === "loading" ? "Verificando tu correo..." : message

    return (
        <div className = "flex flex-col justify-center items-center h-screen bg-gray-100 px-4">
            <img 
                src={logo} 
                alt="KinalSports" 
                className="w-28 h-28 object-contain mb-4"
            />

            <p
                className="text-lg font-semibold text-gray-700 text-center max-w-lg"
                aria-live= "polite"
            >
                {displayMessage}
            </p>
        </div>
    )
}