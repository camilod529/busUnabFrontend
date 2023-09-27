import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { changeRoute } from "../store/route/routeSlice";

import "../css/navbar.css";

export const Navbar = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://bus.unab.edu.co/control/api/routes/")
      .then((res) => res.json())
      .then((response) => {
        setData(response);
      });
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light header">
        <div className="container-fluid">
          <span className="navbar-brand font-weight-bold">
            <img
              src="https://bus.unab.edu.co/static/src/logo-busu.png"
              alt="UNAB logo"
              style={{ height: "2em" }}
            />
          </span>

          {/* Routes menu */}
          {data.length > 0 ? (
            <>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      id="navbarDropdownMenuLink"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Rutas
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      {/* Duplicar para estaciones */}
                      {data.map((route, index) => {
                        return (
                          <li key={route.name}>
                            <div
                              className="dropdown-item"
                              onClick={() => {
                                dispatch(changeRoute(index + 1));
                                localStorage.setItem("route", index + 1);
                              }}
                            >
                              <span>{route.name}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </nav>
    </>
  );
};
