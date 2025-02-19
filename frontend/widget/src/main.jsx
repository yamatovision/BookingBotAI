// widget/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createTheme, ThemeProvider } from '@mui/material'

// URLパラメータからモーダルモードを確認
const urlParams = new URLSearchParams(window.location.search);
const isModal = urlParams.get('modal') === 'true';

// デフォルトの設定
const defaultConfig = {
  theme: {
    primary: '#ff502b'
  },
  clientId: 'preview',
  displayMode: isModal ? 'modal' : 'chat'  // モーダルパラメータに基づいて表示モードを設定
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App config={defaultConfig} />
  </React.StrictMode>
);