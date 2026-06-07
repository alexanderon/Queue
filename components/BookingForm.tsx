'use client';

import { useState } from 'react';
import {
  TextField,
  Dropdown,
  PrimaryButton,
  DefaultButton,
  IDropdownOption,
  Stack,
  Text,
} from '@fluentui/react';

interface BookingFormProps {
  onSubmit: (data: any) => void;
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState({
    shopName: '',
    service: '',
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
  });

  const shopOptions: IDropdownOption[] = [
    { key: 'elite', text: 'Elite Barber Shop' },
    { key: 'pro', text: 'Pro Salon' },
    { key: 'style', text: 'Style Studio' },
    { key: 'groom', text: 'Groom House' },
  ];

  const serviceOptions: IDropdownOption[] = [
    { key: 'haircut', text: 'Haircut' },
    { key: 'beard', text: 'Beard Trim' },
    { key: 'color', text: 'Hair Color' },
    { key: 'massage', text: 'Massage' },
    { key: 'facial', text: 'Facial' },
    { key: 'spa', text: 'Hair Spa' },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.shopName &&
      formData.service &&
      formData.date &&
      formData.time &&
      formData.customerName &&
      formData.customerPhone
    ) {
      onSubmit(formData);
    }
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
      <Dropdown
        label="Select Shop"
        placeholder="Choose a shop..."
        options={shopOptions}
        selectedKey={formData.shopName}
        onChange={(event, option) => handleChange('shopName', option?.text || '')}
        required
      />

      <Dropdown
        label="Service Type"
        placeholder="Choose a service..."
        options={serviceOptions}
        selectedKey={formData.service}
        onChange={(event, option) => handleChange('service', option?.text || '')}
        required
      />

      <TextField
        label="Preferred Date"
        type="date"
        value={formData.date}
        onChange={(event, value) => handleChange('date', value)}
        required
      />

      <TextField
        label="Preferred Time"
        type="time"
        value={formData.time}
        onChange={(event, value) => handleChange('time', value)}
        required
      />

      <TextField
        label="Your Name"
        placeholder="John Doe"
        value={formData.customerName}
        onChange={(event, value) => handleChange('customerName', value)}
        required
      />

      <TextField
        label="WhatsApp Number"
        placeholder="+91 98765 43210"
        value={formData.customerPhone}
        onChange={(event, value) => handleChange('customerPhone', value)}
        required
      />

      <PrimaryButton
        onClick={handleSubmit}
        text="Book Now"
        style={{ height: '40px', fontSize: '16px' }}
      />

      <Text variant="small" style={{ color: '#666', textAlign: 'center' }}>
        We'll send you WhatsApp updates about your slot
      </Text>
    </Stack>
  );
}
