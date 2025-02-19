// ScheduleManager/index.jsx
import { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon
} from '@mui/icons-material';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import WeekView from './WeekView';
import DayDetails from './DayDetails';

function ScheduleManager() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('week');

  const handlePrevWeek = () => {
    setCurrentDate(prev => addWeeks(prev, -1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="h6">
              予約枠管理
            </Typography>
          </Grid>
          <Grid item xs />
          <Grid item>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, value) => value && setViewMode(value)}
              size="small"
            >
              <ToggleButton value="day">日</ToggleButton>
              <ToggleButton value="week">週</ToggleButton>
              <ToggleButton value="month">月</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center">
              <IconButton onClick={handlePrevWeek}>
                <ChevronLeftIcon />
              </IconButton>
              <Tooltip title="今日">
                <IconButton onClick={handleToday}>
                  <TodayIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handleNextWeek}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <WeekView
              currentDate={currentDate}
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <DayDetails
              date={selectedDate}
              onClose={() => setSelectedDate(null)}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ScheduleManager;