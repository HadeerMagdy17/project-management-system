import React from "react";
import SideBar from "../SideBar/SideBar";
import NavBar from "../Navbar/NavBar";
import { Outlet } from "react-router-dom";
import styles from "./MasterLayout.module.css";

export default function MasterLayout() {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* Navbar at the top */}
          <div className="col-12 p-0">
              <NavBar/>
          </div>
        </div>

        <div className={styles.container1}>
          {/* Sidebar on the left */}
          <div className={styles.sidebar}>
            <SideBar  />
          </div>

          {/* Main content area */}
          <div className={styles.content}>
            <div className={styles.header}>
              <div className="content-container">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
