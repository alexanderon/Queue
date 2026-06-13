'use client';

import { useState } from 'react';
import { TextField, PrimaryButton, Stack, Text, MessageBar, MessageBarType } from '@fluentui/react';
import { isValidBookingId } from '@/lib/utils';

interface StatusFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
  initialBookingId?: string;
}

export default function StatusForm({ onSubmit, loading, initialBookingId }: StatusFormProps) {
  const [bookingId, setBookingId] = useState(initialBookingId || '');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!bookingId.trim()) return;
    if (!isValidBookingId(bookingId)) {
      setError('Invalid booking ID format (e.g., BKXXXXXXXXXX)');
      return;
    }
    setError('');
    onSubmit({ bookingId });
  };

  return (
    <Stack
      tokens={{ childrenGap: 16 }}
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        padding: '24px',
      }}
    >
      <TextField
        label="Booking ID"
        placeholder="e.g., BK123456"
        value={bookingId}
        onChange={(event, value) => { setBookingId(value || ''); setError(''); }}
        required
        description="Enter the booking ID you received in your confirmation WhatsApp message"
        errorMessage={error}
      />

      <PrimaryButton
        onClick={handleSubmit}
        disabled={loading}
        text={loading ? 'Checking...' : 'Check Status'}
        style={{ height: '40px', fontSize: '16px' }}
      />

      <MessageBar messageBarType={MessageBarType.info}>
        💡 Your booking ID is unique to your appointment. You can check your status anytime!
      </MessageBar>
    </Stack>
  );
}
