import { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { changeRoute } from "../store/route/routeSlice";

import "../css/navbar.css";
import { Routes } from "../types/types";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [data, setData] = useState<Routes[]>([]);

  useEffect(() => {
    fetch("https://bus.unab.edu.co/control/api/routes/")
      .then((res) => res.json())
      .then((response) => {
        setData(response);
      });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary header">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="https://bus.unab.edu.co/static/src/logo-busu.png"
            alt="UNAB logo"
            style={{ height: "2em" }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {pathname !== "/" ? (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Mapa
                </Link>
              </li>
            ) : (
              ""
            )}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Rutas
              </a>
              <ul className="dropdown-menu">
                {data.length > 0 &&
                  data.map((route, index) => {
                    return (
                      <li key={route.name}>
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            dispatch(changeRoute(index + 1));
                            localStorage.setItem("route", (index + 1).toString());
                          }}
                        >
                          <span>{route.name}</span>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/credits">
                Creditos
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
