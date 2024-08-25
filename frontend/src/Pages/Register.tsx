import { hasSpecialChar } from "../utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"
import { backendUrl } from "@/App";
import { AppContext } from "@/Context/AppContext";
import { AppContextType } from "@/types";

const registerFormSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3, "Please enter a username of length 3"),
    password: z
      .string()
      .min(6, "password should be atleast of length 6")
      .refine((password) => hasSpecialChar(password), {
        message: "password should contain atleast 1 special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

type registerFormType = z.infer<typeof registerFormSchema>;

const Register = () => {
  const {setLoggedInUser} = useContext(AppContext) as AppContextType;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerFormType>({ resolver: zodResolver(registerFormSchema) });
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [registerErrMsg,setRegisterErrMsg] = useState<string>("");
  const navigate = useNavigate();

  const onsubmit: SubmitHandler<registerFormType> = async (data) => {
    setRegisterErrMsg("");
    try {
      console.log(data);
      const {email,password,username} = data;
      const response = await axios.post(`${backendUrl}/api/auth/register`,{
        email,
        password,
        username,
      },{withCredentials:true});
      console.log(response);
      setLoggedInUser(response.data.user);
      reset();
      navigate("/");
    } catch (error:any) {
      console.log(error);
      setRegisterErrMsg(error.response.data.message);
    }
  };

  return (
    <>
      <div className="my-10 bg-slate-50 border rounded-lg flex flex-col p-4 md:mx-16 lg:mx-[25%] xl:mx-[30%]">
        <div className="flex flex-col gap-1 items-center">
          <div className="text-xl font-semibold">Sign up</div>
          <div className="text-gray-600">Get started with socilia</div>
        </div>
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="flex flex-col gap-4 my-4"
        >
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
            <Label className="text-lg" htmlFor="username">
              Username
            </Label>
            <Input
              {...register("username")}
              id="username"
              type="text"
              placeholder="eg: example123"
            />
            {errors.username && (
              <div className="text-red-500">{errors.username.message}</div>
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
          <div className="flex flex-col gap-2">
            <Label className="text-lg" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <Input
              {...register("confirmPassword")}
              type={isShowPassword ? "text" : "password"}
              id="confirmPassword"
            />
            {errors.confirmPassword && (
              <div className="text-red-500">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>
          {registerErrMsg!=="" && <div className="text-red-500 font-semibold">{registerErrMsg}</div>}
          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-center gap-1">
              <span className="text-gray-600 font-semibold">
                Already have an account?
              </span>
              <Link className="font-semibold text-gray-800" to="/login">
                Sign in
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Checkbox
                checked={isShowPassword}
                onClick={() => setIsShowPassword(!isShowPassword)}
              />
              <span className="text-gray-900 font-semibold">Show password</span>
            </div>
          </div>
          <Button disabled={isSubmitting}>Sign up</Button>
        </form>
      </div>
    </>
  );
};

export default Register;
