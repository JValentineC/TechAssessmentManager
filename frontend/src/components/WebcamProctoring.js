import React, { useEffect, useRef, useState } from "react";
import { snapshotService } from "../services";
import { FaCamera } from "react-icons/fa";

const WebcamProctoring = ({ assessmentId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null); // Track the snapshot timeout

  useEffect(() => {
    initializeWebcam();
    scheduleRandomSnapshots();

    return () => {
      // Cleanup timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Stop all media tracks
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("🔴 Stopped webcam track:", track.label);
        });
      }

      // Clear video source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]); // Add stream as dependency so cleanup always has latest reference

  const initializeWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error("Webcam error:", err);
      setError("Unable to access webcam. Please check permissions.");
    }
  };

  const scheduleRandomSnapshots = () => {
    const minInterval =
      parseInt(process.env.REACT_APP_SNAPSHOT_INTERVAL_MIN) || 300000; // 5 min
    const maxInterval =
      parseInt(process.env.REACT_APP_SNAPSHOT_INTERVAL_MAX) || 900000; // 15 min

    const scheduleNext = () => {
      const randomDelay =
        Math.floor(Math.random() * (maxInterval - minInterval + 1)) +
        minInterval;

      // Store timeout reference so we can clear it on cleanup
      timeoutRef.current = setTimeout(async () => {
        await captureSnapshot();
        scheduleNext();
      }, randomDelay);
    };

    scheduleNext();
  };

  const captureSnapshot = async () => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      return;
    }

    try {
      setCapturing(true);

      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.8);
      });

      // Upload snapshot
      await snapshotService.capture(assessmentId, blob);

      // Visual feedback
      setTimeout(() => setCapturing(false), 500);
    } catch (error) {
      console.error("Snapshot capture failed:", error);
      setCapturing(false);
    }
  };

  return (
    <>
      {/* Hidden video element */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Proctoring indicator */}
      {stream && !error && (
        <div className="proctoring-active">
          <FaCamera className={capturing ? "text-white" : "text-red-200"} />
          <span className="text-sm font-medium">
            {capturing ? "Capturing..." : "Proctoring Active"}
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-md">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={initializeWebcam}
            className="mt-2 text-xs underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}
    </>
  );
};

export default WebcamProctoring;
