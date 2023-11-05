import { CustomMarker } from "../types/types";

export default function animateMarkerTo(
  marker: CustomMarker,
  newPosition: google.maps.LatLngLiteral
): void {
  if (marker instanceof google.maps.Marker) {
    const options: {
      duration: number;
      easing: (x: number, t: number, b: number, c: number, d: number) => number;
    } = {
      duration: 1000,
      easing: function (t, b, c, d) {
        // jQuery animation: swing (easeOutQuad)
        return -c * (t /= d) * (t - 2) + b;
      },
    };

    // Verifica si marker no es nulo
    if (marker) {
      // Accede a la propiedad 'position' para obtener la posición
      const startPosition = marker.getPosition() || { lat: 0, lng: 0 };
      const startPositionLat = Number(startPosition.lat);
      const startPositionLng = Number(startPosition.lng);

      marker["AT_startPosition_lat"] = startPositionLat;
      marker["AT_startPosition_lng"] = startPositionLng;

      const newPosition_lat = newPosition.lat;
      let newPosition_lng = newPosition.lng;

      // Cruza el meridiano 180° y da la vuelta larga alrededor de la Tierra
      if (Math.abs(newPosition_lng - marker.AT_startPosition_lng) > 180) {
        if (newPosition_lng > marker.AT_startPosition_lng) {
          newPosition_lng -= 360;
        } else {
          newPosition_lng += 360;
        }
      }

      const animateStep = function (marker: CustomMarker, startTime: number): void {
        const ellapsedTime = new Date().getTime() - startTime;
        const durationRatio = ellapsedTime / options.duration; // 0 - 1
        const easingDurationRatio = options.easing(
          durationRatio,
          ellapsedTime,
          0,
          1,
          options.duration
        );

        if (durationRatio < 1) {
          marker.setPosition({
            lat:
              marker.AT_startPosition_lat +
              (newPosition_lat - marker.AT_startPosition_lat) * easingDurationRatio,
            lng:
              marker.AT_startPosition_lng +
              (newPosition_lng - marker.AT_startPosition_lng) * easingDurationRatio,
          });

          // Utiliza requestAnimationFrame si está disponible en este navegador; de lo contrario, utiliza setTimeout con ~60 fps
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

      // Detiene posiblemente la animación en ejecución
      if (window.cancelAnimationFrame && marker.AT_animationHandler) {
        window.cancelAnimationFrame(marker.AT_animationHandler);
      } else if (marker.AT_animationHandler) {
        clearTimeout(marker.AT_animationHandler);
      }

      animateStep(marker, new Date().getTime());
    }
  }
}
