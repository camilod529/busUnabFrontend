import { CustomMarker } from "../types/types";

export default function animateMarkerTo(
  marker: CustomMarker,
  newPosition: google.maps.LatLngLiteral
) {
  const options = {
    duration: 1000,
    easing: (_x: number, t: number, b: number, c: number, d: number) => {
      // jQuery animation: swing (easeOutQuad)
      return -c * (t /= d) * (t - 2) + b;
    },
  };

  // Save current position. Prefixed to avoid name collisions.
  // Separate for lat/lng to avoid calling lat()/lng() in every frame
  marker["AT_startPosition_lat"] = marker.getPosition()?.lat();
  marker["AT_startPosition_lng"] = marker.getPosition()?.lng();
  const newPosition_lat = newPosition.lat;
  let newPosition_lng = newPosition.lng;

  // Crossing the 180° meridian and going the long way around the earth?
  if (Math.abs(newPosition_lng - marker["AT_startPosition_lng"]!) > 180) {
    if (newPosition_lng > marker["AT_startPosition_lng"]!) {
      newPosition_lng -= 360;
    } else {
      newPosition_lng += 360;
    }
  }

  const animateStep = (startTime: number) => {
    const ellapsedTime = new Date().getTime() - startTime;
    const durationRatio = ellapsedTime / options.duration; // 0 - 1
    const easingDurationRatio = options.easing(durationRatio, ellapsedTime, 0, 1, options.duration);

    if (durationRatio < 1) {
      marker.setPosition({
        lat:
          marker["AT_startPosition_lat"]! +
          (newPosition_lat - marker["AT_startPosition_lat"]!) * easingDurationRatio,
        lng:
          marker["AT_startPosition_lng"]! +
          (newPosition_lng - marker["AT_startPosition_lng"]!) * easingDurationRatio,
      });

      // Use requestAnimationFrame if it exists on this browser. If not, use setTimeout with ~60 fps
      if (window.requestAnimationFrame) {
        marker["AT_animationHandler"] = window.requestAnimationFrame(() => {
          animateStep(startTime);
        });
      } else {
        marker["AT_animationHandler"] = setTimeout(() => {
          animateStep(startTime);
        }, 17);
      }
    } else {
      marker.setPosition(newPosition);
    }
  };

  // Stop possibly running animation
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(marker["AT_animationHandler"]!);
  } else {
    clearTimeout(marker["AT_animationHandler"]);
  }

  animateStep(new Date().getTime());
}
