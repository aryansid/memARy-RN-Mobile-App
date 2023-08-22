import React, { useState } from 'react';
import { Button, View, StyleSheet, TextInput, Image, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
// import ImagePicker from 'react-native-image-picker';
// import firestore from '@react-native-firebase/firestore';    
// import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../firebase";
import { encode as btoa, decode as atob } from 'base-64';
// import styles from './styles.scss'

interface SelectedImage {
  uri: any,
}

function PictureUploadScreen() {
    const [selectedImage, setSelectedImage] = useState<SelectedImage>();
    const [description, setDescription] = useState('');
    const [images, setImages] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    global.atob = atob;

    const handleTakePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera permissions to make this work!');
          return;
        }
      
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.canceled) {
          const asset = result.assets[0];
          setSelectedImage({ uri: asset.uri });
        }
      };
      
    const handleUploadFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
      
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.canceled) {
          const asset = result.assets[0];
          setSelectedImage({ uri: asset.uri });
        }
      };      
      
    const handleUploadToFirebase = async () => {
        if (selectedImage && description) {
          setLoading(true);
          try {
            // Generate a unique filename based on timestamp
            const filename = `${Date.now()}.jpg`;
            
            // Fetch the image from the URI and create a blob

            //note ideally, I don't want to use 'any' here, so let's try to mitigate that here...
            const blob: any = await new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = function () {
                resolve(xhr.response);
              };
              xhr.onerror = function () {
                reject(new TypeError('Network request failed'));
              };
              xhr.responseType = 'blob';
              xhr.open('GET', selectedImage.uri, true);
              xhr.send(null);
            });
      
            // Create a storage reference and upload the blob
            const imageRef = ref(storage, `images/${filename}`);
            const uploadTaskSnapshot = await uploadBytes(imageRef, blob);
      
            // Close the blob and free up resources
            blob.close();
      
            // Get the download URL and update Firestore
            const url = await getDownloadURL(imageRef);
      
            await addDoc(collection(db, 'images'), {
              imageUrl: url,
              description: description,
            });
      
            setSelectedImage(undefined);
            setDescription('');
            setLoading(false);
            Alert.alert("Success", "Image has been successfully uploaded!", [{ text: "OK" }]);
          } catch (err) {
            console.error(err);
            setError("Failed to upload data. Please try again.");
            setLoading(false);
          }
        }
      };

    const handleSignOut = () => {
        auth.signOut().then(() => {
            console.log("User signed out");
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    };
       
    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        Alert.alert("Error", error, [{ text: "OK", onPress: () => setError("") }]);
    }

    return (
        <View style={styles.background}>
            <Text style={styles.logo}>Capture your face</Text>
            <Text style={styles.header}>Capture, Upload, Remember.</Text>

            {selectedImage && <Image source={selectedImage} style={styles.previewImage} />}

            <TextInput
                placeholder="Enter your relationship with the patient ..."
                value={description}
                onChangeText={setDescription}
                style={styles.textInput}
            />

            <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.customButton} onPress={handleTakePicture}>
                <Text style={styles.buttonText}>Take Picture</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.customButton} onPress={handleUploadFromGallery}>
                <Text style={styles.buttonText}>Upload from Gallery</Text>
                </TouchableOpacity>
            </View>

            <View 
                style={styles.buttonContainer}>
                <TouchableOpacity style={styles.customButton} onPress={handleUploadToFirebase}>
                <Text style={styles.buttonText}>Upload Photo</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={images}
                renderItem={({ item }) => (
                    <View style={styles.gridItem}>
                        <Image source={{ uri: item.imageUrl }} style={styles.image} />
                        <Text>{item.description}</Text>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
            />
            {/* <View style={styles.signOutContainer}>
                <Button title="Sign Out" onPress={handleSignOut} />
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f6f6f6',
    },
    /*note from Joy: I really want to use Sass here */
    centered: {
      flex: 1,
    }, 
    gridItem: { 
      flex: 1,
    },
    image: {
      flex: 1,
    },

    logo: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#6200ee',
      textAlign: 'center',
      marginBottom: 16,
    },
    header: {
      fontSize: 16,
      color: '#000',
      textAlign: 'center',
      marginBottom: 16,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 16,
      marginBottom: 16,
    },
    buttonContainer: {
      marginBottom: 12,
      alignItems: 'center',
    },
    customButton: {
      borderRadius: 25,
      backgroundColor: '#6200ee',
      paddingVertical: 10,
      paddingHorizontal: 12,
      width: 200,
      alignItems: 'center',
      marginBottom: 16, // #30D5C8
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    previewImage: {
      width: 200,
      height: 200,
      alignSelf: 'center',
      marginBottom: 24,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    signOutContainer: {
        backgroundColor: '#30D5C8'
    }
  });

export default PictureUploadScreen;
