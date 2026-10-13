import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { toCameraError } from "@/lib/cameraError.ts";
import { useRuntimeStore } from "@/store/runtimeStore.ts";
import { useSettingsStore } from "@/store/settingsStore.ts";

async function openStream(deviceId: string): Promise<MediaStream> {
  const video: MediaTrackConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };
  if (deviceId) video.deviceId = { exact: deviceId };
  else video.facingMode = "user";

  try {
    return await navigator.mediaDevices.getUserMedia({ audio: false, video });
  } catch (error) {
    if (deviceId && error instanceof DOMException && error.name === "OverconstrainedError") {
      return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
    }
    throw error;
  }
}

export function useCamera(videoRef: RefObject<HTMLVideoElement | null>) {
  const streamRef = useRef<MediaStream | null>(null);
  const generationRef = useRef(0);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const video = videoRef.current;
    if (video) video.srcObject = null;
  }, [videoRef]);

  const stop = useCallback(() => {
    generationRef.current += 1;
    stopTracks();
    useRuntimeStore.getState().setCamera("off", null);
    useRuntimeStore.getState().setTracking(false, null);
  }, [stopTracks]);

  const start = useCallback(async () => {
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    stopTracks();

    if (!navigator.mediaDevices?.getUserMedia) {
      useRuntimeStore.getState().setCamera("error", "unsupported");
      return;
    }

    useRuntimeStore.getState().setCamera("starting", null);
    try {
      const stream = await openStream(useSettingsStore.getState().cameraDeviceId);
      if (generationRef.current !== generation) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const video = videoRef.current;
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        useRuntimeStore.getState().setCamera("error", "unknown");
        return;
      }

      video.muted = true;
      video.srcObject = stream;
      streamRef.current = stream;
      if (generationRef.current !== generation) {
        stopTracks();
        return;
      }

      // Show the preview as soon as the stream exists. play() can stay pending
      // until the first frame, which would otherwise leave the UI on "Starting".
      useRuntimeStore.getState().setCamera("on", null);
      void video.play().catch((playError: unknown) => {
        if (generationRef.current !== generation) return;
        if (playError instanceof DOMException && playError.name === "AbortError") return;
        stopTracks();
        useRuntimeStore.getState().setCamera("error", toCameraError(playError));
      });
    } catch (error) {
      if (generationRef.current !== generation) return;
      stopTracks();
      useRuntimeStore.getState().setCamera("error", toCameraError(error));
    }
  }, [stopTracks, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      generationRef.current += 1;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (video) video.srcObject = null;
      useRuntimeStore.getState().setCamera("off", null);
      useRuntimeStore.getState().setTracking(false, null);
    };
  }, [videoRef]);

  return { start, stop };
}

export function useVideoDevices(): MediaDeviceInfo[] {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const camera = useRuntimeStore((state) => state.camera);

  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) return undefined;

    let cancelled = false;
    const load = () => {
      void navigator.mediaDevices.enumerateDevices().then((listed) => {
        if (!cancelled) setDevices(listed.filter((device) => device.kind === "videoinput"));
      });
    };

    load();
    navigator.mediaDevices.addEventListener("devicechange", load);
    return () => {
      cancelled = true;
      navigator.mediaDevices.removeEventListener("devicechange", load);
    };
  }, [camera]);

  return devices;
}
