import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen'
import PictureUploadScreen from './screens/PictureUploadScreen';
import {auth} from "./firebase"
import {useEffect, useState} from 'react';
import { User } from 'firebase/auth';
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator(); 

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen options = {{headerShown: false}} name="Login" component={LoginScreen} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

export default function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        setUser(authUser);
      }
      setIsAuthenticating(false);
    });

    return unsubscribe;
  }, []);

  const Tab = createMaterialTopTabNavigator();

  if (isAuthenticating) {
    return (
      // You can replace this with a loading component or spinner if you like
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>


  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
