export const scheduleManagerStyles = {
  timeSlot: {
    available: {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',  // success.main
      '&:hover': {
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
      }
    },
    reserved: {
      backgroundColor: 'rgba(25, 118, 210, 0.1)',  // primary.main
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
      }
    },
    blocked: {
      backgroundColor: 'rgba(158, 158, 158, 0.1)',  // grey[500]
      '&:hover': {
        backgroundColor: 'rgba(158, 158, 158, 0.2)',
      }
    },
    exception: {
      backgroundColor: 'rgba(255, 152, 0, 0.1)',  // warning.main
      '&:hover': {
        backgroundColor: 'rgba(255, 152, 0, 0.2)',
      }
    }
  },
  weekView: {
    header: {
      today: {
        backgroundColor: 'rgba(25, 118, 210, 0.1)',  // primary.main
        fontWeight: 'bold'
      }
    },
    cell: {
      base: {
        position: 'relative',
        height: 40,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)'  // action.hover
        }
      },
      selected: {
        border: '2px solid rgba(25, 118, 210, 1)'  // primary.main
      }
    }
  },
  dayDetails: {
    slotItem: {
      borderRadius: 1,
      py: 1,
      px: 2,
      mb: 1,
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'  // action.hover
      }
    },
    capacityChip: {
      full: {
        backgroundColor: 'rgba(211, 47, 47, 1)',  // error.main
        color: 'white'
      },
      available: {
        backgroundColor: 'rgba(76, 175, 80, 1)',  // success.main
        color: 'white'
      },
      limited: {
        backgroundColor: 'rgba(255, 152, 0, 1)',  // warning.main
        color: 'white'
      }
    }
  },
  editor: {
    slotPanel: {
      p: 2,
      mb: 2,
      border: 1,
      borderColor: 'divider',
      borderRadius: 1,
      position: 'relative'
    },
    deleteButton: {
      position: 'absolute',
      top: 8,
      right: 8
    }
  }
};

export const getCapacityColor = (available, total) => {
  if (available === 0) return 'full';
  if (available <= total * 0.3) return 'limited';
  return 'available';
};

export const getTimeSlotStyle = (status) => {
  switch (status) {
    case 'available':
      return scheduleManagerStyles.timeSlot.available;
    case 'reserved':
      return scheduleManagerStyles.timeSlot.reserved;
    case 'blocked':
      return scheduleManagerStyles.timeSlot.blocked;
    case 'exception':
      return scheduleManagerStyles.timeSlot.exception;
    default:
      return {};
  }
};