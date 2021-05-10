// La función useMediaQuery fue obtenida de https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
// isMobile: https://stackoverflow.com/questions/21660369/detectmobilebrowsers-how-to-add-ipad-co-detect-mobile-browsers-js

import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
const ENDPOINT = "wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl";
import { Alert, Container, Modal } from 'rsuite';
import Map from './map';
import Chat from './chat';
import colors from '../styles/colors';

const Home = ({ height, width, isMobile }) => {
  const [isLoadingFlights, setIsLoadingFlights] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [flights, setFlights] = useState({})
  const [positions, setPositions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickName, setNickName] = useState('User123');
  const debug = false;
  const horizontallStructure = width > 999 && !isMobile;
  var socket;

  const handleMessage = () => {
    if (nickName.length > 0) {
      if (newMessage.length > 0) {
        if (!socket) {
          const newSocket = io(ENDPOINT, {
            path: '/flights'
          });
          newSocket.emit('CHAT', {
            name: nickName,
            message: newMessage,
            date: '09/05/2021'
          });
          setTimeout(() => {
            newSocket.disconnect()
           } , 10000);
        } else {
          socket.emit('CHAT', {
            name: nickName,
            message: newMessage,
            date: '09/05/2021'
          });
        }
        setNewMessage('');
      } else {
        Alert.error('Es necesario escribir algo')
      }
    } else {
      Alert.error('Es necesario escribir un nombre de usuario')
    }
  }
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
      messages.push(message)
      setMessages(messages);   
    })
    socket.on('POSITION', (message) => {
      handlePositions(message)
    })
    socket.emit('FLIGHTS');
    setIsLoadingChat(false);
  }
  
  const disconnectSocket = () => {
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

  return (
    <Container style={{padding: 10, width, overflowX: 'hidden'}}>
      {isLoadingFlights  ? (
        <Container>
          <h1>CARGANDO</h1>
        </Container>
      ): (
        <Container style={{flexDirection: width > 999 && !isMobile ? 'row' : 'column'}}>
          <Map
            height={height}
            width={width}
            positions={positions}
            flights={flights}
            horizontallStructure={horizontallStructure}
            isLoadingFlights={isLoadingFlights}
            />
          <Chat
            height={height}
            width={width}
            handleMessage={handleMessage}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            nickName={nickName}
            setNickName={setNickName}
            horizontallStructure={horizontallStructure}
            />
        </Container>
      )}
    </Container>
  )
};

const styles = {};

export default Home;
