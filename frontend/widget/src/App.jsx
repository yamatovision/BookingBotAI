// src/App.jsx
import { useState } from 'react';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ChatWidget from './components/Chat/ChatWidget';  // ChatContainerからChatWidgetに変更
import { useAI } from './hooks/useAI';
import { calendarAPI } from '../../api';

function App({ config }) {
  // 基本的な状態管理
  const [messages, setMessages] = useState([{
    id: 1,
    type: 'bot',
    content: '個別相談にご関心をお寄せいただきありがとうございます。\n具体的にどんなAIツールを作りたいと思われているか一言でお伝えください。'
  }]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  // AIフックの使用
  const { 
    processMessage, 
    isProcessing, 
    showCalendar, 
    setShowCalendar, 
    error 
  } = useAI();

  // テーマの設定
  console.log('Creating theme with config:', config);
  const theme = createTheme({
    palette: {
      primary: {
        main: config.theme?.primary || '#FF6B2B',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @global {
            body {
              margin: 0;
              padding: 0;
            }
          }
        `,
      },
    },
  });
  console.log('Created theme palette:', theme.palette.primary);

  // メッセージ送信ハンドラー
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
  
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      content: message
    }]);
  
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'bot',
      content: ''
    }]);

    const history = messages.map(msg => ({
      type: msg.type,
      content: msg.content
    }));
  
    await processMessage(message, history, (chunk) => {
      setMessages(prev => prev.map((msg, index) => {
        if (index === prev.length - 1) {
          return {
            ...msg,
            content: msg.content + chunk.content
          };
        }
        return msg;
      }));
    });
  };

  // 時間選択ハンドラー
  const handleTimeSelect = (day, hour) => {
    const selectedTime = new Date(day);
    selectedTime.setHours(hour, 0, 0, 0);
    setSelectedDateTime(selectedTime);
    setShowCalendar(false);
    setShowForm(true);
  };

  // フォーム送信ハンドラー
  const handleFormSubmit = async (formData) => {
    try {
      const reservationData = {
        clientId: config.clientId || 'default',
        datetime: selectedDateTime.toISOString(),
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          message: formData.message
        }
      };
  
      await calendarAPI.createReservation(reservationData);
  
      const confirmationMessage = `
予約を承りました。

日時：${selectedDateTime.toLocaleString('ja-JP', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
お名前：${formData.name}
メールアドレス：${formData.email}
電話番号：${formData.phone}
${formData.company ? `会社名：${formData.company}\n` : ''}
${formData.message ? `ご要望：${formData.message}` : ''}

ご予約の確認メールをお送りいたしましたので、ご確認ください。
当日は担当者より改めてご連絡させていただきます。
      `.trim();
  
      setShowForm(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        content: confirmationMessage
      }]);
    } catch (error) {
      console.error('Reservation submission error:', error);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        content: '申し訳ありません。予約の送信中にエラーが発生しました。'
      }]);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ChatWidget 
        config={config}
        messages={messages}
        isProcessing={isProcessing}
        error={error}
        onSendMessage={handleSendMessage}
        showCalendar={showCalendar}
        showForm={showForm}
        selectedDateTime={selectedDateTime}
        onTimeSelect={handleTimeSelect}
        onFormSubmit={handleFormSubmit}
        onFormCancel={() => setShowForm(false)}
        onClose={config.onClose}
      />
    </div>
  );
}

export default App;