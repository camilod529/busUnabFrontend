type Bus = {
    latitude: string;
    longitude: string;
    route: number | string;
    bus: string;
    time: string;
    isSending: boolean;
};

export type BusRoute = {
    active: string;
    latitude: number;
    longitude: number;
    plate: string;
};

export type LastJsonMessage = {
    message: Bus;
    // Otros campos si los hay
};
export interface CustomMarker extends google.maps.Marker {
    AT_startPosition_lat: number | undefined;
    AT_startPosition_lng: number | undefined;
    AT_animationHandler?: number | undefined;
}

export type BusMarkers = {
    [plate: string]: {
        marker: customMarker;
    };
};

interface BusesState {
    [bus: string]: Bus;
}
export type Stop = {
    name: string;
    latitude: number;
    longitude: number;
};
export interface Routes {
    id: number;
    name: string;
}

export interface MessageType {
    id: number;
    tittle: string;
    message: string;
}
