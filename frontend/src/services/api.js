import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const resolveApiUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl;

  // Defaults based on platform
  if (Platform.OS === 'android') return 'http://10.0.2.2:4000/api';
  return 'http://localhost:4000/api'; // web & iOS
};

const API_URL = resolveApiUrl();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const BatchService = {
  list: async () => {
    const { data } = await api.get('/batches');
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/batches', payload);
    return data;
  },
};

export const StudentService = {
  list: async (batch) => {
    const { data } = await api.get('/students', {
      params: batch ? { batch } : undefined,
    });
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post('/students', payload);
    return data;
  },
};

export const AttendanceService = {
  byBatchAndDate: async ({ batch, date }) => {
    const { data } = await api.get('/attendance', {
      params: { batch, date },
    });
    return data;
  },
  bulkSave: async ({ batch, date, records }) => {
    await api.post('/attendance/bulk', { batch, date, records });
  },
};

export const ReportsService = {
  student: async (studentId) => {
    const { data } = await api.get(`/reports/student/${studentId}`);
    return data;
  },
  batchSummary: async (params) => {
    const { data } = await api.get('/reports/batch-summary', { params });
    return data;
  },
  defaulters: async (params) => {
    const { data } = await api.get('/reports/defaulters', { params });
    return data;
  },
};
