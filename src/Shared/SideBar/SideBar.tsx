import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./../../assets/images/pms.png";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
import { AuthContext } from "../../Context/AuthContext";
import { ThemeContext, ITheme } from "./../../Context/ThemeContext";

const SideBar: React.FC = () => {
  let { userRole } = useContext(AuthContext);
  // console.log(userRole);
  const { toggleTheme, isDarkMode }:ITheme = useContext(ThemeContext);

  //*************sidebar collapse***************
  let [isCollapsed, setIsCollapsed] = useState(false);
  let handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  //  logout Function
  const navigate = useNavigate();
  function logOut(): void {
    localStorage.removeItem("userToken");
    navigate("/login");
  }

  //Model
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="sidebar-container">
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        // className="custom-model"
        dialogClassName="custom-model"
      >
        <Modal.Body className="p-0">
          <ChangePassword handleClose={handleClose} />
        </Modal.Body>
      </Modal>
      <Sidebar className="vh-100" collapsed={isCollapsed}>
        <div
          className={`toggle-sidebar-btn ${isCollapsed ? "collapsed" : ""} `}
          onClick={handleToggle}
        >
          {isCollapsed ? (
            <i className="fa-solid fa-arrow-right" />
          ) : (
            <i className="fa-solid fa-arrow-left" />
          )}
        </div>
        {/* <div>
          <img onClick={handleToggle} className="w-75" src={logo} alt="" />
        </div> */}
        <Menu className="mt-5">
          <MenuItem
            icon={<i className="fa fa-home"></i>}
            component={<Link to="/dashboard" />}
          >
            Home
          </MenuItem>
          {userRole == "Manager" ? (
            <MenuItem
              icon={<i className="fa fa-users"></i>}
              component={<Link to="/dashboard/users" />}
            >
              Users
            </MenuItem>
          ) : (
            ""
          )}
          <MenuItem
            icon={<i className="fa-solid fa-building-shield"></i>}
            component={<Link to="/dashboard/projects" />}
          >
            Projects
          </MenuItem>
          <MenuItem
            icon={<i className="fa-solid fa-hands-holding-circle"></i>}
            component={<Link to="/dashboard/tasks" />}
          >
            Tasks
          </MenuItem>
          <MenuItem
            onClick={handleShow}
            icon={<i className="fa-solid fa-unlock"></i>}
          >
            Change Password
          </MenuItem>

          <MenuItem
            onClick={logOut}
            icon={<i className="fa-solid fa-right-from-bracket"></i>}
          >
            Logout
          </MenuItem>
          <MenuItem
            onClick={toggleTheme}
            icon={
              isDarkMode === true ? (<i className="fa-solid fa-toggle-on"></i>) : (<i className="fa-solid fa-toggle-off"></i>)
            }
          >
            {
              isDarkMode === true ? ("Light theme") : ("Dark theme")
            }
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};
export default SideBar;
