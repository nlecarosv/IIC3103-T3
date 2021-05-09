// La función useMediaQuery fue obtenida de https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
// isMobile: https://stackoverflow.com/questions/21660369/detectmobilebrowsers-how-to-add-ipad-co-detect-mobile-browsers-js

import React from 'react';
import { Container, Input, InputGroup, Icon } from 'rsuite';
import colors from '../styles/colors';

const Chat = ({
  height,
  width,
  isMobile,
  messages,
  setNewMessage,
  newMessage,
  handleMessage,
  nickName,
  setNickName,
  isLoadingChat,
}) => {

  return (
    <Container >
      {isLoadingChat  ? (
        <Container>
          <h1>CARGANDO</h1>
        </Container>
      ): (
        <Container>
          <Container>
            <h2>Chat</h2>
          </Container>
          <InputGroup  inside style={styles}>
            <Input placeholder={'Usuario'} value={nickName} onChange={setNickName}/>
            <InputGroup.Button>
              {/* <Icon icon="user" /> */}
            </InputGroup.Button>
          </InputGroup>
          <Container style={{backgroundColor: 'gray', padding: 20}}>
            {messages.map((message, index) => {
              if (message.name === nickName) {
                return(
                  <Container key={index.toString()}>
                    <h4>{message.message} - {message.date}</h4>
                  </Container>
                )
              } 
              return(
                <Container key={index.toString()}>
                  <h4>{message.name}: {message.message} - {message.date}</h4>
                </Container>
              )
            })}
          </Container>
          <InputGroup  inside style={styles}>
            <Input placeholder={'Mensaje'} value={newMessage} onChange={setNewMessage} onPressEnter={handleMessage}/>
            <InputGroup.Button>
              {/* <Icon icon="user" /> */}
            </InputGroup.Button>
          </InputGroup>
        </Container>
      )};
    </Container>
  )
};

const styles = {};

export default Chat;
