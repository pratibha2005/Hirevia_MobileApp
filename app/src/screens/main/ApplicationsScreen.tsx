import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated, Easing, Dimensions, RefreshControl, TextInput, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';

// ─── Exact Design Tokens from Design Analysis ────────────────────────────────
import { PALETTE as C, TYPOGRAPHY as T } from '../../theme/tokens';

// ─── Semantic Palette ─────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { label: string; accent: string; bg: string }> = {
  'New':          { label: 'SENT',         accent: C.onSurface, bg: C.surfaceLow },
  'Under Review': { label: 'REVIEW',       accent: C.onSurface, bg: C.surfaceLow },
  'Shortlisted':  { label: 'MATCHED',      accent: C.onSurface, bg: C.surfaceLow },
  'Interview':    { label: 'INTERVIEW',    accent: C.surface,   bg: C.primary },
  'Offer':        { label: 'OFFER',        accent: C.surface,   bg: C.primary },
  'Hired':        { label: 'HIRED',        accent: C.surface,   bg: C.primary },
  'Rejected':     { label: 'CLOSED',       accent: C.onSurfaceVariant, bg: C.surfaceContLow },
};

const FILTERS = ['All', 'Active', 'Interviews', 'Archived'];

// ─── Dummy Data ─────────────────────────────────────────────────────────────────
const DUMMY_APPLICATIONS = [
  {
    _id: '1',
    jobId: { title: 'Senior Visualizer', location: 'Remote', companyId: { name: 'Studio Arkhos' } },
    status: 'Interview',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    jobId: { title: 'Lead Experience Designer', location: 'London, UK', companyId: { name: 'Monolith Digital' } },
    status: 'New',
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    jobId: { title: 'Principal Strategist', location: 'Berlin', companyId: { name: 'Etherium Labs' } },
    status: 'Offer',
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    jobId: { title: 'Interaction Architect', location: 'New York', companyId: { name: 'Oblique Media' } },
    status: 'Rejected',
    appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// ─── Fade-In Wrapper ────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style }: any) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
      ]),
    ]).start();
  }, []);
  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

