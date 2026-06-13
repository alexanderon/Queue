'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TextField, Spinner } from '@fluentui/react';
import { vendorAPI, bookingAPI } from '@/lib/api-client';
import { isValidWhatsAppNumber } from '@/lib/utils';
import Link from 'next/link';

interface Option {
  label: string;
  value: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  options?: Option[];
  isTyping?: boolean;
}

type Step =
  | 'welcome'
  | 'select-shop'
  | 'select-service'
  | 'select-date'
  | 'select-time'
  | 'ask-name'
  | 'ask-phone'
  | 'confirm'
  | 'submitting'
  | 'done';

interface BookingResult {
  bookingId: string;
  shopName: string;
  service: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  status: string;
  queuePosition: number;
  estimatedTime: number;
  createdAt: string;
}

const ALL_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
];

export default function ChatBooking() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [step, setStep] = useState<Step>('welcome');
  const [shops, setShops] = useState<{ id: string; shopName: string }[]>([]);
  const [services, setServices] = useState<{ id: string; name: string; estimatedTime: number; price: number }[]>([]);
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
  const [textInput, setTextInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingShops, setLoadingShops] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botReplyId = useRef(0);
  const shopsRef = useRef(shops);
  useEffect(() => { shopsRef.current = shops; }, [shops]);

  const today = new Date().toISOString().split('T')[0];

  const dateOptions = useMemo(() => {
    const options: Option[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const value = d.toISOString().split('T')[0];
      const label =
        i === 0 ? 'Today' :
        i === 1 ? 'Tomorrow' :
        d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      options.push({ label, value });
    }
    return options;
  }, []);

  const getAvailableSlots = useCallback((date: string) => {
    if (date === today) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      return ALL_TIME_SLOTS.filter(slot => {
        const [h, m] = slot.split(':').map(Number);
        return h > currentHour || (h === currentHour && m > currentMin);
      });
    }
    return ALL_TIME_SLOTS;
  }, [today]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = useCallback((msg: Omit<Message, 'id'>) => {
    const id = `${Date.now()}-${++botReplyId.current}`;
    setMessages(prev => [...prev, { ...msg, id }]);
  }, []);

  const botTyping = useCallback((text: string, options?: Option[], delay = 600) => {
    const typingId = `typing-${Date.now()}-${++botReplyId.current}`;
    setMessages(prev => [...prev, { id: typingId, text: '', sender: 'bot', isTyping: true }]);
    setTimeout(() => {
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== typingId);
        return [...filtered, { id: `${Date.now()}-${botReplyId.current}`, text, sender: 'bot', options }];
      });
    }, delay);
  }, []);

  useEffect(() => {
    vendorAPI.list().then(res => {
      setLoadingShops(false);
      if (res.success && res.data?.data) {
        setShops(res.data.data);
      }
    });
  }, []);

  useEffect(() => {
    if (step !== 'welcome' || messages.length > 0) return;
    const timer = setTimeout(() => {
      addMessage({
        text: '👋 Welcome to Queue! I\'m your booking assistant.\nLet me help you schedule an appointment in a few simple steps.',
        sender: 'bot',
        options: [{ label: 'Start Booking 📅', value: 'start' }],
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [step, messages.length, addMessage]);

  const showShops = useCallback(() => {
    if (shops.length === 0) {
      botTyping('Sorry, no shops are available right now. Please try again later.', undefined, 0);
      return;
    }
    setStep('select-shop');
    botTyping('Which shop would you like to visit?', shops.map(s => ({ label: s.shopName, value: s.id })));
  }, [shops, botTyping]);

  const handleConfirm = useCallback(async () => {
    addMessage({ text: 'Submitting your booking...', sender: 'bot' });

    const res = await bookingAPI.create({
      shopId: formData.shopId,
      shopName: formData.shopName,
      serviceId: formData.serviceId,
      service: formData.service,
      customerName: formData.customerName.trim(),
      customerPhone: formData.customerPhone.trim(),
      date: formData.date,
      time: formData.time,
    });

    if (!res.success || !res.data?.booking) {
      setSubmitError(res.error || 'Failed to create booking. Please try again.');
      setStep('confirm');
      addMessage({ text: 'Something went wrong. Would you like to try again?', sender: 'bot', options: [{ label: 'Try Again 🔄', value: 'retry' }] });
      return;
    }

    sessionStorage.setItem('customerPhone', formData.customerPhone.trim());
    const result = res.data.booking as BookingResult;
    setBookingResult(result);
    setStep('done');

    const formattedDate = new Date(result.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

    addMessage({
      text: `✅ **Booking Confirmed!**\n\n📋 **Booking ID:** ${result.bookingId}\n🏪 **Shop:** ${result.shopName}\n✂️ **Service:** ${result.service}\n📅 **Date:** ${formattedDate}\n⏰ **Time:** ${result.time}\n📍 **Queue Position:** #${result.queuePosition}\n⏱️ **Estimated Wait:** ~${result.estimatedTime} min`,
      sender: 'bot',
    });
  }, [formData, addMessage]);

  const handleOptionClick = useCallback((value: string, label: string) => {
    addMessage({ text: label, sender: 'user' });

    if (value === 'start') {
      if (shops.length === 0 && loadingShops) {
        botTyping('Loading available shops...', undefined, 300);
        const check = setInterval(() => {
          if (shopsRef.current.length > 0) {
            clearInterval(check);
            setStep('select-shop');
            botTyping('Which shop would you like to visit?', shopsRef.current.map(s => ({ label: s.shopName, value: s.id })));
          }
        }, 300);
        setTimeout(() => clearInterval(check), 15000);
        return;
      }
      showShops();
      return;
    }

    switch (step) {
      case 'select-shop': {
        const shop = shops.find(s => s.id === value);
        if (!shop) return;
        setFormData(prev => ({ ...prev, shopId: value, shopName: shop.shopName }));
        vendorAPI.getServices(value).then(res => {
          if (res.success && res.data?.data && res.data.data.length > 0) {
            setServices(res.data.data);
            setStep('select-service');
            botTyping(
              `Great choice! What service would you like at **${shop.shopName}**?`,
              res.data.data.map(s => ({
                label: `${s.name} (${s.estimatedTime} min)`,
                value: s.id,
              }))
            );
          } else {
            botTyping('Sorry, this shop has no available services. Please pick another shop.', undefined, 0);
          }
        });
        break;
      }
      case 'select-service': {
        const svc = services.find(s => s.id === value);
        if (!svc) return;
        setFormData(prev => ({ ...prev, serviceId: value, service: svc.name }));
        setStep('select-date');
        botTyping('When would you like to come? Pick a date:', dateOptions);
        break;
      }
      case 'select-date': {
        const availableSlots = getAvailableSlots(value);
        if (availableSlots.length === 0) {
          botTyping('No available time slots for today. Please pick another date.', dateOptions, 0);
          return;
        }
        setFormData(prev => ({ ...prev, date: value }));
        const dateLabel = new Date(value + 'T00:00:00').toLocaleDateString('en-IN', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
        setStep('select-time');
        botTyping(`What time on ${dateLabel}?`, availableSlots.map(t => ({ label: t, value: t })));
        break;
      }
      case 'select-time': {
        setFormData(prev => ({ ...prev, time: value }));
        setStep('ask-name');
        botTyping('What\'s your name?');
        break;
      }
      case 'confirm': {
        setStep('submitting');
        setSubmitError(null);
        handleConfirm();
        break;
      }
    }
  }, [step, shops, loadingShops, services, dateOptions, getAvailableSlots, addMessage, botTyping, showShops, handleConfirm]);

  const handleTextSubmit = useCallback(() => {
    const value = textInput.trim();
    if (!value) return;

    setTextInput('');
    addMessage({ text: value, sender: 'user' });

    switch (step) {
      case 'ask-name': {
        if (value.length < 2) {
          setStep('ask-name');
          botTyping('Please enter a valid name (at least 2 characters).');
          return;
        }
        setFormData(prev => ({ ...prev, customerName: value }));
        setStep('ask-phone');
        botTyping('What\'s your WhatsApp number? We\'ll send you updates there.\n(e.g., +91 9876543210)');
        break;
      }
      case 'ask-phone': {
        if (!isValidWhatsAppNumber(value)) {
          setPhoneError('Please enter a valid phone number (e.g., +91 9876543210)');
          return;
        }
        setPhoneError('');
        setFormData(prev => ({ ...prev, customerPhone: value }));
        setStep('confirm');
        botTyping(
          'Please confirm your booking details:',
          [{ label: 'Confirm ✅', value: 'confirm' }],
          500
        );
        break;
      }
    }
  }, [textInput, step, addMessage, botTyping]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTextSubmit();
  };

  const currentInputPlaceholder = step === 'ask-name' ? 'Enter your name...' : 'Enter WhatsApp number (e.g., +91 9876543210)';

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-indigo-600 text-white px-5 py-3 flex items-center gap-2">
        <span className="text-xl">💬</span>
        <div>
          <h2 className="font-semibold text-sm">Chat Booking Assistant</h2>
          <p className="text-xs text-indigo-200">Book your slot conversationally</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
              }`}
            >
              {msg.isTyping ? (
                <div className="flex gap-1.5 py-1.5 px-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              )}

              {msg.options && msg.options.length > 0 && !msg.isTyping && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {msg.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionClick(opt.value, opt.label)}
                      className="bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full px-3.5 py-1.5 text-xs font-medium hover:bg-indigo-100 hover:border-indigo-300 transition active:scale-95"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {(step === 'confirm' || submitError) && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          {step === 'confirm' && formData.customerName && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-xs space-y-0.5">
              <p className="font-semibold text-indigo-800 mb-1">📋 Summary</p>
              <p><span className="text-gray-500">Shop:</span> {formData.shopName}</p>
              <p><span className="text-gray-500">Service:</span> {formData.service}</p>
              <p><span className="text-gray-500">Date:</span> {new Date(formData.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p><span className="text-gray-500">Time:</span> {formData.time}</p>
              <p><span className="text-gray-500">Name:</span> {formData.customerName}</p>
              <p><span className="text-gray-500">Phone:</span> {formData.customerPhone}</p>
            </div>
          )}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs">
              {submitError}
            </div>
          )}
        </div>
      )}

      <div className="border-t border-gray-200 px-4 py-3 bg-white">
        {step === 'submitting' ? (
          <div className="flex justify-center py-2">
            <Spinner label="Booking your slot..." />
          </div>
        ) : step === 'done' && bookingResult ? (
          <div className="text-center space-y-3">
            <Link
              href={`/status?bookingId=${bookingResult.bookingId}`}
              className="block w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Check Status
            </Link>
            <div className="flex gap-2">
              <Link
                href="/bookings"
                className="flex-1 bg-indigo-100 text-indigo-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-indigo-200 transition"
              >
                My Bookings
              </Link>
              <Link
                href="/"
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
              >
                Home
              </Link>
            </div>
          </div>
        ) : step === 'ask-name' || step === 'ask-phone' ? (
          <div>
            <div className="flex gap-2">
              <TextField
                value={textInput}
                onChange={(_, v) => {
                  setTextInput(v || '');
                  if (step === 'ask-phone') setPhoneError('');
                }}
                placeholder={currentInputPlaceholder}
                onKeyDown={handleInputKeyDown}
                styles={{ root: { flex: 1 }, fieldGroup: { borderRadius: '8px', borderColor: phoneError ? '#ef4444' : undefined } }}
              />
              <button
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            {phoneError && step === 'ask-phone' && (
              <p className="text-red-600 text-xs mt-1">{phoneError}</p>
            )}
          </div>
        ) : step !== 'done' && messages.length === 0 ? (
          <div className="flex justify-center py-2">
            <Spinner label="Loading..." />
          </div>
        ) : null}
      </div>
    </div>
  );
}
