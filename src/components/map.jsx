
// La función useMediaQuery fue obtenida de https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
// isMobile: https://stackoverflow.com/questions/21660369/detectmobilebrowsers-how-to-add-ipad-co-detect-mobile-browsers-js

import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
const ENDPOINT = "wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl";
import { Container, Modal } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup , Circle, CircleMarker, Polyline, Polygon, Rectangle} from 'react-leaflet'
import { Icon } from 'leaflet'
import colors from '../styles/colors';
import '../styles/map.css';
import planeColors from '../styles/plane-colors';

const myIcon = new Icon({
  iconUrl: '/airplane.png',
  iconSize: [22, 22],
  iconAnchor: [22, 22],
  popupAnchor: [-3, -76],
  // shadowUrl: 'my-icon-shadow.png',
  // shadowSize: [68, 95],
  // shadowAnchor: [22, 94]
});

const reorderPositions = (positionsToSort) => {
  const temporalSortedPositions = {};
  positionsToSort.map((history) => {
    const { code, position } = history;
    if (!temporalSortedPositions[code]) {
      temporalSortedPositions[code] = [];
    }
    temporalSortedPositions[code].push(position)
  });
  return temporalSortedPositions;
}

const center = [51.505, -0.09]


const Map = ({ height, width, isMobile, flights, positions }) => {

  const [flightInfo, setFligthInfo] = useState({code: '', passengers: [], plane: ''});
  const [showPlaneInfo, setShowPlaneInfo] = useState(false);
  const sortedPositions = reorderPositions(positions);


  const setPlaneInfo = (plane) => {
    setFligthInfo(plane);
    setShowPlaneInfo(true)
    console.log(plane, showPlaneInfo)
  }
  
  return (
    <Container>
      <Modal show={showPlaneInfo}>
        <Container>
          <h2>Pasajeros</h2>
          {flightInfo.passengers.map(passenger => (
            <p>{passenger.name} - {passenger.age}</p>
          ))}
        </Container>
      </Modal>
      <MapContainer center={center} zoom={1} minZoom={1} scrollWheelZoom={true} po style={{height: height/2, width: width/2}}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.keys(sortedPositions).map((code, index) => {
          const actualFlight = flights[code];
          const line = [
            actualFlight.origin,
            actualFlight.destination,
          ]
          const path = { color: planeColors[(index % 20).toString()].theorical, weight: '1', dashArray: '2, 2', dashOffset: '2' };
          return (
            <Polyline key={code} pathOptions={path} positions={line} />
            )
        })}
        {Object.keys(sortedPositions).map((code, index) => {
          const flightPositions = sortedPositions[code];
          const path = { color: planeColors[(index % 20).toString()].actual, width: '3' };
          return (
            <Polyline key={code} pathOptions={path} positions={flightPositions} />
            )
          })}

        {Object.keys(sortedPositions).map((code) => {
          const flightPositions = sortedPositions[code];
          const actualPosition = flightPositions[flightPositions.length - 1];
          const actualFlight = flights[code];
          // console.log(actualFlight)
          return (
            <Marker position={actualPosition} icon={myIcon}>
              <Popup>
                Vuelo {actualFlight.code}
                <br />
                {actualFlight.plane}
                <br />
                {actualFlight.seats}
                <br />
                <a onClick={() => setPlaneInfo(actualFlight)}>Ver más</a>
              </Popup>
            </Marker>
            )
          })}
      </MapContainer>,
    </Container>
  )
};

const styles = {};

export default Map;
