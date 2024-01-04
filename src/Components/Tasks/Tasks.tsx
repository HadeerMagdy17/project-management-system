import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
// import noData from "./../../assets/images/no-data.png";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "./../../Context/AuthContext";
import { ToastContext } from "../../Context/ToastContext";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import NoData from "../../Shared/NoData/NoData";
// import AddTask from "../AddTask/AddTask";
import noData from "./../../assets/images/no-data.png";
import style from "./Tasks.module.css"
import CustomPagination from "../../Shared/CustomPagination/CustomPagination";
import Select from 'react-select';
import Loading from "../../Shared/Loading/Loading";
interface Itasks {
  id: number;
  status: string;
  title: string
}

const Tasks: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { baseUrl, requestHeaders, userRole } = useContext(AuthContext);
  const { getToastValue }: any = useContext(ToastContext);
  const [userList, setUserList] = useState([])
  const [tasks, setTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [todoTasks, setTodoTasks] = useState([])
  const [inProgressTasks, setInProgressTasks] = useState([])
  const [doneTasks, setDoneTasks] = useState([])
  // const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesArray, setPagesArray] = useState([]);
  const [projectList, setProjectList] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [timerId, setTimerId] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [taskId, setTaskId]: any = useState(0);


  interface FormValues {
    title: string;
    description: string;
    employeeId?: number;

  }

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>();


  const [modalState, setModalState] = useState("close");
  // ********to close modal*******************
  const handleClose = () => setModalState("close");
  // ********to show view modal*******************
  const showViewModal = (id: any) => {
    setTaskId(id);
    setModalState("view-modal");
    getTaskDetails(id);
  };
  // ***********update modal******************
  const showUpdateModal = (task: any) => {
    setTaskId(task.id);
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("employeeId", task.employee.userName);
    //  setValue("employeeId", task.employeeId.userName);
    setModalState("update-modal");
  };
  // ********to show delete modal*******************
  const showDeleteModal = (taskId: any) => {
    setTaskId(taskId);
    setModalState("delete-modal");
  };
  // **********get all tasks**********pageSize:number, pageNumber:number*******
  const getManagerTasksList = async (pageNumber: number, title: string) => {
    setIsLoading(true);
    await axios
      .get(`${baseUrl}/Task/manager`,
        {
          headers: requestHeaders,
          params: {
            pageSize: 5,
            pageNumber: pageNumber,
            title: title
          }
        })
      .then((response) => {
        setPagesArray(
          Array(response?.data?.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
        setTasks(response?.data?.data);
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
  // **********get all Employee tasks**********pageSize:number, pageNumber:number*******
  const getEmployeeTasksList = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(`${baseUrl}/Task`, {
        headers: requestHeaders,
        // params:{
        //   pageSize: 5,
        //   pageNumber: pageNumber,
        // }
      });

      const filterTaskByStatus = (status) =>
        response?.data?.data.filter((task: Itasks) => task.status === status);

      const todoTasks = filterTaskByStatus('ToDo');
      const inProgressTasks = filterTaskByStatus('InProgress');
      const doneTasks = filterTaskByStatus('Done');
      // const todoTasks = response.data.data.filter((task: Itasks) => task.status == 'ToDo')
      // const inProgressTasks = response.data.data.filter((task: Itasks) => task.status == 'InProgress')
      // const doneTasks = response.data.data.filter((task: Itasks) => task.status == 'Done')

      // Update state with categorized tasks
      setTodoTasks(todoTasks);
      setInProgressTasks(inProgressTasks);
      setDoneTasks(doneTasks);
    } catch (error) {
      getToastValue(
        'error',
        error?.response?.data?.message ||
        'An error occurred. Please try again.'
      );
    }
    finally {
      setIsLoading(false);
    }
  };

  // Get All users
  const getAllUsers = () => {

    axios.get(`${baseUrl}/Users/`, {
      headers: requestHeaders,
      params: {
        pageSize: 50,
      }
    })
      .then((response) => {
        setUserList(response?.data?.data);
      })
      .catch((error) => {

      })
  }

  //****************update Task**********************
  const updateTask = (data: any) => {
    setIsLoading(true);
    axios
      .put(`${baseUrl}/Task/${taskId}`, data, {
        headers: requestHeaders,
      })
      .then((response) => {
        handleClose();
        getManagerTasksList();
        getToastValue(
          "success",
          response?.data?.message || "Task updated suceessfully"
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
  // ************to deleted from Tasks*********
  const deleteTask = () => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/Task/${taskId}`, {
        headers: requestHeaders,
      })
      .then((response) => {
        setTasks(response.data.data);
        setTaskId(taskId);
        handleClose();
        getToastValue(
          "success",
          response?.data?.message || "Task deleted successfully"
        );

        // getTasksList();
        // getManagerTasksList(1);
        getManagerTasksList();
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
  // ************get tasks details to view****************
  const getTaskDetails = (taskId) => {
    axios
      .get(`${baseUrl}/Task/${taskId}`, {
        headers: requestHeaders,
      })
      .then((response) => {
        setTaskDetails(response?.data);
      })
      .catch((error) => {
        getToastValue(
          "error",
          error?.response?.data?.message ||
          "An error occurred. Please try again."
        );
      });
  };


  // *********Search in dropdown **************
  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
    // getUsersList(selectedOption?.label);
    setValue("employeeId", selectedOption?.value); // Set value for react-hook-form
    setError("employeeId", { type: "", message: "" });
  }
  const userOptions = userList.map((user) => ({
    value: user.id,
    label: user.userName,
  }));


  // ***Handle drag and drop
  const handleDragEnd = (result) => {
    //  if the result destination object doesnot exisit we can return of that function
    if (!result.destination) {
      return;
    }

    const sourceTasks = getTasksByStatus(result.source.droppableId);
    const destinationTasks = getTasksByStatus(result.destination.droppableId);

    const [draggedTask] = sourceTasks.splice(result.source.index, 1);
    draggedTask.status = getStatusByDroppableId(result.destination.droppableId);
    destinationTasks.splice(result.destination.index, 0, draggedTask);

    if (result.source.droppableId === 'todo') {
      setTodoTasks(sourceTasks);
    } else if (result.source.droppableId === 'inProgress') {
      setInProgressTasks(sourceTasks);
    } else if (result.source.droppableId === 'done') {
      setDoneTasks(sourceTasks);
    }

    if (result.destination.droppableId === 'todo') {
      setTodoTasks(destinationTasks);
    } else if (result.destination.droppableId === 'inProgress') {
      setInProgressTasks(destinationTasks);
    } else if (result.destination.droppableId === 'done') {
      setDoneTasks(destinationTasks);
    }

    // Update the task status in the Manager
    updateTaskStatus(draggedTask.id, draggedTask.status);

  };

  const getStatusByDroppableId = (droppableId) => {
    if (droppableId === 'todo') {
      return 'ToDo';
    } else if (droppableId === 'inProgress') {
      return 'InProgress';
    } else if (droppableId === 'done') {
      return 'Done';
    }
  };

  const getTasksByStatus = (status: Itasks) => {
    if (status === 'todo') {
      return todoTasks;
    } else if (status === 'inProgress') {
      return inProgressTasks;
    } else if (status === 'done') {
      return doneTasks;
    }
  };

  const updateTaskStatus = (taskId, newStatus) => {
    // Make an API request to update the task status in the backend
    axios.put(`${baseUrl}/Task/${taskId}/change-status`, { status: newStatus }, {
      headers: requestHeaders,
    })
      .then((response) => {

      })
      .catch((error) => {

      });
  };

  // ******** get all tasks by project for  */
  // const getAllProjectsList = () => {
  //   axios
  //     .get(`${baseUrl}/Project`, {
  //       headers: requestHeaders,
  //       params: {
  //         pageSize: 30,

  //       }
  //     })
  //     .then((response) => {

  //       setProjectList(response?.data?.data);
  //     })
  //     .catch((error) => {
  //       getToastValue(
  //         "error",
  //         error?.response?.data?.message ||
  //         "An error occurred. Please try again."
  //       );
  //     });
  // };

  // const getTasksByProjectId = (projectId) => {
  //   const apiUrl = projectId
  //     ? `${baseUrl}/Task/project/${projectId}`
  //     : `${baseUrl}/Task/manager`;

  //   axios
  //     .get(apiUrl, {
  //       headers: requestHeaders,
  //       params: {
  //         pageSize: 50,
  //         // pageNumber: pageNumber,
  //       }
  //     })
  //     .then((response) => {
  //       setTasks(response?.data?.data);
  //       setPagesArray(
  //         Array(response?.data?.totalNumberOfPages)
  //           .fill()
  //           .map((_, i) => i + 1)
  //       );
  //     })
  //     .catch((error) => {
  //       getToastValue(
  //         "error",
  //         error?.response?.data?.message ||
  //         "An error occurred. Please try again."
  //       );
  //     });
  // };

  // const handleProjectSelection = (selectedValue) => {
  //   const projectId = selectedValue ? selectedValue.value : null;

  //   setSelectedProjectId(selectedValue);

  //   if (selectedValue !== null) {
  //     // If a specific project is selected, filter tasks by project
  //     getTasksByProjectId(selectedValue);
  //   } else {
  //     // If no project is selected, fetch all tasks
  //     if (userRole === 'Manager') {
  //       getManagerTasksList();
  //     } else if (userRole === 'Employee') {
  //       getEmployeeTasksList();
  //     }
  //   }
  // };


  useEffect(() => {
    if (userRole === 'Manager') {
      getManagerTasksList(currentPage);
      getAllUsers();
    } else if (userRole === 'Employee') {
      getEmployeeTasksList();
    }
  }, [userRole, currentPage]);

  useEffect(() => {
    if (userRole === 'Manager') {
      if (timerId) {
        clearTimeout(timerId);
      }

      const newTimeOut = setTimeout(() => {
        getManagerTasksList(1, searchString);
      }, 500);

      setTimerId(newTimeOut);
    }

    // Clear timeout on component unmount to avoid memory leaks
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [searchString, userRole]);
  // Search Task  by name
  const getTaskTitleValue = (input: string) => {
    setSearchString(input?.target?.value);

  }

  return (
    <>
      <div className="header d-flex justify-content-between p-3">
        <h3>Tasks</h3>
        {userRole == 'Manager' ?
          <Link
            to='/dashboard/tasks/add-task'
            className="btn btn-warning rounded-5 px-4"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> &nbsp;Add New
            Task
          </Link> : ''
        }


      </div>

      {/* table */}
      <>
      {
          userRole === 'Manager' ?
        <div className="w-25 px-3">
          <div className="icon-input position-relative">
            <i
              className={`${style.icons} fa-solid fa-search position-absolute text-success`}
            />
            <input
              onChange={getTaskTitleValue}
              placeholder="search by Task name...."
              className="form-control  my-2 "
              type="text"
              style={{ paddingLeft: "2rem" }}
            />
          </div>
        </div> : ''}
        {
          userRole === 'Manager' ? (
            <div className="table-container1 vh-100">

              <table className="table">
                <thead className="table-head table-bg ">
                  <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Description</th>
                    <th scope="col">User</th>
                    <th scope="col">Project</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading ? (
                    <>
                      {tasks?.length > 0 ? (
                        tasks.map((task: any) => (
                          <tr key={task?.id}>
                            <td scope="row">{task?.title}</td>
                            <td className=' text-white' style={{ textAlign: 'center' }}>
                              <div style={{
                                backgroundColor:
                                  task?.status === 'ToDo'
                                    ? '#4da79d'
                                    : task?.status === 'InProgress'
                                      ? '#EF9B28'
                                      : task?.status === 'Done'
                                        ? '#009247'
                                        : 'inherit',
                                borderRadius: '15px',
                                fontSize: '16px',
                                padding: '10px',
                                fontWeight: '250',
                                fontFamily: 'Montserrat-Regular',
                              }}>
                                {task?.status}
                              </div>
                            </td>
                            <td>{task?.description}</td>
                            <td>{task?.employee?.userName}</td>
                            <td>{task?.project?.title}</td>
                            <td>{new Date(task.creationDate).toLocaleDateString()}</td>
                            <td>
                              <button onClick={() => showViewModal(task?.id)} className="p-0 border-0 icon-bg-custom">
                                <i className="fa fa-eye text-info px-1"></i>
                              </button>
                              <button onClick={() => showUpdateModal(task)} className="p-0 border-0 icon-bg-custom">
                                <i className="fa fa-pen text-warning px-1"></i>
                              </button>
                              <button onClick={() => showDeleteModal(task.id)} className="p-0 border-0 icon-bg-custom">
                                <i className="fa fa-trash text-danger px-1"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7">
                            <NoData />
                          </td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      {" "}
                      <td colSpan="7">
                        <Loading />
                      </td>
                    </tr>

                  )}
                </tbody>
              </table>
              {/* ******************** view modal ***************************/}
              <Modal show={modalState === "view-modal"} onHide={handleClose}>
                <Modal.Header closeButton>
                  <h3>Tasks Details</h3>
                </Modal.Header>
                <Modal.Body>
                  <>
                    <p>
                      <span className="text-warning">Title :&nbsp;</span>
                      {taskDetails?.title}
                    </p>
                    <p>
                      <span className="text-warning">description :&nbsp;</span>
                      {taskDetails?.description}
                    </p>
                    <p>
                      <span className="text-warning">status :&nbsp;</span>
                      {taskDetails?.status}
                    </p>
                    <p>
                      <span className="text-warning">Project :&nbsp;</span>
                      {taskDetails?.project?.title}
                    </p>
                  </>
                </Modal.Body>
              </Modal>
              {/* //*****************view modal******************** */}
              {/* ****************update modal *****************/}
              <Modal show={modalState === "update-modal"} onHide={handleClose}>
                <Modal.Header closeButton>
                  <h3>Update Task</h3>
                </Modal.Header>
                <Modal.Body>
                  <p>Welcome Back! Please enter your details</p>
                  <form
                    onSubmit={handleSubmit(updateTask)}
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
                        <span className="text-danger ">desciption is required</span>
                      )}
                    </div>
                    <div className="form-group my-3">
                      {/* <select
                        {...register("employeeId", { required: true, valueAsNumber: true })}
                        // aria-label="Default select example"
                        className="form-select"
                      >
                        <option className="text-muted">User</option>
                        {userList.map((user) => (
                          <option key={user.id} value={user.id} >
                            {user.userName}
                          </option>
                        ))}
                      </select> */}

                      <Select
                        {...register("employeeId", { required: true, valueAsNumber: true })}
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
              {/* ***************** //update modal *****************/}
              {/* **************** * delete modal *****************/}
              <Modal show={modalState === "delete-modal"} onHide={handleClose}>
                <Modal.Header closeButton>
                  <h3>delete this Task?</h3>
                </Modal.Header>
                <Modal.Body>
                  <div className="text-center">
                    <img src={noData} />
                    <p>
                      are you sure you want to delete this item ? if you are sure
                      just click on delete it
                    </p>

                  </div>
                  <div className="text-end ">
                    <button
                      onClick={deleteTask}
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
              {!isLoading ? (
                <CustomPagination
                  totalPages={pagesArray.length}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />) : ('')}
            </div>
          ) : (
            <div >

              <DragDropContext onDragEnd={handleDragEnd} >
                <div
                  className={`d-flex justify-content-around  m-4 p-2 ${style.columnContainer}`}
                >
                  {/* ToDo column */}
                  <div

                    className={style.column}
                  >
                    <Droppable droppableId="todo" direction="vertical"  >
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                          {...provided.droppableProps}
                          // className={`${style.bgStatus} p-5`}
                          style={{
                            backgroundColor: (snapshot.isDraggingOver ? "#024337" : '#315951'),
                            padding: 5,
                            width: 310,
                            minHeight: 500
                          }}
                        >
                          <h4 className="text-white">To-Do</h4>
                          {todoTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div

                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: 3,
                                    margin: '0 0 8px 0',
                                    minHeight: '20px',
                                    backgroundColor: snapshot.isDragging ? "#b26b07" : '#EF9B28',
                                    color: 'white',
                                    borderRadius: '10px',
                                    ...provided.draggableProps.style
                                  }}

                                >
                                  <div className={`${style.taskContent} `}>
                                    <p className={`${style.taskTitleBackground}`}>{task.title}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Draggable>


                          ))}
                          {provided.placeholder}

                        </div>
                      )}
                    </Droppable>
                  </div>


                  {/* InProgress column */}
                  <div
                    className={style.column}
                  >
                    <Droppable droppableId="inProgress" direction="vertical">
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}
                          className=""
                          style={{
                            backgroundColor: (snapshot.isDraggingOver ? "#024337" : '#315951'),
                            padding: 5,
                            width: 310,
                            minHeight: 500
                          }}>
                          <h4 className="text-white">In Progress</h4>
                          {inProgressTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: 3,
                                    margin: '0 0 8px 0',
                                    minHeight: '20px',
                                    backgroundColor: snapshot.isDragging ? "#b26b07" : '#EF9B28',
                                    color: 'white',
                                    borderRadius: '10px',
                                    ...provided.draggableProps.style
                                  }}

                                >
                                  <div className={`${style.taskContent} `}>
                                    <p className={`${style.taskTitleBackground}`}>{task.title}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                  </div>

                  {/* Done column */}

                  <div className={style.column}>
                    <Droppable droppableId="done" direction="vertical">
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                          {...provided.droppableProps}

                          style={{
                            backgroundColor: (snapshot.isDraggingOver ? "#024337" : '#315951'),
                            padding: 5,
                            width: 310,
                            minHeight: 500
                          }}
                        >
                          <h4 className="text-white">Done</h4>
                          {doneTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${style.taskItem}`}
                                  style={{
                                    userSelect: 'none',
                                    padding: 3,
                                    margin: '0 0 8px 0',
                                    minHeight: '20px',
                                    backgroundColor: snapshot.isDragging ? "#b26b07" : '#EF9B28',
                                    color: 'white',
                                    borderRadius: '10px',
                                    ...provided.draggableProps.style
                                  }}
                                >
                                  <div className={`${style.taskContent} `}>
                                    <p className={`${style.taskTitleBackground} text-decoration-line-through`}>{task.title}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>

                </div>
              </DragDropContext>
            </div>

          )
        }


      </>
      {/* table */}
    </>
  )
}

export default Tasks