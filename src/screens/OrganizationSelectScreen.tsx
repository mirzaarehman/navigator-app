import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native';
import { Button, Image, Text, useTheme, XStack, YStack } from 'tamagui';
import { useIsAuthenticated } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';
import useStorage from '../hooks/use-storage';

const OrganizationSelectScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const cfg = useConfig() as any;
    const [orgSelected, setOrgSelected] = useStorage<boolean>('_org_selected', false as any);
    const [, setOrgName] = useStorage<string>('_org_name', '' as any);
    const isAuthenticated = useIsAuthenticated();

    const handleSelect = useCallback(
        (preset: 'MAZEN' | 'MAZAN') => {
            const hostKey = preset === 'MAZEN' ? 'MAZEN_FLEETBASE_HOST' : 'MAZAN_FLEETBASE_HOST';
            const apiKeyKey = preset === 'MAZEN' ? 'MAZEN_FLEETBASE_KEY' : 'MAZAN_FLEETBASE_KEY';
            const scHostKey = preset === 'MAZEN' ? 'MAZEN_SOCKETCLUSTER_HOST' : 'MAZAN_SOCKETCLUSTER_HOST';
            const scPortKey = preset === 'MAZEN' ? 'MAZEN_SOCKETCLUSTER_PORT' : 'MAZAN_SOCKETCLUSTER_PORT';
            const scSecureKey = preset === 'MAZEN' ? 'MAZEN_SOCKETCLUSTER_SECURE' : 'MAZAN_SOCKETCLUSTER_SECURE';

            // Prefer brand-specific host/key, but fallback to generic .env values if not present
            const FLEETBASE_HOST = cfg[hostKey] ?? cfg.FLEETBASE_HOST;
            const FLEETBASE_KEY = cfg[apiKeyKey] ?? cfg.FLEETBASE_KEY;
            const SOCKETCLUSTER_HOST = cfg[scHostKey];
            const SOCKETCLUSTER_PORT = cfg[scPortKey];
            const SOCKETCLUSTER_SECURE = cfg[scSecureKey];

            // Mask sensitive values for logging
            const mask = (v?: string) => (typeof v === 'string' && v.length > 8 ? `${v.slice(0, 4)}***${v.slice(-4)}` : v);

            console.log('[OrganizationSelect] Preset:', preset);
            console.log('[OrganizationSelect] Applying FLEETBASE_HOST:', FLEETBASE_HOST);
            console.log('[OrganizationSelect] Applying FLEETBASE_KEY:', mask(FLEETBASE_KEY));

            if (FLEETBASE_HOST) cfg.setInstanceLinkConfig('FLEETBASE_HOST', FLEETBASE_HOST);
            if (FLEETBASE_KEY) cfg.setInstanceLinkConfig('FLEETBASE_KEY', FLEETBASE_KEY);
            if (SOCKETCLUSTER_HOST) cfg.setInstanceLinkConfig('SOCKETCLUSTER_HOST', SOCKETCLUSTER_HOST);
            if (SOCKETCLUSTER_PORT) cfg.setInstanceLinkConfig('SOCKETCLUSTER_PORT', SOCKETCLUSTER_PORT);
            if (SOCKETCLUSTER_SECURE !== undefined) cfg.setInstanceLinkConfig('SOCKETCLUSTER_SECURE', SOCKETCLUSTER_SECURE);

            setOrgSelected(true as any);
            setOrgName(preset as any);

            // Route back to Boot to let it perform initialization checks consistently
            navigation.replace('Boot' as never);
        },
        [cfg, navigation, setOrgSelected, setOrgName, isAuthenticated]
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <YStack flex={1} bg={cfg.navigatorConfig('colors.loginBackground')} alignItems='center' justifyContent='center' space='$6' px='$5'>
                <YStack alignItems='center' space='$3'>
                    <Image source={require('../../assets/navigator-icon-transparent.png')} width={64} height={64} />
                    <Text color='$textPrimary' fontSize='$7' fontWeight='700'>
                        Select Organization
                    </Text>
                    <Text color='$textSecondary' fontSize='$3'>
                        Continue as Mazen Group or Mazan Pharmacy
                    </Text>
                </YStack>

                <YStack width='100%' space='$3'>
                    <Button size='$5' onPress={() => handleSelect('MAZEN')}>
                        Mazen Group
                    </Button>
                    <Button size='$5' onPress={() => handleSelect('MAZAN')}>
                        Mazan Pharmacy
                    </Button>
                </YStack>

                <XStack pt='$4'>
                    <Text color='$textSecondary' fontSize='$2'>
                        You can change this later in Instance Link.
                    </Text>
                </XStack>
            </YStack>
        </SafeAreaView>
    );
};

export default OrganizationSelectScreen;


