import axios from "axios";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Context/AuthContext";
import logo from "./../../assets/images/pms.png";
import { ToastContext } from "../../Context/ToastContext";
import { IAuth } from './../../Context/AuthContext';
import { ToastContextType } from './../../Context/ToastContext';

const ResetPassword: React.FC = () => {
  const { baseUrl }: IAuth= useContext(AuthContext);
  const { getToastValue }: ToastContextType= useContext(ToastContext);

  const navigate = useNavigate();

  interface FormValues {
    email: string;
    seed:any;
    password:any;
    confirmPassword:any;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // console.log(data);
    axios
      .post(`${baseUrl}/Users/Reset`, data)
      .then((response) => {
        console.log(data);
        navigate("/login");
        getToastValue(
          "success",
          response?.data?.message || "password reset successfully"
        );
      })
      .catch((error) => {
        getToastValue(
          "error",
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      });
  };

  return (
    <div className="vh-100 auth-container d-flex justify-content-center align-items-center flex-column">
      <div className="text-center ">
        <img src={logo} alt="logo" className="img-fluid" />
      </div>
      <div className="w-75 mb-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          action=""
          className="login-wrapper m-auto  mt-1 py-2 px-5"
        >
          <p className="text-white">welcome to PMS</p>
          <h2 className="title mb-4">Reset password</h2>
          <div className="form-group my-1">
            <label className="label-title mb-2">E-mail</label>
            <input
              {...register("email", {
                required: true,
                pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              })}
              type="email"
              name="email"
              className="form-control custom-input"
              placeholder="Enter your E-mail"
            />

            {errors.email && errors.email.type === "required" && (
              <span className="text-danger ">Email is required</span>
            )}

            {errors.email && errors.email.type === "pattern" && (
              <span className="text-danger ">Email is invalid</span>
            )}
          </div>
          <div className="form-group my-1">
            <label className="label-title mb-1">OTP Verification</label>
             <input
              {...register("seed", {
                required: true,
                
              })}
              type="text"
              className="form-control custom-input"
              placeholder="Enter OTP code Verification"
            />

           {errors.seed && errors.seed.type === "required" && (
              <span className="text-danger ">Otp code is required</span>
            )}

          
          </div>
          <div className="form-group my-3">
                  <label className="label-title mb-2">Password</label>
                  <input
                    {...register("password", {
                      required: true,
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    })}
                    type="password"
                    className="form-control custom-input"
                    placeholder="Enter your password"
                  />
                  {errors.password && errors.password.type === "required" && (
                    <span className="text-danger">password is required</span>
                  )}
                  {errors.password && errors.password.type === "pattern" && (
                    <span className="text-danger ">password is invalid</span>
                  )}
                 
                  </div>
                  <div className="form-group my-3">
                  <label className="label-title mb-2">Confirm Password</label>
                  <input
                    {...register("confirmPassword", {
                      required: true,
                    })}
                    type="password"
                    className="form-control custom-input"
                    placeholder="Confirm your Password "
                  />
                  {errors.confirmPassword && errors.confirmPassword.type === "required" && (
                    <span className="text-danger">confirmPassword is required</span>
                  )}
                 
                  </div>

          <div className="form-group my-3">
            <button type="submit" className="btn w-100">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
