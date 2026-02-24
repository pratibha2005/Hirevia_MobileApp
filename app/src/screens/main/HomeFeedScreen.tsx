import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const THEME = {
    primary: '#0F4C5C',
    primaryForeground: '#FFFFFF',
    accent: '#E2725B',   // Muted Burnt Sienna
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#12171A',
    textMuted: '#6B7280',
    border: '#E5E7EB',
};

const MOCK_JOBS = [
    {
        id: '1',
        title: 'Senior Frontend Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA (Hybrid)',
        salary: '$140k - $180k',
        type: 'Full-time',
        tags: ['React Native', 'Next.js', 'TypeScript'],
        logo: 'https://ui-avatars.com/api/?name=Stripe&background=0D2B3E&color=fff&size=120'
    },
    {
        id: '2',
        title: 'Product Designer',
        company: 'Linear',
        location: 'Remote',
        salary: '$120k - $160k',
        type: 'Full-time',
        tags: ['Figma', 'UI/UX', 'Prototyping'],
        logo: 'https://ui-avatars.com/api/?name=Linear&background=5E6AD2&color=fff&size=120'
    },
    {
        id: '3',
        title: 'Backend Developer',
        company: 'Vercel',
        location: 'New York, NY',
        salary: '$130k - $170k',
        type: 'Contract',
        tags: ['Node.js', 'Go', 'AWS'],
        logo: 'https://ui-avatars.com/api/?name=Vercel&background=000&color=fff&size=120'
    }
];

const CATEGORIES = ['All Roles', 'Engineering', 'Design', 'Product', 'Marketing'];

export default function HomeFeedScreen() {
    const navigation = useNavigation<any>();
    const [activeCategory, setActiveCategory] = useState('All Roles');

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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good morning, Alex</Text>
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
                data={MOCK_JOBS}
                keyExtractor={(item) => item.id}
                renderItem={renderJobCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <Text style={styles.sectionTitle}>Recommended for you</Text>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
    greeting: { fontSize: 24, fontWeight: '800', color: THEME.text, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: THEME.textMuted, marginTop: 4, fontWeight: '500' },
    notificationBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: THEME.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
    notificationDot: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.accent, borderWidth: 1.5, borderColor: THEME.surface },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.surface, marginHorizontal: 20, borderRadius: 16, paddingLeft: 16, paddingRight: 6, paddingVertical: 6, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2, marginBottom: 24 },
    searchIcon: { marginRight: 12 },
    searchPlaceholder: { flex: 1, color: THEME.textMuted, fontSize: 15, fontWeight: '500' },
    filterBtn: { backgroundColor: THEME.primary, width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    categoryContainer: { marginBottom: 24 },
    categoryBadge: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: THEME.surface, borderWidth: 1, borderColor: THEME.border },
    categoryBadgeActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
    categoryText: { fontSize: 14, fontWeight: '600', color: THEME.textMuted },
    categoryTextActive: { color: THEME.primaryForeground },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: THEME.text, marginBottom: 16, paddingHorizontal: 4 },
    listContainer: { paddingHorizontal: 20, paddingBottom: 100 },
    card: { backgroundColor: THEME.surface, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    companyLogo: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: THEME.border },
    cardTitleContainer: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    jobTitle: { fontSize: 17, fontWeight: '700', color: THEME.text, marginBottom: 4, letterSpacing: -0.3 },
    companyName: { fontSize: 14, color: THEME.textMuted, fontWeight: '500' },
    bookmarkButton: { padding: 4 },
    cardDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 20 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { fontSize: 13, color: THEME.textMuted, fontWeight: '500' },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: THEME.border },
    tagBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    tagText: { fontSize: 12, fontWeight: '600', color: THEME.textMuted },
});
