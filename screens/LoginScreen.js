import React from "react";
import {StyleSheet, Text, View} from "react-native";

const HomeScreen = () => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <View>
        <TextInput
          placeholder = "Email"
          // value = { }
          // onChangeText = {text => }
          style = {styles.input}
        />
        <TextInput
          placeholder = "Password"
          // value = { }
          // onChangeText = {text => }
          style = {styles.input}
          secureTextEntry
        />
      </View>

      <View
        style = {styles.buttonContainer}
      >
        <TouchableOpacity
          onPress = {() => { }}
          style = {styles.button}
        >
          <Text
            style = {styles.button}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress = {() => { }}
          style = {styles.button}
        >
          <Text
            style = {styles.button}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  }
})