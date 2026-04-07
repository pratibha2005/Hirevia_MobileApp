import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Animated,
  Easing,
  Platform,
  Keyboard,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';
import { PALETTE as C, TYPOGRAPHY as T } from '../../theme/tokens';

const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1496664444929-8c75efb9546f?q=80&w=2600&auto=format&fit=crop';
const ROLE_TABS = ['ALL ROLES', 'REMOTE', 'DESIGN', 'LEADERSHIP'];

interface JobEntry {
  id: string;
  icon: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  badge?: { label: string; type: 'new' | 'closing' };
  type?: string;
}

// ─── Animated Job Row (Weightless Entrance) ──────────────────────────────────
function JobRow({ job, index, onPress }: { job: JobEntry; index: number; onPress: () => void }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      delay: index * 25,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }).start();
  }, [job.id]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });

  return (
    <Animated.View style={[styles.entryWrapper, { opacity: anim, transform: [{ translateY }] }]}>
      <TouchableOpacity activeOpacity={0.75} style={styles.entryTile} onPress={onPress}>
        <View style={styles.entryLeft}>
          <View style={styles.entryIconBox}>
            <MaterialCommunityIcons name={job.icon as any} size={22} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.entryTitleRow}>
              <Text style={styles.entryTitle}>{job.title}</Text>
              {job.badge && (
                <View style={job.badge.type === 'new' ? styles.badgeNew : styles.badgeClose}>
                  <Text style={job.badge.type === 'new' ? styles.badgeNewText : styles.badgeCloseText}>
                    {job.badge.label}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.entryMeta}>{job.company} · {job.location}</Text>
          </View>
        </View>
        <View style={styles.entryRight}>
          <Text style={styles.entrySalary}>{job.salary}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function JobSearchScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);
  const [jobs, setJobs] = useState<JobEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<{ name?: string; profilePic?: string } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 🧪 Inline Reveal Animations
  const inlineSearchHeight = useRef(new Animated.Value(0)).current; 
  const contentAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    // 🏂 Multi-layered Animation
    Animated.parallel([
      Animated.spring(inlineSearchHeight, {
        toValue: showSearch ? 68 : 0,
        useNativeDriver: false,
        friction: 12,
        tension: 35,
      }),
      Animated.timing(contentAnim, {
        toValue: showSearch ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();

    if (showSearch) {
      setTimeout(() => inputRef.current?.focus(), 350);
    } else {
      inputRef.current?.blur();
      setSearchQuery(''); // 🧹 Reset archive search
      Keyboard.dismiss();
    }
  }, [showSearch]);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const u = await AsyncStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
      const res = await fetch(`${API_BASE_URL}/api/jobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs.map((j: any) => ({
          id: j._id,
          icon: j.type === 'Remote' ? 'earth' : 'briefcase-variant-outline',
          title: j.title,
          company: j.companyId?.name || 'Studio Arkhos',
          location: j.location,
          salary: j.salary || '$120k — $150k',
          type: j.type,
          badge: j.isNew ? { label: 'NEW', type: 'new' } : undefined,
        })));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); setRefreshing(false); }
  };

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const filteredJobs = jobs.filter(job => {
    const tabName = ROLE_TABS[activeTab];
    const matchesTab = (() => {
      if (tabName === 'ALL ROLES') return true;
      if (tabName === 'REMOTE') return job.type === 'Remote';
      if (tabName === 'DESIGN') return job.title.toLowerCase().includes('design') || job.title.toLowerCase().includes('creative');
      if (tabName === 'LEADERSHIP') return job.title.toLowerCase().includes('lead') || job.title.toLowerCase().includes('principal') || job.title.toLowerCase().includes('vp');
      return true;
    })();
    const matchesSearch = searchQuery 
      ? (job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
         job.location.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesTab && matchesSearch;
  });

  const featuredJob = filteredJobs.length > 0 ? filteredJobs[0] : (jobs[0] || null);
  const displayName = user?.name ? user.name.split(' ')[0].toUpperCase() : 'ARCHIVE';
  const avatarSource = user?.profilePic ? { uri: user.profilePic } : require('../../../assets/images/profile_bitmoji.png');

  // Zen Interpolations
  const contentOpacity = contentAnim.interpolate({ inputRange: [0.3, 1], outputRange: [0, 1] });
  const contentTranslateY = contentAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.background} />

      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerInner}>
          <View style={styles.headerLeft}>
            <View style={styles.profileAvatar}><Image source={avatarSource} style={styles.profileAvatarImg} /></View>
            <Text style={styles.headerTitle}>{displayName}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowSearch(!showSearch)}>
              <Ionicons name={showSearch ? "close" : "search"} size={22} color={showSearch ? C.error : C.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* 📂 Inline Full-Width Reveal Search Bar */}
      <Animated.View style={[styles.inlineSearchContainer, { height: inlineSearchHeight }]}>
        <Animated.View style={[styles.inlineSearchInner, { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }]}>
          <Ionicons name="search-outline" size={18} color={C.onSurfaceVariant} style={{ marginRight: 12 }} />
          <TextInput 
            ref={inputRef}
            style={styles.inlineSearchInput}
            placeholder="TITLE, COMPANY OR LOCATION..."
            placeholderTextColor="rgba(86, 97, 102, 0.35)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            selectionColor={C.primary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={18} color={C.outlineVariant} /></TouchableOpacity>
          )}
        </Animated.View>
        <View style={styles.inlineSeparator} />
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} tintColor={C.primary} />}
        stickyHeaderIndices={[1]}
      >
        <View style={styles.heroSection}>
          <Image source={{ uri: HERO_IMAGE_URL }} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(247, 249, 251, 0.4)', '#f7f9fb']} style={styles.heroBottomGradient} />
          <View style={styles.heroContent} pointerEvents="box-none">
            <View style={styles.heroHeader}>
              <View style={styles.heroEyebrow}><View style={styles.heroEyebrowLine} /><Text style={styles.heroEyebrowText}>FEATURED PLACEMENT</Text></View>
              <Text style={styles.heroTitle}>
                {featuredJob ? featuredJob.title.split(' ').slice(0, -1).join(' ') + ' ' : 'Senior Creative '}
                <Text style={styles.heroTitleBold}>{featuredJob ? featuredJob.title.split(' ').slice(-1) : 'Strategist'}</Text>
              </Text>
            </View>
            <View style={styles.heroMetaContent}>
              <View style={styles.heroMetaRow}><Text style={styles.heroMetaLabel}>COMPANY</Text><Text style={styles.heroMetaValueIndigo}>{featuredJob?.company || 'Studio Arkhos'}</Text></View>
              <View style={styles.heroMetaRow}><Text style={styles.heroMetaLabel}>LOCATION</Text><Text style={styles.heroMetaValue}>{featuredJob?.location || 'Copenhagen / Remote'}</Text></View>
              <TouchableOpacity style={styles.heroBtn} onPress={() => featuredJob && navigation.navigate('JobDetails', { job: featuredJob })}>
                <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                <Text style={styles.heroBtnText}>VIEW DETAILS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.tabsSurface}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsInner}>
            {ROLE_TABS.map((tab, i) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(i)} style={[styles.tab, activeTab === i && styles.tabActive]}>
                <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>RECENT ENTRIES</Text>
          <View style={styles.listContainer}>
            {loading ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <LottieView source={require('../../../assets/animations/document_reader.json')} autoPlay loop style={{ width: 120, height: 120 }} />
                <Text style={{ color: C.onSurfaceVariant, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginTop: -10 }}>ANALYZING ARCHIVE</Text>
              </View>
            ) : filteredJobs.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <LottieView source={require('../../../assets/animations/no_item_found.json')} autoPlay loop style={{ width: 220, height: 220 }} />
                <Text style={{ color: C.onSurfaceVariant, fontSize: 13, fontWeight: '600', marginTop: -20 }}>No jobs match your filters.</Text>
              </View>
            ) : (
              filteredJobs.map((job, i) => (
                <JobRow key={job.id} job={job} index={i} onPress={() => navigation.navigate('JobDetails', { job })} />
              ))
            )}
          </View>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:               { flex: 1, backgroundColor: C.background },
  scrollContent:      { paddingTop: 0 },
  header:             { backgroundColor: 'rgba(247,249,251,0.92)', zIndex: 120 },
  headerInner:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  headerLeft:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileAvatar:      { width: 34, height: 34, borderRadius: 17, overflow: 'hidden', backgroundColor: C.surfaceContHigh, borderWidth: 1, borderColor: '#fff' },
  profileAvatarImg:   { width: 34, height: 34 },
  headerTitle:        { fontSize: 11, fontWeight: '900', letterSpacing: 4.5, color: C.indigo900, textTransform: 'uppercase' },
  headerIconBtn:      { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 },
  
  // 📂 Inline Reveal Search
  inlineSearchContainer: { width: '100%', overflow: 'hidden', backgroundColor: 'rgba(169,180,185,0.06)' },
  inlineSearchInner:     { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  inlineSearchInput:     { flex: 1, fontSize: 14, color: C.onSurface, fontWeight: '600' },
  inlineSeparator:       { height: 1, backgroundColor: 'rgba(169,180,185,0.1)', width: '100%', position: 'absolute', bottom: 0 },

  heroSection:        { width: '100%', height: 480, position: 'relative', overflow: 'hidden' },
  heroImage:          { ...StyleSheet.absoluteFillObject, opacity: 0.82 },
  heroBottomGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%', zIndex: 1 },
  heroContent:        { ...StyleSheet.absoluteFillObject, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24, justifyContent: 'space-between', zIndex: 2 },
  heroHeader:         { marginBottom: 20 },
  heroEyebrow:        { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  heroEyebrowLine:    { width: 32, height: 2, backgroundColor: C.primary },
  heroEyebrowText:    { fontSize: 10, fontWeight: '900', letterSpacing: 5, color: C.indigo900, opacity: 0.8 },
  heroTitle:          { fontSize: 38, fontWeight: '300', letterSpacing: -1, color: C.onSurface, lineHeight: 46 },
  heroTitleBold:      { fontWeight: '900', fontStyle: 'italic', color: C.indigo900 },
  
  heroMetaContent:    { paddingBottom: 0 },
  heroMetaRow:        { flexDirection: 'column', marginBottom: 16 },
  heroMetaLabel:      { fontSize: 11, fontWeight: '900', letterSpacing: 3, color: C.outline, textTransform: 'uppercase', marginBottom: 6 },
  heroMetaValueIndigo:{ fontSize: 20, fontWeight: '700', color: C.indigo900 },
  heroMetaValue:      { fontSize: 20, fontWeight: '700', color: C.onSurface },
  heroBtn:            { alignSelf: 'flex-start', paddingHorizontal: 36, paddingVertical: 16, backgroundColor: C.indigo900, borderRadius: 16, marginTop: 12, overflow: 'hidden' },
  heroBtnText:        { fontSize: 10, fontWeight: '900', letterSpacing: 3, color: '#ffffff' },
  
  tabsSurface:        { backgroundColor: C.background, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(169,180,185,0.08)' },
  tabsInner:          { paddingHorizontal: 24, gap: 32, flexDirection: 'row' },
  tab:                { paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive:          { borderBottomColor: C.primary },
  tabText:            { fontSize: 11, fontWeight: '600', letterSpacing: 4.5, color: C.outline, textTransform: 'uppercase' },
  tabTextActive:      { fontWeight: '900', color: C.primary },
  section:            { marginTop: 8 },
  sectionLabel:       { paddingHorizontal: 24, fontSize: 11, fontWeight: '900', letterSpacing: 6, color: C.outline, textTransform: 'uppercase', marginBottom: 12 },
  listContainer:      { paddingHorizontal: 16 },
  entryWrapper:       { marginBottom: 14 },
  entryTile:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, padding: 18, shadowColor: '#000', shadowOffset: { width:0, height:4 }, shadowOpacity:0.03, shadowRadius:6 },
  entryLeft:          { flexDirection: 'row', alignItems: 'center', gap: 18, flex: 1, marginRight: 12 },
  entryIconBox:       { width: 44, height: 44, borderRadius: 14, backgroundColor: C.surfaceContLow, alignItems: 'center', justifyContent: 'center' },
  entryTitleRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 },
  entryTitle:         { fontSize: 17, fontWeight: '700', color: C.onSurface, letterSpacing: -0.5 },
  entryMeta:          { fontSize: 13, fontWeight: '500', color: C.onSurfaceVariant },
  entryRight:         { alignItems: 'flex-end', gap: 4 },
  entrySalary:        { fontSize: 11, fontWeight: '900', letterSpacing: 2, color: C.primary, textTransform: 'uppercase' },
  badgeNew:           { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: C.surfaceContLow, borderRadius: 8 },
  badgeNewText:       { fontSize: 10, fontWeight: '900', color: C.primary },
  badgeClose:         { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: 'rgba(158, 63, 78, 0.04)', borderRadius: 8 },
  badgeCloseText:     { fontSize: 10, fontWeight: '900', color: C.error },
});
