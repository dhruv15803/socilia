import { useContext, useState } from "react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { backendUrl } from "@/App";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Please enter a password"),
});

type loginFormType = z.infer<typeof loginFormSchema>;

const LoginByEmail = () => {
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [loginErrMsg,setLoginErrMsg] = useState<string>("");
  const {setLoggedInUser} = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<loginFormType>({ resolver: zodResolver(loginFormSchema) });
  const onsubmit: SubmitHandler<loginFormType> = async (data) => {
    setLoginErrMsg("");
    try {
      const { email, password } = data;
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          email,
          password,
          username: "",
        },
        { withCredentials: true }
      );
      console.log(response);
      setLoggedInUser(response.data.user);
      reset();
      navigate("/");
    } catch (error:any) {
      console.log(error);
      setLoginErrMsg(error.response.data.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="text-lg" htmlFor="email">
            Email
          </Label>
          <Input
            {...register("email")}
            type="email"
            id="email"
            placeholder="eg: example@example.com"
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-lg" htmlFor="password">
            Password
          </Label>
          <Input
            {...register("password")}
            type={isShowPassword ? "text" : "password"}
            id="password"
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        {errors.root && (
          <div className="text-red-500">{errors.root.message}</div>
        )}
        {loginErrMsg!=="" && <div className="text-red-500 font-semibold">{loginErrMsg}</div>}
        <div className="flex items-center justify-between">
          <div className="flex flex-col justify-center gap-1">
            <span className="text-gray-600 font-semibold">
              Don't have an account?
            </span>
            <Link className="font-semibold text-gray-800" to="/register">
              Sign up
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isShowPassword}
              onClick={() => setIsShowPassword(!isShowPassword)}
            />
            <span className="text-gray-900 font-semibold">Show password</span>
          </div>
        </div>
        <Button disabled={isSubmitting}>Sign in</Button>
      </form>
    </>
  );
};

export default LoginByEmail;
