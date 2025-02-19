// frontend/admin/src/pages/Integration/ScriptGenerator.jsx
import { useState } from 'react';
import { 
  Box,
  Paper,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  Fade
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function ScriptGenerator() {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const WIDGET_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5174'
    : 'https://aibookingbot-widget.web.app';

  // iframe埋め込みコードの生成
  const generateEmbedCode = () => {
    const code = `<!-- AI Chat Widget -->
<iframe
  src="${WIDGET_URL}"
  style="
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 720px;
    height: 540px;
    max-width: 90vw;
    max-height: 90vh;
    border: none;
    border-radius: 12px;
    z-index: 9999;
    overflow: hidden;"
  allow="microphone"
  title="AI Chat Widget"
></iframe>`;

    return code;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
  };
  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 500 }}>
        ウィジェット埋め込みコード
      </Typography>
  
      {/* プレビュー部分（上部） */}
      <Paper 
        elevation={1} 
        sx={{ 
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          height: '600px',
          mb: 3
        }}
      >
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle2">
            プレビュー
          </Typography>
        </Box>
        <Box sx={{ 
          position: 'relative', 
          height: 'calc(100% - 52px)',
          backgroundColor: theme.palette.grey[50],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Fade in={true} timeout={500}>
            <iframe
              src={WIDGET_URL}
              style={{
                border: 'none',
                width: '720px',
                height: '540px',
                maxWidth: '90%',
                maxHeight: '90%',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              title="Widget Preview"
            />
          </Fade>
        </Box>
      </Paper>
  
      {/* コード表示部分（下部） */}
      <Paper 
        elevation={1} 
        sx={{ 
          width: '100%',
          overflow: 'hidden',
          borderRadius: 2
        }}
      >
        <Box sx={{ p: 2, backgroundColor: theme.palette.grey[100] }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            埋め込みコード
          </Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <SyntaxHighlighter 
            language="html" 
            style={atomDark}
            customStyle={{
              margin: 0,
              borderRadius: '0 0 8px 8px',
              padding: '20px'
            }}
          >
            {generateEmbedCode()}
          </SyntaxHighlighter>
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10 
            }}
          >
            <button
              onClick={handleCopy}
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                padding: '8px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ContentCopyIcon sx={{ color: 'white' }} />
            </button>
          </Box>
        </Box>
      </Paper>
  
      {/* コピー成功通知 */}
      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          コードをクリップボードにコピーしました
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ScriptGenerator;