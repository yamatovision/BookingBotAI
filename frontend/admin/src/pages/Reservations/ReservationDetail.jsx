import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { calendarAPI, emailAPI } from '../../../../api';  // 正確なパスを使用

const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error'
};

const statusLabels = {
  pending: '保留中',
  confirmed: '確定',
  cancelled: 'キャンセル'
};

function ReservationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [emailLogs, setEmailLogs] = useState([]);


  // 予約データの取得
  const fetchReservation = async () => {
    try {
      setLoading(true);
      const data = await calendarAPI.getReservationById(id);
      setReservation(data);
      setEditData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // メール送信履歴の取得
  const fetchEmailLogs = async () => {
    try {
      const data = await emailAPI.getEmailLogs(id);
      setEmailLogs(data);
    } catch (err) {
      console.error('Email logs fetch error:', err);
    }
  };

  useEffect(() => {
    fetchReservation();
    fetchEmailLogs();
  }, [id]);

  // ステータス更新
  const handleStatusUpdate = async (newStatus) => {
    try {
      await calendarAPI.updateReservationStatus(id, newStatus);
      fetchReservation();
    } catch (err) {
      setError(err.message);
    }
  };

  // 予約情報の更新
  const handleUpdate = async () => {
    try {
      await calendarAPI.updateReservation(id, editData);
      setEditMode(false);
      fetchReservation();
    } catch (err) {
      setError(err.message);
    }
  };

  // 手動メール送信
  const handleSendEmail = async (templateType) => {
    try {
      await emailAPI.sendEmail(id, templateType);
      fetchEmailLogs();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Typography>読み込み中...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!reservation) return <Typography>予約が見つかりません</Typography>;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/reservations')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">予約詳細</Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* 予約情報 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6">予約情報</Typography>
              <Button
                startIcon={<EditIcon />}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'キャンセル' : '編集'}
              </Button>
            </Stack>

            {editMode ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="お名前"
                    value={editData.customerInfo?.name || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      customerInfo: { ...editData.customerInfo, name: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="メールアドレス"
                    value={editData.customerInfo?.email || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      customerInfo: { ...editData.customerInfo, email: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="会社名"
                    value={editData.customerInfo?.company || ''}
                    onChange={(e) => setEditData({
                      ...editData,
                      customerInfo: { ...editData.customerInfo, company: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleUpdate}>
                    更新する
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">予約日時</Typography>
                  <Typography>
                    {format(new Date(reservation.datetime), 'yyyy年MM月dd日 HH:mm')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">ステータス</Typography>
                  <Chip
                    label={statusLabels[reservation.status]}
                    color={statusColors[reservation.status]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">お名前</Typography>
                  <Typography>{reservation.customerInfo.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                  <Typography>{reservation.customerInfo.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">会社名</Typography>
                  <Typography>{reservation.customerInfo.company || '-'}</Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* メール履歴 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>メール送信履歴</Typography>
            <List>
              {emailLogs.map((log) => (
                <ListItem key={log._id}>
                  <ListItemText
                    primary={log.templateId.name}
                    secondary={format(new Date(log.sentAt), 'yyyy/MM/dd HH:mm')}
                  />
                  <Chip
                    size="small"
                    label={log.status === 'success' ? '送信済' : 'エラー'}
                    color={log.status === 'success' ? 'success' : 'error'}
                  />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              <Button
                fullWidth
                startIcon={<EmailIcon />}
                onClick={() => handleSendEmail('reminder')}
              >
                リマインドメール送信
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ReservationDetail;
