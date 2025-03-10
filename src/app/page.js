/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { Camera } from "react-camera-pro";
import { useGeolocated } from "react-geolocated";
import useGeolocation from "react-hook-geolocation";

export default function Home() {
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [coordinate, setCoordinate] = useState({
    latitude: 0,
    longitude: 0,
    previousLatitude: 0,
    previousLongitude: 0,
    accuracy: 0,
  });
  const [originCoor, setOriginCoor] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [latitudeArray, setLatitudeArray] = useState([]);
  const [longitudeArray, setLongitudeArray] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isCoorGet, setIsCoorGet] = useState(false);
  const canvasRef = useRef(null);
  const [size, setSize] = useState(100); // Size of the square
  const [x, setX] = useState(20); // X position
  const [y, setY] = useState(20); // Y position
  const [errorText, setErrorText] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [startText, setStartText] = useState("");
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [latitudeInterval, setLatitudeInterval] = useState(0);
  const [longitudeInterval, setLongitudeInterval] = useState(0);
  // console.log("origin", parseFloat(latitudeInterval) + parseFloat(originCoor.latitude));

  // console.log("lat", isNaN(latitudeInterval))

  const geolocation = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 1000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (isStarted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (
          parseFloat(latitudeInterval) != 0 &&
          parseFloat(longitudeInterval) == 0
        ) {
          // latInter minus
          if (parseFloat(latitudeInterval) < 0) {
            // current lat is lower then latInter + origin lat
            if (
              parseFloat(latitudeInterval) + parseFloat(originCoor.latitude) >
              coordinate.latitude
            ) {
              if (coordinate.latitude > coordinate.previousLatitude) {
                setSize(size - 1);
              } else if (coordinate.latitude < coordinate.previousLatitude) {
                setSize(size + 1);
              }
            }
          } else {
            // latInter plus
            if (
              // current lat is higher then latInter + origin lat
              parseFloat(latitudeInterval) + parseFloat(originCoor.latitude) <
              coordinate.latitude
            ) {
              if (coordinate.latitude > coordinate.previousLatitude) {
                setSize(size + 1);
              } else if (coordinate.latitude < coordinate.previousLatitude) {
                setSize(size - 1);
              }
            }
          }
        } else if (
          // Only longitude measurement
          parseFloat(latitudeInterval) == 0 &&
          parseFloat(longitudeInterval) != 0
        ) {
          // longInter minus
          if (parseFloat(longitudeInterval) < 0) {
            // current long is lower then longInter + origin long
            if (
              parseFloat(longitudeInterval) + parseFloat(originCoor.longitude) >
              coordinate.longitude
            ) {
              if (coordinate.longitude > coordinate.previousLongitude) {
                setSize(size - 1);
              } else if (coordinate.longitude < coordinate.previousLongitude) {
                setSize(size + 1);
              }
            }
          } else {
            // longInter plus
            if (
              // current long is higher then longInter + origin long
              parseFloat(longitudeInterval) + parseFloat(originCoor.longitude) <
              coordinate.longitude
            ) {
              if (coordinate.longitude > coordinate.previousLongitude) {
                setSize(size + 1);
              } else if (coordinate.longitude < coordinate.previousLongitude) {
                setSize(size - 1);
              }
            }
          }
        } else if (
          // lat long interval measurement
          parseFloat(latitudeInterval) != 0 ||
          parseFloat(longitudeInterval) != 0
        ) {
          if (
            // latInter minus && longInter minus
            parseFloat(latitudeInterval) < 0 &&
            parseFloat(longitudeInterval) < 0
          ) {
            if (
              parseFloat(latitudeInterval) + parseFloat(originCoor.latitude) >
                coordinate.latitude &&
              parseFloat(longitudeInterval) + parseFloat(originCoor.longitude) >
                coordinate.longitude
            ) {
              if (
                coordinate.longitude > coordinate.previousLongitude &&
                coordinate.latitude > coordinate.previousLatitude
              ) {
                setSize(size - 1);
              } else if (
                coordinate.longitude < coordinate.previousLongitude &&
                coordinate.latitude < coordinate.previousLatitude
              ) {
                setSize(size + 1);
              }
            }
          } else if (
            // latInter plus && longInter plus
            parseFloat(latitudeInterval) > 0 &&
            parseFloat(longitudeInterval) > 0
          ) {
            if (
              parseFloat(latitudeInterval) + parseFloat(originCoor.latitude) <
                coordinate.latitude &&
              parseFloat(longitudeInterval) + originCoor.longitude <
                coordinate.longitude
            ) {
              if (
                coordinate.longitude > coordinate.previousLongitude &&
                coordinate.latitude > coordinate.previousLatitude
              ) {
                setSize(size + 1);
              } else if (
                coordinate.longitude < coordinate.previousLongitude &&
                coordinate.latitude < coordinate.previousLatitude
              ) {
                setSize(size - 1);
              }
            }
          }
          //  else if (
          //   // latInter minus && longInter plus
          //   parseFloat(latitudeInterval) < 0 &&
          //   parseFloat(longitudeInterval) > 0
          // ) {
  
          // } else {
          //   // latInter plus && longInter minus
          // }
        }
        // Set stroke color and width
        ctx.fillStyle = "green"; // Set color for the outline
        ctx.lineWidth = 1; // Set width of the outline
  
        // Draw the outlined square
        ctx.fillRect(x, y, size, size);
      }
      
      if (!isStarted) {
        ctx.fillStyle = "green"; // Set color for the outline
        ctx.lineWidth = 1; // Set width of the outline
  
        // Draw the outlined square
        ctx.fillRect(x, y, size, size);
      }

      // only latInter measurement
      // Draw the outline of the square
    }
  }, [
    coordinate.latitude,
    coordinate.previousLatitude,
    coordinate.longitude,
    coordinate.previousLongitude,
  ]);

  useEffect(() => {
    function getPermission() {
      // await navigator.permissions.query({ name: "camera" }).then((result) => {
      //   if (result.state === "granted") {
      //     setCameraPermission(true);
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          setLocationPermission(true);
        } else {
          setLocationPermission(false);
          setErrorText("Location Permission denied!");
        }
      });
      // } else if (result.state == "prompt") {
      //   setCameraPermission(false);
      //   setCameraError("Camera Permission denied!");
      // }
      // });
    }
    getPermission();
  }, []);

  useEffect(() => {
    if (locationPermission) {
      // if (!isCoorGet) {
      //   setOriginCoor({
      //     latitude: geolocation.latitude,
      //     longitude: geolocation.longitude
      //   })
      // }
      // setIsCoorGet(true);
      var latitudeArray1 = [...latitudeArray];
      var longitudeArray1 = [...longitudeArray];
      if (latitudeArray.length < 7 && longitudeArray.length < 7) {
        latitudeArray1.push(geolocation.latitude);
        longitudeArray1.push(geolocation.longitude);
        setLatitudeArray(latitudeArray1);
        setLongitudeArray(longitudeArray1);
      } else {
        latitudeArray1.shift();
        longitudeArray1.shift();
        latitudeArray1.push(geolocation.latitude);
        longitudeArray1.push(geolocation.longitude);
        setLatitudeArray(latitudeArray1);
        setLongitudeArray(longitudeArray1);
        var TotalLatitude = latitudeArray1.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        var TotalLongitude = longitudeArray1.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        var averageLatitude = TotalLatitude / latitudeArray1.length;
        var averageLongitude = TotalLongitude / longitudeArray1.length;

        setCoordinate((prev) => {
          return {
            latitude: averageLatitude.toFixed(8),
            longitude: averageLongitude.toFixed(8),
            previousLatitude: prev.latitude,
            previousLongitude: prev.longitude,
            accuracy: geolocation.accuracy,
          };
        });
      }
      // setLatitude(geolocation.latitude);
      // setLongitude(geolocation.longitude);
    } else {
      console.log("need permission");
    }

    // const successCallback = (position) => {
    //   console.log("callBack")
    //   var latitudeArray1 = [...latitudeArray];
    //   var longitudeArray1 = [...longitudeArray];
    //   if (latitudeArray.length < 7 && longitudeArray.length < 7) {
    //     latitudeArray1.push(parseFloat(position.coords.latitude).toFixed(8));
    //     longitudeArray1.push(parseFloat(position.coords.longitude).toFixed(8));
    //     setLatitudeArray(latitudeArray1);
    //     setLongitudeArray(longitudeArray1);
    //   } else {
    //     setStartText("Square measurement is starting!");
    //     latitudeArray1.shift();
    //     longitudeArray1.shift();
    //     latitudeArray1.push(parseFloat(position.coords.latitude).toFixed(8));
    //     longitudeArray1.push(parseFloat(position.coords.longitude).toFixed(8));
    //     setLatitudeArray(latitudeArray1);
    //     setLongitudeArray(longitudeArray1);
    //     var TotalLatitude = latitudeArray1.reduce(
    //       (accumulator, currentValue) => accumulator + currentValue,
    //       0
    //     );
    //     var TotalLongitude = longitudeArray1.reduce(
    //       (accumulator, currentValue) => accumulator + currentValue,
    //       0
    //     );
    //     var averageLatitude = TotalLatitude / latitudeArray1.length;
    //     var averageLongitude = TotalLongitude / longitudeArray1.length;

    //     setCoordinate((prev) => {
    //       return {
    //         latitude: averageLatitude.toFixed(8),
    //         longitude: averageLongitude.toFixed(8),
    //         previousLatitude: prev.latitude,
    //         previousLongitude: prev.longitude,
    //         accuracy: position.coords.accuracy,
    //       };
    //     });
    //   }
    //   if (!isStarted) {
    //     console.log("isStarted ===>")
    //     setOriginCoor({
    //       latitude: parseFloat(position.coords.latitude),
    //       longitude: parseFloat(position.coords.longitude)
    //     })
    //   }
    //   setIsStarted(true);
    // };

    // const errorCallback = (error) => {
    //   console.error("Error getting location: ", error);
    // };

    // // Check if geolocation is supported
    // if (navigator.geolocation) {
    //   console.log("navigator")
    //   const watchId = navigator.geolocation.watchPosition(
    //     successCallback,
    //     errorCallback
    //   );

    //   // Cleanup function to stop watching position
    //   return () => {
    //     navigator.geolocation.clearWatch(watchId);
    //   };
    // } else {
    //   console.error("Geolocation is not supported by this browser.");
    // }
  }, [geolocation, locationPermission]);

  const startMeasurement = () => {
    setIsStarted(true);
    setStartText("Square measurement is starting!");
    setOriginCoor({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <div style={{ position: "relative" }}>
        <Camera
          ref={camera}
          numberOfCamerasCallback={setNumberOfCameras}
          facingMode="environment"
          aspectRatio={4 / 3}
        />
      </div>
      <canvas
        style={{ position: "absolute", top: 100, left: 100 }}
        ref={canvasRef}
      />
      <div style={{ marginLeft: 10, lineHeight: 1.2 }}>
        {startText ? (
          <p style={{ color: "green" }}>{startText}</p>
        ) : (
          <p style={{ color: "red" }}>
            Measurement Loading. Please wait ........
          </p>
        )}
        <div style={{ display: "flex", flexDirection: "column", width: 250 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              color: "black",
              height: 30,
            }}
          >
            <label>Latitude Interval: </label>
            <input
              id="latitudeInterval"
              style={{ marginLeft: 20, width: 80 }}
              type="text"
              value={latitudeInterval}
              onChange={(e) => setLatitudeInterval(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              color: "black",
              height: 30,
            }}
          >
            <label>Longitude Interval: </label>
            <input
              id="longitudeInterval"
              style={{ marginLeft: 20, width: 80 }}
              type="text"
              value={longitudeInterval}
              onChange={(e) => setLongitudeInterval(e.target.value)}
            />
          </div>
        </div>

        <p style={{ color: "black" }}>Latitude: {coordinate.latitude}</p>
        {/* <p style={{ color: "black" }}>
          Pre Latitude: {coordinate.previousLatitude}
        </p> */}
        <p style={{ color: "black" }}>Longitude: {coordinate.longitude}</p>
        {/* <p style={{ color: "black" }}>
          Pre Longitude: {coordinate.previousLongitude}
        </p> */}
        <p style={{ color: "black" }}>
          Origin Latitude: {originCoor.latitude}
        </p>
        <p style={{ color: "black" }}>
          Latitude Interval Calculated:{" "}
          {originCoor.latitude == 0
            ? 0
            : parseFloat(latitudeInterval) + parseFloat(originCoor.latitude)}
        </p>
        <p style={{ color: "black" }}>
          Origin Longitude: {originCoor.longitude}
        </p>
        <p style={{ color: "black" }}>
          Longitude Interval Calculated:{" "}
          {originCoor.longitude == 0
            ? 0
            : parseFloat(longitudeInterval) + parseFloat(originCoor.longitude)}
        </p>
        {/* <p style={{ color: "black" }}>
          Camera Permission: {cameraPermission ? "granted" : cameraError}
        </p> */}
        <p style={{ color: "black" }}>
          Location Permission: {locationPermission ? "granted" : errorText}
        </p>

        {/* <img src={image} alt="Phote" />
      <button
        onClick={() => {
          const photo = camera.current.takePhoto();
          setImage(photo);
        }}
      >
        Take Photo
      </button> */}
        {/* <button
          // hidden={numberOfCameras <= 1}
          onClick={() => {
            camera.current.switchCamera();
          }}
        >
          Switch Camera
        </button> */}
        <button
          // hidden={numberOfCameras <= 1}
          style={{width: 100, padding: 5, backgroundColor: 'green', color: "white"}}
          onClick={() => {
            startMeasurement();
          }}
        >
          Start
        </button>
      </div>
    </div>
  );
}
