import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../../api/config';
import ApplicationCard from './ApplicationCard';

// ─── Design System ────────────────────────────────────────────────────────────
const THEME = {
  primary:        '#4F46E5',
  primaryLight:   '#EEF2FF',
  background:     '#F8FAFC',
  surface:        '#FFFFFF',
  surfaceLow:     '#F1F5F9',
  text:           '#111827',
  textMuted:      '#6B7280',
  textSubtle:     '#9CA3AF',
  border:         '#E5E7EB',
  success:        '#22C55E',
  successLight:   '#F0FDF4',
  danger:         '#EF4444',
  dangerLight:    '#FEF2F2',
  warning:        '#F59E0B',
  warningLight:   '#FFFBEB',
  secondary:      '#06B6D4',
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  'New':         { color: THEME.primary,  bg: THEME.primaryLight, icon: 'time-outline',         label: 'Applied' },
  'Under Review':{ color: THEME.warning,  bg: THEME.warningLight, icon: 'eye-outline',           label: 'Under Review' },
  'Shortlisted': { color: THEME.success,  bg: THEME.successLight, icon: 'checkmark-circle-outline', label: 'Shortlisted' },
  'Rejected':    { color: THEME.textSubtle, bg: THEME.surfaceLow, icon: 'close-circle-outline',  label: 'Rejected' },
};

const FILTERS = ['All', 'Active', 'Shortlisted', 'Closed'];

// ─── Timeline Step ────────────────────────────────────────────────────────────
const PIPELINE_STEPS = ['Applied', 'Review', 'Shortlisted', 'Interview', 'Offer'];

