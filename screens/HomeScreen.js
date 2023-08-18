import React from "react";
import {KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";

const HomeScreen = () => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
      <Text>Home Screen</Text>
    </KeyboardAvoidingView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})