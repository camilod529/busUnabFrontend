// import { useFetch } from "../hooks";

import "../css/navbar.css";

export const Navbar = () => {
  // const { data, isLoading, hasError } = useFetch("https://bus.unab.edu.co/django/api/routes/");

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light vh-10 header">
        <div className="container-fluid">
          <span className="navbar-brand font-weight-bold">
            <img src="../../static/img/UNABNARANJA.png" alt="UNAB logo" style={{ height: "2em" }} />
          </span>
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
                  <li>
                    <a className="dropdown-item">Ruta 1</a>
                  </li>
                  <li>
                    <a className="dropdown-item">Ruta 2</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
