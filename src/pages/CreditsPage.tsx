import { Link } from "react-router-dom";

export const CreditsPage = () => {
  return (
    <>
      <style>
        {`
          .table-striped tbody tr:nth-child(odd) {
            background-color: rgba(242, 162, 51, 0.18);
          }
        `}
      </style>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title text-center mb-4">Créditos</h1>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="text-center">Cargo</th>
                        <th className="text-center">Nombre</th>
                        <th className="text-center">Correo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Backend y App móvil conductor</td>
                        <td>Juan Eduardo Quintero Palacio</td>
                        <td>juedquipa29@gmail.com </td>
                      </tr>
                      <tr>
                        <td>Frontend</td>
                        <td>Camilo Alberto Durán Ferreira</td>
                        <td>camilod529@gmail.com</td>
                      </tr>
                      <tr>
                        <td>Director de proyecto</td>
                        <td>Julian Santiago Santoyo Diaz</td>
                        <td>jsdiaz@unab.edu.co</td>
                      </tr>
                      <tr>
                        <td>Co-Director de proyecto</td>
                        <td>Javier Pinzón Castellanos</td>
                        <td>jpinzon408@unab.edu.co</td>
                      </tr>
                      <tr>
                        <td>App móvil conductor</td>
                        <td>Pedro Elías Palencia Landinez</td>
                        <td>ppalencia101@unab.edu.co</td>
                      </tr>
                      <tr>
                        <td>App móvil conductor</td>
                        <td>Maria Laura Rodriguez Ortega</td>
                        <td>mrodriguez162@unab.edu.co</td>
                      </tr>
                      <tr>
                        <td>App móvil conductor</td>
                        <td>Santiago Carreño Vásquez</td>
                        <td>scarreno773@unab.edu.co</td>
                      </tr>

                      <tr>
                        <td>App móvil conductor</td>
                        <td>Fabián Enrique Suarez Carvajal</td>
                        <td>fsuarez120@unab.edu.co</td>
                      </tr>
                      <tr>
                        <td>Infraestructura UNAB</td>
                        <td>Jonathan Espinel</td>
                        <td>jespinel404@unab.edu.co</td>
                      </tr>
                      <tr>
                        <td>Infraestructura UNAB</td>
                        <td>Ricardo becerra Gómez</td>
                        <td>ricardo.becerra@outlook.com</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Link
                    to={"/"}
                    className="btn d-lg-none"
                    style={{ backgroundColor: "rgba(242, 162, 51, 0.8)", borderRadius: "20px" }}
                  >
                    Volver al Home
                  </Link>
                </div>
              </div>
              <Link
                to={"/"}
                className="btn d-none d-lg-block position-absolute"
                style={{
                  bottom: 3,
                  right: 10,
                  backgroundColor: "rgba(242, 162, 51, 0.8)",
                  borderRadius: "20px",
                }}
              >
                Volver al Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
