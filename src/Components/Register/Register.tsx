import axios from "axios";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../../Context/AuthContext';
import { ToastContext } from './../../Context/ToastContext';
import logo from './../../assets/images/pms.png';


const Register: React.FC = () => {
  let { baseUrl } = useContext(AuthContext);
  let { getToastValue } = useContext(ToastContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  interface FormValues {
    userName: string,
    email: string,
    password: string,
    confirmPassword: string,
    country: string,
    phoneNumber: string,
  }

  const appendToFormData = (data: FormValues) => {
    const formData = new FormData();
    formData.append("userName", data["userName"]);
    formData.append("password", data["password"]);
    formData.append("confirmPassword", data["confirmPassword"]);
    formData.append("email", data["email"]);
    formData.append("country", data["country"]);
    formData.append("phoneNumber", data["phoneNumber"]);
    return formData;
  };

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    console.log(data)
    const addFormData = appendToFormData(data);
    await axios
      .post(`${baseUrl}/Users/Register`, addFormData)
      .then((response) => {
        setTimeout(() => {
          getToastValue("success", "Account created successfully! A verification code has been sent to your email address");
        }, 1000);

        console.log(response);
        navigate("/verify-user");
      })
      .catch((error) => {
        console.log(error);
        getToastValue("error", error.response?.data.message || "An error occurred");
      });
  };

  return (
    <div className="auth-container container-fluid">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-md-6">
          <div className="p-2">
            <div className="logo-cont text-center mb-3">
              <img src={logo} className="w-50" alt="logo" />
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="m-auto w-100 p-5 rounded-4"
            >
              <p className="text-white">Welcome to PMs</p>
              <h2 className="title">Create New Account</h2>

              <div className="row">
                <div className="col-md-6 ">
                  <div className="form-group my-3">
                    <label className="label-title mb-2">User Name</label>
                    <input
                      {...register("userName", {
                        required: true,
                        pattern: /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/

                      })}
                      type="text"
                      className="form-control  custom-input"
                      placeholder="Enter your name"
                    />
                    {errors.userName && errors.userName.type === "required" && (
                      <span className="text-danger">userName is required</span>
                    )}
                    {errors.userName && errors.userName.type === "pattern" && (
                      <span className="text-danger ">The userName must contain characters and end with numbers without spaces</span>
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
                      className="form-control  custom-input"
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
                      className="form-control  custom-input"
                      placeholder="Confirm your Password "
                    />
                    {errors.confirmPassword && errors.confirmPassword.type === "required" && (
                      <span className="text-danger">confirmPassword is required</span>
                    )}

                  </div>
                </div>
                <div className="col-md-6">

                  <div className="form-group my-3">
                    <label className="label-title mb-2">Email</label>
                    <input
                      {...register("email", {
                        required: true,
                        pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                      })}
                      type="email"
                      className="form-control  custom-input"
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
                    <label className="label-title mb-2">Country</label>
                    <input
                      {...register("country", {
                        required: true,
                      })}
                      type="text"
                      className="form-control  custom-input"
                      placeholder="Enter your country"
                    />
                    {errors.country && errors.country.type === "required" && (
                      <span className="text-danger">countryis required</span>
                    )}

                  </div>
                  <div className="form-group my-3">
                    <label className="label-title mb-2">Phone Number</label>
                    <input
                      {...register("phoneNumber", {
                        required: true,
                      })}
                      type="text"
                      className="form-control  custom-input"
                      placeholder="Enter your phone number"
                    />
                    {errors.phoneNumber && errors.phoneNumber.type === "required" && (
                      <span className="text-danger">phoneNumber is required</span>
                    )}

                  </div>
                </div>
              </div>


              <div className='form-group my-3 text-end'>

                <Link to="/login" className='text-white text-decoration-none'>
                  Login now?
                </Link>
              </div>
              <div className="form-group my-3">
                <button type="submit" className="btn btn-success w-100">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register