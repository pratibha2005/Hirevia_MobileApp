import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Animated, Easing, Dimensions, RefreshControl, TextInput, Pressable, ImageBackground } from 'react-native';
import SkeletonLoader from '../../components/SkeletonLoader';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';

// ─── Exact Design Tokens ──────────────────────────────────────────────────────
const C = {
  background:     '#F3F3F3', // Pure Matte Light Grey
  surface:        '#FFFFFF', // Pure White for cards
  surfaceLow:     '#FAFAFA', // Ultra-soft grey for chips
  primary:        '#2C2C2C', // Deep Matte Dark Grey
  primaryLight:   '#EBEBEB', // Soft structural grey
  onSurface:      '#1A1A1A', // Matte Black
  onSurfaceVar:   '#7A7A7A', // Matte medium grey
  outlineVar:     '#E6E6E6', // Barely visible structure line
};

const STATUS_COLORS: Record<string, { label: string; accent: string; bg: string }> = {
  'New':          { label: 'SENT',         accent: C.onSurface, bg: C.primaryLight },
  'Under Review': { label: 'REVIEW',       accent: C.onSurface, bg: C.primaryLight },
  'Shortlisted':  { label: 'MATCHED',      accent: C.onSurface, bg: C.primaryLight },
  'Interview':    { label: 'INTERVIEW',    accent: C.surface,   bg: C.primary },
  'Offer':        { label: 'OFFER',        accent: C.surface,   bg: C.primary },
  'Hired':        { label: 'HIRED',        accent: C.surface,   bg: C.primary },
  'Rejected':     { label: 'CLOSED',       accent: C.onSurfaceVar, bg: C.outlineVar },
};

const FILTERS = ['All', 'Active', 'Interviews', 'Archived'];

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

function ApplicationItemCard({ item, index }: { item: any; index: number }) {
  const job = item.jobId || {};
  const company = job.companyId || {};
  const statusKey = item.status || 'New';
  const cfg = STATUS_COLORS[statusKey] || STATUS_COLORS['New'];
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <FadeIn delay={index * 50}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={styles.cleanMotionCard}>
          <View style={styles.cleanMotionHeaderRow}>
             <View style={[styles.cleanStagePill, { backgroundColor: cfg.bg }]}><Text style={[styles.cleanStageText, { color: cfg.accent }]}>{cfg.label.toUpperCase()}</Text></View>
             <Text style={styles.cleanDateText}>{new Date(item.appliedAt).toLocaleDateString().toUpperCase()}</Text>
          </View>
          <Text style={styles.cleanCompanyText}>{company.name || 'Unknown Studio'}</Text>
          <Text style={styles.cleanRoleText}>{job.title || 'Untitled Narrative'}</Text>
          <View style={styles.cleanActionRow}>
             <View style={styles.cleanDurationBox}>
                <Ionicons name="location-outline" size={14} color={C.onSurfaceVar} />
                <Text style={styles.cleanDurationText}>{job.location || 'Remote'}</Text>
             </View>
             <TouchableOpacity style={styles.cleanJoinBtn}><Text style={styles.cleanJoinBtnText}>VIEW STATUS</Text><Ionicons name="arrow-forward" size={14} color="#FFF" /></TouchableOpacity>
          </View>
        </Pressable>
      </Animated.View>
    </FadeIn>
  );
}

