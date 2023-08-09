import React from "react";

export const NoServicePage = () => {
  return (
    <>
      <div className="row text-center gap-2" style={{ height: "100vh", width: "100vw" }}>
        <div className="col align-self-center">
          <img
            src="../../static/svg/logo-busu.svg"
            alt="UNAB logo"
            style={{ height: "15rem", width: "auto" }}
          />
          <p className="fs-5 mt-4">
            <b>El servicio de Bus UNAB no est&aacute; disponible los fines de semana.</b>
            <br />
            Lamentamos el inconveniente.
          </p>
        </div>
      </div>
    </>
  );
};
