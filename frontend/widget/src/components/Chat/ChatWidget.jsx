// widget/src/components/Chat/ChatWidget.jsx
import { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useAI } from '../../hooks/useAI';
import SimpleWeekView from '../Calendar/SimpleWeekView';
import ReservationForm from '../Forms/ReservationForm';
import { calendarAPI } from "../../../../api";

const EVENT_TYPES = {
  WIDGET_READY: 'WIDGET_READY',
  WIDGET_TOGGLE: 'WIDGET_TOGGLE',
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  RESERVATION_SUBMIT: 'RESERVATION_SUBMIT'
};

function ChatWidget({ 
  config,
  messages: initialMessages,
  isProcessing: externalProcessing,
  error: externalError,
  onSendMessage: externalSendMessage,
  showCalendar: externalShowCalendar,
  showForm: externalShowForm,
  selectedDateTime: externalSelectedDateTime,
  onTimeSelect: externalTimeSelect,
  onFormSubmit: externalFormSubmit,
  onFormCancel: externalFormCancel,
  onClose: externalClose
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState(initialMessages || [{
    id: 1,
    type: 'bot',
    content: '個別相談にご関心をお寄せいただきありがとうございます。\n具体的にどんなAIツールを作りたいと思われているか一言でお伝えください。'
  }]);
  const [showForm, setShowForm] = useState(externalShowForm || false);
  const [selectedDateTime, setSelectedDateTime] = useState(externalSelectedDateTime || null);
  const { 
    processMessage, 
    isProcessing, 
    showCalendar, 
    setShowCalendar, 
    error 
  } = useAI();

  useEffect(() => {
    window.parent.postMessage({ 
      type: EVENT_TYPES.WIDGET_READY,
      payload: { ready: true }
    }, '*');

    const handleMessage = (event) => {
      const { type, payload } = event.data;
      switch (type) {
        case EVENT_TYPES.WIDGET_TOGGLE:
          setIsVisible(payload.visible);
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      content: message
    }]);

    window.parent.postMessage({
      type: EVENT_TYPES.CHAT_MESSAGE,
      payload: { message }
    }, '*');

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

  const handleTimeSelect = (day, hour) => {
    const selectedTime = new Date(day);
    selectedTime.setHours(hour, 0, 0, 0);
    setSelectedDateTime(selectedTime);
    setShowCalendar(false);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const reservationData = {
        clientId: config.clientId || 'default',
        datetime: selectedDateTime.toISOString(),
        customerInfo: formData
      };

      await calendarAPI.createReservation(reservationData);

      window.parent.postMessage({
        type: EVENT_TYPES.RESERVATION_SUBMIT,
        payload: reservationData
      }, '*');

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

  return isVisible ? (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '600px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '8px',
        background: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1300,
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <ChatHeader onClose={() => {
        setIsVisible(false);
        window.parent.postMessage({
          type: EVENT_TYPES.WIDGET_TOGGLE,
          payload: { visible: false }
        }, '*');
      }} />
      
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden' 
      }}>
        {error && (
          <div style={{ margin: '4px' }}>
            <div style={{ 
              padding: '6px 16px',
              backgroundColor: '#fdeded',
              color: '#5f2120',
              borderRadius: '4px',
              marginBottom: '8px'
            }}>
              {error}
            </div>
          </div>
        )}

        {!showCalendar && !showForm && (
          <ChatMessages 
            messages={messages}
            error={error}
            isProcessing={isProcessing}
          />
        )}

        {showCalendar && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 2,
            overflow: 'auto'
          }}>
            <SimpleWeekView onTimeSelect={handleTimeSelect} />
          </div>
        )}

        {showForm && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 2
          }}>
            <ReservationForm 
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {!showCalendar && !showForm && (
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={isProcessing}
          />
        )}
      </div>
    </div>
  ) : null;
}

export default ChatWidget;