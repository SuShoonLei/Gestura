export type CameraErrorCode = "denied" | "not-found" | "in-use" | "unsupported" | "unknown";

export const CAMERA_ERROR_COPY: Record<CameraErrorCode, { title: string; detail: string }> = {
  denied: {
    title: "Camera permission blocked",
    detail:
      "Allow camera access in the browser site settings, then try again. On macOS, also check System Settings, Privacy & Security, Camera.",
  },
  "not-found": {
    title: "No camera found",
    detail: "Connect a camera, or pick a different one in Settings.",
  },
  "in-use": {
    title: "Camera is in use",
    detail: "Another app is using the camera. Close it, then try again.",
  },
  unsupported: {
    title: "Camera unavailable",
    detail: "Open Gestura on localhost or HTTPS in a current version of Chrome, Edge, Firefox, or Safari.",
  },
  unknown: {
    title: "Could not start the camera",
    detail: "Check the connection and try again.",
  },
};

export function toCameraError(error: unknown): CameraErrorCode {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return "unsupported";
  }
  if (!(error instanceof DOMException)) return "unknown";

  switch (error.name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
    case "SecurityError":
      return "denied";
    case "NotFoundError":
    case "DevicesNotFoundError":
    case "OverconstrainedError":
      return "not-found";
    case "NotReadableError":
    case "TrackStartError":
      return "in-use";
    default:
      return "unknown";
  }
}
