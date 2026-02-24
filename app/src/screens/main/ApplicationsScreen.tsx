import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../../api/config';

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

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
    'New': { color: '#2563EB', bg: '#DBEAFE' },
    'Under Review': { color: '#D97706', bg: '#FEF3C7' },
    'Shortlisted': { color: '#059669', bg: '#D1FAE5' },
    'Rejected': { color: '#6B7280', bg: '#F3F4F6' },
};

export default function ApplicationsScreen() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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

    useFocusEffect(
        useCallback(() => { fetchApplications(); }, [])
    );

    const renderAppCard = ({ item }: { item: any }) => {
        const job = item.jobId;
        const company = job?.companyId;
        const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['New'];
        const companyName = company?.name || 'Unknown Company';
        const jobTitle = job?.title || 'Unknown Role';
        const location = job?.location || '';
        const appliedDate = new Date(item.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0F4C5C&color=fff&size=120`;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{companyName.charAt(0)}</Text>
                    </View>
                    <View style={styles.cardTitleContainer}>
                        <Text style={styles.jobTitle} numberOfLines={1}>{jobTitle}</Text>
                        <Text style={styles.companyName}>{companyName}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={THEME.textMuted} />
                </View>

                <View style={styles.divider} />

                <View style={styles.statusRow}>
                    <View>
                        <Text style={styles.label}>Applied</Text>
                        <Text style={styles.value}>{appliedDate}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>Location</Text>
                        <Text style={styles.value} numberOfLines={1}>{location || '—'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusCfg.color }]} />
                        <Text style={[styles.statusText, { color: statusCfg.color }]}>{item.status}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Applications</Text>
                <Text style={styles.headerSubtitle}>Track your job applications and statuses</Text>
            </View>

            <FlatList
                data={applications}
                keyExtractor={(item) => item._id}
                renderItem={renderAppCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => fetchApplications(true)} tintColor={THEME.primary} />}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color={THEME.primary} style={{ marginTop: 60 }} />
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={48} color={THEME.textMuted} />
                            <Text style={styles.emptyText}>No applications yet</Text>
                            <Text style={styles.emptySubtext}>Browse jobs and apply to see them here.</Text>
                        </View>
                    )
                }
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
    avatarContainer: { width: 52, height: 52, borderRadius: 12, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
    cardTitleContainer: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    jobTitle: { fontSize: 17, fontWeight: '700', color: THEME.text, marginBottom: 4, letterSpacing: -0.3 },
    companyName: { fontSize: 14, color: THEME.textMuted, fontWeight: '500' },
    divider: { height: 1, backgroundColor: THEME.border, marginVertical: 16 },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontSize: 12, color: THEME.textMuted, marginBottom: 4, fontWeight: '500' },
    value: { fontSize: 14, color: THEME.text, fontWeight: '600', maxWidth: 100 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    statusText: { fontSize: 13, fontWeight: '700' },
    emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
    emptyText: { fontSize: 18, fontWeight: '700', color: THEME.text, marginTop: 16 },
    emptySubtext: { fontSize: 14, color: THEME.textMuted, marginTop: 6, textAlign: 'center' },
});

