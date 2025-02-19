import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { emailAPI } from '../../../../api';

const templateTypes = {
  confirmation: '予約確認',
  reminder: 'リマインド',
  followup: 'フォローアップ'
};

const timeUnits = {
  minutes: '分',
  hours: '時間',
  days: '日'
};

const initialFormState = {
  name: '',
  type: 'confirmation',
  subject: '',
  body: '',
  isActive: true,
  timing: {
    value: 1,
    unit: 'days'
  },
  staffInfo: {
    name: '',
    email: ''
  }
};

function EmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [testEmailDialog, setTestEmailDialog] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  // テンプレート一覧の取得
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await emailAPI.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // ダイアログを開く
  const handleOpenDialog = (template = null) => {
    if (template) {
      setSelectedTemplate(template);
      setFormData(template);
    } else {
      setSelectedTemplate(null);
      setFormData(initialFormState);
    }
    setOpenDialog(true);
  };

  // テンプレートの保存
  const handleSave = async () => {
    try {
      console.log('Saving template data:', formData); // 追加

      await emailAPI.saveTemplate(formData);
      setOpenDialog(false);
      fetchTemplates();
    } catch (err) {
      setError(err.message);
    }
  };

  // テンプレートの削除
  const handleDelete = async (id) => {
    if (!window.confirm('このテンプレートを削除してもよろしいですか？')) return;
    try {
      await emailAPI.deleteTemplate(id);
      fetchTemplates();
    } catch (err) {
      setError(err.message);
    }
  };

  // テストメール送信
  const handleSendTest = async (templateId) => {
    try {
      await emailAPI.sendTestEmail(templateId, testEmail);
      setTestEmailDialog(false);
      setTestEmail('');
      alert('テストメールを送信しました');
    } catch (err) {
      setError(err.message);
    }
  };

  // タイミング設定のコンポーネント
  const TimingSettings = () => {
    if (formData.type === 'confirmation') {
      return (
        <Typography color="textSecondary">
          予約確認メールは予約直後に送信されます
        </Typography>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          送信タイミング
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              type="number"
              label="時間"
              value={formData.timing.value}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  setFormData(prev => ({
                    ...prev,
                    timing: {
                      ...prev.timing,
                      value
                    }
                  }));
                }
              }}
              inputProps={{ min: 1 }}
              sx={{ width: 120 }}
            />
            <FormControl>
              <InputLabel>単位</InputLabel>
              <Select
                value={formData.timing.unit}
                label="単位"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timing: {
                    ...prev.timing,
                    unit: e.target.value
                  }
                }))}
                sx={{ width: 120 }}
              >
                {Object.entries(timeUnits).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography color="textSecondary">
              {formData.type === 'reminder' ? '前' : '後'}
            </Typography>
          </Stack>
          
          <Typography variant="body2" color="textSecondary">
            {`${formData.type === 'reminder' ? '予約時刻の' : '予約完了から'} ${formData.timing.value}${timeUnits[formData.timing.unit]}${formData.type === 'reminder' ? '前' : '後'}に送信されます`}
          </Typography>
        </Stack>
      </Box>
    );
  };

  // テンプレートの状態を更新
  const handleTemplateStatusChange = async (template, checked) => {
    try {
      await emailAPI.updateTemplateStatus(template._id, {
        ...template,
        isActive: checked
      });
      fetchTemplates();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTiming = (template) => {
    if (template.type === 'confirmation') {
      return '予約直後';
    }
    const { value, unit } = template.timing;
    const unitText = timeUnits[unit];
    return template.type === 'reminder'
      ? `予約${value}${unitText}前`
      : `予約${value}${unitText}後`;
  };

  if (loading) return <Typography>読み込み中...</Typography>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">メールテンプレート</Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          新規作成
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>テンプレート名</TableCell>
              <TableCell>種類</TableCell>
              <TableCell>件名</TableCell>
              <TableCell>状態</TableCell>
              <TableCell>送信タイミング</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template._id}>
                <TableCell>{template.name}</TableCell>
                <TableCell>{templateTypes[template.type]}</TableCell>
                <TableCell>{template.subject}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={template.isActive}
                        onChange={(e) => handleTemplateStatusChange(template, e.target.checked)}
                      />
                    }
                    label={template.isActive ? '有効' : '無効'}
                  />
                </TableCell>
                <TableCell>{formatTiming(template)}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="編集">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(template)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip><Tooltip title="テスト送信">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedTemplate(template);
                          setTestEmailDialog(true);
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="削除">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(template._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* テンプレート編集ダイアログ */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedTemplate ? 'テンプレートの編集' : '新規テンプレート'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="テンプレート名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            /><FormControl fullWidth>
              <InputLabel>種類</InputLabel>
              <Select
                value={formData.type}
                label="種類"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    type: e.target.value,
                    timing: initialFormState.timing
                  });
                }}
              >
                {Object.entries(templateTypes).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="件名"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />

            <TextField
              fullWidth
              label="本文"
              multiline
              rows={10}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              helperText="利用可能な変数: {{name}}, {{email}}, {{date}}, {{time}}, {{company}}"
            />

            <Divider sx={{ my: 2 }} />
            
            <TimingSettings />

            <Divider sx={{ my: 2 }} />

            {/* スタッフ情報設定 */}
            <Typography variant="subtitle1">スタッフ情報</Typography>
            <TextField
              fullWidth
              label="担当者名"
              value={formData.staffInfo?.name || ''}
              onChange={(e) => setFormData({
                ...formData,
                staffInfo: { ...formData.staffInfo, name: e.target.value }
              })}
            />
            <TextField
              fullWidth
              label="担当者メール"
              value={formData.staffInfo?.email || ''}
              onChange={(e) => setFormData({
                ...formData,
                staffInfo: { ...formData.staffInfo, email: e.target.value }
              })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>キャンセル</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* テストメール送信ダイアログ */}
      <Dialog
        open={testEmailDialog}
        onClose={() => setTestEmailDialog(false)}
      >
        <DialogTitle>テストメール送信</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="送信先メールアドレス"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestEmailDialog(false)}>
            キャンセル
          </Button>
          <Button
            onClick={() => handleSendTest(selectedTemplate._id)}
            variant="contained"
          >
            送信
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EmailTemplates;