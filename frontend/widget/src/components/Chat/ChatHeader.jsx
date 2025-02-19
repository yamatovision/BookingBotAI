// ChatHeader.jsx
import { IconButton, useTheme } from '@mui/material';  // Boxと Typography を削除
import CloseIcon from '@mui/icons-material/Close';

function ChatHeader({ onClose }) {
  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: '#ff502b',
        color: 'white',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{ 
        fontSize: '1.25rem', 
        fontWeight: 500,
        fontFamily: theme.typography.h6.fontFamily 
      }}>
        AIアシスタント

      </div>
      <IconButton 
        size="small" 
        sx={{ 
          color: 'white',
          '&:hover': {
            bgcolor: `${theme.palette.primary.dark}30`
          }
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
    </div>
  );
}

export default ChatHeader;