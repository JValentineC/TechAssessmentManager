import React, { useState, useEffect } from "react";
import { FaClock, FaExclamationTriangle } from "react-icons/fa";

const Timer = ({ durationMinutes, onTimeout, startTime, className = "" }) => {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    // Calculate initial time remaining if startTime is provided
    if (startTime) {
      // Ensure UTC parsing by appending 'Z' if not present
      const utcStartTime = startTime.includes("Z")
        ? startTime
        : startTime.replace(" ", "T") + "Z";
      const elapsed = Math.floor(
        (Date.now() - new Date(utcStartTime).getTime()) / 1000
      );
      const remaining = Math.max(0, durationMinutes * 60 - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        onTimeout();
        return;
      }
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }

        // Warning: 10 minutes remaining
        if (newTime <= 600 && newTime > 300) {
          setIsWarning(true);
          setIsCritical(false);
        }
        // Critical: 5 minutes remaining
        else if (newTime <= 300) {
          setIsWarning(false);
          setIsCritical(true);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [durationMinutes, startTime, onTimeout]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerClass = () => {
    if (isCritical) return "timer-critical";
    if (isWarning) return "timer-warning";
    return "timer-normal";
  };

  return (
    <div
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
        isCritical
          ? "bg-red-100 border border-red-500"
          : isWarning
          ? "bg-yellow-100 border border-yellow-500"
          : "bg-gray-100 border border-gray-300"
      } ${className}`}
    >
      {isCritical && <FaExclamationTriangle className="text-red-600" />}
      <FaClock className={getTimerClass()} />
      <span className={`text-lg font-mono font-semibold ${getTimerClass()}`}>
        {formatTime(timeRemaining)}
      </span>
      {isCritical && (
        <span className="text-xs text-red-600 font-medium">
          Time is running out!
        </span>
      )}
    </div>
  );
};

export default Timer;
