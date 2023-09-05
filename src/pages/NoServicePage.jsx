import React from "react";
import busLogo from "../assets/logo-busu.svg";

export const NoServicePage = () => {
  return (
    <>
      <div className="row text-center gap-2" style={{ height: "100vh", width: "100vw" }}>
        <div className="col align-self-center">
          <img src={busLogo} alt="UNAB logo" style={{ height: "12rem", width: "auto" }} />
          <p className="fs-5 mt-4">
            <b>
              ¡Importante! Ten en cuenta que los fines de semana no se presta el servicio de ruta
              del Bus UNAB.
            </b>
          </p>
        </div>
      </div>
    </>
  );
};
