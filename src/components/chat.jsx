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
      // backgroundColor: 'green',
      height: horizontallStructure ? height - 30 : (height - 30)/2,
    },
  };
  console.log(width, width/ 3 + 40)
  return (
    <Container style={styles.generalContainer}>
      {isLoadingChat  ? (
        <Container>
          <h1>CARGANDO</h1>
        </Container>
      ): (
        <Container style={{
          flex: 1, 
          backgroundColor: colors.black,
          marginTop: horizontallStructure ? -15 : 0,
          marginBottom: horizontallStructure ? -15 : 0,
          paddingTop: horizontallStructure ? 15 : 10,
          paddingBottom: horizontallStructure ? 15 : 10,
          marginRight: horizontallStructure ? -15 : 0,
          paddingRight: horizontallStructure ? 15 : 10,
          paddingLeft: horizontallStructure ? 15 : 10,
          borderRadius: horizontallStructure ? 0 : 10,
          maxWidth: horizontallStructure ? width/ 2: width - 100 - 30,
          }}>
          <Container>
            <h2 style={{color: colors.white}}>Chat</h2>
          </Container>
          <InputGroup inside>
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
            // backgroundColor: 'gray',
            padding: 20,
            overflowY: 'scroll',
            maxHeight: horizontallStructure ? height - 2*36 - 50 - 30 : height/2 - 2*36 - 50 - 30,
            height: horizontallStructure ? height - 2*36 - 50 - 30 : height/2 - 2*36 - 50 - 30,
            }}>
            {messages.map((message, index) => {
              const date = moment(message.date).format('DD/MM/YYYY hh:mm')
              const { name: userName, message: textMessage } = message;
              if (message.name === nickName) {
                return(
                  <Container key={index.toString()} style={{
                    backgroundColor: colors.lightBlue,
                    borderRadius: 10,
                    wordWrap: 'break-word',
                    marginBottom: 5,
                    padding: 5,
                    marginLeft: 100,
                    justifySelf: 'start',
                    // maxHeight: 60,
                    // width: horizontallStructure ? width/ 3 - 100 - 30 : width - 100 - 30,
                  maxWidth: horizontallStructure ? width/ 3 + 20 : width - 100 - 30,
                    // maxWidth: horizontallStructure ? width/ 3 : width - 100 - 30,

                }}>
                  <Container style={{flexDirection: 'row-reverse'}}>
                    <p>{date}</p>
                  </Container>
                  <p style={{wordWrap: 'break-word'}}>{textMessage}</p>
                  </Container>
                )
              } 
              return(
                <Container key={index.toString()} style={{
                  backgroundColor: 'lightgray',
                  borderRadius: 10,
                  wordWrap: 'break-word',
                  marginBottom: 5,
                  padding: 5,
                  marginRight: 100,
                  // maxHeight: 60,
                  // width: horizontallStructure ? width/ 3 + 30 : width - 100 - 30,
                  maxWidth: horizontallStructure ? width/ 3 + 20 : width - 100 - 30,
                  }}>
                  <Container style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <p style={{alignSelf: 'flex-end'}}><b>{userName}</b></p>
                    <p>{date}</p>
                  </Container>
                  <p style={{wordWrap: 'break-word'}}> {textMessage}</p>
                </Container>
              )
            })}
          </Container>
          <InputGroup  inside style={styles}>
            <Input placeholder={'Mensaje'} value={newMessage} onChange={setNewMessage} onPressEnter={handleMessage}/>
            <InputGroup.Button style={{backgroundColor: colors.gray}} onClick={handleMessage}> 
              <Icon icon="send" />
            </InputGroup.Button>
          </InputGroup>
        </Container>
      )}
    </Container>
  )
};


export default Chat;
