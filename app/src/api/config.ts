import Constants from 'expo-constants';

// In Expo Go, hostUri is the address Metro is running on (e.g. "192.168.1.12:8081")
// We extract the host and point to the backend port on the same machine.
// Falls back to 10.0.2.2 for Android emulator (where hostUri is absent).
const getBaseUrl = (): string => {
    const hostUri = Constants.expoConfig?.hostUri ?? Constants.manifest2?.extra?.expoGo?.debuggerHost;
    if (hostUri) {
        const host = hostUri.split(':')[0]; // strip the Metro port
        return `http://${host}:5001`;
    }
    // Emulator fallback
    return 'http://10.0.2.2:5001';
};

export const API_BASE_URL = getBaseUrl();
