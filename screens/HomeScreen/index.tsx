import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PictureUploadScreen from '../PictureUploadScreen';
import RecogScreen from '../RecogScreen';

export default function HomeScreen() {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator 
      initialRouteName="Picture Upload" 
      screenOptions={ { tabBarShowLabel : false, tabBarItemStyle: { width: 0 } } }
    >
      <Tab.Screen name="Picture Upload" component={PictureUploadScreen}/>
      <Tab.Screen name="Recog Screen" component={RecogScreen}/>
    </Tab.Navigator>
  );
}