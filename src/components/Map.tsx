import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, InfoWindowF, Marker, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import useWebSocket from "react-use-websocket";
import mapStyles from "../assets/JSON/mapStyles.ts";
import animateMarkerTo from "../helpers/animateMarkerTo";

// Iconos marcadores mapa
import busMarkerR1 from "../assets/img/bus/busMarker-R1.png";
import busMenuR1 from "../assets/img/bus/busMenu-R1.png";
import busMarkerR2 from "../assets/img/bus/busMarker-R2.png";
import busMenuR2 from "../assets/img/bus/busMenu-R2.png";
import stopMarkerR1 from "../assets/img/stops/stopMarker-R1.png";
import stopMarkerR2 from "../assets/img/stops/stopMarker-R2.png";

// Store
import { restoreDefaultBusLocation, updateBusLocation } from "../store/route/busSlice";

// Tipado
import { RootState } from "../store/store.ts";
import { BusesState, BusMarkers, BusRoute, LastJsonMessage, Stop } from "../types/types";

import "../css/map.css";

const centerR1 = { lat: 7.1148017392066905, lng: -73.10797265816113 };
const centerR2 = { lat: 7.093142759549661, lng: -73.1093801136395 };

const busMarkers: BusMarkers = {};

export const Map = () => {
    const [stops, setStops] = useState<Stop[]>([]);
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);

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
            dispatch(updateBusLocation({ ...lastJsonMessage.message, isSending: true }));
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
                data.buses.forEach((bus: BusRoute) => {
                    dispatch(
                        updateBusLocation({
                            bus: bus.plate,
                            latitude: bus.latitude.toString(),
                            longitude: bus.longitude.toString(),
                            route: route,
                            time: bus.active,
                            isSending: false,
                        })
                    );
                });
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
            zoom={route == 1 ? 16 : 14}
            center={route == 1 ? centerR1 : centerR2}
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
                                url:
                                    busData.route == 1
                                        ? busData.isSending
                                            ? busMarkerR1
                                            : busMenuR1
                                        : busData.isSending
                                        ? busMarkerR2
                                        : busMenuR2,
                                anchor: new google.maps.Point(17, 46),
                                scaledSize: busData.isSending
                                    ? new google.maps.Size(47, 58)
                                    : new google.maps.Size(48, 48),
                                labelOrigin: busData.isSending
                                    ? new google.maps.Point(20, 66)
                                    : new google.maps.Point(24, 60),
                            }}
                            position={{
                                lat: parseFloat(busData.latitude),
                                lng: parseFloat(busData.longitude),
                            }}
                            animation={google.maps.Animation.DROP}
                            label={{
                                text: bus,
                                color:
                                    route == 1
                                        ? busData.isSending
                                            ? "#46ac34"
                                            : "grey"
                                        : busData.isSending
                                        ? "#de703f"
                                        : "grey",
                                className: "label-background",
                            }}
                            ref={(marker) => {
                                if (marker) busMarkers[bus] = marker;
                            }}
                            zIndex={100}
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
                            url: route == 1 ? stopMarkerR1 : stopMarkerR2,
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
                <InfoWindowF
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
                </InfoWindowF>
            )}
        </GoogleMap>
    ) : (
        <></>
    );
};
