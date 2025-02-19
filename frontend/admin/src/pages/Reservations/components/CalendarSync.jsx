import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

function CalendarSync() {
  const [syncStatus, setSyncStatus] = useState({
    isConnected: false,
    loading: true,
    error: null
  });

  const CLIENT_ID = '235426778039-35a3sk7potfffbqgrqej15utuf16b8em.apps.googleusercontent.com';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  useEffect(() => {
    console.log('🚀 CalendarSync component mounted');
    
    const loadGoogleIdentity = async () => {
      console.log('📡 Starting to load Google Identity Services');
      
      try {
        // Google Identity Servicesスクリプトの読み込み
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        console.log('📚 Google Identity Services script loaded');

        // TokenClientの初期化
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response) => {
            if (response.error !== undefined) {
              console.error('❌ Token error:', response);
              setSyncStatus({
                isConnected: false,
                loading: false,
                error: `認証エラー: ${response.error}`
              });
            } else {
              console.log('✅ Token received successfully');
              setSyncStatus({
                isConnected: true,
                loading: false,
                error: null
              });
            }
          },
        });

        // グローバルに保存して後で使用できるようにする
        window.tokenClient = tokenClient;
        
        console.log('⚙️ Token client initialized');
        setSyncStatus(prev => ({
          ...prev,
          loading: false
        }));

      } catch (error) {
        console.error('❌ Error initializing Google Identity Services:', error);
        setSyncStatus({
          isConnected: false,
          loading: false,
          error: `初期化エラー: ${error.message || '不明なエラー'}`
        });
      }
    };

    loadGoogleIdentity();

    return () => {
      console.log('🧹 Cleaning up CalendarSync component');
    };
  }, []);

  const handleConnect = async () => {
    console.log('🔄 Starting connection process');
    try {
      setSyncStatus(prev => ({ ...prev, loading: true }));
      
      if (window.tokenClient) {
        console.log('🔑 Requesting access token...');
        window.tokenClient.requestAccessToken();
      } else {
        throw new Error('Token client not initialized');
      }
    } catch (error) {
      console.error('❌ Connection error:', error);
      setSyncStatus(prev => ({
        ...prev,
        loading: false,
        error: `接続エラー: ${error.message || '不明なエラー'}`
      }));
    }
  };

  const handleDisconnect = () => {
    console.log('🔄 Starting disconnection process');
    try {
      google.accounts.oauth2.revoke(
        google.accounts.oauth2.getToken()?.access_token,
        () => {
          console.log('✅ Successfully disconnected');
          setSyncStatus({
            isConnected: false,
            loading: false,
            error: null
          });
        }
      );
    } catch (error) {
      console.error('❌ Disconnection error:', error);
      setSyncStatus(prev => ({
        ...prev,
        loading: false,
        error: `接続解除エラー: ${error.message || '不明なエラー'}`
      }));
    }
  };




  if (syncStatus.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Googleカレンダー連携
      </Typography>
      
      {syncStatus.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {syncStatus.error}
        </Alert>
      )}

      <Box sx={{ mt: 2 }}>
        <Typography variant="body1" gutterBottom>ステータス: {syncStatus.isConnected ? '接続済み' : '未接続'}
        </Typography>

        {syncStatus.isConnected ? (
          <Button
            variant="outlined"
            color="error"
            onClick={handleDisconnect}
            disabled={syncStatus.loading}
          >
            接続を解除
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<GoogleIcon />}
            onClick={handleConnect}
            disabled={syncStatus.loading}
          >
            Googleカレンダーと連携
          </Button>
        )}
      </Box>
    </Paper>
  );
}

export default CalendarSync;