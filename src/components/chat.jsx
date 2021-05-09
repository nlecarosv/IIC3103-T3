// La función useMediaQuery fue obtenida de https://stackoverflow.com/questions/19014250/rerender-view-on-browser-resize-with-react
// isMobile: https://stackoverflow.com/questions/21660369/detectmobilebrowsers-how-to-add-ipad-co-detect-mobile-browsers-js

import React from 'react';
import { Container, Input, InputGroup, Icon } from 'rsuite';
import colors from '../styles/colors';
import moment from 'moment';

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
  horizontallStructure,
}) => {

  const styles = {
    generalContainer: {
      margin: 5,
      backgroundColor: 'green',
      height: horizontallStructure ? height - 30 : (height - 30)/2,
    },
  };
  
  return (
    <Container style={styles.generalContainer}>
      {isLoadingChat  ? (
        <Container>
          <h1>CARGANDO</h1>
        </Container>
      ): (
        <Container style={{flex: 1}}>
          <Container>
            <h2>Chat</h2>
          </Container>
          <InputGroup inside style={{flex: 1}}>
            <Input
              placeholder={'Usuario'}
              value={nickName}
              onChange={setNickName}
            />
            <InputGroup.Button>
              <Icon icon="user" />
            </InputGroup.Button>
          </InputGroup>
          <Container style={{
            backgroundColor: 'gray',
            padding: 20,
            flex: 20,
            }}>
            {messages.map((message, index) => {
              const date = moment(message.date).format('DD/MM/YYYY hh:mm')
              const { name: userName, message: textMessage } = message;
              if (message.name === nickName) {
                return(
                  <Container key={index.toString()} style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    wordWrap: 'break-word',
                }}>
                  <p>{date}</p>
                  <p style={{wordWrap: 'break-word'}}>{textMessage}</p>
                  </Container>
                )
              } 
              return(
                <Container key={index.toString()} style={{
                  backgroundColor: 'lightgray',
                  borderRadius: 10,
                  wordWrap: 'break-word',
                  }}>
                  <p>{date}</p>
                  <p style={{wordWrap: 'break-word'}}>{userName}: {textMessage}</p>
                </Container>
              )
            })}
          </Container>
          <InputGroup  inside style={styles}>
            <Input placeholder={'Mensaje'} value={newMessage} onChange={setNewMessage} onPressEnter={handleMessage}/>
            <InputGroup.Button style={{backgroundColor: colors.gray}}>
              <Icon icon="send" />
            </InputGroup.Button>
          </InputGroup>
        </Container>
      )}
    </Container>
  )
};


export default Chat;
