import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { BatchService, StudentService } from '../src/services/api';

export default function StudentsScreen() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('');
  const [form, setForm] = useState({
    name: '',
    rollNumber: '',
    batch: '',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadBatches = async () => {
      const batchData = await BatchService.list();
      setBatches(batchData);
      setForm((prev) => ({
        ...prev,
        batch: prev.batch || (batchData[0]?._id ?? ''),
      }));
    };
    loadBatches();
  }, []);

  const loadStudents = async (batchId = '') => {
    setLoading(true);
    try {
      const data = await StudentService.list(batchId || undefined);
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents(selectedBatchFilter);
  }, [selectedBatchFilter]);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.rollNumber.trim() || !form.batch) return;
    setSaving(true);
    try {
      await StudentService.create({
        name: form.name.trim(),
        rollNumber: form.rollNumber.trim(),
        batch: form.batch,
        contactNumber: form.contactNumber.trim(),
      });
      setForm((prev) => ({ ...prev, name: '', rollNumber: '', contactNumber: '' }));
      await loadStudents(selectedBatchFilter);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Add a Student</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#94a3b8"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Roll number"
          placeholderTextColor="#94a3b8"
          value={form.rollNumber}
          onChangeText={(text) => setForm((prev) => ({ ...prev, rollNumber: text }))}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.batch}
            onValueChange={(value) => setForm((prev) => ({ ...prev, batch: value }))}
            style={styles.picker}
            dropdownIconColor="#bae6fd"
          >
            {batches.map((batch) => (
              <Picker.Item key={batch._id} label={batch.name} value={batch._id} color="#0f172a" />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Contact number"
          placeholderTextColor="#94a3b8"
          value={form.contactNumber}
          onChangeText={(text) => setForm((prev) => ({ ...prev, contactNumber: text }))}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save Student'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.header}>Students</Text>
        <View style={[styles.pickerWrapper, { width: 180 }]}>
          <Picker
            selectedValue={selectedBatchFilter}
            onValueChange={setSelectedBatchFilter}
            style={styles.picker}
            dropdownIconColor="#bae6fd"
          >
            <Picker.Item label="All batches" value="" color="#0f172a" />
            {batches.map((batch) => (
              <Picker.Item key={batch._id} label={batch.name} value={batch._id} color="#0f172a" />
            ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#38bdf8" />
      ) : students.length ? (
        students.map((student) => (
          <View key={student._id} style={styles.studentCard}>
            <View>
              <Text style={styles.studentName}>
                {student.name}{' '}
                <Text style={{ color: '#38bdf8', fontSize: 13 }}>#{student.rollNumber}</Text>
              </Text>
              {typeof student.batch === 'object' && student.batch ? (
                <Text style={styles.studentMeta}>{student.batch.name}</Text>
              ) : null}
              {student.contactNumber ? (
                <Text style={styles.studentContact}>☎ {student.contactNumber}</Text>
              ) : null}
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>No students found for this filter.</Text>
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
    gap: 10,
  },
  input: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
  },
  pickerWrapper: {
    backgroundColor: '#111827',
    borderRadius: 12,
  },
  picker: {
    color: '#f8fafc',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentCard: {
    backgroundColor: '#0b1120',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  studentName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  studentMeta: {
    color: '#94a3b8',
    marginTop: 4,
  },
  studentContact: {
    color: '#cbd5f5',
    marginTop: 6,
    fontSize: 13,
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
  },
});

