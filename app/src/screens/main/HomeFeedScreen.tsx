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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';

const { width } = Dimensions.get('window');

// ─── Exact Design Tokens from Design Analysis ────────────────────────────────
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

// ─── Bar Chart Data ───────────────────────────────────────────────────────────
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

// ─── Activity Data ────────────────────────────────────────────────────────────
const ACTIVITIES = [
  {
    id: '1',
    time: 'TODAY, 09:12',
    title: 'Application Viewed',
    desc: 'Your application for Spatial Lead was reviewed by the hiring team at Metahaus.',
    isLast: false,
    active: true,
  },
  {
    id: '2',
    time: 'YESTERDAY',
    title: 'New Profile Match',
    desc: 'Your skills align 95% with the new Design Principal opening.',
    isLast: false,
    active: false,
  },
  {
    id: '3',
    time: 'OCT 24',
    title: 'Portfolio Update',
    desc: 'Successfully synced your latest Behance projects to your HireVia profile.',
    isLast: true,
    active: false,
  },
];

// ─── Animated Fade In ─────────────────────────────────────────────────────────
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

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart() {
  useEffect(() => {
    CHART_DATA.forEach((_, i) => BAR_ANIMS[i].setValue(0));
    const anims = BAR_ANIMS.map((anim, i) =>
      Animated.sequence([
        Animated.delay(400 + i * 60),
        Animated.spring(anim, { toValue: 1, useNativeDriver: false, tension: 80, friction: 8 }),
      ])
    );
    Animated.parallel(anims).start();
  }, []);

  return (
    <View style={styles.chartContainer}>
      {CHART_DATA.map((bar, i) => {
        const isLast = i === CHART_DATA.length - 1;
        const barHeight = BAR_ANIMS[i].interpolate({
          inputRange: [0, 1],
          outputRange: [4, bar.value * MAX_BAR_HEIGHT],
        });
        return (
          <View key={bar.day} style={styles.barCol}>
            <View style={styles.barTrack}>
              <Animated.View
                style={[
                  styles.barFill,
                  isLast ? styles.barFillActive : styles.barFillMuted,
                  { height: barHeight },
                ]}
              />
            </View>
            <Text style={[styles.barLabel, isLast && styles.barLabelActive]}>
              {bar.day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeFeedScreen() {
  const navigation = useNavigation<any>();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('there');

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
          salary: j.salary || 'Salary not disclosed',
          type: j.type || 'Full-time',
          tags: j.skills || [],
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(j.companyId?.name || 'C')}&background=0F4C5C&color=fff&size=120`,
          description: j.description,
          screeningQuestions: j.screeningQuestions || [],
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

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchJobs(true)} tintColor={C.primary} />}
        >

          {/* ── Header ── */}
          <FadeSlide delay={0} style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={16} color={C.primary} />
              </View>
              <Text style={styles.workspaceLabel}>Hello, {userName} 👋</Text>
            </View>
            <TouchableOpacity hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Ionicons name="search" size={20} color={C.onSurface} />
            </TouchableOpacity>
          </FadeSlide>

          {/* ── Market Pulse ── */}
          <FadeSlide delay={80}>
            <Text style={styles.sectionLabel}>MARKET PULSE</Text>
            <Text style={styles.pulseHeadline}>
              Your profile is gaining{'\n'}
              <Text style={styles.pulseHighlight}>momentum</Text> in Paris.
            </Text>
            <View style={styles.pulseStatRow}>
              <Text style={styles.pulseStat}>+12%</Text>
              <Text style={styles.pulseStatLabel}>reach this week</Text>
            </View>
            <BarChart />
            <View style={styles.divider} />
          </FadeSlide>

          {/* ── In Motion: Pristine Minimal ── */}
          <FadeSlide delay={160}>
            <Text style={styles.sectionLabel}>IN MOTION</Text>
            
            <View style={styles.cleanMotionCard}>
              <View style={styles.cleanMotionHeaderRow}>
                <View style={styles.cleanStagePill}>
                  <Text style={styles.cleanStageText}>INTERVIEW</Text>
                </View>
                <Text style={styles.cleanDateText}>TOMORROW, 10:00 AM</Text>
              </View>

              <Text style={styles.cleanCompanyText}>Apple</Text>
              <Text style={styles.cleanRoleText}>Senior Product Designer</Text>
              
              <View style={styles.cleanDivider} />

              <View style={styles.cleanActionRow}>
                <View style={styles.cleanDurationBox}>
                  <Ionicons name="time-outline" size={14} color={C.onSurfaceVar} />
                  <Text style={styles.cleanDurationText}>60 Min</Text>
                </View>
                
                <TouchableOpacity style={styles.cleanJoinBtn}>
                  <Text style={styles.cleanJoinBtnText}>JOIN CALL</Text>
                  <Ionicons name="arrow-forward" size={14} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
          </FadeSlide>

          {/* ── Discover ── */}
          <FadeSlide delay={240}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionLabel}>CURATED FOR YOU</Text>
                <Text style={styles.sectionTitle}>Discover</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAll}>SEE ALL</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginHorizontal: -24 }}>
              {loading ? (
                <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 20 }} />
              ) : (
                <FlatList
                  horizontal
                  data={jobs}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 24, paddingRight: 48 }}
                  snapToInterval={width * 0.65 + 16}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.jobCard}
                      activeOpacity={0.9}
                      onPress={() => navigation.navigate('JobDetails', { job: item })}
                    >
                      <Image source={{ uri: item.logo }} style={styles.jobImage} resizeMode="cover" />
                      <View style={styles.jobCardContent}>
                        <Text style={styles.jobTags}>{(Array.isArray(item.tags) ? item.tags.join(' • ') : item.tags || '').toUpperCase()}</Text>
                        <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.jobCompany} numberOfLines={1}>{item.company}</Text>
                        <Text style={styles.jobSalary}>{item.salary}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyState}>
                      <Ionicons name="briefcase-outline" size={48} color={C.onSurfaceVar} />
                      <Text style={styles.emptyText}>No jobs available right now.</Text>
                    </View>
                  }
                />
              )}
            </View>
            <View style={styles.divider} />
          </FadeSlide>

          {/* ── Recent Activity ── */}
          <FadeSlide delay={400}>
            <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
            <View style={styles.activityList}>
              {ACTIVITIES.map((item) => (
                <View key={item.id} style={styles.activityItem}>
                  {/* Timeline Column */}
                  <View style={styles.timelineCol}>
                    <View style={[styles.timelineDot, item.active && styles.timelineDotActive]} />
                    {!item.isLast && <View style={styles.timelineLine} />}
                  </View>

                  {/* Content */}
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTime}>{item.time}</Text>
                    <Text style={styles.activityTitle}>{item.title}</Text>
                    <Text style={styles.activityDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </FadeSlide>

          <View style={{ height: 110 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:              { flex: 1, backgroundColor: C.background },
  safeArea:          { flex: 1 },
  scroll:            { paddingHorizontal: 24, paddingTop: 16 },

  // Header
  header:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
  headerLeft:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar:            { width: 32, height: 32, borderRadius: 16, backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center' },
  workspaceLabel:    { fontSize: 18, fontWeight: '500', color: C.onSurface, letterSpacing: -0.3 },

  // Shared
  sectionLabel:      { fontSize: 10, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 },
  divider:           { height: 48, backgroundColor: 'transparent' }, // Used for spacing without visible lines

  // Market Pulse
  pulseHeadline:     { fontSize: 24, fontWeight: '300', color: C.onSurface, letterSpacing: -0.5, lineHeight: 32 },
  pulseHighlight:    { fontWeight: '600' },
  pulseStatRow:      { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 8 },
  pulseStat:         { fontSize: 24, fontWeight: '600', color: C.onSurface },
  pulseStatLabel:    { fontSize: 12, color: C.onSurfaceVar, fontWeight: '400' },

  // Chart
  chartContainer:    { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 20, paddingBottom: 4 },
  barCol:            { flex: 1, alignItems: 'center', gap: 6 },
  barTrack:          { height: MAX_BAR_HEIGHT, justifyContent: 'flex-end', width: '100%', borderRadius: 2, overflow: 'hidden' },
  barFill:           { width: '100%', borderRadius: 2 },
  barFillMuted:      { backgroundColor: C.outlineVar }, // exactly as design: grey bars
  barFillActive:     { backgroundColor: C.primary },    // deep blue for active
  barLabel:          { fontSize: 10, fontWeight: '500', color: C.onSurfaceVar },
  barLabelActive:    { color: C.primary, fontWeight: '700' },

  // Pristine Minimal Motion Card
  cleanMotionCard:   { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: C.outlineVar }, 
  cleanMotionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cleanStagePill:    { backgroundColor: C.surfaceLow, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  cleanStageText:    { fontSize: 10, fontWeight: '700', color: C.onSurface, letterSpacing: 1.5 },
  cleanDateText:     { fontSize: 10, fontWeight: '700', color: C.onSurfaceVar, letterSpacing: 1.0 },
  cleanCompanyText:  { fontSize: 13, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 0.5, marginBottom: 8 },
  cleanRoleText:     { fontSize: 26, fontWeight: '300', color: C.onSurface, letterSpacing: -0.5, marginBottom: 24 }, 
  cleanDivider:      { height: 40, backgroundColor: 'transparent' }, 
  cleanActionRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cleanDurationBox:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cleanDurationText: { fontSize: 13, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 0.5 },
  cleanJoinBtn:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 100, gap: 8 },
  cleanJoinBtnText:  { fontSize: 11, fontWeight: '700', color: '#FFFFFF', letterSpacing: 1.5 },

  // Discover
  sectionHeader:     { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 },
  sectionTitle:      { fontSize: 24, fontWeight: '600', color: C.onSurface, letterSpacing: -0.5 },
  seeAll:            { fontSize: 11, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 0.5, marginBottom: 4 },
  jobCard:           { width: width * 0.65, backgroundColor: C.surface, borderRadius: 12, overflow: 'hidden', marginRight: 16, borderWidth: 1, borderColor: C.outlineVar }, 
  jobImage:          { width: '100%', height: 120, backgroundColor: C.outlineVar },
  jobCardContent:    { padding: 16 },
  jobTags:           { fontSize: 9, fontWeight: '600', color: C.onSurfaceVar, letterSpacing: 0.5, marginBottom: 10 },
  jobTitle:          { fontSize: 16, fontWeight: '600', color: C.onSurface, marginBottom: 6 },
  jobCompany:        { fontSize: 13, color: C.onSurfaceVar, marginBottom: 16 },
  jobSalary:         { fontSize: 14, fontWeight: '600', color: C.onSurface },
  emptyState:        { alignItems: 'center', paddingHorizontal: 40, marginTop: 10 },
  emptyText:         { fontSize: 15, fontWeight: '500', color: C.onSurfaceVar, marginTop: 10, textAlign: 'center' },

  // Activity
  activityList:      { marginTop: 16 },
  activityItem:      { flexDirection: 'row' },
  timelineCol:       { alignItems: 'center', width: 20, marginRight: 20 },
  timelineDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: C.outlineVar, marginTop: 6, zIndex: 2 },
  timelineDotActive: { backgroundColor: C.onSurface }, 
  timelineLine:      { width: 1, flex: 1, backgroundColor: C.outlineVar, marginVertical: 4, opacity: 0.3 }, 
  activityContent:   { flex: 1, paddingBottom: 40 },
  activityTime:      { fontSize: 10, fontWeight: '700', color: C.onSurfaceVar, letterSpacing: 1.5, marginBottom: 8 },
  activityTitle:     { fontSize: 16, fontWeight: '500', color: C.onSurface, marginBottom: 6, letterSpacing: -0.2 },
  activityDesc:      { fontSize: 14, fontWeight: '400', color: C.onSurfaceVar, lineHeight: 22 },
});