// ─── Minimal Application Card ──────────────────────────────────────────────────
function ApplicationItemCard({ item, index }: { item: any; index: number }) {
  const job = item.jobId || {};
  const company = job.companyId || {};
  const statusKey = item.status || 'New';
  const cfg = STATUS_COLORS[statusKey] || STATUS_COLORS['New'];
  const companyName = company.name || 'Unknown Studio';
  const jobTitle = job.title || 'Untitled Narrative';

  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <FadeIn delay={index * 50}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable 
           onPressIn={onPressIn}
           onPressOut={onPressOut}
           style={styles.cleanMotionCard} 
        >
          {/* Header Row (Status & Date) */}
          <View style={styles.cleanMotionHeaderRow}>
             <View style={[styles.cleanStagePill, { backgroundColor: cfg.bg }]}>
               <Text style={[styles.cleanStageText, { color: cfg.accent }]}>{cfg.label.toUpperCase()}</Text>
             </View>
             <Text style={styles.cleanDateText}>{new Date(item.appliedAt).toLocaleDateString().toUpperCase()}</Text>
          </View>

          {/* Hero Content */}
          <Text style={styles.cleanCompanyText}>{companyName}</Text>
          <Text style={styles.cleanRoleText}>{jobTitle}</Text>
          
          {/* Footer / Action Row */}
          <View style={styles.cleanActionRow}>
             <View style={styles.cleanDurationBox}>
                <Ionicons name="location-outline" size={14} color={C.onSurfaceVariant} />
                <Text style={styles.cleanDurationText}>{job.location || 'Remote'}</Text>
             </View>
             <TouchableOpacity style={styles.cleanJoinBtn}>
                <Text style={styles.cleanJoinBtnText}>VIEW STATUS</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFF" />
             </TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>
    </FadeIn>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────────────
export default function ApplicationsScreen() {
  const navigation = useNavigation<any>();
  const [applications, setApplications] = useState<any[]>(DUMMY_APPLICATIONS);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Search animation
  const searchHeight = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(searchHeight, {
       toValue: showSearch ? 72 : 0,
       duration: 300,
       easing: Easing.out(Easing.quad),
       useNativeDriver: false
    }).start();
  }, [showSearch]);

  const [tabLayouts, setTabLayouts] = useState<Record<string, { x: number; width: number }>>({});
  const translateX = useRef(new Animated.Value(0)).current;
  const indicatorWidth = useRef(new Animated.Value(0)).current;

  const handleTabLayout = (filter: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => ({ ...prev, [filter]: { x, width } }));
  };

  useEffect(() => {
    const layout = tabLayouts[activeFilter];
    if (layout) {
      Animated.parallel([
        Animated.spring(translateX, { toValue: layout.x, useNativeDriver: false, tension: 70, friction: 12 }),
        Animated.spring(indicatorWidth, { toValue: layout.width, useNativeDriver: false, tension: 70, friction: 12 }),
      ]).start();
    }
  }, [activeFilter, tabLayouts]);

  const fetchApplications = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await fetch(`${API_BASE_URL}/api/applications/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.applications?.length > 0) {
          setApplications(data.applications);
        }
      }
    } catch (e) { console.log('Failed to fetch applications'); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useFocusEffect(useCallback(() => { fetchApplications(); }, []));

  let filtered = applications;
  if (activeFilter === 'Active') {
    filtered = applications.filter(a => !['Rejected', 'Hired', 'Offer'].includes(a.status));
  } else if (activeFilter === 'Interviews') {
    filtered = applications.filter(a => ['Interview'].includes(a.status));
  } else if (activeFilter === 'Archived') {
    filtered = applications.filter(a => ['Rejected', 'Hired', 'Offer'].includes(a.status));
  }

  if (searchQuery) {
    filtered = filtered.filter(a => 
      a.jobId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.jobId?.companyId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* ─── Screen Header ─────────────────── */}
        <View style={styles.screenHeader}>
           <View>
              <Text style={styles.sectionLabel}>YOUR ARCHIVE</Text>
              <Text style={styles.sectionTitle}>Applications</Text>
           </View>
           <TouchableOpacity 
              onPress={() => setShowSearch(!showSearch)}
              style={styles.searchIconTap}
           >
              <Ionicons name="search" size={24} color={C.onSurface} strokeWidth={2} />
           </TouchableOpacity>
        </View>

        {/* ─── Search Box (Tonal Reveal) ────────────────────────── */}
        <Animated.View style={[styles.searchWrapper, { height: searchHeight, opacity: searchHeight.interpolate({ inputRange: [0, 72], outputRange: [0, 1] }) }]}>
           <View style={styles.gallerySearchArea}>
              <Ionicons name="search-outline" size={18} color={C.onSurfaceVariant} style={{ marginRight: 12 }} />
              <TextInput 
                placeholder="Search index..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={C.onSurfaceVariant}
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={C.onSurfaceVariant} />
                </TouchableOpacity>
              )}
           </View>
        </Animated.View>

        {/* ─── Filter Tabs (Micro-Typography Rule) ─────────────── */}
        <View style={styles.tabsContainer}>
          {FILTERS.map(f => {
            const isActive = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={styles.tabItem}
                onPress={() => setActiveFilter(f)}
                onLayout={(e) => handleTabLayout(f, e)}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{f.toUpperCase()}</Text>
              </TouchableOpacity>
            );
          })}
          <Animated.View
            style={[styles.tabUnderline, { width: indicatorWidth, transform: [{ translateX }] }]}
          />
        </View>

        {/* ─── Gallery List (Breathable Scroll) ──────────────────── */}
        {loading && !refreshing ? (
          <View style={styles.loader}>
            <ActivityIndicator size="small" color={C.primary} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => <ApplicationItemCard item={item} index={index} />}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => fetchApplications(true)} tintColor={C.primary} />
            }
            ListEmptyComponent={
              <View style={styles.emptyView}>
                <Text style={styles.emptyLabel}>END OF LIST</Text>
                {!searchQuery && (
                   <TouchableOpacity
                     style={styles.cleanJoinBtn}
                     onPress={() => navigation.navigate('Search')}
                   >
                     <Text style={styles.cleanJoinBtnText}>BROWSE JOBS</Text>
                   </TouchableOpacity>
                )}
              </View>
            }
          />
        )}

      </SafeAreaView>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  safeArea: { flex: 1 },

  // Header
  screenHeader: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  sectionTitle: { fontSize: 24, fontWeight: '600', color: C.onSurface, letterSpacing: -0.5 },
  searchIconTap: { padding: 4 },

  // Search
  searchWrapper: { paddingHorizontal: 24, overflow: 'hidden' },
  gallerySearchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.onSurface,
    height: '100%',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 8,
    marginTop: 4,
    position: 'relative',
  },
  tabItem: { paddingVertical: 14, paddingHorizontal: 16 },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  tabLabelActive: { color: C.onSurface, fontWeight: '700' },
  tabUnderline: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    height: 3,
    backgroundColor: C.primary,
    borderRadius: 1.5,
  },

  // List
  listContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Minimal Card Structure
  cleanMotionCard:   { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, marginBottom: 16 }, 
  cleanMotionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cleanStagePill:    { backgroundColor: C.surfaceLow, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  cleanStageText:    { fontSize: 10, fontWeight: '700', color: C.onSurface, letterSpacing: 1.5 },
  cleanDateText:     { fontSize: 10, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 1.0 },
  cleanCompanyText:  { fontSize: 13, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 8 },
  cleanRoleText:     { fontSize: 26, fontWeight: '300', color: C.onSurface, letterSpacing: -0.5, marginBottom: 24 }, 
  cleanActionRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cleanDurationBox:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cleanDurationText: { fontSize: 13, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.5 },
  cleanJoinBtn:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 100, gap: 8 },
  cleanJoinBtnText:  { fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1.5 },

  // Empty
  emptyView: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.onSurfaceVariant,
    letterSpacing: 1.5,
    marginBottom: 24,
  },
});
