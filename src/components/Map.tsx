import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWebSocket from "react-use-websocket";
import { GoogleMap, InfoWindow, Marker, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { restoreDefaultBusLocation, updateBusLocation } from "../store/route/busSlice";
import mapStyles from "../assets/JSON/mapStyles.ts";
import animateMarkerTo from "../helpers/animateMarkerTo";
// Iconos marcadores mapa
import paradaMapa from "../assets/svg/parada-mapa.svg";
import busMapa from "../assets/svg/bus-mapa.svg";
import { RootState } from "../store/store.ts";
import { BusesState, BusMarkers, LastJsonMessage, Stop } from "../types/types";

const center = { lat: 7.1148017392066905, lng: -73.10797265816113 };

const busMarkers: BusMarkers = {};

export const Map = () => {
  const [stops, setStops] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop>();

  const route = useSelector((state: RootState) => state.route.route);
  const buses: BusesState = useSelector((state: RootState) => state.buses);
  const dispatch = useDispatch();
  const { lastJsonMessage } = useWebSocket<LastJsonMessage>(
    "wss://bus.unab.edu.co/buses/location/",
    {
      onOpen: () => {
        console.log("WebSocket connection established.");
      },
      shouldReconnect: () => false,
    }
  );

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
  }, [route, dispatch]);

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
    >
      {/* Bus marker */}
      {Object.keys(buses).length > 0 &&
        Object.keys(buses).map((bus: string) => {
          const busData = buses[bus]; // Accede a los datos del autobús utilizando la clave
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
                lat: parseFloat(busData.latitude),
                lng: parseFloat(busData.longitude),
              }}
              animation={google.maps.Animation.DROP}
              label={bus}
              ref={(marker) => {
                busMarkers[bus] = { marker };
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
            animation={google.maps.Animation.DROP}
            onClick={() => {
              setSelectedStop(stop);
            }}
          ></MarkerF>
        );
      })}
      {selectedStop && (
        <InfoWindow
          onCloseClick={() => setSelectedStop(undefined)}
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
