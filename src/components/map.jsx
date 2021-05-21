import React, { useState } from 'react';
import { Container, IconButton, Modal, Icon as IconRsuite, Loader } from 'rsuite';
import { MapContainer, TileLayer, Marker, Popup, Polyline, } from 'react-leaflet'
import { Icon } from 'leaflet'
import '../styles/map.css';
import planeColors from '../styles/plane-colors';
import airplane from '../assets/images/airplane.png'

const myIcon = new Icon({
  iconUrl: airplane,
  iconSize: [22, 22],
  iconAnchor: [1, 1],
  popupAnchor: [-3, -76],
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

const center = [0, 0]


const Map = ({
  height,
  isMobile,
  flights,
  positions,
  horizontallStructure,
  isLoadingFlights,
}) => {

  const [flightInfo, setFligthInfo] = useState({
    code: '',
    passengers: [],
    plane: '',
    origin: [0, 0],
    destination: [0, 0],
    seats: 0,
    airline: ''
  });
  const [showPlaneInfo, setShowPlaneInfo] = useState(false);
  const sortedPositions = reorderPositions(positions);
  
  const setPlaneInfo = (plane) => {
    setFligthInfo(plane);
    setShowPlaneInfo(true)
  }
  
  const styles = {
    generalContainer: {
      flex: horizontallStructure ? 2 : 1,
      margin: 5,
      height: horizontallStructure ? height - 30 : (height - 30)/2,
    },
    closeButton: { alignSelf: 'flex-end',},
    map: {
      height: horizontallStructure ? '100%' : (height - 200)/2,
      borderRadius: 10,
    },
    loader: {
      margin: 100, alignSelf: 'center', justifyContent: 'center',
    },
    center: {alignSelf: 'center'},
  };
  return (
    <Container style={styles.generalContainer}>
      <Modal show={showPlaneInfo} overflow backdrop onHide={() => setShowPlaneInfo(false)}>
        <IconButton
          onClick={() => setShowPlaneInfo(false)}
          circle
          icon={(
            <IconRsuite icon="close"/>
          )}
          size="sm"
          style={styles.closeButton}/>
        <Container>

          <h2 style={styles.center}>Vuelo {flightInfo.code}</h2>
          <p>Código: {flightInfo.code}</p>
          <p>Avión: {flightInfo.plane}</p>
          <p>Aerolínea: {flightInfo.airline}</p>
          <p>Asientos: {flightInfo.seats}</p>
          <p>Origen: ({flightInfo.origin[0]}, {flightInfo.origin[1]})</p>
          <p>Destino: ({flightInfo.destination[0]}, {flightInfo.destination[1]})</p>
          <br/>
          <h3 style={styles.center}>Pasajeros</h3>
          {flightInfo.passengers.map((passenger, index) => (
            <p key={index.toString()}>- {passenger.name}: {passenger.age} años.</p>
          ))}
        </Container>
      </Modal>
      <h2>Mapa de vuelos</h2>
      <Container>
        <p> (*) Presiona sobre un vuelo para ver su información</p>
      </Container>
      {isLoadingFlights ? (
        <Container>
          <Loader
            content="Cargando mapa y vuelos"
            style={styles.loader}  
          />
        </Container>
      ) : (
        <MapContainer center={center} zoom={0} minZoom={1} scrollWheelZoom={true} style={styles.map}>
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
            const path = {
              color: planeColors[(index % 20).toString()].theorical,
              weight: '1',
              dashArray: '2, 2',
              dashOffset: '2'
            };
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
          {Object.keys(sortedPositions).map((code, index) => {
            const flightPositions = sortedPositions[code];
            const actualPosition = flightPositions[flightPositions.length - 1];
            const actualFlight = flights[code];
            return (
              <Marker position={actualPosition} icon={myIcon} key={index.toString()}>
                <Popup>
                  <b>Vuelo {actualFlight.code}</b>
                  <br />
                  Avión: {actualFlight.plane}
                  <br />
                  Asientos: {actualFlight.seats}
                  <br />
                  <a onClick={() => setPlaneInfo(actualFlight)}>Ver más</a>
                </Popup>
              </Marker>
              )
            })}
        </MapContainer>
      )}
    </Container>
  )
};


export default Map;
