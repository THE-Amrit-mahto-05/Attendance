import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const quickLinks = [
  { title: 'Mark Attendance', subtitle: 'Swipe by batch & date', href: '/(tabs)/attendance' },
  { title: 'Insights', subtitle: 'Stats & defaulters', href: '/(tabs)/insights' },
  { title: 'Batches', subtitle: 'Create or edit classes', href: '/batches' },
  { title: 'Students', subtitle: 'Roster & contacts', href: '/students' },
  { title: 'Defaulters', subtitle: 'Full monthly view', href: '/defaulters' },
];

const highlights = [
  { label: 'Overall Attendance', value: '92%' },
  { label: 'Today Present', value: '134' },
  { label: 'Batches Active', value: '08' },
];

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <LinearGradient colors={['#0ea5e9', '#6366f1']} style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>ClassCheck</Text>
            <Text style={styles.heroTitle}>Stay ahead of attendance</Text>
            <Text style={styles.heroBody}>
              Jump back into marking, check trends, and catch defaulters before the month ends.
            </Text>
          </View>
          <View style={styles.heroStats}>
            {highlights.map((item) => (
              <View key={item.label} style={styles.heroStat}>
                <Text style={styles.heroStatValue}>{item.value}</Text>
                <Text style={styles.heroStatLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          {quickLinks.map((item) => (
            <Link key={item.title} href={item.href} asChild>
              <TouchableOpacity style={styles.quickCard}>
                <Text style={styles.quickTitle}>{item.title}</Text>
                <Text style={styles.quickSubtitle}>{item.subtitle}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <View style={styles.timeline}>
          <View style={styles.timelineHeader}>
            <Text style={styles.sectionTitle}>Today&apos;s Timeline</Text>
            <Text style={styles.timelineDate}>Fri, {new Date().toLocaleDateString()}</Text>
          </View>
          {['Morning Physics', 'Math Sprint', 'Evening Revision'].map((slot, index) => (
            <View key={slot} style={styles.timelineRow}>
              <View style={styles.bullet} />
              <View>
                <Text style={styles.timelineTitle}>{slot}</Text>
                <Text style={styles.timelineMeta}>
                  {index === 0 ? '7:00 AM' : index === 1 ? '2:00 PM' : '6:00 PM'} • 40 students
                </Text>
              </View>
              <Link href="/(tabs)/attendance" asChild>
                <TouchableOpacity style={styles.timelineButton}>
                  <Text style={styles.timelineButtonText}>Mark</Text>
                </TouchableOpacity>
              </Link>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000000ff',
  },
  container: {
    padding: 20,
    gap: 24,
  },
  hero: {
    borderRadius: 28,
    padding: 20,
    minHeight: 220,
    justifyContent: 'space-between',
    shadowColor: '#0ea5e9',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
  },
  kicker: {
    color: '#bbf7d0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 13,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroBody: {
    color: '#e0f2fe',
    fontSize: 15,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  heroStat: {
    backgroundColor: '#ffffff20',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  heroStatValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  heroStatLabel: {
    color: '#e2e8f0',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '600',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 16,
    width: '47%',
    minHeight: 110,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1d4ed8',
  },
  quickTitle: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  quickSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
  },
  timeline: {
    backgroundColor: '#0b1120',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineDate: {
    color: '#94a3b8',
    fontSize: 13,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38bdf8',
  },
  timelineTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  timelineMeta: {
    color: '#94a3b8',
    fontSize: 12,
  },
  timelineButton: {
    marginLeft: 'auto',
    backgroundColor: '#22d3ee30',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#22d3ee',
  },
  timelineButtonText: {
    color: '#22d3ee',
    fontWeight: '600',
  },
});

