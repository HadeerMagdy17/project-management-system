import axios from "axios";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Context/AuthContext";
import logo from "./../../assets/images/pms.png";
import { ToastContext } from "../../Context/ToastContext";

const RequestReset: React.FC = () => {
  const { baseUrl }: any = useContext(AuthContext);

  const { getToastValue }: any = useContext(ToastContext);

  const navigate = useNavigate();

  interface FormValues {
    email: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    axios
      .post(`${baseUrl}/Users/Reset/Request`, data)
      .then((response) => {
        console.log(data);
        navigate("/reset-password");
        getToastValue(
          "success",
          response?.data?.message || "Code sent to your mail please check"
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
    <div className=" vh-100 auth-container d-flex justify-content-center align-items-center flex-column">
      <div className="text-center ">
        <img src={logo} alt="logo" className="img-fluid" />
      </div>
      <div className="w-50 mb-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          action=""
          className="login-wrapper m-auto  mt-3 py-3 px-5"
        >
          <p className="text-white">welcome to PMS</p>
          <h2 className="title mb-5">Request reset password</h2>
          <div className="form-group my-3">
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
export default RequestReset;
