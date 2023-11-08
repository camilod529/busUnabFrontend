import image from "../assets/img/buenaVibra.jpg";
import { Navbar } from "../components";

export const BuenaVibraPage = () => {
  return (
    <>
      <Navbar />
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 69px)" }}
      >
        <div className="text-center">
          <img
            src={image} // Reemplaza "tu-imagen.png" con la ruta de tu imagen
            alt="Imagen"
            style={{ width: "auto", height: "calc(100vh - 69px)" }}
          />
        </div>
      </div>
    </>
  );
};
