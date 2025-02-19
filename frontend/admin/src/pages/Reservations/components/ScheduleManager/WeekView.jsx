import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  IconButton
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  isSameDay,
  parseISO
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { calendarAPI } from "../../../../../../api";



function WeekView({ currentDate, onDateSelect, selectedDate }) {
  const [timeSlots, setTimeSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState({
    startHour: 0,
    endHour: 24
  });
  const [visibleTimeRange, setVisibleTimeRange] = useState({
    start: 9,
    end: 20
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const start = startOfWeek(currentDate, { locale: ja });
        const end = endOfWeek(currentDate, { locale: ja });

        // 並行してデータを取得
        const [slotsData, reservationsData, businessHours] = await Promise.all([
          calendarAPI.getTimeSlots(
            format(start, 'yyyy-MM-dd'),
            format(end, 'yyyy-MM-dd')
          ),
          calendarAPI.getReservations(
            `?startDate=${format(start, 'yyyy-MM-dd')}&endDate=${format(end, 'yyyy-MM-dd')}`
          ),
          calendarAPI.getBusinessHours()
        ]);

        // 全時間帯の集計
        const allTimeSlots = new Set();
        
        // 予約可能時間から時間を収集
        slotsData.forEach(slot => {
          const hour = parseInt(slot.startTime.split(':')[0], 10);
          allTimeSlots.add(hour);
        });

        // 予約済み時間から時間を収集
        reservationsData.forEach(reservation => {
          const hour = new Date(reservation.datetime).getHours();
          allTimeSlots.add(hour);
        });

        // 営業時間から時間を収集
        Object.values(businessHours.businessHours).forEach(day => {
          if (day.isOpen) {
            const startHour = parseInt(day.start.split(':')[0], 10);
            const endHour = parseInt(day.end.split(':')[0], 10);
            allTimeSlots.add(startHour);
            allTimeSlots.add(endHour);
          }
        });

        const hours = Array.from(allTimeSlots).sort((a, b) => a - b);
        
        // 表示範囲の設定（前後1時間のバッファを含む）
        const earliest = Math.max(0, Math.min(...hours) - 1);
        const latest = Math.min(24, Math.max(...hours) + 1);

        setTimeRange({ startHour: earliest, endHour: latest });
        setVisibleTimeRange({ 
          start: Math.min(9, earliest), 
          end: Math.max(20, latest) 
        });

        setTimeSlots(slotsData);
        setReservations(reservationsData);

      } catch (err) {
        console.error('Data fetching error:', err);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentDate]);

  // 時間枠の状態を取得
  const getSlotStatus = (day, hour) => {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // 予約可能時間枠の確認
    const slot = timeSlots.find(s => 
      s.date === dateStr && s.startTime === timeStr
    );

    if (!slot) return 'unavailable';
    if (slot.blocked) return 'blocked';

    // 予約状況の確認
    const reservationCount = reservations.filter(r => {
      const rDate = new Date(r.datetime);
      return isSameDay(rDate, day) && rDate.getHours() === hour;
    }).length;

    if (reservationCount >= slot.capacity) return 'full';
    if (reservationCount > 0) return 'partial';
    return 'available';
  };

  // 時間枠のツールチップテキストを生成
  const getSlotTooltip = (day, hour) => {
    const reservation = reservations.find(r => {
      const rDate = new Date(r.datetime);
      return isSameDay(rDate, day) && rDate.getHours() === hour;
    });
  
    if (!reservation) return null;  // 予約がない場合はツールチップを表示しない
  
    const { customerInfo } = reservation;
    return `
      ${customerInfo.name}
      ${customerInfo.email}
      ${customerInfo.phone || ''}
    `.trim();
  };
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
    );
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate, { locale: ja }),
    end: endOfWeek(currentDate, { locale: ja })
  });

  return (
    <Box>
      {/* 時間範囲コントロール */}
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center" 
        sx={{ mb: 2, px: 2 }}
      >
        <AccessTimeIcon color="action" />
        <Typography variant="subtitle2">
          表示時間: {visibleTimeRange.start}:00 - {visibleTimeRange.end}:00
        </Typography>
        <IconButton 
          size="small"
          onClick={() => setVisibleTimeRange(prev => ({
            start: Math.max(timeRange.startHour, prev.start - 1),
            end: prev.end
          }))}
        >
          <ExpandMore />
        </IconButton>
        <IconButton 
          size="small"
          onClick={() => setVisibleTimeRange(prev => ({
            start: prev.start,
            end: Math.min(timeRange.endHour, prev.end + 1)
          }))}
        >
          <ExpandLess />
        </IconButton>
      </Stack>

      {/* カレンダーグリッド */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={80} />
              {weekDays.map(day => (
                <TableCell
                  key={day.toISOString()}
                  align="center"
                  sx={{
                    bgcolor: isToday(day) ? 'action.hover' : 'transparent',
                    fontWeight: isToday(day) ? 'bold' : 'normal'
                  }}
                >
                  <Box
                    sx={{
                      cursor: 'pointer',
                      p: 1,
                      borderRadius: 1,
                      ...(isSameDay(day, selectedDate) && {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                      })
                    }}
                    onClick={() => onDateSelect?.(day)}
                  >
                    <Typography variant="subtitle2">
                      {format(day, 'E', { locale: ja })}
                    </Typography>
                    <Typography>
                      {format(day, 'd', { locale: ja })}
                    </Typography>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(
              { length: visibleTimeRange.end - visibleTimeRange.start },
              (_, i) => visibleTimeRange.start + i
            ).map(hour => (
              <TableRow key={hour}>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </Typography>
                </TableCell>
                {weekDays.map(day => {
                  const status = getSlotStatus(day, hour);
                  const isNonStandardHour = hour < 9 || hour >= 18;
                  
                  return (
                    <Tooltip 
                      key={`${day.toISOString()}-${hour}`}
                      title={getSlotTooltip(day, hour)}
                    >
                      <TableCell
                        sx={{
                          position: 'relative',
                          height: 40,
                          border: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer',
                          ...(isNonStandardHour && {
                            bgcolor: 'rgba(0, 0, 0, 0.03)',
                          }),
                          ...getSlotStyle(status)
                        }}
                        onClick={() => onDateSelect?.(day)}
                      >
                        {status === 'partial' && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              bgcolor: 'warning.main'
                            }}
                          />
                        )}
                      </TableCell>
                    </Tooltip>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// スロットの状態に応じたスタイルを定義
const getSlotStyle = (status) => {
  switch (status) {
    case 'available':
      return {
        bgcolor: 'success.light',
        opacity: 0.1,
        '&:hover': {
          opacity: 0.2
        }
      };
    case 'partial':
      return {
        bgcolor: 'warning.light',
        opacity: 0.1,
        '&:hover': {
          opacity: 0.2
        }
      };
    case 'full':
      return {
        bgcolor: 'error.light',
        opacity: 0.1,
        '&:hover': {
          opacity: 0.2
        }
      };
    case 'blocked':
      return {
        bgcolor: 'grey.300',
        opacity: 0.2,
        '&:hover': {
          opacity: 0.3
        }
      };
    default:
      return {
        '&:hover': {
          bgcolor: 'action.hover'
        }
      };
  }
};

export default WeekView;