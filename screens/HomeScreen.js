import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, TextInput, Image, Text, FlatList, ActivityIndicator, Alert, Platform } from 'react-native';
// import ImagePicker from 'react-native-image-picker';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { encode as btoa, decode as atob } from 'base-64';

function HomeScreen() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    global.atob = atob;

    // const handleTakePicture = () => {
    //     const options = {
    //         title: 'Take Picture',
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //         },
    //         mediaType: 'photo',
    //         cameraType: 'back',
    //     };

    //     ImagePicker.launchCamera(options, (response) => {
    //         if (!response.didCancel && !response.error) {
    //             setSelectedImage({ uri: response.uri });
    //         }
    //     });
    // };

    // const handleUploadFromGallery = () => {
    //     const options = {
    //         title: 'Select Image from Gallery',
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //         },
    //         mediaType: 'photo',
    //     };

    //     ImagePicker.launchImageLibrary(options, (response) => {
    //         if (!response.didCancel && !response.error) {
    //             setSelectedImage({ uri: response.uri });
    //         }
    //     });
    // };

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
      
        if (!result.cancelled && !result.canceled) {
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
      
        if (!result.cancelled && !result.canceled) {
          const asset = result.assets[0];
          setSelectedImage({ uri: asset.uri });
        }
      };      
      
      const handleUploadToFirebase = async () => {
        if (selectedImage && description) {
          setLoading(true);
          try {
            // Extract filename and generate upload URI
            const filename = selectedImage.uri.substring(selectedImage.uri.lastIndexOf('/') + 1);
            const uploadUri = selectedImage.uri;
      
            // Read the file into a Uint8Array
            const fileInfo = await FileSystem.getInfoAsync(uploadUri);
            const fileUri = fileInfo.uri;
            const fileData = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
            const fileBuffer = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
      
            // Create a storage reference and upload the Uint8Array
            const imageRef = ref(storage, filename);
            const uploadTaskSnapshot = await uploadBytes(imageRef, fileBuffer);
      
            // Get the download URL and update Firestore
            const url = await getDownloadURL(imageRef);
      
            await addDoc(collection(db, 'images'), {
              imageUrl: url,
              description: description,
            });
      
            setSelectedImage(null);
            setDescription('');
            setLoading(false);
          } catch (err) {
            console.error(err);
            setError("Failed to upload data. Please try again.");
            setLoading(false);
          }
        }
      };
      
      

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        Alert.alert("Error", error, [{ text: "OK", onPress: () => setError(null) }]);
    }

    return (
        <View style={styles.container}>
            <Button title="Take Picture" onPress={handleTakePicture} />
            <Button title="Upload from Gallery" onPress={handleUploadFromGallery} />
            {selectedImage && <Image source={selectedImage} style={styles.previewImage} />}
            <TextInput
                placeholder="Enter a description..."
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <Button title="Upload to Firebase" onPress={handleUploadToFirebase} />
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
    },
    gridItem: {
        flex: 1,
        margin: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
    },
});

export default HomeScreen;
