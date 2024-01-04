// nadia.mohamed.taha166@gmail.com
// @Password123!
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Context/AuthContext";
import { ToastContext } from "../../Context/ToastContext";
import { SubmitHandler, useForm } from "react-hook-form";

const AddProject: React.FC = () => {
  const { baseUrl, requestHeaders }: any = useContext(AuthContext);
  const { getToastValue }: any = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  interface FormValues {
    title: string;
    description: string;
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    axios
      .post(`${baseUrl}/Project`, data, { headers: requestHeaders })
      .then((response) => {
        getToastValue(
          "success",
          response?.data?.message || "Project added suceessfully"
        );
        navigate("/dashboard/projects");
      })
      .catch((error) => {
        getToastValue(
          "error",
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div className="header d-flex justify-content-between p-3 ">
        <h5>Add New Project</h5>
      </div>
      <div className="vh-100 ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          action=""
          className="form-wrapper m-auto w-75  pt-5 pb-3 px-5"
        >
          <div className="form-group my-3">
            <label className="label-title mb-2">Title</label>
            <input
              {...register("title", {
                required: true,
              })}
              type="text"
              name="title"
              className="form-control"
              placeholder="Enter Title..."
            />

            {errors.title && errors.title.type === "required" && (
              <span className="text-danger ">title is required</span>
            )}
          </div>
          <div className="form-group my-3">
            <label className="label-title mb-2">Description</label>
            <textarea
              {...register("description", {
                required: true,
              })}
              rows={5}
              type="text"
              name="description"
              className="form-control"
              placeholder="Enter description..."
            ></textarea>

            {errors.title && errors.title.type === "required" && (
              <span className="text-danger ">title is required</span>
            )}
          </div>

          <div className="form-group my-3 text-end">
            <button
              className={"btn my-3 px-4" + (isLoading ? " disabled" : "")}
            >
              {isLoading == true ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default AddProject;
