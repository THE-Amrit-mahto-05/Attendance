import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BatchService, ReportsService } from '../src/services/api';

export default function DefaultersScreen() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [threshold, setThreshold] = useState('75');
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const loadBatches = async () => {
      const data = await BatchService.list();
      setBatches(data);
      setSelectedBatch((prev) => prev || (data[0]?._id ?? ''));
    };
    loadBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatch) return;
    setLoading(true);
    ReportsService.defaulters({
      batch: selectedBatch,
      month: Number(month),
      year: Number(year),
      threshold: Number(threshold),
    })
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [selectedBatch, month, year, threshold]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Defaulter Filters</Text>
      <View style={styles.card}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedBatch}
            onValueChange={setSelectedBatch}
            style={styles.picker}
            dropdownIconColor="#bae6fd"
          >
            {batches.map((batch) => (
              <Picker.Item key={batch._id} label={batch.name} value={batch._id} color="#0f172a" />
            ))}
          </Picker>
        </View>
        <View style={styles.filters}>
          <TextInput
            style={styles.input}
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
            placeholder="MM"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            placeholder="YYYY"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            style={styles.input}
            value={threshold}
            onChangeText={setThreshold}
            keyboardType="numeric"
            placeholder="%"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <Text style={styles.header}>Students below {threshold}%</Text>
      {loading ? (
        <ActivityIndicator color="#38bdf8" />
      ) : entries.length ? (
        entries.map((entry) => (
          <View key={entry.student._id} style={styles.entryCard}>
            <View>
              <Text style={styles.entryName}>{entry.student.name}</Text>
              <Text style={styles.entryMeta}>#{entry.student.rollNumber}</Text>
            </View>
            <Text style={styles.entryPercent}>{entry.percentage}%</Text>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>Great news! No defaulters for this filter.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
    padding: 16,
  },
  header: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  pickerWrapper: {
    backgroundColor: '#111827',
    borderRadius: 16,
  },
  picker: {
    color: '#f8fafc',
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
  },
  entryCard: {
    backgroundColor: '#0b1120',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  entryMeta: {
    color: '#94a3b8',
    marginTop: 2,
  },
  entryPercent: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '700',
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
});

