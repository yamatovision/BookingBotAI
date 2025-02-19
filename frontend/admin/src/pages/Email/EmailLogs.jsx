import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { format } from 'date-fns';
import { emailAPI } from '../../../../api';  // APIをインポート

function EmailLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    searchTerm: ''
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);

  // ログデータの取得
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate.toISOString());
      }

      const data = await emailAPI.getLogs(queryParams.toString());
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters.startDate, filters.endDate]);

  // フィルタリングされたログデータ
  const filteredLogs = logs.filter(log => {
    const searchTerm = filters.searchTerm.toLowerCase();
    return (
      log.reservationId.customerInfo.email.toLowerCase().includes(searchTerm) ||
      log.templateId.name.toLowerCase().includes(searchTerm)
    );
  });

  // ページネーション処理
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 詳細ダイアログを開く
  const handleOpenDetail = (log) => {
    setSelectedLog(log);
    setDetailDialog(true);
  };

  if (loading) return <Typography>読み込み中...</Typography>;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">メール送信ログ</Typography>
        <IconButton onClick={fetchLogs} title="更新">
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* フィルター */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              label="開始日"
              value={filters.startDate}
              onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label="終了日"
              value={filters.endDate}
              onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
              slotProps={{ textField: { size: "small" } }}
            />
          </LocalizationProvider>
          <TextField
            label="検索"
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            placeholder="メールアドレス、テンプレート名で検索"
            sx={{ flexGrow: 1 }}
            size="small"
          />
        </Stack>
      </Paper>

      {/* エラー表示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ログ一覧テーブル */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>送信日時</TableCell>
              <TableCell>テンプレート</TableCell>
              <TableCell>送信先</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((log) => (
                <TableRow key={log._id}>
                  <TableCell>
                    {format(new Date(log.sentAt), 'yyyy/MM/dd HH:mm')}
                  </TableCell>
                  <TableCell>{log.templateId.name}</TableCell>
                  <TableCell>{log.reservationId.customerInfo.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.status === 'success' ? '成功' : 'エラー'}
                      color={log.status === 'success' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="詳細を表示">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetail(log)}
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
          count={filteredLogs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="表示件数"
        />
      </TableContainer>
      {/* 詳細ダイアログ */}
      <Dialog
        open={detailDialog}
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>送信詳細</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Typography variant="subtitle2">送信日時</Typography>
              <Typography>
                {format(new Date(selectedLog.sentAt), 'yyyy年MM月dd日 HH:mm:ss')}
              </Typography>

              <Typography variant="subtitle2">テンプレート</Typography>
              <Typography>{selectedLog.templateId.name}</Typography>

              <Typography variant="subtitle2">送信先</Typography>
              <Typography>{selectedLog.reservationId.customerInfo.email}</Typography>

              <Typography variant="subtitle2">予約情報</Typography>
              <Typography>
                予約日時: {format(new Date(selectedLog.reservationId.datetime), 'yyyy年MM月dd日 HH:mm')}<br />
                お名前: {selectedLog.reservationId.customerInfo.name}<br />
                会社名: {selectedLog.reservationId.customerInfo.company || '-'}
              </Typography>

              {selectedLog.status === 'failed' && (
                <>
                  <Typography variant="subtitle2" color="error">エラー内容</Typography>
                  <Typography color="error">{selectedLog.error}</Typography>
                </>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmailLogs;