import { useState, useCallback, useEffect, useRef } from "react";

import { GoogleMap, MarkerF, useJsApiLoader, InfoWindow, Marker } from "@react-google-maps/api";
import useWebSocket from "react-use-websocket";

import { useFetch } from "../hooks";

import { Spinner } from "./";

import mapStyles from "../../static/JSON/mapStyles.js";
import { useSelector } from "react-redux";

// const center = { lat: 7.113237646328663, lng: -73.10617916332973 };
const center = { lat: 7.1148017392066905, lng: -73.10797265816113 }; // centro para nuevas rutas
const WS_URL = "wss://bus.unab.edu.co/buses/location/";
// const WS_URL = "wss://bus.unab.edu.co/buses/location/";
// const WS_URL = "ws://localhost:8000/buses/location/"; //test localhost port 8000

let latitude,
  longitude,
  stops = [];

function animateMarkerTo(marker, newPosition) {
  var options = {
    duration: 1000,
    easing: function (x, t, b, c, d) {
      // jquery animation: swing (easeOutQuad)
      return -c * (t /= d) * (t - 2) + b;
    },
  };

  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;
  window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  // save current position. prefixed to avoid name collisions. separate for lat/lng to avoid calling lat()/lng() in every frame
  marker.AT_startPosition_lat = marker.getPosition().lat();
  marker.AT_startPosition_lng = marker.getPosition().lng();
  var newPosition_lat = newPosition.lat;
  var newPosition_lng = newPosition.lng;

  // crossing the 180° meridian and going the long way around the earth?
  if (Math.abs(newPosition_lng - marker.AT_startPosition_lng) > 180) {
    if (newPosition_lng > marker.AT_startPosition_lng) {
      newPosition_lng -= 360;
    } else {
      newPosition_lng += 360;
    }
  }

  var animateStep = function (marker, startTime) {
    var ellapsedTime = new Date().getTime() - startTime;
    var durationRatio = ellapsedTime / options.duration; // 0 - 1
    var easingDurationRatio = options.easing(durationRatio, ellapsedTime, 0, 1, options.duration);

    if (durationRatio < 1) {
      marker.setPosition({
        lat:
          marker.AT_startPosition_lat +
          (newPosition_lat - marker.AT_startPosition_lat) * easingDurationRatio,
        lng:
          marker.AT_startPosition_lng +
          (newPosition_lng - marker.AT_startPosition_lng) * easingDurationRatio,
      });

      // use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
      if (window.requestAnimationFrame) {
        marker.AT_animationHandler = window.requestAnimationFrame(function () {
          animateStep(marker, startTime);
        });
      } else {
        marker.AT_animationHandler = setTimeout(function () {
          animateStep(marker, startTime);
        }, 17);
      }
    } else {
      marker.setPosition(newPosition);
    }
  };

  // stop possibly running animation
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(marker.AT_animationHandler);
  } else {
    clearTimeout(marker.AT_animationHandler);
  }

  animateStep(marker, new Date().getTime());
}

export const Map = () => {
  const route = useSelector((state) => state.route.route);
  const [loading, setLoading] = useState(false);

  console.log(route);
  const { isLoaded } = useJsApiLoader({
    if: "google-map-script",
    googleMapsApiKey: "AIzaSyAalziNd960DQofNIoW54K8z608vBZd_Ic",
  });

  const [map, setMap] = useState(null);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const markerRef = useRef(null);

  // const { data, isLoading } = useFetch("http://localhost:8000/api/routes/1/"); // test localhost port 8000, cambiar el numero de ruta por la ruta seleccionada

  //* fetch stops
  useEffect(() => {
    setLoading(true);

    fetch(`https://bus.unab.edu.co/control/api/routes/${route}/`)
      .then((res) => res.json())
      .then((data) => {
        stops = data.stops;
        latitude = data.buses[route - 1]?.latitude;
        longitude = data.buses[route - 1]?.longitude;
        console.log({ data });
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
  if (lastJsonMessage) {
    const { message } = lastJsonMessage;
    latitude = parseFloat(message.latitude);
    longitude = parseFloat(message.longitude);
    // console.log({ latitude, longitude });
    markerRef.current !== null
      ? animateMarkerTo(markerRef.current.marker, { lat: latitude, lng: longitude })
      : null;
  }

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
                console.log({ stop });
                return (
                  <MarkerF
                    key={stop.name}
                    position={{ lat: stop.latitude, lng: stop.longitude }}
                    icon={{
                      url: "https://bus.unab.edu.co/static/src/parada-mapa.png",
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
            {latitude && (
              <Marker
                position={{ lat: latitude, lng: longitude }}
                icon={{
                  url: "https://bus.unab.edu.co/static/src/bus-mapa.png",
                  anchor: new google.maps.Point(17, 46),
                  scaledSize: new google.maps.Size(47, 58),
                }}
                animation={2}
                zIndex={12}
                ref={markerRef}
              ></Marker>
            )}
          </>
        </GoogleMap>
      ) : (
        <Spinner />
      )}
    </>
  );
};
