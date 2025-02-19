import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const SplitLayout = ({ leftContent, rightContent }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        gap: 2,
        height: 'calc(100vh - 100px)', // ヘッダーなどを考慮
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          borderRight: '1px solid',
          borderColor: 'divider',
        }}
      >
        {leftContent}
      </Box>
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
        }}
      >
        {rightContent}
      </Box>
    </Box>
  );
};

SplitLayout.propTypes = {
  leftContent: PropTypes.node.isRequired,
  rightContent: PropTypes.node.isRequired,
};

export default SplitLayout;