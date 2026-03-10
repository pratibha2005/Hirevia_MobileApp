import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';

const THEME = {
    primary: '#0F4C5C',
    primaryForeground: '#FFFFFF',
    accent: '#B7725D',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#1A202C',
    textMuted: '#6B7280',
    border: '#E2E8F0',
};

const CATEGORIES = ['All', 'Engineering', 'Design', 'Product', 'Marketing'];

export default function HomeFeedScreen() {
    const navigation = useNavigation<any>();
    const [activeCategory, setActiveCategory] = useState('All');
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

    const renderJobCard = ({ item }: { item: typeof MOCK_JOBS[0] }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('JobDetails', { job: item })}
        >
            <View style={styles.cardHeader}>
                <Image source={{ uri: item.logo }} style={styles.companyLogo} />
                <View style={styles.cardTitleContainer}>
                    <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.companyName}>{item.company}</Text>
                </View>
                <TouchableOpacity style={styles.bookmarkButton}>
                    <Ionicons name="bookmark-outline" size={22} color={THEME.textMuted} />
                </TouchableOpacity>
            </View>

            <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color={THEME.textMuted} />
                    <Text style={styles.detailText}>{item.location}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="cash-outline" size={16} color={THEME.textMuted} />
                    <Text style={styles.detailText}>{item.salary}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={16} color={THEME.textMuted} />
                    <Text style={styles.detailText}>{item.type}</Text>
                </View>
            </View>

            <View style={styles.tagsContainer}>
                {item.tags.map((tag, idx) => (
                    <View key={idx} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {userName} 👋</Text>
                    <Text style={styles.headerSubtitle}>Find your dream job today</Text>
                </View>
                <TouchableOpacity style={styles.notificationBtn}>
                    <Ionicons name="notifications-outline" size={24} color={THEME.text} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={THEME.textMuted} style={styles.searchIcon} />
                <Text style={styles.searchPlaceholder}>Search for jobs, companies...</Text>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="options" size={20} color={THEME.primaryForeground} />
                </TouchableOpacity>
            </View>

            <View style={styles.categoryContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={CATEGORIES}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.categoryBadge, activeCategory === item && styles.categoryBadgeActive]}
                            onPress={() => setActiveCategory(item)}
                        >
                            <Text style={[styles.categoryText, activeCategory === item && styles.categoryTextActive]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <FlatList
                data={jobs}
                keyExtractor={(item) => item.id}
                renderItem={renderJobCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchJobs(true)} tintColor={THEME.primary} />}
                ListHeaderComponent={
                    <Text style={styles.sectionTitle}>
                        {loading ? 'Loading jobs...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} available`}
                    </Text>
                }
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 40 }} />
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="briefcase-outline" size={48} color={THEME.textMuted} />
                            <Text style={styles.emptyText}>No jobs available right now.</Text>
                            <Text style={styles.emptySubtext}>Pull down to refresh.</Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
    greeting: { fontSize: 22, fontWeight: '700', color: THEME.text, letterSpacing: -0.3 },
    headerSubtitle: { fontSize: 14, color: THEME.textMuted, marginTop: 4, fontWeight: '500' },
    notificationBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1 },
    notificationDot: { position: 'absolute', top: 10, right: 10, width: 7, height: 7, borderRadius: 4, backgroundColor: THEME.accent, borderWidth: 1.5, borderColor: THEME.surface },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, marginHorizontal: 20, borderRadius: 12, paddingLeft: 14, paddingRight: 4, paddingVertical: 4, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 1, marginBottom: 20 },
    searchIcon: { marginRight: 10 },
    searchPlaceholder: { flex: 1, color: THEME.textMuted, fontSize: 14, fontWeight: '500' },
    filterBtn: { backgroundColor: THEME.primary, width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    categoryContainer: { marginBottom: 20 },
    categoryBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16, backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border },
    categoryBadgeActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
    categoryText: { fontSize: 13, fontWeight: '600', color: THEME.textMuted },
    categoryTextActive: { color: THEME.primaryForeground },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: THEME.text, marginBottom: 14, paddingHorizontal: 4 },
    listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
    card: { backgroundColor: THEME.surface, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    companyLogo: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, borderColor: THEME.border },
    cardTitleContainer: { flex: 1, marginLeft: 12, justifyContent: 'center' },
    jobTitle: { fontSize: 16, fontWeight: '700', color: THEME.text, marginBottom: 3, letterSpacing: -0.2 },
    companyName: { fontSize: 13, color: THEME.textMuted, fontWeight: '500' },
    bookmarkButton: { padding: 4 },
    cardDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    detailText: { fontSize: 13, color: THEME.textMuted, fontWeight: '500' },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingTop: 14, borderTopWidth: 1, borderTopColor: THEME.border },
    tagBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
    tagText: { fontSize: 11, fontWeight: '600', color: THEME.textMuted },
    emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
    emptyText: { fontSize: 17, fontWeight: '700', color: THEME.text, marginTop: 16 },
    emptySubtext: { fontSize: 14, color: THEME.textMuted, marginTop: 6 },
});
