import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, H2, Paragraph, Separator, YStack, useTheme } from 'tamagui';
import { useConfig } from '../contexts/ConfigContext';
import useStorage from '../hooks/use-storage';

const BrandSelectScreen: React.FC = () => {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const cfg = useConfig() as any;
    const [, setOrgSelected] = useStorage<boolean>('_org_selected', false as any);
    const [, setOrgName] = useStorage<string>('_org_name', '' as any);

    const handleSelect = (brand: 'Mazen Group' | 'Mazan Pharmacy') => {
        // Choose the appropriate API key/host based on selected brand
        // Mazen Group: prefer MAZEN_* vars, fallback to generic FLEETBASE_*
        // Mazan Pharmacy: use MAZAN_* vars
        const key =
            brand === 'Mazan Pharmacy'
                ? cfg.MAZAN_FLEETBASE_KEY
                : cfg.MAZEN_FLEETBASE_KEY ?? cfg.FLEETBASE_KEY;
        const host =
            brand === 'Mazan Pharmacy'
                ? cfg.MAZAN_FLEETBASE_HOST
                : cfg.MAZEN_FLEETBASE_HOST ?? cfg.FLEETBASE_HOST;

        // Mask sensitive values for logging
        const mask = (v?: string) => (typeof v === 'string' && v.length > 8 ? `${v.slice(0, 4)}***${v.slice(-4)}` : v);

        console.log('[BrandSelect] Selected brand:', brand);
        console.log('[BrandSelect] Applying FLEETBASE_KEY:', mask(key));

        if (key) {
            cfg.setInstanceLinkConfig('FLEETBASE_KEY', key);
        }
        if (host) {
            console.log('[BrandSelect] Applying FLEETBASE_HOST:', host);
            cfg.setInstanceLinkConfig('FLEETBASE_HOST', host);
        }

        // Mark organization selection so Boot doesn't redirect back here
        setOrgSelected(true as any);
        setOrgName(brand as any);

        // Proceed to the existing flow which starts in Boot
        navigation.replace('Boot');
    };

    return (
        <YStack flex={1} bg={theme.background} alignItems="center" justifyContent="center" padding="$6" gap="$6">
            <YStack alignItems="center" gap="$2">
                <H2 color={theme.color}>Select Brand</H2>
                <Paragraph color={theme.color} opacity={0.7} textAlign="center">
                    Please choose one to continue
                </Paragraph>
            </YStack>

            <YStack width="100%" maxWidth={340} gap="$4">
                <Button size="$6" themeInverse onPress={() => handleSelect('Mazen Group')}>
                    Mazen Group
                </Button>
                <Button size="$6" themeInverse onPress={() => handleSelect('Mazan Pharmacy')}>
                    Mazan Pharmacy
                </Button>
            </YStack>
            <Separator alignSelf="stretch" />
        </YStack>
    );
};

export default BrandSelectScreen;
