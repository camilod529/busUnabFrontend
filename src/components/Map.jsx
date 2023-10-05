import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { GoogleMap, MarkerF, useJsApiLoader, InfoWindow, Marker } from "@react-google-maps/api";
import useWebSocket from "react-use-websocket";

import mapStyles from "../../static/JSON/mapStyles.js";
import animateMarkerTo from "../helpers/animateMarkerTo";

import { Spinner } from "./";
import "../css/map.css";
import busMapa from "../assets/iconos-appbus/bus-mapa.svg";
import paradaMapa from "../assets/iconos-appbus/parada-mapa.svg";

// const center = { lat: 7.113237646328663, lng: -73.10617916332973 };
const center = { lat: 7.1148017392066905, lng: -73.10797265816113 }; // centro para nuevas rutas
const WS_URL = `wss://bus.unab.edu.co/buses/location/`;
// const WS_URL = "wss://bus.unab.edu.co/buses/location/";
// const WS_URL = "ws://localhost:8000/buses/location/"; //test localhost port 8000

let latitude,
  longitude,
  busInfo1,
  busInfo2,
  stops = [];

export const Map = () => {
  const route = useSelector((state) => state.route.route);
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  // console.log(route);

  const { isLoaded } = useJsApiLoader({
    if: "google-map-script",
    googleMapsApiKey: "AIzaSyAalziNd960DQofNIoW54K8z608vBZd_Ic",
  });

  const [map, setMap] = useState(null);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const markerRef = useRef(null);
  const markerRef2 = useRef(null);

  // const { data, isLoading } = useFetch("http://localhost:8000/api/routes/1/"); // test localhost port 8000, cambiar el numero de ruta por la ruta seleccionada

  //* fetch stops
  useEffect(() => {
    setLoading(true);

    fetch(`https://bus.unab.edu.co/control/api/routes/${route}/`)
      .then((res) => res.json())
      .then((data) => {
        stops = data.stops;
        // latitude = data.buses[route - 1]?.latitude;
        // longitude = data.buses[route - 1]?.longitude;
        if (
          data.buses[route - 1]?.plate === "SZK163" ||
          data.buses[route - 1]?.plate === "WFC837"
        ) {
          busInfo1 = {
            latitude: data.buses[route - 1]?.latitude,
            longitude: data.buses[route - 1]?.longitude,
            plate: data.buses[route - 1]?.plate,
          };
        } else {
          busInfo2 = {
            latitude: data.buses[route - 1]?.latitude,
            longitude: data.buses[route - 1]?.longitude,
            plate: data.buses[route - 1]?.plate,
          };
        }
        // console.log({ data });
        setBuses(data.buses);
        setLoading(false);
        // console.log({ latitude, longitude });
      });
  }, [, route]);

  //* InfoWIndow selected stop
  const [selectedStop, setSelectedStop] = useState(null);

  //* WS bus location
  const { lastJsonMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      // console.log("WebSocket connection established.");
    },
    shouldReconnect: () => false,
  });
  // TODO: Revisar como se envia el mensaje si hay 2 buses
  if (lastJsonMessage) {
    const { message } = lastJsonMessage;
    if (message.bus === "SZK163" || message.bus === "WFC837") {
      busInfo1 = {
        latitude: parseFloat(message.latitude),
        longitude: parseFloat(message.longitude),
        plate: message.bus,
      };
    } else {
      busInfo2 = {
        latitude: parseFloat(message.latitude),
        longitude: parseFloat(message.longitude),
        plate: message.bus,
      };
    }
    // latitude = parseFloat(message.latitude);
    // longitude = parseFloat(message.longitude);

    // console.log({ latitude, longitude });
    // if (busInfo.plate === "SZK163" || busInfo.plate === "WFC837") {
    markerRef.current !== null
      ? animateMarkerTo(markerRef.current.marker, {
          lat: busInfo1.latitude,
          lng: busInfo1.longitude,
        })
      : null;
    // }
    // if (busInfo.plate === "THY642") {
    markerRef2.current !== null
      ? animateMarkerTo(markerRef2?.current.marker, {
          lat: busInfo2.latitude,
          lng: busInfo2.longitude,
        })
      : null;
    // }

    return (
      <>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "calc(100vh - 69px)",
              zIndex: 9,
            }}
            zoom={16}
            center={center}
            mapTypeId="roadmap"
            options={{
              fullscreenControl: false,
              disableDoubleClickZoom: true,
              streetViewControl: false,
              zoomControl: false,
              scrollwheel: true,
              styles: mapStyles,
              disableDefaultUI: true,
              gestureHandling: "greedy",
            }}
            onUnmount={onUnmount}
          >
            <>
              {/* Load markerFs stops */}
              {!loading &&
                stops?.map((stop) => {
                  // console.log({ stop });
                  return (
                    <MarkerF
                      key={stop.name}
                      position={{ lat: stop.latitude, lng: stop.longitude }}
                      icon={{
                        url: paradaMapa,
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
                  );
                })}
              {selectedStop && (
                <InfoWindow
                  onCloseClick={() => setSelectedStop(null)}
                  position={{
                    lat: selectedStop.latitude,
                    lng: selectedStop.longitude,
                  }}
                  options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                >
                  <div>
                    <span>Estación {selectedStop.name}</span>
                  </div>
                </InfoWindow>
              )}
              {/* Bus markerF */}
              {/* TODO: Cambiar como se renderizan los buses, revisar la cantidad y renderizar acorde, intentar cambiar el color del bus, que sea mas identificable */}
              {busInfo1 &&
                buses?.map((bus, index) => {
                  console.log(index, bus);
                  return (
                    <Marker
                      key={bus.plate}
                      position={
                        bus.plate === "SZK163" || bus.plate === "WFC837"
                          ? {
                              lat: parseFloat(busInfo1.latitude),
                              lng: parseFloat(busInfo1.longitude),
                            }
                          : {
                              lat: parseFloat(busInfo2?.latitude),
                              lng: parseFloat(busInfo2?.longitude),
                            }
                      }
                      icon={{
                        url: busMapa,
                        anchor: new google.maps.Point(17, 46),
                        scaledSize: new google.maps.Size(47, 58),
                        labelOrigin: new google.maps.Point(20, 65),
                      }}
                      animation={2}
                      zIndex={12}
                      ref={
                        bus.plate === "SZK163" || bus.plate === "WFC837" ? markerRef : markerRef2
                      }
                      title={bus.plate}
                      label={{
                        text: bus.plate,
                        color: "#dc622b",
                        // className: "label-background",
                      }}
                    ></Marker>
                  );
                })}
            </>
          </GoogleMap>
        ) : (
          <Spinner />
        )}
      </>
    );
  }
};
