'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  TextField,
  Dropdown,
  PrimaryButton,
  IDropdownOption,
  Stack,
  Text,
  Spinner,
  MessageBar,
  MessageBarType,
} from '@fluentui/react';
import { vendorAPI } from '@/lib/api-client';
import { BookingForm as BookingFormData } from '@/lib/types';
import { isValidWhatsAppNumber } from '@/lib/utils';

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export default function BookingForm({
  onSubmit,
  isSubmitting = false,
  submitError = null,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    shopId: '',
    shopName: '',
    serviceId: '',
    service: '',
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
  });

  const [shopOptions, setShopOptions] = useState<IDropdownOption[]>([]);
  const [serviceOptions, setServiceOptions] = useState<IDropdownOption[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    async function loadShops() {
      setLoadingShops(true);
      setLoadError(null);

      const response = await vendorAPI.list();
      if (!response.success || !response.data?.data) {
        setLoadError(response.error || 'Failed to load shops');
        setLoadingShops(false);
        return;
      }

      setShopOptions(
        response.data.data.map((shop) => ({
          key: shop.id,
          text: shop.shopName,
        }))
      );
      setLoadingShops(false);
    }

    loadShops();
  }, []);

  useEffect(() => {
    if (!formData.shopId) {
      setServiceOptions([]);
      return;
    }

    async function loadServices() {
      setLoadingServices(true);
      setLoadError(null);

      const response = await vendorAPI.getServices(formData.shopId);
      if (!response.success || !response.data?.data) {
        setLoadError(response.error || 'Failed to load services');
        setServiceOptions([]);
        setLoadingServices(false);
        return;
      }

      setServiceOptions(
        response.data.data.map((service) => ({
          key: service.id,
          text: `${service.name} (~${service.estimatedTime} min)`,
          data: service,
        }))
      );
      setLoadingServices(false);
    }

    loadServices();
  }, [formData.shopId]);

  const isFormValid = useMemo(() => {
    return (
      !!formData.shopId &&
      !!formData.serviceId &&
      !!formData.date &&
      !!formData.time &&
      formData.customerName.trim().length >= 2 &&
      isValidWhatsAppNumber(formData.customerPhone) &&
      formData.date >= today
    );
  }, [formData, today]);

  const handleShopChange = (_event: unknown, option?: IDropdownOption) => {
    if (!option) return;

    setFormData((prev) => ({
      ...prev,
      shopId: String(option.key),
      shopName: option.text,
      serviceId: '',
      service: '',
    }));
  };

  const handleServiceChange = (_event: unknown, option?: IDropdownOption) => {
    if (!option) return;

    const serviceName = option.data?.name || option.text.split(' (~')[0];

    setFormData((prev) => ({
      ...prev,
      serviceId: String(option.key),
      service: serviceName,
    }));
  };

  const handleChange = (field: string, value: string | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value || '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isSubmitting) {
      onSubmit(formData);
    }
  };

  if (loadingShops) {
    return (
      <Stack horizontalAlign="center" tokens={{ childrenGap: 12 }} style={{ padding: '48px 0' }}>
        <Spinner label="Loading shops..." />
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack
        tokens={{ childrenGap: 16 }}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          padding: '24px',
        }}
      >
        {(loadError || submitError) && (
          <MessageBar messageBarType={MessageBarType.error}>
            {submitError || loadError}
          </MessageBar>
        )}

        <Dropdown
          label="Select Shop"
          placeholder="Choose a shop..."
          options={shopOptions}
          selectedKey={formData.shopId || undefined}
          onChange={handleShopChange}
          disabled={isSubmitting || shopOptions.length === 0}
          required
        />

        <Dropdown
          label="Service Type"
          placeholder={
            !formData.shopId
              ? 'Select a shop first...'
              : loadingServices
                ? 'Loading services...'
                : 'Choose a service...'
          }
          options={serviceOptions}
          selectedKey={formData.serviceId || undefined}
          onChange={handleServiceChange}
          disabled={!formData.shopId || loadingServices || isSubmitting}
          required
        />

        <TextField
          label="Preferred Date"
          type="date"
          value={formData.date}
          min={today}
          onChange={(_event, value) => handleChange('date', value)}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="Preferred Time"
          type="time"
          value={formData.time}
          onChange={(_event, value) => handleChange('time', value)}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="Your Name"
          placeholder="John Doe"
          value={formData.customerName}
          onChange={(_event, value) => handleChange('customerName', value)}
          disabled={isSubmitting}
          required
        />

        <TextField
          label="WhatsApp Number"
          placeholder="+91 98765 43210"
          value={formData.customerPhone}
          onChange={(_event, value) => handleChange('customerPhone', value)}
          disabled={isSubmitting}
          required
        />

        <PrimaryButton
          type="submit"
          text={isSubmitting ? 'Booking...' : 'Book Now'}
          disabled={!isFormValid || isSubmitting}
          style={{ height: '40px', fontSize: '16px' }}
        />

        <Text variant="small" style={{ color: '#666', textAlign: 'center' }}>
          {!isFormValid
            ? 'Fill in all required fields to enable booking'
            : "We'll send you WhatsApp updates about your slot"}
        </Text>
      </Stack>
    </form>
  );
}
