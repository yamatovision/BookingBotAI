// ReservationList.jsx の修正版
// statusColors と statusLabels の削除
// ステータス関連のフィルターも削除

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Typography  // 追加

} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';
import { calendarAPI } from '../../../../../api';

function ReservationTable() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    searchTerm: ''
  });

  // ページネーション処理
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 電話番号フォーマット関数
  const formatPhoneNumber = (phone) => {
    if (!phone) return '-';
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  };

  // 予約データの取得
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate.toISOString());
      }

      const data = await calendarAPI.getReservations(queryParams.toString());
      setReservations(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [filters.startDate, filters.endDate]);

  // フィルタリングされた予約データ
  const filteredReservations = reservations.filter(reservation => {
    const searchTerm = filters.searchTerm.toLowerCase();
    if (searchTerm) {
      return (
        reservation.customerInfo.name.toLowerCase().includes(searchTerm) ||
        reservation.customerInfo.email.toLowerCase().includes(searchTerm) ||
        reservation.customerInfo.phone?.includes(searchTerm) ||
        (reservation.customerInfo.company || '').toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        予約一覧
      </Typography>

      {/* フィルター */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              label="開始日"
              value={filters.startDate}
              onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true
                }
              }}
            />
            <DatePicker
              label="終了日"
              value={filters.endDate}
              onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
              slotProps={{
                textField: {
                  size: "small",
                  fullWidth: true
                }
              }}
            />
          </LocalizationProvider>

          <TextField
            label="検索"
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            placeholder="名前、メール、電話番号、会社名で検索"
            size="small"
            sx={{ flexGrow: 1 }}
          />
        </Stack>
      </Paper>

      {/* エラー表示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 予約一覧テーブル */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>予約日時</TableCell>
              <TableCell>お名前</TableCell>
              <TableCell>メールアドレス</TableCell>
              <TableCell>電話番号</TableCell>
              <TableCell>会社名</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((reservation) => (
                <TableRow key={reservation._id}>
                  <TableCell>
                    {format(new Date(reservation.datetime), 'yyyy/MM/dd HH:mm')}
                  </TableCell>
                  <TableCell>{reservation.customerInfo.name}</TableCell>
                  <TableCell>{reservation.customerInfo.email}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PhoneIcon fontSize="small" color="action" />
                      {formatPhoneNumber(reservation.customerInfo.phone)}
                    </Stack>
                  </TableCell>
                  <TableCell>{reservation.customerInfo.company || '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="詳細を表示">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/reservations/${reservation._id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredReservations.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="表示件数"
        />
      </TableContainer>
    </Box>
  );
}

export default ReservationTable;

