import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Typography,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { calendarAPI } from "../../../../../../api";



function TimeSlotEditor({ 
  open, 
  onClose, 
  selectedDate, 
  selectedSlot = null,
  onSave 
}) {
  const [formData, setFormData] = useState({
    startTime: '10:00',
    endTime: '11:00',
    capacity: 3,
    repeat: 'none', // none, daily, weekly
    until: null,
    isBlocked: false,
    blockReason: '',
    exceptions: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSlot) {
      setFormData({
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        capacity: selectedSlot.capacity,
        repeat: 'none',
        isBlocked: selectedSlot.blocked,
        blockReason: selectedSlot.blockReason || '',
        exceptions: selectedSlot.exceptions || []
      });
    }
  }, [selectedSlot]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = {
        ...formData,
        date: format(selectedDate, 'yyyy-MM-dd')
      };

      if (selectedSlot) {
        await calendarAPI.updateTimeSlot(selectedSlot.id, data);
      } else {
        await calendarAPI.createTimeSlot(data);
      }

      onSave();
      onClose();
    } catch (err) {
      setError('保存に失敗しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (formData.startTime >= formData.endTime) {
      return '開始時間は終了時間より前である必要があります';
    }
    if (formData.isBlocked && !formData.blockReason.trim()) {
      return 'ブロックする場合は理由を入力してください';
    }
    if (!formData.isBlocked && formData.capacity < 1) {
      return '予約可能枠数は1以上である必要があります';
    }
    return null;
  };

  const validationError = validateForm();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedSlot ? '予約枠の編集' : '予約枠の追加'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error">{error}</Alert>
            )}

            <Typography variant="subtitle2" color="text.secondary">
              {format(selectedDate, 'yyyy年M月d日(E)', { locale: ja })}
            </Typography>

            <Stack direction="row" spacing={2}>
              <TimePicker
                label="開始時間"
                value={parseISO(`2000-01-01T${formData.startTime}`)}
                onChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    startTime: format(newValue, 'HH:mm')
                  }));
                }}
                disabled={loading}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
              <TimePicker
                label="終了時間"
                value={parseISO(`2000-01-01T${formData.endTime}`)}
                onChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    endTime: format(newValue, 'HH:mm')
                  }));
                }}
                disabled={loading}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isBlocked}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      isBlocked: e.target.checked
                    }));
                  }}
                  disabled={loading}
                />
              }
              label="この時間をブロックする"
            />

            {formData.isBlocked ? (
              <TextField
                label="ブロックの理由"
                value={formData.blockReason}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    blockReason: e.target.value
                  }));
                }}
                multiline
                rows={2}
                disabled={loading}
              />
            ) : (
              <TextField
                label="予約可能枠数"
                type="number"
                value={formData.capacity}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    capacity: parseInt(e.target.value, 10)
                  }));
                }}
                InputProps={{ inputProps: { min: 1 } }}
                disabled={loading}
              />
            )}

            <FormControl fullWidth disabled={loading}>
              <InputLabel>繰り返し設定</InputLabel>
              <Select
                value={formData.repeat}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    repeat: e.target.value
                  }));
                }}
                label="繰り返し設定"
              >
                <MenuItem value="none">繰り返しなし</MenuItem>
                <MenuItem value="daily">毎日</MenuItem>
                <MenuItem value="weekly">毎週</MenuItem>
              </Select>
            </FormControl>

            {formData.repeat !== 'none' && (
              <TextField
                label="繰り返し終了日"
                type="date"
                value={formData.until || ''}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    until: e.target.value
                  }));
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={loading}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={onClose}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button 
            variant="contained"
            onClick={handleSave}
            disabled={loading || !!validationError}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}

export default TimeSlotEditor;
