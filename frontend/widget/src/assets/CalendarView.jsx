import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { 
  Box, 
  Typography, 
  Button, 
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { ja } from 'date-fns/locale';
import { addDays, format } from 'date-fns';
import { calendarAPI } from "../../../../api";


function CalendarView({ onClose, onSelectDateTime }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedDate) return;
      
      try {
        setLoading(true);
        setError(null);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const slots = await calendarAPI.getAvailableSlots(dateStr);
        setAvailableSlots(slots);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setError('予約可能時間の取得に失敗しました');
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleConfirm = async () => {
    if (selectedDate && selectedTime) {
      const dateStr = format(selectedDate, 'yyyy年MM月dd日');
      const dateTimeStr = `${dateStr} ${selectedTime}`;
      
      try {
        setLoading(true);
        // 予約作成のAPIを呼び出す
        await calendarAPI.createReservation({
          datetime: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`),
          status: 'pending'
        });
        onSelectDateTime?.(dateTimeStr);
      } catch (err) {
        setError('予約の作成に失敗しました');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'auto'
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">ご希望の日時を選択してください</Typography>
      </Box>

      <Box sx={{ p: 2, overflow: 'auto' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <DateCalendar
              value={selectedDate}
              onChange={(newDate) => {
                setSelectedDate(newDate);
                setSelectedTime(null); // 日付変更時に時間選択をリセット
              }}
              minDate={new Date()}
              maxDate={addDays(new Date(), 30)}
              disableHighlightToday={false}
              sx={{ 
                '& .MuiPickersCalendarHeader-root': { mr: 0 },
                '& .MuiDayCalendar-weekDayLabel': { 
                  width: 32,
                  height: 32 
                },
                '& .MuiPickersDay-root': { 
                  width: 32,
                  height: 32 
                }
              }}
            />
          </Box>
        </LocalizationProvider>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {selectedDate && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {format(selectedDate, 'yyyy年MM月dd日')}の予約可能な時間
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Stack 
                direction="row" 
                spacing={1} 
                flexWrap="wrap" 
                sx={{ gap: 1 }}
              >
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? 'contained' : 'outlined'}
                    onClick={() => handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    size="small"
                    sx={{ 
                      minWidth: '80px',
                      opacity: slot.available ? 1 : 0.5
                    }}
                  >
                    {slot.time}
                  </Button>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Box>

      <Box 
        sx={{ 
          p: 2, 
          mt: 'auto', 
          borderTop: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button 
            variant="outlined" 
            onClick={onClose}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button
            variant="contained"
            disabled={!selectedDate || !selectedTime || loading}
            onClick={handleConfirm}
          >
            {loading ? <CircularProgress size={24} /> : '予約する'}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default CalendarView;