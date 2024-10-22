import {
  createNativeStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/native-stack';
import {
  Initial,
  Userloginsignup,
  Main,
  BusinessDetails,
  CategoryBusiness,
  UserCartListItems,
  UserAddressList,
  UserAddnewAddress,
  UserEditAddress,
  UserMyaccount,
  EditProfile,
  RemoveAccounut,
  NotificationList,
  OrderHistory,
  OrderDetails,
  BusinessReview,
  UserorderReview,
  UserCheckout,
  OrderSuccessfull,
  ForgotPassword,
} from '../Screens';
import Bottomtabs from './BottomTab';
const Stack = createNativeStackNavigator();
const MainNavigation = () => {
  const horizontalAnimation = {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({current, layouts}) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };

  return (
    // <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // animationEnabled: Platform.OS === "android" ? false : true,
        gestureEnabled: Platform.OS === 'android' ? false : true,
        headerShadowVisible: false,
        // detachInactiveScreens: true,
      }}
      initialRouteName="Initial">
      <Stack.Screen
        name="Initial"
        component={Initial}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="login"
        component={Userloginsignup}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="main"
        component={Main}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="businessDetails"
        component={BusinessDetails}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="businessCategory"
        component={CategoryBusiness}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="usercartScreen"
        component={UserCartListItems}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="userNewAddress"
        component={UserAddnewAddress}
        options={horizontalAnimation}
      />

      <Stack.Screen
        name="userEditAddress"
        component={UserEditAddress}
        options={horizontalAnimation}
      />

      <Stack.Screen
        name="usereditProfile"
        component={EditProfile}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="removeaccount"
        component={RemoveAccounut}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="notificationlist"
        component={NotificationList}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="orderDetails"
        component={OrderDetails}
        options={horizontalAnimation}
      />

      <Stack.Screen
        name="orderReview"
        component={UserorderReview}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="cartCheckout"
        component={UserCheckout}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="orderSuccessfull"
        component={OrderSuccessfull}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="homescreen"
        component={Bottomtabs}
        options={horizontalAnimation}
      />

      <Stack.Screen
        name="forgotPassword"
        component={ForgotPassword}
        options={horizontalAnimation}
      />
    </Stack.Navigator>
  );
};

//export default MainNavigation;
export {MainNavigation};
