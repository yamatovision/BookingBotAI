import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { calendarAPI } from "../../../../../../api";

function DayDetails({ date, onClose }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      if (!date) return;
      
      try {
        setLoading(true);
        const dateStr = format(date, 'yyyy-MM-dd');
        // 新しいAPIメソッドを使用
        const reservationsData = await calendarAPI.getReservationsByDate(dateStr);
        setReservations(reservationsData);
      } catch (err) {
        console.error('Data fetching error:', err);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [date]);




  if (!date) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          日付を選択してください
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2 
      }}>
        <Typography variant="h6">
          {format(date, 'M月d日(E)', { locale: ja })}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {reservations.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          予約はありません
        </Typography>
      ) : (
        <List>
          {reservations
            .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
            .map((reservation, index) => (
              <Box key={reservation._id || index}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {format(new Date(reservation.datetime), 'HH:mm')}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          {reservation.customerInfo.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {reservation.customerInfo.email}
                        </Typography>
                        {reservation.customerInfo.phone && (
                          <Typography variant="body2" color="text.secondary">
                            {reservation.customerInfo.phone}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
          ))}
        </List>
      )}
    </Box>
  );
}

export default DayDetails;