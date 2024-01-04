
import axios from "axios";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { ToastContext } from '../../Context/ToastContext';
import logo from './../../assets/images/pms.png';
import { IAuth } from './../../Context/AuthContext';
import { ToastContextType } from './../../Context/ToastContext';



const VerifyUser: React.FC  = () => {
  
  const { baseUrl, requestHeaders }:IAuth= useContext(AuthContext);
  const { getToastValue }: ToastContextType= useContext(ToastContext);
  const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormValues>();

      interface FormValues {
        email: string,
        code: string,
      }
      
      const onSubmit: SubmitHandler<FormValues> = async (data:FormValues) => {
        // console.log(data);
        await axios
      .put(`${baseUrl}/Users/verify`,data,{
        headers: requestHeaders,
      })
      .then((response) => {
          getToastValue("success", "Account created successfully!");

        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        getToastValue("error", error.response.data.message|| "An error occurred");
      });
      }
    
  return (
    <div className="auth-container container-fluid">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-md-6">
          <div className="p-2">
            <div className="logo-cont text-center mb-1">
              <img src={logo} className="w-50" alt="logo" />
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="m-auto w-75  p-5 rounded-4"
            >
              <p className="text-white">welcome to PMS</p>
              <h2 className="title">Verify Account</h2>
              

              <div className="form-group my-3">
                <input
                  {...register("email", {
                    required: true,
                    pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  })}
                  type="email"
                  className="form-control"
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
                <input
                  {...register("code", {
                    required: true,
                    
                  })}
                  type="text"
                  className="form-control"
                  placeholder="verefication code"
                />
                {errors.code && errors.code.type === "required" && (
                  <span className="text-danger">Verification code is required</span>
                )}
              </div>
              <div className="form-group my-1">
                <button type="submit" className="btn btn-success w-100">
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyUser