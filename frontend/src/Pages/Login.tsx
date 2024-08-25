import { useState } from "react";
import LoginByEmail from "@/components/LoginByEmail";
import LoginByUsername from "@/components/LoginByUsername";

const Login = () => {
  const [isLoginByEmail, setIsLoginByEmail] = useState<boolean>(true);

  return (
    <>
      <div className="my-10 bg-slate-50 border rounded-lg flex flex-col p-4 md:mx-16 lg:mx-[25%] xl:mx-[30%]">
        <div className="flex flex-col items-center gap-2">
          <div className="text-2xl font-semibold">Sign in</div>
          <div className="text-gray-600">Get started with Socilia</div>
          <div className="flex items-center gap-2">
            <span>Sign in with</span>
            <button
              onClick={() => setIsLoginByEmail(true)}
              className={`${isLoginByEmail ? "font-semibold" : ""}`}
            >
              Email
            </button>
            <span>/</span>
            <button
              onClick={() => setIsLoginByEmail(false)}
              className={`${!isLoginByEmail ? "font-semibold" : ""}`}
            >
              Username
            </button>
          </div>
        </div>
        {isLoginByEmail ? <LoginByEmail /> : <LoginByUsername />}
      </div>
    </>
  );
};

export default Login;