export default function ApplicationsScreen() {
  const navigation = useNavigation<any>();
  const [applications, setApplications] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(searchHeight, { toValue: showSearch ? 72 : 0, duration: 300, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
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
        const res = await fetch(`${API_BASE_URL}/api/applications/my`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (data.success) setApplications(data.applications || []);
      }
    } catch (e) { console.log(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useFocusEffect(useCallback(() => { fetchApplications(); }, []));

  let filtered = applications;
  if (activeFilter === 'Active') filtered = applications.filter(a => !['Rejected', 'Hired', 'Offer'].includes(a.status));
  else if (activeFilter === 'Interviews') filtered = applications.filter(a => ['Interview'].includes(a.status));
  else if (activeFilter === 'Archived') filtered = applications.filter(a => ['Rejected', 'Hired', 'Offer'].includes(a.status));

  if (searchQuery) {
    filtered = filtered.filter(a => a.jobId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.jobId?.companyId?.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.screenHeader}>
           <View><Text style={styles.sectionLabel}>YOUR ARCHIVE</Text><Text style={styles.sectionTitle}>Applications</Text></View>
           <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.searchIconTap}><Ionicons name="search" size={24} color={C.onSurface} /></TouchableOpacity>
        </View>

        <Animated.View style={[styles.searchWrapper, { height: searchHeight, opacity: searchHeight.interpolate({ inputRange: [0, 72], outputRange: [0, 1] }) }]}>
           <View style={styles.gallerySearchArea}>
              <Ionicons name="search-outline" size={18} color={C.onSurfaceVar} style={{ marginRight: 12 }} />
              <TextInput placeholder="Search index..." style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor={C.onSurfaceVar} />
           </View>
        </Animated.View>

        <View style={styles.tabsContainer}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={styles.tabItem} onPress={() => setActiveFilter(f)} onLayout={(e) => handleTabLayout(f, e)}>
              <Text style={[styles.tabLabel, activeFilter === f && styles.tabLabelActive]}>{f.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
          <Animated.View style={[styles.tabUnderline, { width: indicatorWidth, transform: [{ translateX }] }]} />
        </View>

        {loading && !refreshing ? (
          <View style={styles.listContainer}>
             {[1, 2, 3].map(i => (
               <View key={i} style={styles.cleanMotionCard}>
                  <View style={styles.cleanMotionHeaderRow}>
                     <SkeletonLoader width={80} height={20} borderRadius={4} />
                     <SkeletonLoader width={60} height={10} />
                  </View>
                  <SkeletonLoader width={120} height={14} style={{ marginBottom: 12 }} />
                  <SkeletonLoader width={200} height={28} style={{ marginBottom: 24 }} />
                  <View style={styles.cleanActionRow}>
                     <SkeletonLoader width={100} height={16} />
                     <SkeletonLoader width={120} height={40} borderRadius={100} />
                  </View>
               </View>
             ))}
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => <ApplicationItemCard item={item} index={index} />}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchApplications(true)} tintColor={C.primary} />}
            ListEmptyComponent={
              <View style={styles.emptyView}>
                <LottieView source={require('../../../assets/animations/no_item_found.json')} autoPlay loop style={{ width: 200, height: 200 }} />
                <Text style={styles.emptyLabel}>END OF LIST</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.background },
  safeArea: { flex: 1 },
  screenHeader: { paddingHorizontal: 24, marginTop: 20, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: { fontSize: 10, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  sectionTitle: { fontSize: 24, fontWeight: '600', color: C.onSurface, letterSpacing: -0.5 },
  searchIconTap: { padding: 4 },
  searchWrapper: { paddingHorizontal: 24, overflow: 'hidden' },
  gallerySearchArea: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 18, height: 52, borderWidth: 1, borderColor: C.outlineVar },
  searchInput: { flex: 1, fontSize: 14, color: C.onSurface, height: '100%' },
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 8, marginTop: 4, position: 'relative' },
  tabItem: { paddingVertical: 14, paddingHorizontal: 16 },
  tabLabel: { fontSize: 11, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 1.5 },
  tabLabelActive: { color: C.onSurface, fontWeight: '700' },
  tabUnderline: { position: 'absolute', bottom: -1, left: 0, height: 3, backgroundColor: C.primary, borderRadius: 1.5 },
  listContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },
  cleanMotionCard:   { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: C.outlineVar, marginBottom: 16 }, 
  cleanMotionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cleanStagePill:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  cleanStageText:    { fontSize: 10, fontWeight: '700', color: C.onSurface, letterSpacing: 1.5 },
  cleanDateText:     { fontSize: 10, fontWeight: '700', color: C.onSurfaceVar, letterSpacing: 1.0 },
  cleanCompanyText:  { fontSize: 13, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 0.5, marginBottom: 8 },
  cleanRoleText:     { fontSize: 26, fontWeight: '300', color: C.onSurface, letterSpacing: -0.5, marginBottom: 24 }, 
  cleanActionRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cleanDurationBox:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cleanDurationText: { fontSize: 13, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 0.5 },
  cleanJoinBtn:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 100, gap: 8 },
  cleanJoinBtnText:  { fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1.5 },
  emptyView: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyLabel: { fontSize: 11, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 1.5, marginBottom: 24 },
});
