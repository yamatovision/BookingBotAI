import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  Grid,
  InputLabel
} from '@mui/material';
import { ChromePicker } from 'react-color';
import { settingsAPI } from '../../../../api';

function PromptSettings() {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    systemPrompt: '',
    referenceContent: '',
    lpContent: '',
    theme: {
      primary: '#FF6B2B'
    },
    displayMode: 'fixed'
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await settingsAPI.getSettings();
        setSettings(prev => ({
          ...prev,
          ...data,
          theme: data.theme || { primary: '#FF6B2B' },
          displayMode: data.displayMode || 'fixed'
        }));
      } catch (error) {
        console.error('Error loading settings:', error);
        setSnackbar({
          open: true,
          message: '設定の読み込みに失敗しました',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsAPI.updateSettings(settings);
      setSnackbar({
        open: true,
        message: '設定を保存しました',
        severity: 'success'
      });
    } catch (error) {
      console.error('設定の保存に失敗しました:', error);
      setSnackbar({
        open: true,
        message: '設定の保存に失敗しました',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        primary: color.hex
      }
    }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        システム設定
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="システムプロンプト" />
          <Tab label="参考資料" />
          <Tab label="LP内容" />
          <Tab label="表示設定" />
        </Tabs>

        {activeTab === 0 && (
          <TextField
            fullWidth
            multiline
            rows={10}
            name="systemPrompt"
            label="システムプロンプト"
            value={settings.systemPrompt}
            onChange={handleChange}
            helperText="AIの基本的な応答方針を設定します"
            disabled={isSaving}
          />
        )}

        {activeTab === 1 && (
          <TextField
            fullWidth
            multiline
            rows={10}
            name="referenceContent"
            label="参考資料"
            value={settings.referenceContent}
            onChange={handleChange}
            helperText="AIが参照する補足情報を設定します"
            disabled={isSaving}
          />
        )}

        {activeTab === 2 && (
          <TextField
            fullWidth
            multiline
            rows={10}
            name="lpContent"
            label="LP内容"
            value={settings.lpContent}
            onChange={handleChange}
            helperText="LPの内容をAIに理解させるための情報を設定します"
            disabled={isSaving}
          />
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                テーマ設定
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ mb: 1 }}>メインカラー</InputLabel>
              <Box sx={{ 
                p: 2, 
                border: '1px solid #ccc', 
                borderRadius: 1,
                bgcolor: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
              }}>
                <ChromePicker
                  color={settings.theme.primary}
                  onChange={handleColorChange}
                  disableAlpha
                  styles={{
                    default: {
                      picker: {
                        width: '100%',
                        boxShadow: 'none'
                      }
                    }
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ mb: 1 }}>表示モード</InputLabel>
              <TextField
                select
                fullWidth
                name="displayMode"
                value={settings.displayMode}
                onChange={handleChange}
                disabled={isSaving}
                SelectProps={{
                  native: true
                }}
              >
                <option value="fixed">固定表示</option>
                <option value="modal">モーダル表示</option>
              </TextField>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                固定表示：常に画面の右下に表示されます
                <br />
                モーダル表示：アイコンをクリックすると中央にモーダルで表示されます
              </Typography>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} /> : null}
          >
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PromptSettings;