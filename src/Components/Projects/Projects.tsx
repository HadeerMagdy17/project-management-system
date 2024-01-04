import axios from "axios";
import { useContext, useEffect, useState } from "react";
import NoData from "./../../Shared/NoData/NoData";
import noData from "./../../assets/images/no-data.png";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "./../../Context/AuthContext";
import { Link } from "react-router-dom";
import { ToastContext } from "../../Context/ToastContext";
import { useForm } from "react-hook-form";
import CustomPagination from "../../Shared/CustomPagination/CustomPagination";
import style from "../Projects/Projects.module.css";
import Loading from "../../Shared/Loading/Loading";

const Projects: React.FC = () => {
  const { baseUrl, requestHeaders, userRole }: any = useContext(AuthContext);
  const { getToastValue }: any = useContext(ToastContext);
  const [project, setProject] = useState({});
  const [projectDetails, setProjectDetails] = useState({});
  const [projects, setProjects] = useState([]);
  let [itemId, setItemId]: any = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timerId, setTimerId] = useState(null);
  // *********search***********
  const [searchString, setSearchString] = useState("");
  // *******pagination*******
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesArray, setPagesArray] = useState([]);

  interface FormValues {
    title: string;
    description: string;
  }
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  // *************************

  // **********to use more than one modal in same component**********
  const [modalState, setModalState] = useState("close");
  // ********to close modal*******************
  const handleClose = () => setModalState("close");
  // ********to show view modal*******************
  const showViewModal = (id: number) => {
    setItemId(id);
    setModalState("view-modal");
    getPtojectDetails(id);
  };
  // ***********update modal******************
  const showUpdateModal = (project: any) => {
    setItemId(project.id);
    setValue("title", project.title);
    setValue("description", project.description);
    setModalState("update-modal");
  };
  // ********to show delete modal*******************

  const showDeleteModal = (itemId: number) => {
    setItemId(itemId);
    setModalState("delete-modal");
  };
  // **********get all projects*****************
  const getAllProjectsList = (pageNo: number, title: string) => {
    setIsLoading(true);
    axios
      .get(
        userRole == "Manager"
          ? `${baseUrl}/Project/manager`
          : `${baseUrl}/Project/employee`,
        {
          headers: requestHeaders,
          params: {
            pageSize: 5,
            pageNumber: pageNo,
            title: title,
          },
        }
      )
      .then((response) => {
        // console.log("list", response?.data?.data);
        setPagesArray(
          Array(response?.data?.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
        setProjects(response?.data?.data);
      })
      .catch((error) => {
        getToastValue(
          "error",
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //****************update project**********************
  const updateProject = (data: any) => {
    setIsLoading(true);
    axios
      .put(`${baseUrl}/Project/${itemId}`, data, {
        headers: requestHeaders,
      })
      .then((response) => {
        handleClose();

        getAllProjectsList();
        getToastValue(
          "success",
          response?.data?.message || "Project updated suceessfully"
        );
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
  // ************to deleted from projects*********
  const deleteProject = () => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/Project/${itemId}`, {
        headers: requestHeaders,
      })
      .then((response) => {
        setProjects(response.data.data);
        setItemId(itemId);
        handleClose();
        getToastValue(
          "success",
          response?.data?.message || "project deleted successfully"
        );

        getAllProjectsList();
      })
      .catch((error) => {
        getToastValue(
          "error",
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        ).finally(() => setIsLoading(false));
      });
  };
  // ************get project details to view****************
  const getPtojectDetails = (itemId: number) => {
    axios
      .get(`${baseUrl}/Project/${itemId}`, {
        headers: requestHeaders,
      })
      .then((response) => {
        setProjectDetails(response?.data);
      })
      .catch((error) => {
        getToastValue(
          "error",
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      });
  };
  // *****************************************************
  // **********search by proj name***********************
  const getProjectTitleValue = (e: MouseEvent) => {
    setSearchString(e.target.value);
  };
  // ************************

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
    const newTimeOut = setTimeout(() => {
      getAllProjectsList(1, searchString);
    }, 500);
    setTimerId(newTimeOut);
  }, [userRole,searchString]);

  // useEffect(() => {


  //   getAllProjectsList(currentPage);
  // }, [userRole,currentPage]);
  useEffect(() => {
    if (userRole === 'Manager') {
      getAllProjectsList(currentPage)

    } else if (userRole === 'Employee') {
      getAllProjectsList(currentPage)
    }
  }, [userRole, currentPage]);


  return (
    <>
      <div className="header d-flex justify-content-between p-3">
        <h3>Projects</h3>
        {userRole == "Manager" ? (
          <Link
            to={"/dashboard/projects/add-project"}
            className="btn btn-warning rounded-5 px-4 customize-link"
          >
            <i className="fa fa-plus" aria-hidden="true"></i>
            &nbsp;Add New Project
          </Link>
        ) : (
          ""
        )}
      </div>
      {/* table */}
      <>
        <div className="w-25 px-3">
          <div className="icon-input position-relative">
            <i
              className={`${style.icons} fa-solid fa-search position-absolute text-success`}
            />
            <input
              onChange={getProjectTitleValue}
              placeholder="search by project name...."
              className="form-control  my-2 "
              type="text"
              style={{ paddingLeft: "2rem" }}
            />
          </div>
        </div>
        <div className="table-responsive table-container1 vh-100">
          <table className="table">
            <thead className="table-head table-bg ">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Num Task</th>
                {userRole == "Manager" ? (
                  <th scope="col">Actions</th>
                ) : (
                  <th scope="col">Date created</th>
                )}
              </tr>
            </thead>
            <tbody>
              {!isLoading ? (
                <>
                  {projects?.length > 0 ? (
                    projects.map((project: any) => (
                      <tr key={project?.id}>
                        <td>{project?.title}</td>
                        <td>{project?.description}</td>
                        <td>{project?.task?.length}</td>
                        {userRole == "Manager" ? (
                          <td>


                            <button
                              className="border-0 icon-bg-custom"
                              onClick={() => showViewModal(project?.id)}
                            >

                              <i className="fa fa-eye  text-info px-2"></i>
                            </button>

                            <button
                              className="icon-bg-custom border-0"
                              onClick={() => showUpdateModal(project)}
                            >
                              <i className="fa fa-pen  text-warning px-2"></i>
                            </button>

                            <button
                              className="icon-bg-custom border-0"
                              onClick={() => showDeleteModal(project.id)}
                            ><i className="fa fa-trash  text-danger"></i>
                            </button>


                          </td>
                        ) : (
                          <td>
                            {new Date(
                              project?.creationDate
                            ).toLocaleDateString()}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colspan="4">
                        <NoData />
                      </td>
                    </tr>
                  )}
                </>
              ) : (
                <tr>
                  {" "}
                  <td colspan="4">
                    <Loading />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* ******************** view modal ***************************/}
          <Modal show={modalState == "view-modal"} onHide={handleClose}>
            <Modal.Header closeButton>
              <h3>Project Details</h3>
            </Modal.Header>
            <Modal.Body>
              <>
                <p>
                  <span className="text-warning">Title :&nbsp;</span>
                  {projectDetails?.title}
                </p>
                <p>
                  <span className="text-warning">description :&nbsp;</span>
                  {projectDetails?.description}
                </p>
                <p>
                  <span className="text-warning">creation Date :&nbsp;</span>
                  {new Date(projectDetails?.creationDate).toLocaleDateString()}
                </p>
              </>
            </Modal.Body>
          </Modal>
          {/* //*****************view modal******************** */}
          {/* ****************update modal *****************/}
          <Modal show={modalState == "update-modal"} onHide={handleClose}>
            <Modal.Header closeButton>
              <h3>Update project</h3>
            </Modal.Header>
            <Modal.Body>
              <p>Welcome Back! Please enter your details</p>
              <form
                onSubmit={handleSubmit(updateProject)}
                action=""
                className="form-wrapper m-auto   pt-5 pb-3 px-5"
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
                      "Update"
                    )}
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
          {/***************** //update modal *****************/}
          {/* **************** * delete modal *****************/}
          <Modal show={modalState == "delete-modal"} onHide={handleClose}>
            <Modal.Header closeButton>
              <h3>delete this Project?</h3>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center">
                <img src={noData} />
                <p>
                  are you sure you want to delete this item ? if you are sure
                  just click on delete it
                </p>
              </div>
              <div className="text-end">
                <button
                  onClick={deleteProject}
                  className={
                    "btn btn-outline-danger my-3" +
                    (isLoading ? " disabled" : "")
                  }
                >
                  {isLoading == true ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    "Delete this item"
                  )}
                </button>
              </div>
            </Modal.Body>
          </Modal>
          {/************************* * //delete modal*************** */}
          {/* pagination */}
          {!isLoading && (
            <CustomPagination
              totalPages={pagesArray.length}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </>
      {/* table */}
    </>
  );
};
export default Projects;
