import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Text } from 'tamagui';
import HeaderButton from '../../components/HeaderButton';
import BootScreen from '../../screens/BootScreen';
import InstanceLinkScreen from '../../screens/InstanceLinkScreen';
import LocationPermissionScreen from '../../screens/LocationPermissionScreen';
import OrganizationSelectScreen from '../../screens/OrganizationSelectScreen';
import BrandSelectScreen from '../../screens/BrandSelectScreen';
import TestScreen from '../../screens/TestScreen';
import { getTheme } from '../../utils';

export const Boot = {
    screen: BootScreen,
    options: {
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
    },
};

export const LocationPermission = {
    screen: LocationPermissionScreen,
    options: {
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
    },
};

export const InstanceLink = {
    screen: InstanceLinkScreen,
    options: ({ navigation }) => {
        return {
            headerTitle: '',
            presentation: 'modal',
            headerLeft: (props) => (
                <Text color='$textPrimary' fontSize={20} fontWeight='bold'>
                    Connection Config
                </Text>
            ),
            headerRight: (props) => <HeaderButton icon={faTimes} onPress={() => navigation.goBack()} />,
            headerStyle: {
                backgroundColor: getTheme('background'),
                headerTintColor: getTheme('borderColor'),
            },
        };
    },
};

export const OrganizationSelect = {
    screen: OrganizationSelectScreen,
    options: {
        headerShown: false,
        gestureEnabled: false,
        animation: 'none',
    },
};

export const BrandSelect = {
    screen: BrandSelectScreen,
    options: {
        headerShown: false,
        gestureEnabled: false,
    },
};

export const Test = {
    screen: TestScreen,
};

const CoreStack = {
    Boot,
    Test,
    LocationPermission,
    InstanceLink,
    OrganizationSelect,
    BrandSelect,
};

export default CoreStack;
