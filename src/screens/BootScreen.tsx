import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { LinearGradient } from 'react-native-linear-gradient';
import { PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import { Image, Spinner, XStack, YStack, useTheme } from 'tamagui';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import useFleetbase from '../hooks/use-fleetbase';
import useStorage from '../hooks/use-storage';
import { config, isArray, later, toArray } from '../utils';
import SetupWarningScreen from './SetupWarningScreen';

const APP_NAME = config('APP_NAME');
const BootScreen = ({ route }) => {
    const params = route.params ?? {};
    const theme = useTheme();
    const navigation = useNavigation<any>();
    const { hasFleetbaseConfig } = useFleetbase();
    const { isAuthenticated } = useAuth() as any;
    const { t } = useLanguage();
    const [error, setError] = useState<Error | null>(null);
    const backgroundColor = toArray(config('BOOTSCREEN_BACKGROUND_COLOR', '$background'));
    const isGradientBackground = isArray(backgroundColor) && backgroundColor.length > 1;
    const locationEnabled = params.locationEnabled;
    const [orgSelected] = useStorage<boolean>('_org_selected', false as any);

    useFocusEffect(
        useCallback(() => {
            const checkLocationPermission = async () => {
                const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

                const result = await check(permission);
                if (result === RESULTS.GRANTED) {
                    initializeNavigator();
                } else {
                    later(() => BootSplash.hide(), 300);
                    // If the locationEnabled flag is set meaning not null or undefined then initialize navigator
                    if (locationEnabled !== undefined && locationEnabled !== null) {
                        initializeNavigator();
                    } else {
                        navigation.navigate('LocationPermission');
                    }
                }
            };

            const initializeNavigator = async () => {
                // If organization/brand not selected yet, force selection first
                if (!orgSelected) {
                    setTimeout(() => navigation.navigate('OrganizationSelect' as never), 0);
                    return;
                }

                if (!hasFleetbaseConfig()) {
                    try {
                        setTimeout(() => navigation.navigate('OrganizationSelect' as never), 0);
                        return;
                    } catch (err) {
                        return setError(new Error('Missing connection configuration.'));
                    }
                }

                try {
                    later(() => {
                        try {
                            // Any initialization processes will run here
                            if (isAuthenticated) {
                                navigation.navigate('DriverNavigator');
                            } else {
                                navigation.navigate('Login');
                            }
                        } catch (err) {
                            console.warn('Failed to navigate to screen:', err);
                        }
                    }, 0);
                } catch (initializationError) {
                    setError(initializationError);
                } finally {
                    later(() => BootSplash.hide(), 300);
                }
            };

            checkLocationPermission();
        }, [navigation, isAuthenticated, orgSelected])
    );

    if (error) {
        return <SetupWarningScreen error={error} />;
    }

    return (
        <YStack flex={1} bg={backgroundColor[0]} alignItems='center' justifyContent='center' width='100%' height='100%'>
            {isGradientBackground && (
                <LinearGradient
                    colors={backgroundColor}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        height: '100%',
                        width: '100%',
                    }}
                />
            )}
            <YStack alignItems='center' justifyContent='center'>
                <Image source={require('../../assets/splash-screen.png')} width={100} height={100} borderRadius='$4' mb='$1' />
                <XStack mt='$2' alignItems='center' justifyContent='center' space='$3'>
                    <Spinner size='small' color='$textPrimary' />
                </XStack>
            </YStack>
        </YStack>
    );
};

export default BootScreen;
