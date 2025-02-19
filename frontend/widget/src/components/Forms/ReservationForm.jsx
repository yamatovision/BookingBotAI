import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Stack 
} from '@mui/material';

function ReservationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '電話番号を入力してください';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6">
          予約情報の入力
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 120px)', // ヘッダーとフッターの高さを考慮
          overflow: 'auto',
          p: 2
        }}
      >
        <Stack spacing={2}>
          <TextField
            label="お名前"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            required
          />
          <TextField
            label="メールアドレス"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
          <TextField
            label="電話番号"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
       
          <TextField
            label="作りたい仕組みやツール"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Stack>
      </Box>

      <Box sx={{ 
  p: 2, 
  borderTop: '1px solid',
  borderColor: 'divider',
  display: 'flex', 
  gap: 2, 
  justifyContent: 'flex-end',
  backgroundColor: 'background.paper'
}}>
  <Button variant="outlined" onClick={onCancel}>
    キャンセル
  </Button>
  <Button 
    onClick={handleSubmit}
    variant="contained"
    sx={{
      bgcolor: '#ff502b',
      '&:hover': {
        bgcolor: '#ff6b41'
      }
    }}
  >
    予約を確定する
  </Button>
</Box>
    </Box>
  );
}

export default ReservationForm;