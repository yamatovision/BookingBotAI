import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material';
import ReservationTable from './components/ReservationTable';
import ScheduleManager from './components/ScheduleManager';
import ReservationSettings from './components/ReservationSettings';
import CalendarSync from './components/CalendarSync';

function ReservationList() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        予約管理
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="予約一覧" />
          <Tab label="予約枠表示" />
          <Tab label="基本設定" />
          <Tab label="カレンダー連携" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && <ReservationTable />}
          {activeTab === 1 && <ScheduleManager />}
          {activeTab === 2 && <ReservationSettings />}
          {activeTab === 3 && <CalendarSync />}
        </Box>
      </Paper>
    </Box>
  );
}

export default ReservationList;