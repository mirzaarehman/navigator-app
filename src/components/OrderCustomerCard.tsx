
import { faEnvelope, faMessage, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Linking } from 'react-native';
import { Avatar, Button, Separator, Text, useTheme, XStack, YStack } from 'tamagui';

const OrderCustomerCard = ({ customer, driverName, orgName, order,entities }) => {
    const theme = useTheme();

  const calculateOrderTotal = (entities) => {
    const entitiesArray = Array.isArray(entities) ? entities : [];

    let total = entitiesArray.reduce((sum, entity) => {
      const price = parseFloat(entity?.price) || 0;
      return sum + price;
    }, 0);

    const currency = entitiesArray[0]?.currency || "USD";

if (total > 0){
    total = total / 100;
    }
    return { total, currency };
  };


    // Usage
    const { total, currency } = calculateOrderTotal(entities);
    console.log(`Order Total: ${total} ${currency}`); // -> Order Total: 2000 USD



  const message = `

  Hi 👋, this is ${driverName || "Driver"} from ${orgName || "Our Company"}.
  Your order ${order?.number || "N/A"} (total ${total + " " + currency || "N/A"}) is ready for delivery. 🚚
  Please share your location 📍 or send a voice note with your detailed address so we can deliver it.
  Thank you! 🙏


  مرحباً 👋، معك ${driverName || "السائق"} من ${orgName || "شركتنا"}.
  طلبك رقم ${order?.number || "N/A"} (بقيمة ${total + " " + currency || "N/A"}) جاهز للتسليم 🚚.
  يرجى تزويدنا بموقعك 📍 أو إرسال ملاحظة صوتية بعنوانك بالتفصيل ليتم التوصيل.
  `;


console.log( message);
const openWhatsApp = () => {


    console.log(customer);
    if (!customer.phone) {
        console.warn("Customer phone number is missing");
        return;
    }

    const phone = customer.phone.replace("+", "");

    const url = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
        console.error("Make sure WhatsApp is installed on the device");
    });
};


    return (
        <YStack space='$2' borderWidth={1} borderColor='$borderColor' borderRadius='$4'>
            <YStack px='$3' py='$2'>
                <XStack space='$3'>
                    <YStack justifyContent='center'>
                        <Avatar size={30} circular>
                            <Avatar.Image src={customer.photo_url} />
                        </Avatar>
                    </YStack>
                    <YStack>
                        <Text color='$textPrimary' fontWeight='bold' mb='$1'>
                            {customer.name}
                        </Text>
                        <YStack>
                            {customer.phone && <Text color='$textSecondary'>{customer.phone}</Text>}
                            {customer.email && <Text color='$textSecondary'>{customer.email}</Text>}
                        </YStack>
                    </YStack>
                </XStack>
            </YStack>
            <Separator />
            <YStack px='$3' py='$2'>
                <XStack space='$3'>
                    <Button bg='$info' size='$3' borderWidth={1} borderColor='$infoBorder'>
                        <Button.Icon>
                            <FontAwesomeIcon icon={faPhone} color={theme.infoText.val} />
                        </Button.Icon>
                        <Button.Text color='$infoText'>Call</Button.Text>
                    </Button>
                    <Button bg='$info' size='$3' borderWidth={1} borderColor='$infoBorder'>
                        <Button.Icon>
                            <FontAwesomeIcon icon={faEnvelope} color={theme.infoText.val} />
                        </Button.Icon>
                        <Button.Text color='$infoText'>Email</Button.Text>
                    </Button>
                    <Button bg='$info' size='$3' borderWidth={1} borderColor='$infoBorder'>
                        <Button.Icon>
                            <FontAwesomeIcon icon={faMessage} color={theme.infoText.val} />
                        </Button.Icon>
                        <Button.Text color='$infoText'>Chat</Button.Text>
                    </Button>

                    <Button
                        bg='$info'
                        size='$3'
                        borderWidth={1}
                        borderColor='$infoBorder'
                        onPress={openWhatsApp}
                    >
                        <Button.Icon>
                            <FontAwesomeIcon icon={faMessage} color={theme.infoText.val} />
                        </Button.Icon>
                        <Button.Text color='$infoText'>WhatsApp</Button.Text>
                    </Button>
                </XStack>
            </YStack>
        </YStack>
    );
};

export default OrderCustomerCard;