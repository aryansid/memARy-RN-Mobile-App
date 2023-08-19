import React, { useState, useEffect } from 'react';
import { Button, View, StyleSheet, TextInput, Image, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

function HomeScreen() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTakePicture = () => {
        const options = {
            title: 'Take Picture',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            mediaType: 'photo',
            cameraType: 'back',
        };

        ImagePicker.launchCamera(options, (response) => {
            if (!response.didCancel && !response.error) {
                setSelectedImage({ uri: response.uri });
            }
        });
    };

    const handleUploadFromGallery = () => {
        const options = {
            title: 'Select Image from Gallery',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            mediaType: 'photo',
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel && !response.error) {
                setSelectedImage({ uri: response.uri });
            }
        });
    };

    const handleUploadToFirebase = async () => {
        if (selectedImage && description) {
            setLoading(true);
            try {
                // Upload image to Firebase Storage
                const filename = selectedImage.uri.substring(selectedImage.uri.lastIndexOf('/') + 1);
                const uploadUri = Platform.OS === 'ios' ? selectedImage.uri.replace('file://', '') : selectedImage.uri;
                const reference = storage().ref(filename);
                await reference.putFile(uploadUri);

                // Get the download URL
                const url = await reference.getDownloadURL();

                // Save to Firestore
                await firestore().collection('images').add({
                    imageUrl: url,
                    description: description,
                });

                // Reset state
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const snapshot = await firestore().collection('images').get();
                const fetchedData = snapshot.docs.map(doc => doc.data());
                setImages(fetchedData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data. Please try again.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
