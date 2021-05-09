// La función useMediaQuery fue obtenida de https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
// isMobile: https://stackoverflow.com/questions/21660369/detectmobilebrowsers-how-to-add-ipad-co-detect-mobile-browsers-js

import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
const ENDPOINT = "wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl";
import { Container } from 'rsuite';
import Map from './map';
import colors from '../styles/colors';

const Home = ({ height, width, isMobile }) => {
  const [isLoadingFlights, setIsLoadingFlights] = useState(true);
  const [isSocketOn, setIsSocketOn] = useState(false);
  const [flights, setFlights] = useState({})
  const [positions, setPositions] = useState([]);
  const [sortedPositions, setSortedPositions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickName, setNickName] = useState('User123');
  const debug = false;
  let socket;

  const handlePositions = (message) => {
    const { code } = message;
    if (!flights[code]) {
      socket.emit('FLIGHTS');
    }
    positions.push(message);
    setPositions(positions);
  }
  
  const formatFlights = (data) => {
    const temporalFlights = {};
    data.map(flight => {
      temporalFlights[flight.code] = flight;
    });
    setFlights(temporalFlights);
  }

  const setUpSocket = () => {
    socket = io(ENDPOINT, {
      path: '/flights'
    });
    socket.on('FLIGHTS', (message) => {
      formatFlights(message)    
    })
    socket.on('CHAT', (message) => {
      console.log('MENSAJE', message)    
    })
    socket.on('POSITION', (message) => {
      handlePositions(message)
    })
    socket.emit('FLIGHTS');
  }
  
  const disconnectSocket = () => {
    console.log('DISCONECTED')
    socket.disconnect();
  }

  useEffect(() => {
    setUpSocket();
    if (debug) {
      setTimeout(() => {
        disconnectSocket()
      }, 10000);
    }
    return () => disconnectSocket();
  }, []);
  
  useEffect(() => {
    if (flights) {
      setIsLoadingFlights(false)
    };
  }, [flights]);

  // useEffect(() => reorderedPositions(), [positions])

  return (
    <Container >
      {isLoadingFlights  ? (
        <Container>
          <h1>CARGANDO</h1>
        </Container>
      ): (
        <Container>
          <Map
            height={height}
            width={width}
            positions={positions}
            flights={flights}
            />
        </Container>
      )};
    </Container>
  )
};

const styles = {};

export default Home;
