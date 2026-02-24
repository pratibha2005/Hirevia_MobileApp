import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const THEME = {
    primary: '#0F4C5C',
    primaryForeground: '#FFFFFF',
    accent: '#E2725B',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#12171A',
    textMuted: '#6B7280',
    border: '#E5E7EB',
};

const MOCK_APPLICATIONS = [
    {
        id: '1',
        title: 'Senior Frontend Engineer',
        company: 'Stripe',
        location: 'San Francisco, CA',
        dateApplied: 'Oct 24, 2023',
        status: 'Under Review',
        statusColor: '#D97706', // Amber/Orange
        statusBg: '#FEF3C7',
        logo: 'https://ui-avatars.com/api/?name=Stripe&background=0D2B3E&color=fff&size=120'
    },
    {
        id: '2',
        title: 'Product Designer',
        company: 'Linear',
        location: 'Remote',
        dateApplied: 'Oct 20, 2023',
        status: 'Shortlisted',
        statusColor: '#059669', // Emerald
        statusBg: '#D1FAE5',
        logo: 'https://ui-avatars.com/api/?name=Linear&background=5E6AD2&color=fff&size=120'
    },
    {
        id: '3',
        title: 'Backend Developer',
        company: 'Vercel',
        location: 'New York, NY',
        dateApplied: 'Sep 15, 2023',
        status: 'Rejected',
        statusColor: '#4B5563', // Gray
        statusBg: '#F3F4F6',
        logo: 'https://ui-avatars.com/api/?name=Vercel&background=000&color=fff&size=120'
    }
];

export default function ApplicationsScreen() {
    const renderAppCard = ({ item }: { item: typeof MOCK_APPLICATIONS[0] }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
            <View style={styles.cardHeader}>
                <Image source={{ uri: item.logo }} style={styles.companyLogo} />
                <View style={styles.cardTitleContainer}>
                    <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.companyName}>{item.company}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={THEME.textMuted} />
            </View>

            <View style={styles.divider} />

            <View style={styles.statusRow}>
                <View>
                    <Text style={styles.label}>Date Applied</Text>
                    <Text style={styles.value}>{item.dateApplied}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                    <View style={[styles.statusDot, { backgroundColor: item.statusColor }]} />
                    <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Applications</Text>
                <Text style={styles.headerSubtitle}>Track your job applications and statuses</Text>
            </View>

            <FlatList
                data={MOCK_APPLICATIONS}
                keyExtractor={(item) => item.id}
                renderItem={renderAppCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: THEME.background },
    header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, backgroundColor: THEME.surface, borderBottomWidth: 1, borderBottomColor: THEME.border },
    headerTitle: { fontSize: 26, fontWeight: '800', color: THEME.text, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 14, color: THEME.textMuted, marginTop: 4, fontWeight: '500' },
    listContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
    card: { backgroundColor: THEME.surface, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: THEME.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    companyLogo: { width: 52, height: 52, borderRadius: 12, borderWidth: 1, borderColor: THEME.border },
    cardTitleContainer: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    jobTitle: { fontSize: 17, fontWeight: '700', color: THEME.text, marginBottom: 4, letterSpacing: -0.3 },
    companyName: { fontSize: 14, color: THEME.textMuted, fontWeight: '500' },
    divider: { height: 1, backgroundColor: THEME.border, marginVertical: 16 },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontSize: 12, color: THEME.textMuted, marginBottom: 4, fontWeight: '500' },
    value: { fontSize: 14, color: THEME.text, fontWeight: '600' },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    statusText: { fontSize: 13, fontWeight: '700' }
});
