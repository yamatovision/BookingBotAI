// src/components/Chat/ChatMessages.jsx
import { Alert } from '@mui/material';  // Box を削除
import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatMessages = ({ messages, error, isProcessing }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const behavior = messages.length <= 1 ? 'auto' : 'smooth';
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}
    >
      <style>
        {`
          .messages-container::-webkit-scrollbar {
            width: 8px;
          }
          .messages-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .messages-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .messages-container::-webkit-scrollbar-thumb:hover {
            background: #666;
          }
        `}
      </style>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            marginBottom: '16px',
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {error}
        </Alert>
      )}

      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          type={message.type}
          content={message.content}
        />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;