
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./../../Context/AuthContext";
import { ToastContext } from "../../Context/ToastContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProjectContext } from '../../Context/ProjectContext';
import { FormValues, projectType, IAuth } from './../../Types/Types';
import Select from 'react-select';



const AddTask: React.FC = () => {
  const { baseUrl, requestHeaders }: any
    //Pick<IAuth, 'baseUrl','requestHeaders'>
    = useContext(AuthContext);
  const { getToastValue }: void = useContext(ToastContext);
  // const { projects }: projectType[] = useContext(ProjectContext);
  // console.log(projects, "from addtasks");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [userList, setUserList] = useState([])
  const [projectList, setProjectList] = useState([])
  const [selectedUser, setSelectedUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,

  } = useForm<FormValues>();

  const goBack = () => {
    navigate(-1);
  }
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    // setIsLoading(true)
    data = { ...data, employeeId: selectedUser?.value };
    axios
      .post(`${baseUrl}/Task`, data, { headers: requestHeaders })
      .then((response) => {
        // setIsLoading(false)
        getToastValue(
          "success",
          response?.data?.message || "Project added suceessfully"
        );
        navigate("/dashboard/tasks");
      })
      .catch((error) => {
        // setIsLoading(false)
        getToastValue(
          "error",
          error?.response?.data?.message ||
          "An error occurred. Please try again."
        );
      })
      .finally(() => setIsLoading(false));

  }

  // Get users list
  const getUsersList = () => {

    axios.get(`${baseUrl}/Users/`, {
      headers: requestHeaders,
      params: {
        pageSize: 100,

      }

    })
      .then((response) => {
        setUserList(response?.data?.data);
      })
      .catch((error) => {
        getToastValue(
          "error",
          error?.response?.data?.message ||
          "An error occurred. Please try again."
        );
      })
  }
  const getAllProjectsList = () => {
    axios
      .get(`${baseUrl}/Project/manager`, { headers: requestHeaders })
      .then((response) => {
        setProjectList(response?.data?.data);
      })
      .catch((error) => {
        getToastValue(
          "error",
          error?.response?.data?.message ||
          "An error occurred. Please try again."
        );
      });
  };

  useEffect(() => {
    getUsersList();
    getAllProjectsList()

  }, [])
  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
    // getUsersList(selectedOption?.label);
    setValue("employeeId", selectedOption?.value); // Set value for react-hook-form
    setError("employeeId", { type: "", message: "" });


  };
  // const filterOptions = (options, { inputValue }) => {
  //   return options.filter((user) =>
  //     user.label.toLowerCase().includes(inputValue.toLowerCase())
  //   ).slice(0, 5); // Limit the results to 5 items
  // };
  const userOptions = userList.map((user) => ({
    value: user.id,
    label: user.userName,
  }));


  return (
    <>
      <div className="header d-flex justify-content-between p-3 ">
        <div className="">
          <Link to='/dashboard/tasks'
            className="btn ">&laquo; View All Tasks
          </Link>
          {/* <button
            onClick={goBack}
            className="btn ">&laquo; View All Tasks
            </button> */}
          <h2>Add New Task</h2>
        </div>

      </div>

      <div className="vh-100   shadow-lg rounded-4">

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
          <div className="row">
            <div className="col-md-6">
              <Select
                {...register("employeeId", { required: true, valueAsNumber: true })}
                className="text-black"
                options={userOptions}
                value={selectedUser}
                onChange={handleUserChange}
                placeholder="Search user..."
                isClearable

              />
              {errors.employeeId && errors.employeeId.type === "required" && (
                <span className="text-danger ">No User Selected</span>
              )}
            </div>
            <div className="col-md-6 ">
              <select
                {...register("projectId", { required: true, valueAsNumber: true })}
                aria-label="Default select example"
                // type="number"
                className="form-select mt-sm-3 mt-md-0"
              >
                <option className="text-muted">
                  Project
                </option>

                {
                  projectList?.map((project: projectType) => (
                    <>
                      <option key={project?.id} value={project.id}>{project?.title}</option>
                    </>
                  ))
                }
              </select>
              {errors.projectId && errors.projectId.type === "required" && (
                <span className="text-danger ">No Status Selected</span>
              )}
            </div>
          </div>

          <div className="form-group my-3 d-flex justify-content-between align-items-center">
            <button
              onClick={goBack}
              className="btn btn-outline-danger rounded-5">
              Cancel
            </button>
            <button
              className={"btn btn-orange my-3 px-4" + (isLoading ? " disabled" : "")}
            >
              {isLoading == true ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTask;