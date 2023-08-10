import { useState, useCallback, useEffect } from "react";

import { GoogleMap, MarkerF, useJsApiLoader, InfoWindow } from "@react-google-maps/api";
import useWebSocket from "react-use-websocket";

import { useFetch } from "../hooks";

import { Spinner } from "./";

import mapStyles from "../../static/JSON/mapStyles.js";

const center = { lat: 7.113237646328663, lng: -73.10617916332973 };
// const WS_URL = "wss://bus.unab.edu.co/buses/location/";
const WS_URL = "ws://localhost:8000/buses/location/"; //test localhost port 8000

let latitude,
  longitude,
  stops = [];

export const Map = () => {
  const { isLoaded } = useJsApiLoader({
    if: "google-map-script",
    googleMapsApiKey: "AIzaSyAalziNd960DQofNIoW54K8z608vBZd_Ic",
  });

  const [map, setMap] = useState(null);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  //* fetch stops
  // const { data, isLoading } = useFetch("https://bus.unab.edu.co/django/api/routes/");
  const { data, isLoading } = useFetch("http://localhost:8000/api/routes/1"); // test localhost port 8000, cambiar el numero de ruta por la ruta seleccionada

  useEffect(() => {
    if (data) {
      console.log(data);
      stops = data.stops;
    }
  }, [data]);

  //* InfoWIndow selected stop
  const [selectedStop, setSelectedStop] = useState(null);

  //* WS bus location
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      // console.log("WebSocket connection established.");
    },
    shouldReconnect: () => false,
  });
  if (lastJsonMessage) {
    const { message } = lastJsonMessage;
    latitude = parseFloat(message.latitude);
    longitude = parseFloat(message.longitude);
    console.log({ latitude, longitude });
  }

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "90vh" }}
          zoom={15.5}
          center={center}
          mapTypeId="roadmap"
          options={{
            fullscreenControl: false,
            disableDoubleClickZoom: true,
            streetViewControl: false,
            zoomControl: false,
            scrollwheel: true,
            styles: mapStyles,
          }}
          onUnmount={onUnmount}
        >
          <>
            {/* Load markerFs stops */}
            {!isLoading &&
              stops?.map((stop) => (
                <MarkerF
                  key={stop.name}
                  position={{ lat: stop.latitude, lng: stop.longitude }}
                  icon={{
                    url: "../../static/pngs-iconos/parada-mapa.png",
                    anchor: new google.maps.Point(17, 46),
                    scaledSize: new google.maps.Size(34, 37),
                  }}
                  zIndex={10}
                  title={stop.name}
                  animation={2}
                  onClick={() => {
                    setSelectedStop(stop);
                  }}
                ></MarkerF>
              ))}
            {selectedStop && (
              <InfoWindow
                onCloseClick={() => setSelectedStop(null)}
                position={{
                  lat: selectedStop.latitude,
                  lng: selectedStop.longitude,
                }}
                options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
              >
                <span>Estación {selectedStop.name}</span>
              </InfoWindow>
            )}
            {/* Bus markerF */}
            {latitude && (
              <MarkerF
                position={{ lat: latitude, lng: longitude }}
                icon={{
                  url: "../../static/pngs-iconos/bus-mapa.png",
                  anchor: new google.maps.Point(17, 46),
                  scaledSize: new google.maps.Size(47, 58),
                }}
                animation={2}
                zIndex={12}
              ></MarkerF>
            )}
          </>
        </GoogleMap>
      ) : (
        <Spinner />
      )}
    </>
  );
};
