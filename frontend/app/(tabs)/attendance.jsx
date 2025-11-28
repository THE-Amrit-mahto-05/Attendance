import { Picker } from '@react-native-picker/picker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AttendanceService, BatchService, StudentService } from '../../src/services/api';

const STATUS_OPTIONS = [
  { key: 'PRESENT', label: 'Present', color: '#22c55e' },
  { key: 'ABSENT', label: 'Absent', color: '#ef4444' },
  { key: 'LATE', label: 'Late', color: '#fbbf24' },
];

export default function AttendanceScreen() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadBatches = async () => {
      const data = await BatchService.list();
      setBatches(data);
      let initial = '';
      for (const b of data) {
        const roster = await StudentService.list(b._id);
        if (roster.length > 0) {
          initial = b._id;
          break;
        }
      }
      setSelectedBatch((prev) => prev || initial || (data[0]?._id ?? ''));
    };
    loadBatches();
  }, []);

  const fetchAttendance = useCallback(async (opts = { silent: false }) => {
    if (!selectedBatch) return;
    if (opts.silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await AttendanceService.byBatchAndDate({
        batch: selectedBatch,
        date,
      });
      setRows(data);
    } finally {
      if (opts.silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [selectedBatch, date]);

  useEffect(() => {
    if (!selectedBatch) return;
    fetchAttendance();
  }, [fetchAttendance, selectedBatch]);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      },
      { PRESENT: 0, ABSENT: 0, LATE: 0 }
    );
  }, [rows]);

  const updateRow = (studentId, status) => {
    setRows((current) =>
      current.map((row) =>
        row.student._id === studentId
          ? {
              ...row,
              status,
            }
          : row
      )
    );
  };

  const handleSave = async () => {
    if (!selectedBatch || rows.length === 0) return;
    setSaving(true);
    try {
      await AttendanceService.bulkSave({
        batch: selectedBatch,
        date,
        records: rows.map((row) => ({
          student: row.student._id,
          status: row.status,
          remarks: row.remarks,
        })),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedBatch}
            onValueChange={(value) => setSelectedBatch(value)}
            dropdownIconColor="#bae6fd"
            style={styles.picker}
          >
            {batches.map((batch) => (
              <Picker.Item key={batch._id} label={batch.name} value={batch._id} color="#0f172a" />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.summaryRow}>
        {STATUS_OPTIONS.map((option) => (
          <View key={option.key} style={[styles.summaryCard, { borderColor: option.color }]}>
            <Text style={styles.summaryValue}>{summary[option.key] ?? 0}</Text>
            <Text style={[styles.summaryLabel, { color: option.color }]}>{option.label}</Text>
          </View>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#38bdf8" />
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.student._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchAttendance({ silent: true })} />
          }
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={styles.emptyState}>
              No students found for this batch. Head to the Students screen to add a roster.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View>
                <Text style={styles.name}>{item.student.name}</Text>
                <Text style={styles.meta}>Roll #{item.student.rollNumber}</Text>
              </View>
              <View style={styles.statusGroup}>
                {STATUS_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.statusButton,
                      item.status === option.key && { backgroundColor: `${option.color}40`, borderColor: option.color },
                    ]}
                    onPress={() => updateRow(item.student._id, option.key)}
                  >
                    <Text
                      style={[
                        styles.statusLabel,
                        item.status === option.key && { color: option.color },
                      ]}
                    >
                      {option.label[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Saving…' : 'Save Attendance'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    padding: 16,
    gap: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 14,
  },
  picker: {
    color: '#f8fafc',
  },
  input: {
    width: 150,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingHorizontal: 14,
    color: '#f8fafc',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    alignItems: 'center',
  },
  summaryValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  name: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    color: '#94a3b8',
    marginTop: 2,
  },
  statusGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  statusButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusLabel: {
    color: '#cbd5f5',
    fontWeight: '600',
  },
  emptyState: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 60,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#021016',
    fontWeight: '700',
    fontSize: 16,
  },
});
