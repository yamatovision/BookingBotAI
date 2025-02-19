import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PropTypes from 'prop-types';

const CodeDisplay = ({ embedCode, onCopy }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        埋め込みコード
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={embedCode}
          InputProps={{
            readOnly: true,
            sx: { 
              fontFamily: 'monospace',
              bgcolor: 'grey.50'
            }
          }}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<ContentCopyIcon />}
          onClick={onCopy}
        >
          コードをコピー
        </Button>
      </Paper>
    </Box>
  );
};

CodeDisplay.propTypes = {
  embedCode: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
};

export default CodeDisplay;