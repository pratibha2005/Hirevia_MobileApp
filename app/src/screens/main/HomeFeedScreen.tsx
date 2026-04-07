import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import SkeletonLoader from '../../components/SkeletonLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';
import { PALETTE as C, TYPOGRAPHY as T } from '../../theme/tokens';

const { width } = Dimensions.get('window');

// ─── Bar Chart Data ──────────────────────────────────────────────────────────────
const CHART_DATA = [
  { day: 'Mon', value: 0.35 },
  { day: 'Tue', value: 0.55 },
  { day: 'Wed', value: 0.45 },
  { day: 'Thu', value: 0.70 },
  { day: 'Fri', value: 0.60 },
  { day: 'Sat', value: 0.80 },
  { day: 'Sun', value: 1.00 },
];
const MAX_BAR_HEIGHT = 56;
const BAR_ANIMS = CHART_DATA.map(() => new Animated.Value(0));

// ─── Animated Fade In ────────────────────────────────────────────────────────────
function FadeSlide({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);
  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}

// ─── Bar Chart ───────────────────────────────────────────────────────────────────
function BarChart({ data }: { data: typeof CHART_DATA }) {
  const breath = useRef(new Animated.Value(1)).current;
  const todayIndex = (new Date().getDay() + 6) % 7; // Sunday (0) -> 6, Monday (1) -> 0, etc.

  useEffect(() => {
    // Initial State: Reset all bars to 0
    BAR_ANIMS.forEach(anim => anim.setValue(0));
    
    // Staggered Elastic "Pop" Entry
    const springs = BAR_ANIMS.map((anim, i) => 
      Animated.spring(anim, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: false,
        delay: i * 50
      })
    );
    Animated.stagger(50, springs).start();

    // Looping breath for ONLY today's bar
    Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1.05, duration: 1500, useNativeDriver: false }),
        Animated.timing(breath, { toValue: 1, duration: 2500, useNativeDriver: false }),
      ])
    ).start();
  }, [data]);

  return (
    <View style={styles.chartContainer}>
      {data.map((bar, i) => {
        const isToday = i === todayIndex;
        const barHeight = BAR_ANIMS[i].interpolate({
          inputRange: [0, 1],
          outputRange: [2, bar.value * MAX_BAR_HEIGHT],
        });

        return (
          <View key={bar.day} style={styles.barCol}>
            <View style={styles.barTrack}>
              <Animated.View
                style={[
                  styles.barFill,
                  isToday ? styles.barFillActive : styles.barFillMuted,
                  { 
                    height: Animated.multiply(barHeight, isToday ? breath : 1),
                    opacity: isToday ? 1 : 0.8
                  },
                ]}
              />
            </View>
            <Text style={[styles.barLabel, isToday && styles.barLabelActive]}>
              {bar.day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Dynamic Image Helper ───────────────────────────────────────────────────────
const getJobImage = (title: string, company: string = '') => {
  const t = title.toLowerCase();
  const c = company.toLowerCase();
  if (t.includes('design') || t.includes('ux') || t.includes('ui')) return 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80';
  if (t.includes('develop') || t.includes('engineer')) return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';
};

// ─── Main Screen ────────────────────────────────────────────────────────────────
export default function HomeFeedScreen() {
  const navigation = useNavigation<any>();
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('there');
  const [dynamicChart, setDynamicChart] = useState(CHART_DATA);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const jobRes = await fetch(`${API_BASE_URL}/api/jobs`);
      const jobData = await jobRes.json();
      if (jobData.success) {
        const jobList = jobData.jobs.map((j: any) => {
          // 🖼️ Priority: Company Logo > HR Profile Image > Stock Fallback
          const rawLogo = j.companyId?.logoUrl || j.postedById?.profileImage;
          const logo = rawLogo 
            ? (rawLogo.startsWith('http') ? rawLogo : `${API_BASE_URL}${rawLogo}`) 
            : getJobImage(j.title, j.companyId?.name);

          // 👤 Normalize HR Profile Image if it exists
          const postedBy = j.postedById ? {
            ...j.postedById,
            profileImage: j.postedById.profileImage 
              ? (j.postedById.profileImage.startsWith('http') ? j.postedById.profileImage : `${API_BASE_URL}${j.postedById.profileImage}`)
              : undefined
          } : null;

          return {
            id: j._id,
            title: j.title,
            description: j.description,
            company: j.companyId?.name || 'Unknown Company',
            location: j.location,
            salary: j.salary || 'Salary not disclosed',
            type: j.type || 'Full-time',
            tags: j.skills || [],
            logo,
            postedBy,
          };
        });
        setJobs(jobList);
        setDynamicChart(CHART_DATA.map(d => ({ ...d, value: Math.min(1.0, d.value * (0.9 + Math.random() * 0.2) + (jobList.length / 100)) })));
      }
      if (token) {
        const appRes = await fetch(`${API_BASE_URL}/api/applications/my`, { headers: { Authorization: `Bearer ${token}` } });
        const appData = await appRes.json();
        if (appData.success) setApplications(appData.applications);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => {
    fetchData();
    AsyncStorage.getItem('user').then(u => { if (u) setUserName(JSON.parse(u).name?.split(' ')[0] || 'there'); });
  }, []);

  const activeMotion = applications.find(a => a.status !== 'Rejected') || null;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} tintColor={C.primary} />}
        >
          <FadeSlide delay={0} style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}><Ionicons name="person" size={16} color={C.primary} /></View>
              <Text style={styles.workspaceLabel}>Hello, {userName} 👋</Text>
            </View>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate('Search');
              }}
            >
              <Ionicons name="search" size={20} color={C.onSurface} />
            </TouchableOpacity>
          </FadeSlide>

          <FadeSlide delay={80}>
            <Text style={styles.sectionLabel}>MARKET PULSE</Text>
            <Text style={styles.pulseHeadline}>Your profile is gaining <Text style={styles.pulseHighlight}>momentum</Text> in your area.</Text>
            <BarChart data={dynamicChart} />
            <View style={styles.divider} />
          </FadeSlide>

          <FadeSlide delay={160}>
            <Text style={styles.sectionLabel}>IN MOTION</Text>
            <View style={styles.cleanMotionCard}>
              <View style={styles.cleanMotionHeaderRow}>
                <View style={styles.cleanStagePill}><Text style={styles.cleanStageText}>{(activeMotion?.status || 'No Active Apps').toUpperCase()}</Text></View>
                <Text style={styles.cleanDateText}>{activeMotion ? new Date(activeMotion.appliedAt).toLocaleDateString().toUpperCase() : 'TODAY'}</Text>
              </View>
              <Text style={styles.cleanCompanyText}>{activeMotion?.jobId?.companyId?.name || 'Explore Opportunities'}</Text>
              <Text style={styles.cleanRoleText}>{activeMotion?.jobId?.title || 'Start applying to see updates'}</Text>
              <View style={styles.cleanActionRow}>
                <TouchableOpacity 
                  style={styles.cleanJoinBtn} 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    activeMotion ? navigation.navigate('Applications') : navigation.navigate('Search');
                  }}
                >
                  <Text style={styles.cleanJoinBtnText}>{activeMotion ? 'VIEW STATUS' : 'FIND JOBS'}</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
          </FadeSlide>

          <FadeSlide delay={240}>
            <View style={styles.sectionHeader}>
              <View><Text style={styles.sectionLabel}>CURATED FOR YOU</Text><Text style={styles.sectionTitle}>Discover</Text></View>
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('Search');
                }}
              >
                <Text style={styles.seeAll}>SEE ALL</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginHorizontal: -24 }}>
              {loading ? (
                <FlatList
                  horizontal
                  data={[1, 2, 3]}
                  keyExtractor={(i) => i.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 24, paddingRight: 48 }}
                  renderItem={() => (
                    <View style={[styles.jobCard, { borderColor: 'transparent' }]}>
                      <SkeletonLoader height={120} />
                      <View style={styles.jobCardContent}>
                        <SkeletonLoader height={10} width="40%" style={{ marginBottom: 8 }} />
                        <SkeletonLoader height={16} width="80%" style={{ marginBottom: 8 }} />
                        <SkeletonLoader height={12} width="60%" />
                      </View>
                    </View>
                  )}
                />
              ) : (
                <FlatList
                  horizontal data={jobs} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 24, paddingRight: 48 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.jobCard} 
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        navigation.navigate('JobDetails', { job: item });
                      }}
                    >
                      <View style={styles.imageContainer}>
                        <Image source={{ uri: item.logo }} style={styles.jobImage} />
                        {item.postedBy?.profileImage && (
                          <View style={styles.hrBadge}>
                            <Image source={{ uri: item.postedBy.profileImage }} style={styles.hrAvatar} />
                          </View>
                        )}
                      </View>
                      <View style={styles.jobCardContent}>
                        <Text style={styles.jobTags}>{(Array.isArray(item.tags) ? item.tags.join(' • ') : item.tags || '').toUpperCase()}</Text>
                        <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.jobCompany}>{item.company}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
            <View style={styles.divider} />
          </FadeSlide>

          <FadeSlide delay={400}>
            <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
            <View style={styles.activityList}>
              {loading ? [1, 2, 3].map(i => (
                <View key={i} style={[styles.activityItem, { marginBottom: 24 }]}>
                  <View style={styles.timelineCol}>
                    <SkeletonLoader width={8} height={8} borderRadius={4} />
                    <View style={styles.timelineLine} />
                  </View>
                  <View style={styles.activityContent}>
                    <SkeletonLoader height={10} width="30%" style={{ marginBottom: 8 }} />
                    <SkeletonLoader height={16} width="70%" style={{ marginBottom: 8 }} />
                    <SkeletonLoader height={12} width="90%" />
                  </View>
                </View>
              )) : (
                applications.length > 0 ? (
                  applications.slice(0, 3).map((app, i) => (
                    <View key={app._id} style={styles.activityItem}>
                      <View style={styles.timelineCol}>
                        <View style={[styles.timelineDot, app.status !== 'Rejected' && styles.timelineDotActive]} />
                        {i < 2 && <View style={styles.timelineLine} />}
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTime}>{new Date(app.appliedAt).toLocaleDateString().toUpperCase()}</Text>
                        <Text style={styles.activityTitle}>{app.jobId?.title}</Text>
                        <Text style={styles.activityDesc}>{app.status}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No recent activity found.</Text>
                  </View>
                )
              )}
            </View>
          </FadeSlide>
          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:              { flex: 1, backgroundColor: C.background },
  safeArea:          { flex: 1 },
  scroll:            { paddingHorizontal: 24, paddingTop: 16 },
  header:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
  headerLeft:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar:            { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surfaceContHigh, alignItems: 'center', justifyContent: 'center' },
  workspaceLabel:    { fontSize: 18, fontWeight: '500', color: C.onSurface, letterSpacing: -0.3 },
  sectionLabel:      { fontSize: 10, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 },
  divider:           { height: 56, backgroundColor: 'transparent' },
  pulseHeadline:     { fontSize: 24, fontWeight: '300', color: C.onSurface, letterSpacing: -0.5, lineHeight: 32 },
  pulseHighlight:    { fontWeight: '600' },
  chartContainer:    { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 20, paddingBottom: 4 },
  barCol:            { flex: 1, alignItems: 'center', gap: 6 },
  barTrack:          { height: MAX_BAR_HEIGHT, justifyContent: 'flex-end', width: '100%', borderRadius: 2, overflow: 'hidden' },
  barFill:           { width: '100%', borderRadius: 2 },
  barFillMuted:      { backgroundColor: C.outlineVariant },
  barFillActive:     { backgroundColor: C.matteForest },
  barLabel:          { fontSize: 10, fontWeight: '500', color: C.onSurfaceVariant },
  barLabelActive:    { color: C.primary, fontWeight: '700' },
  chartWrapper:      { position: 'relative' },
  cleanMotionCard:   { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24 }, 
  cleanMotionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cleanStagePill:    { backgroundColor: C.matteSage, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  cleanStageText:    { fontSize: 10, fontWeight: '700', color: C.onSurface, letterSpacing: 1.5 },
  cleanDateText:     { fontSize: 10, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 1.0 },
  cleanCompanyText:  { fontSize: 13, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 8 },
  cleanRoleText:     { fontSize: 26, fontWeight: '300', color: C.onSurface, letterSpacing: -0.5, marginBottom: 24 }, 
  cleanActionRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cleanJoinBtn:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 100, gap: 8 },
  cleanJoinBtnText:  { fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1.5 },
  sectionHeader:     { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 },
  sectionTitle:      { fontSize: 24, fontWeight: '600', color: C.onSurface, letterSpacing: -0.5 },
  seeAll:            { fontSize: 11, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 4 },
  jobCard:           { width: width * 0.65, backgroundColor: C.surface, borderRadius: 12, overflow: 'hidden', marginRight: 16 }, 
  imageContainer:    { position: 'relative', width: '100%', height: 120 },
  jobImage:          { width: '100%', height: 120, backgroundColor: C.outlineVariant },
  hrBadge:           { position: 'absolute', bottom: -12, right: 12, width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: '#FFF', backgroundColor: '#FFF', padding: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  hrAvatar:          { width: 28, height: 28, borderRadius: 14 },
  jobCardContent:    { padding: 16, paddingTop: 20 },
  jobTags:           { fontSize: 9, fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 10 },
  jobTitle:          { fontSize: 16, fontWeight: '600', color: C.onSurface, marginBottom: 6 },
  jobCompany:        { fontSize: 13, color: C.onSurfaceVariant, marginBottom: 16 },
  activityList:      { marginTop: 16 },
  activityItem:      { flexDirection: 'row' },
  timelineCol:       { alignItems: 'center', width: 20, marginRight: 20 },
  timelineDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: C.outlineVariant, marginTop: 6, zIndex: 2 },
  timelineDotActive: { backgroundColor: C.onSurface }, 
  timelineLine:      { width: 1, flex: 1, backgroundColor: C.outlineVariant, marginVertical: 4, opacity: 0.3 }, 
  activityContent:   { flex: 1, paddingBottom: 40 },
  activityTime:      { fontSize: 10, fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 8 },
  activityTitle:     { fontSize: 16, fontWeight: '500', color: C.onSurface, marginBottom: 6, letterSpacing: -0.2 },
  activityDesc:      { fontSize: 14, fontWeight: '400', color: C.onSurfaceVariant, lineHeight: 22 },
  emptyState:        { alignItems: 'center', paddingVertical: 20 },
  emptyText:         { fontSize: 13, color: C.onSurfaceVariant },
});
