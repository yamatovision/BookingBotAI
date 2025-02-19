import { useState, useEffect } from 'react';
import {
Box,
Paper,
Typography,
Grid,
FormControl,
InputLabel,
Select,
MenuItem,
Switch,
FormControlLabel,
Button,
Stack,
Alert,
Divider,
TextField,
Chip
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { calendarAPI } from '../../../../../api';

const DAYS_OF_WEEK = [
{ id: 'monday', label: '月曜日' },
{ id: 'tuesday', label: '火曜日' },
{ id: 'wednesday', label: '水曜日' },
{ id: 'thursday', label: '木曜日' },
{ id: 'friday', label: '金曜日' },
{ id: 'saturday', label: '土曜日' },
{ id: 'sunday', label: '日曜日' }
];

function ReservationSettings() {
  const DEFAULT_CLIENT_ID = 'default';
  const [settings, setSettings] = useState({
    businessHours: {
      monday: { isOpen: true, start: '09:00', end: '17:00', slots: 3 },
      tuesday: { isOpen: true, start: '09:00', end: '17:00', slots: 3 },
      wednesday: { isOpen: true, start: '09:00', end: '17:00', slots: 3 },
      thursday: { isOpen: true, start: '09:00', end: '17:00', slots: 3 },
      friday: { isOpen: true, start: '09:00', end: '17:00', slots: 3 },
      saturday: { isOpen: false, start: '10:00', end: '15:00', slots: 3 },
      sunday: { isOpen: false, start: '10:00', end: '15:00', slots: 3 }
    },
    timeSlotDuration: 60,
    reservationPeriod: {
      start: 1,
      end: 30
    },
    exceptionalDays: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await calendarAPI.getBusinessHours(DEFAULT_CLIENT_ID);
        console.log('Loaded business hours:', response);
        
        if (response) {
          setSettings({
            businessHours: response.businessHours || settings.businessHours,
            timeSlotDuration: response.timeSlotDuration || settings.timeSlotDuration,
            reservationPeriod: response.reservationPeriod || settings.reservationPeriod,
            exceptionalDays: response.exceptionalDays || settings.exceptionalDays
          });
        }
      } catch (err) {
        console.error('Failed to load business hours:', err);
        setError('設定の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await calendarAPI.updateBusinessHours(DEFAULT_CLIENT_ID, settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save business hours:', err);
      setError('設定の保存に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDaySettingChange = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleAddExceptionalDay = (date, isHoliday) => {
    setSettings(prev => ({
      ...prev,
      exceptionalDays: [
        ...prev.exceptionalDays,
        {
          date: format(date, 'yyyy-MM-dd'),
          isHoliday,
          note: ''
        }
      ]
    }));
  };

  const handleTimeSlotDurationChange = (value) => {
    setSettings(prev => ({
      ...prev,
      timeSlotDuration: value
    }));
  };

  const handleReservationPeriodChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      reservationPeriod: {
        ...prev.reservationPeriod,
        [field]: parseInt(value)
      }
    }));
  };

  const handleRemoveExceptionalDay = (index) => {
    setSettings(prev => ({
      ...prev,
      exceptionalDays: prev.exceptionalDays.filter((_, i) => i !== index)
    }));
  };



// rendering部分
if (loading) {
  return <Box sx={{ p: 3 }}>読み込み中...</Box>;
}

return (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
    <Box>
      <Typography variant="h6" gutterBottom>
        予約受付の基本設定
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          設定を保存しました
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          予約枠の設定
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>予約時間枠</InputLabel>
              <Select
                value={settings.timeSlotDuration}
                onChange={(e) => handleTimeSlotDurationChange(e.target.value)}
              >
                <MenuItem value={30}>30分</MenuItem>
                <MenuItem value={60}>1時間</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          曜日ごとの営業時間
        </Typography>

        {DAYS_OF_WEEK.map(({ id, label }) => (
          <Paper key={id} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.businessHours[id].isOpen}
                      onChange={(e) => handleDaySettingChange(id, 'isOpen', e.target.checked)}
                    />
                  }
                  label={label}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TimePicker
                  label="開始時間"
                  value={new Date(`2000-01-01T${settings.businessHours[id].start}`)}
                  onChange={(newValue) => {
                    const timeString = format(newValue, 'HH:mm');
                    handleDaySettingChange(id, 'start', timeString);
                  }}
                  disabled={!settings.businessHours[id].isOpen}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TimePicker
                  label="終了時間"
                  value={new Date(`2000-01-01T${settings.businessHours[id].end}`)}
                  onChange={(newValue) => {
                    const timeString = format(newValue, 'HH:mm');
                    handleDaySettingChange(id, 'end', timeString);
                  }}
                  disabled={!settings.businessHours[id].isOpen}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="予約可能枠数"
                  type="number"
                  value={settings.businessHours[id].slots}
                  onChange={(e) => handleDaySettingChange(id, 'slots', parseInt(e.target.value))}
                  disabled={!settings.businessHours[id].isOpen}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          予約受付期間
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="何日前から"
              type="number"
              value={settings.reservationPeriod.start}
              onChange={(e) => handleReservationPeriodChange('start', e.target.value)}
              InputProps={{ inputProps: { min: 0 } }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="何日後まで"
              type="number"
              value={settings.reservationPeriod.end}
              onChange={(e) => handleReservationPeriodChange('end', e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
              fullWidth
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle1" gutterBottom>
          特別営業日・休業日の設定
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <DatePicker
            label="日付を選択"
            onChange={(date) => handleAddExceptionalDay(date, true)}
            slotProps={{
              textField: { fullWidth: true }
            }}
          />
          <Button variant="outlined" onClick={() => handleAddExceptionalDay(new Date(), true)}>
            休業日を追加
          </Button>
          <Button variant="outlined" onClick={() => handleAddExceptionalDay(new Date(), false)}>
            特別営業日を追加
          </Button>
        </Stack>



<Box sx={{ mb: 3 }}>
          {settings.exceptionalDays.map((day, index) => (
            <Chip
              key={index}
              label={`${format(new Date(day.date), 'yyyy/MM/dd')} ${day.isHoliday ? '休業日' : '特別営業日'}`}
              onDelete={() => handleRemoveExceptionalDay(index)}
              sx={{ m: 0.5 }}
              color={day.isHoliday ? "error" : "success"}
            />
          ))}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? '保存中...' : '設定を保存'}
        </Button>
      </Box>
    </Box>
  </LocalizationProvider>
);
}

export default ReservationSettings;