function PipelineTimeline({ status }: { status: string }) {
  const activeIdx = status === 'New' ? 0 : status === 'Under Review' ? 1 : status === 'Shortlisted' ? 2 : status === 'Rejected' ? -1 : 0;
  if (activeIdx === -1) return null;

  return (
    <View style={tl.container}>
      {PIPELINE_STEPS.slice(0, 4).map((step, i) => (
        <View key={step} style={{ flex: 1, alignItems: 'center' }}>
          <View style={[tl.dot, i <= activeIdx ? tl.dotActive : tl.dotInactive]}>
            {i <= activeIdx && <View style={tl.dotInner} />}
          </View>
          {i < PIPELINE_STEPS.length - 2 && (
            <View style={[tl.line, i < activeIdx ? tl.lineActive : tl.lineInactive]} />
          )}
          <Text style={[tl.label, i <= activeIdx ? tl.labelActive : tl.labelInactive]} numberOfLines={1}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

const tl = StyleSheet.create({
  container:    { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, position: 'relative' },
  dot:          { width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  dotActive:    { backgroundColor: THEME.primary, borderWidth: 2, borderColor: THEME.primaryLight },
  dotInactive:  { backgroundColor: '#E5E7EB', borderWidth: 2, borderColor: '#F1F5F9' },
  dotInner:     { width: 5, height: 5, borderRadius: 3, backgroundColor: '#FFF' },
  line:         { position: 'absolute', top: 7, left: '50%', right: '-50%', height: 2, zIndex: 1 },
  lineActive:   { backgroundColor: THEME.primary },
  lineInactive: { backgroundColor: '#E5E7EB' },
  label:        { fontSize: 9, marginTop: 5, textAlign: 'center', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, maxWidth: 60 },
  labelActive:  { color: THEME.primary },
  labelInactive:{ color: THEME.textSubtle },
});

// ─── Application Card ─────────────────────────────────────────────────────────
function AppCard({ item }: { item: any }) {
  const job = item.jobId;
  const company = job?.companyId;
  const statusKey = item.status || 'New';
  const cfg = STATUS_CONFIG[statusKey] || STATUS_CONFIG['New'];
  const companyName = company?.name || 'Unknown Company';
  const jobTitle = job?.title || 'Unknown Role';
  const location = job?.location || 'Remote';
  const appliedDate = new Date(item.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <View style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={styles.companyLogoWrapper}>
          <Text style={styles.companyLogoText}>{companyName.charAt(0)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>{jobTitle}</Text>
          <Text style={styles.companyName}>{companyName}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.metaChip}>
              <Ionicons name="location-outline" size={10} color={THEME.textMuted} />
              <Text style={styles.metaText}>{location}</Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="calendar-outline" size={10} color={THEME.textMuted} />
              <Text style={styles.metaText}>{appliedDate}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusPill, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon as any} size={10} color={cfg.color} style={{ marginRight: 3 }} />
          <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </View>

      {/* Pipeline tracker */}
      {statusKey !== 'Rejected' && <PipelineTimeline status={statusKey} />}
      {statusKey === 'Rejected' && (
        <View style={styles.rejectedBar}>
          <Ionicons name="close-circle" size={13} color={THEME.danger} />
          <Text style={styles.rejectedText}>Application not selected this time</Text>
        </View>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchApplications = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/applications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setApplications(data.applications);
    } catch (e) {
      console.error('Failed to fetch applications', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchApplications(); }, []));

  const filtered = applications.filter(a => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return ['New', 'Under Review'].includes(a.status);
    if (activeFilter === 'Shortlisted') return a.status === 'Shortlisted';
    if (activeFilter === 'Closed') return a.status === 'Rejected';
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Applications</Text>
          <Text style={styles.headerSub}>Track your pipeline progress</Text>
        </View>
        <View style={styles.headerStats}>
          <Text style={styles.statNum}>{applications.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <AppCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchApplications(true)} tintColor={THEME.primary} colors={[THEME.primary]} />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 60 }} />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="document-text-outline" size={32} color={THEME.textSubtle} />
              </View>
              <Text style={styles.emptyTitle}>No applications yet</Text>
              <Text style={styles.emptySub}>Start browsing jobs and apply to see them here.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: THEME.background },

  // Header
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, backgroundColor: THEME.surface, borderBottomWidth: 1, borderBottomColor: THEME.border },
  headerTitle:        { fontSize: 22, fontWeight: '800', color: THEME.text, letterSpacing: -0.4 },
  headerSub:          { fontSize: 13, color: THEME.textMuted, marginTop: 2 },
  headerStats:        { alignItems: 'center', backgroundColor: THEME.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: THEME.primary + '30' },
  statNum:            { fontSize: 20, fontWeight: '800', color: THEME.primary, letterSpacing: -0.4 },
  statLabel:          { fontSize: 10, color: THEME.primary + 'AA', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Filters
  filterRow:          { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8, backgroundColor: THEME.surface, borderBottomWidth: 1, borderBottomColor: THEME.border },
  filterTab:          { flex: 1, paddingVertical: 7, borderRadius: 10, alignItems: 'center', backgroundColor: THEME.surfaceLow, borderWidth: 1, borderColor: THEME.border },
  filterTabActive:    { backgroundColor: THEME.primary, borderColor: THEME.primary },
  filterText:         { fontSize: 12, fontWeight: '700', color: THEME.textMuted },
  filterTextActive:   { color: '#FFF' },

  // List
  listContent:        { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 120, gap: 12 },

  // Card
  card:               { backgroundColor: THEME.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader:         { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  companyLogoWrapper: { width: 44, height: 44, borderRadius: 12, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', shadowColor: THEME.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3, shrink: 0 } as any,
  companyLogoText:    { fontSize: 18, fontWeight: '800', color: '#FFF' },
  cardInfo:           { flex: 1 },
  jobTitle:           { fontSize: 15, fontWeight: '700', color: THEME.text, letterSpacing: -0.2, marginBottom: 2 },
  companyName:        { fontSize: 12, color: THEME.textMuted, fontWeight: '500', marginBottom: 6 },
  cardMeta:           { flexDirection: 'row', gap: 8 },
  metaChip:           { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText:           { fontSize: 10, color: THEME.textMuted, fontWeight: '500' },
  statusPill:         { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 },
  statusText:         { fontSize: 10, fontWeight: '700' },

  // Rejected
  rejectedBar:        { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: THEME.border },
  rejectedText:       { fontSize: 11, color: THEME.danger, fontWeight: '600' },

  // Empty state
  emptyState:         { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  emptyIcon:          { width: 72, height: 72, borderRadius: 20, backgroundColor: THEME.surfaceLow, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: THEME.border },
  emptyTitle:         { fontSize: 17, fontWeight: '700', color: THEME.text, marginBottom: 6 },
  emptySub:           { fontSize: 13, color: THEME.textMuted, textAlign: 'center', lineHeight: 20 },
});
