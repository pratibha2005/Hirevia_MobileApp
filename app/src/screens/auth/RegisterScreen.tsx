import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Profile</Text>
            <TextInput style={styles.input} placeholder="Full Name" />
            <TextInput style={styles.input} placeholder="Email" />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry />
            <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Sign Up</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.link}>Sign In instead</Text></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
    input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 16 },
    button: { backgroundColor: '#2563EB', padding: 16, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#FFF', fontWeight: 'bold' },
    link: { color: '#2563EB', textAlign: 'center', marginTop: 16 }
});
