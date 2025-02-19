import { useState } from 'react';
import { chatAPI, calendarAPI } from '@frontend/api';

export function useAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [confirmationMode, setConfirmationMode] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [reservationError, setReservationError] = useState(null);

  const processMessage = async (message, history = [], onChunk) => {
    setIsProcessing(true);
    let completeResponse = '';
    
    try {
      await chatAPI.streamMessage(message, history, (data) => {
        if (data.content) {
          completeResponse += data.content;
          
          // @ マーカーの検出（即時カレンダー表示）
          if (data.content.includes('@')) {
            setShowCalendar(true);
            return; // ストリーミングを停止
          }
          
          // マーカーを除去して表示用テキストを生成
          const displayContent = data.content.replace(/[$@]/g, '').trim();
          
          if (displayContent) {
            onChunk({ content: displayContent });
          }

          // $ マーカーの検出（予約確認モード）
          if (data.content.includes('$')) {
            setConfirmationMode(true);
            setReservationError(null);
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
      onChunk({ 
        content: 'すみません、エラーが発生しました。もう一度お試しください。'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDateTimeSelect = async (dateTime, customerInfo) => {
    try {
      setIsProcessing(true);
      setReservationError(null);

      const result = await calendarAPI.createReservation({
        datetime: dateTime,
        customerInfo,
        status: 'pending'
      });

      setSelectedDateTime(dateTime);
      setShowCalendar(false);

      return result;
    } catch (error) {
      console.error('Reservation error:', error);
      setReservationError(
        error.message || '予約の作成に失敗しました。時間を変更して再度お試しください。'
      );
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processMessage,
    isProcessing,
    showCalendar,
    setShowCalendar,
    selectedDateTime,
    reservationError,
    handleDateTimeSelect,
    confirmationMode,
    setConfirmationMode
  };
}