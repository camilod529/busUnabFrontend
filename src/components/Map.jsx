import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";
import { useFetch } from "../hooks";

const center = { lat: 7.113237646328663, lng: -73.10617916332973 };
let stops = [];

export const Map = () => {
  const { isLoaded } = useJsApiLoader({
    if: "google-map-script",
    googleMapsApiKey: "AIzaSyAalziNd960DQofNIoW54K8z608vBZd_Ic",
  });

  const [map, setMap] = useState(null);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const { data } = useFetch("https://bus.unab.edu.co/django/api/routes/");

  useEffect(() => {
    if (data) {
      stops = data.stops;
      console.log(stops);
    }
  }, [data]);

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "90vh" }}
          zoom={15.5}
          center={center}
          onUnmount={onUnmount}
        >
          {stops.map((stop) => (
            <Marker
              key={stop.name}
              position={{ lat: stop.latitude, lng: stop.longitude }}
              icon={{
                url: "../../static/img/location-pin.png",
                anchor: new google.maps.Point(17, 46),
                scaledSize: new google.maps.Size(37, 37),
              }}
            ></Marker>
          ))}
        </GoogleMap>
      ) : (
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};
