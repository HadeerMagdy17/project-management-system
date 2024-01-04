import React from "react";
import { useContext } from "react";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Context/AuthContext";
import logo from "./../../assets/images/pms.png";
import { ToastContext } from "../../Context/ToastContext";

interface ChangePasswordProps {
  handleClose: () => void;
}
const ChangePassword: React.FC<ChangePasswordProps> = ({ handleClose }) => {
  const { baseUrl, requestHeaders } = useContext(AuthContext);

  const { getToastValue } = useContext(ToastContext);

  const navigate = useNavigate();

  interface FormValues {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    await axios
      .put(`${baseUrl}/Users/ChangePassword`, data, {
        headers: requestHeaders,
      })
      .then((response) => {
        console.log(response);
        // localStorage.setItem('userToken', response.data.token)
        // saveUserData();
        // navigate("/login");
        handleClose();


        getToastValue("success", "Congratulations! Your Password Changed");
      })
      .catch((error) => {
        console.log(error);
        getToastValue(
          "error",
          error.response?.data.message || "An error occurred"
        );
      });
  };
  return (
    <div className="d-flex overlay-bg justify-content-center align-items-center flex-column">

      {/* form */}
      <div className=" changewidth h-50">

        <form
          className="login-wrapper m-auto w-100 my-5 py-3 px-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-center mb-2">
        <img src={logo} className="img-fluid" alt="logo" />
      </div>
          <p className="text-white">welcome to PMS</p>
          <h2 className="title mb-5">Change Password</h2>

          {/* // old Password */}
          <div className="form-group my-3">
            <label className="label-title mb-2"> Old Password</label>
            <input
              className="form-control custom-input"
              type="password"
              placeholder="Password"
              {...register("oldPassword", {
                required: true,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              })}
            />
            {errors.oldPassword && errors.oldPassword.type === "required" && (
              <span className="text-danger">Password is required</span>
            )}
            {errors.oldPassword && errors.oldPassword.type === "pattern" && (
              <span className="text-danger ">password is invalid</span>
            )}
          </div>
          {/* //New Password */}

          <div className="form-group my-3">
            <label className="label-title mb-2">New Password</label>
            <input
              className="form-control custom-input"
              type="password"
              placeholder="Password"
              {...register("newPassword", {
                required: true,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              })}
            />
            {errors.newPassword && errors.newPassword.type === "required" && (
              <span className="text-danger">Password is required</span>
            )}
            {errors.newPassword && errors.newPassword.type === "pattern" && (
              <span className="text-danger ">password is invalid</span>
            )}
          </div>
          {/* //Confirm Password */}
          <div className="form-group my-3">
            <label className="label-title mb-2">confirm New Password</label>
            <input
              className="form-control custom-input"
              type="password"
              placeholder="confirmNewPassword"
              {...register("confirmNewPassword", {
                required: true,
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              })}
            />
            {errors.confirmNewPassword &&
              errors.confirmNewPassword.type === "required" && (
                <span className="text-danger">Password is required</span>
              )}
            {errors.confirmNewPassword &&
              errors.confirmNewPassword.type === "pattern" && (
                <span className="text-danger ">password is invalid</span>
              )}
          </div>
          {/* Buttuon login */}
          {/* <div className="form-group my-3 d-flex justify-content-between">
            <Link to="/register" className="text-white text-decoration-none">
              Register Now?
            </Link>
            <Link
              to="/"
              // to='/request-reset-pass'
              className="text-white text-decoration-none"
            >
              Forgot Password?
            </Link>
          </div> */}
          <div className="form-group my-3">
            <button type="submit" className="btn w-100">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ChangePassword;
