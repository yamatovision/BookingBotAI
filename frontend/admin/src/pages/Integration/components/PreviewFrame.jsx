import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const PreviewFrame = ({ widgetUrl }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        bgcolor: 'background.paper',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <iframe
        src={widgetUrl}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title="Widget Preview"
      />
    </Box>
  );
};

PreviewFrame.propTypes = {
  widgetUrl: PropTypes.string.isRequired,
};

export default PreviewFrame;