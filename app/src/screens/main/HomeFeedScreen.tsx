import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Image, ActivityIndicator, RefreshControl, ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';

// ─── Design System ────────────────────────────────────────────────────────────
const THEME = {
  primary:        '#4F46E5',
  primaryHover:   '#4338CA',
  primaryLight:   '#EEF2FF',
  secondary:      '#06B6D4',
  secondaryLight: '#ECFEFF',
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
  warning:        '#F59E0B',
  warningLight:   '#FFFBEB',
};

const CATEGORIES = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Data'];

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ item, onPress }: { item: any; onPress: () => void }) {
  const matchScore = item.matchScore || Math.floor(70 + Math.random() * 29);
  const scoreColor = matchScore >= 90 ? THEME.success : matchScore >= 75 ? THEME.primary : THEME.warning;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.92} onPress={onPress}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.logo }} style={styles.companyLogo} />
        <View style={styles.cardTitleContainer}>
          <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
        </View>
        {/* Match score badge */}
        <View style={[styles.matchBadge, { borderColor: scoreColor + '40', backgroundColor: scoreColor + '12' }]}>
          <Text style={[styles.matchText, { color: scoreColor }]}>{matchScore}%</Text>
          <Text style={[styles.matchLabel, { color: scoreColor + 'CC' }]}>Match</Text>
        </View>
      </View>

      {/* Details row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailChip}>
          <Ionicons name="location-outline" size={12} color={THEME.textMuted} />
          <Text style={styles.detailChipText}>{item.location}</Text>
        </View>
        <View style={styles.detailChip}>
          <Ionicons name="time-outline" size={12} color={THEME.textMuted} />
          <Text style={styles.detailChipText}>{item.type || 'Full-time'}</Text>
        </View>
        {item.salary && (
          <View style={styles.detailChip}>
            <Ionicons name="cash-outline" size={12} color={THEME.textMuted} />
            <Text style={styles.detailChipText}>{item.salary}</Text>
          </View>
        )}
      </View>

      {/* Skills tags + bookmark */}
      <View style={styles.cardFooter}>
        <View style={styles.tagsRow}>
          {(item.tags || []).slice(0, 3).map((tag: string, idx: number) => (
            <View key={idx} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
          {(item.tags || []).length > 3 && (
            <View style={[styles.tag, { backgroundColor: THEME.primaryLight, borderColor: THEME.primary + '30' }]}>
              <Text style={[styles.tagText, { color: THEME.primary }]}>+{item.tags.length - 3}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Ionicons name="bookmark-outline" size={16} color={THEME.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeFeedScreen() {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('All');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('there');
  const [searchText, setSearchText] = useState('');

  const fetchJobs = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs.map((j: any) => ({
          id: j._id,
          title: j.title,
          company: j.companyId?.name || 'Unknown Company',
          location: j.location,
          salary: j.salary || null,
          type: j.type || 'Full-time',
          tags: j.skills || [],
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(j.companyId?.name || 'Co')}&background=4F46E5&color=fff&size=120&bold=true`,
          description: j.description,
          screeningQuestions: j.screeningQuestions || [],
          matchScore: Math.floor(70 + Math.random() * 29),
        })));
      }
    } catch (e) {
      console.error('Failed to fetch jobs', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    AsyncStorage.getItem('user').then(u => {
      if (u) {
        const parsed = JSON.parse(u);
        setUserName(parsed.name?.split(' ')[0] || 'there');
      }
    });
  }, []);

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = searchText === '' ||
      j.title.toLowerCase().includes(searchText.toLowerCase()) ||
      j.company.toLowerCase().includes(searchText.toLowerCase());
    const matchesCat = activeCategory === 'All' ||
      j.tags?.some((t: string) => t.toLowerCase().includes(activeCategory.toLowerCase())) ||
      j.title.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName} 👋</Text>
          <Text style={styles.headerSub}>Find your next opportunity</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color={THEME.text} />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={THEME.textMuted} style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search jobs, companies..."
            placeholderTextColor={THEME.textSubtle}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color={THEME.textSubtle} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options" size={20} color={THEME.surface} />
        </TouchableOpacity>
      </View>

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Jobs list */}
      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <JobCard item={item} onPress={() => navigation.navigate('JobDetails', { job: item })} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchJobs(true)}
            tintColor={THEME.primary}
            colors={[THEME.primary]}
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.resultCount}>
              {loading ? 'Loading...' : `${filteredJobs.length} position${filteredJobs.length !== 1 ? 's' : ''} found`}
            </Text>
            <TouchableOpacity style={styles.sortBtn}>
              <Ionicons name="swap-vertical" size={14} color={THEME.textMuted} />
              <Text style={styles.sortText}>Best match</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 60 }} />
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="briefcase-outline" size={32} color={THEME.textSubtle} />
              </View>
              <Text style={styles.emptyTitle}>No jobs found</Text>
              <Text style={styles.emptySub}>Try adjusting your search or filters</Text>
              <TouchableOpacity style={styles.emptyAction} onPress={() => { setSearchText(''); setActiveCategory('All'); }}>
                <Text style={styles.emptyActionText}>Clear filters</Text>
              </TouchableOpacity>
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
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  greeting:           { fontSize: 20, fontWeight: '700', color: THEME.text, letterSpacing: -0.4 },
  headerSub:          { fontSize: 13, color: THEME.textMuted, marginTop: 2, fontWeight: '500' },
  notifBtn:           { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2, position: 'relative' },
  notifDot:           { position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.danger, borderWidth: 1.5, borderColor: THEME.surface },

  // Search
  searchWrapper:      { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16, gap: 10 },
  searchBar:          { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, borderRadius: 14, paddingLeft: 14, paddingRight: 12, paddingVertical: 10, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  searchInput:        { flex: 1, fontSize: 14, color: THEME.text, fontWeight: '500', padding: 0 },
  filterBtn:          { width: 44, height: 44, borderRadius: 14, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', shadowColor: THEME.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },

  // Categories
  catScroll:          { maxHeight: 44, marginBottom: 16 },
  catChip:            { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border },
  catChipActive:      { backgroundColor: THEME.primary, borderColor: THEME.primary },
  catText:            { fontSize: 13, fontWeight: '600', color: THEME.textMuted },
  catTextActive:      { color: '#FFFFFF' },

  // List
  listContent:        { paddingHorizontal: 20, paddingBottom: 120 },
  listHeader:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultCount:        { fontSize: 13, fontWeight: '700', color: THEME.text },
  sortBtn:            { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText:           { fontSize: 12, color: THEME.textMuted, fontWeight: '600' },

  // Card
  card:               { backgroundColor: THEME.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  cardHeader:         { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  companyLogo:        { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: THEME.border, backgroundColor: THEME.surfaceLow },
  cardTitleContainer: { flex: 1 },
  jobTitle:           { fontSize: 15, fontWeight: '700', color: THEME.text, letterSpacing: -0.2, marginBottom: 2 },
  companyName:        { fontSize: 12, color: THEME.textMuted, fontWeight: '500' },
  matchBadge:         { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  matchText:          { fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
  matchLabel:         { fontSize: 9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 1 },

  // Details
  detailsRow:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  detailChip:         { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: THEME.surfaceLow, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  detailChipText:     { fontSize: 11, color: THEME.textMuted, fontWeight: '500' },

  // Footer
  cardFooter:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTopWidth: 1, borderTopColor: THEME.border },
  tagsRow:            { flexDirection: 'row', flexWrap: 'wrap', gap: 5, flex: 1 },
  tag:                { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: THEME.surfaceLow, borderWidth: 1, borderColor: THEME.border },
  tagText:            { fontSize: 10, fontWeight: '600', color: THEME.textMuted },
  bookmarkBtn:        { padding: 4, marginLeft: 8 },

  // Empty state
  emptyState:         { alignItems: 'center', marginTop: 60, paddingHorizontal: 32 },
  emptyIcon:          { width: 72, height: 72, borderRadius: 20, backgroundColor: THEME.surfaceLow, justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: THEME.border },
  emptyTitle:         { fontSize: 17, fontWeight: '700', color: THEME.text, marginBottom: 6 },
  emptySub:           { fontSize: 13, color: THEME.textMuted, textAlign: 'center', lineHeight: 20 },
  emptyAction:        { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, backgroundColor: THEME.primaryLight, borderWidth: 1, borderColor: THEME.primary + '30' },
  emptyActionText:    { fontSize: 13, fontWeight: '700', color: THEME.primary },
});
