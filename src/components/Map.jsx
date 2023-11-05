import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { restoreDefaultBusLocation, updateBusLocation } from "../store/route/busSlice";
import mapStyles from "../../static/JSON/mapStyles.js";
import animateMarkerTo from "../helpers/animateMarkerTo";
// Iconos marcadores mapa
import paradaMapa from "../assets/iconos-appbus/parada-mapa.svg";
import busMapa from "../assets/iconos-appbus/bus-mapa.svg";

const center = { lat: 7.1148017392066905, lng: -73.10797265816113 };

export const Map = () => {
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [map, setMap] = useState(null);

  const busMarkers = {};

  const route = useSelector((state) => state.route.route);
  const buses = useSelector((state) => state.buses.buses);
  const dispatch = useDispatch();
  const { lastJsonMessage } = useWebSocket("wss://bus.unab.edu.co/buses/location/", {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    shouldReconnect: () => false,
  });

  useEffect(() => {
    // Realiza la animación de los marcadores de los autobuses
    if (lastJsonMessage && lastJsonMessage.message.route == route) {
      dispatch(updateBusLocation(lastJsonMessage.message));
      const plate = lastJsonMessage.message.bus;

      const newLocation = {
        lat: parseFloat(lastJsonMessage.message.latitude),
        lng: parseFloat(lastJsonMessage.message.longitude),
      };
      if (busMarkers[plate]) {
        animateMarkerTo(busMarkers[plate].marker, newLocation);
      }
    }
  }, [lastJsonMessage, route, dispatch]);

  // * stops by route
  useEffect(() => {
    fetch(`https://bus.unab.edu.co/control/api/routes/${route}/`)
      .then((res) => res.json())
      .then((data) => {
        setStops(data.stops);
      });
    dispatch(restoreDefaultBusLocation());
  }, [route]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Cargar de mapa de Google
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAalziNd960DQofNIoW54K8z608vBZd_Ic",
  });

  return isLoaded ? (
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
      {/* Bus marker */}
      {Object.keys(buses).length > 0 &&
        Object.keys(buses).map((bus) => {
          return (
            <Marker
              key={bus}
              icon={{
                url: busMapa,
                anchor: new google.maps.Point(17, 46),
                scaledSize: new google.maps.Size(47, 58),
                labelOrigin: new google.maps.Point(20, 65),
              }}
              position={{
                lat: parseFloat(buses[bus].latitude),
                lng: parseFloat(buses[bus].longitude),
              }}
              label={bus}
              ref={(marker) => {
                busMarkers[bus] = marker;
              }}
            />
          );
        })}

      {/* StopMarker */}
      {stops?.map((stop) => {
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
    </GoogleMap>
  ) : (
    <></>
  );
};
