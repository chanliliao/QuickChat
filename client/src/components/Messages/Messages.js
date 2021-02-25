import React, { useEffect, useRef } from 'react';
import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name }) => {
  const msgEndRef = useRef(null);

  const scrollToBottom = () => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='messages'>
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} name={name} />
        </div>
      ))}
      <div ref={msgEndRef} />
    </div>
  );
};

export default Messages;
