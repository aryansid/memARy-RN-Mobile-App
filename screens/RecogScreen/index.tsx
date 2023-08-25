import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, Image, ImageBackground, Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import { getDocs, query, collection, where } from 'firebase/firestore'; 
import { auth, db } from "../../firebase";
import * as theme from '../../theme'; // TODO: Have once consistent theme throughout 

const { width } = Dimensions.get('window');

// const SPLASH_IMAGE_URL = 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80';

// const { width } = Dimensions.get('window');
// const mocks: RelatedPersonItem[] = [
//   {
//     id: 1,
//     relatedPerson: {
//       name: 'Joy',
//       relationship: 'Son',
//     },
//     image: "./joy.jpg"
//   },
//   {
//     id: 2,
//     relatedPerson: {
//       name: 'Julian',
//       relationship: 'Niece',
//     },
//     image: './julian.jpg'
//   },
//   {
//     id: 3,
//     relatedPerson: {
//       name: 'Aryan',
//       relationship: 'Grandson',
//     },
//     image: './aryan.jpg'
//   },
// ]

// type RelatedPersonItem = {
//   id: number,
//   relatedPerson: {
//     name: string,
//     relationship: string,
//   },
//   image: string,
// };

// const RecogScreen: React.FC = () => {

//   const renderCard = ({ item }: {item: RelatedPersonItem}) => {
      
//       //ideally this switch case is dumb, ik, but the whole point is 
//       //we want to maybe have some default image?? True
//       let source;
//       switch(item.image) {
//         case "./aryan.jpg":
//           source = require("./aryan.jpg");
//           break;
//         case "./joy.jpg":
//           source = require("./joy.jpg");
//           break;
//         case "./julian.jpg":
//           source = require("./julian.jpg");
//           break;
//         default:
//           source = {uri: SPLASH_IMAGE_URL};
//       }

//       return (
//           <View style={styles.card}>
//               <ImageBackground
//                   // source={{ uri: item.image }}
//                   source={source}
//                   style={styles.image}
//               >
//                 <View style={styles.nameBackground}>
//                   <Text>{`${item.relatedPerson.name}, your ${item.relatedPerson.relationship}`}</Text>
//                 </View>
//               </ImageBackground>
//           </View>
//       );
//   }



//   return (
//       <FlatList
//           data={mocks}
//           renderItem={renderCard}
//           keyExtractor={item => `${item.id}`}
//           contentContainerStyle={styles.list}
//       />
//   );
// }

function RecogScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
        setLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const q = query(collection(db, 'images'), where('userID', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const allImages = querySnapshot.docs.map((doc) => doc.data());
                setImages(allImages);
            }
        } catch (err) {
            console.error("Error fetching images: ", err);
        }
        setLoading(false);
    };
    
    fetchImages();
}, []);

const renderImageItem = ({ item }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.imageUrl }} style={styles.image} />
    <Text>{item.description}</Text>
  </View>
);

return (
  <View>
    {loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : (
      <FlatList
        data={images}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    )}
  </View>
);

}

const styles = StyleSheet.create({
  list: {
    padding: theme.sizes.padding,
  },
  card: {
    marginBottom: theme.sizes.margin,
    overflow: 'hidden',
    borderRadius: theme.sizes.radius,
  },
  image: {
    width: width - (theme.sizes.padding * 2),
    height: 250,
    borderRadius: theme.sizes.radius
  },
  nameBackground: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.gray,
    top: 220,
    right: 5,  
    padding: 4,
    borderRadius: theme.sizes.radius,
  },
  
});

export default RecogScreen;

