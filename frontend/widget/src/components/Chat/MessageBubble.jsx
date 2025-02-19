// MessageBubble.jsx
import { Avatar, Paper } from '@mui/material';  // 必要最小限のコンポーネントのみ残す
import aiAvatar from '../../assets/images/ai-avatar.png';

function MessageBubble({ type, content }) {
  const isBot = type === 'bot';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        marginBottom: '16px',
        maxWidth: '100%'
      }}
    >
      {isBot && (
        <Avatar 
          src={aiAvatar}
          alt="AI Assistant"
          sx={{ 
            width: 48,
            height: 48,
            '& img': {
              objectFit: 'cover'
            }
          }}
        />
      )}

      <Paper
        elevation={1}
        sx={{
          padding: '16px',
          maxWidth: '80%',
          backgroundColor: isBot ? '#f5f5f5' : '#ff502b',
          color: isBot ? '#000000' : '#ffffff',
          borderRadius: '8px',
          borderTopLeftRadius: isBot ? 0 : '8px',
          borderTopRightRadius: isBot ? '8px' : 0,
          wordBreak: 'break-word'
        }}
      >
        <div style={{ 
          whiteSpace: 'pre-wrap',
          lineHeight: 1.5,
          fontSize: '1rem'
        }}>
          {content}
        </div>
      </Paper>

      {!isBot && <div style={{ width: '32px' }} />}
    </div>
  );
}

export default MessageBubble;