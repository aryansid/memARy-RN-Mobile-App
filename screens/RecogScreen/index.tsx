import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    Image,
    ImageBackground,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as theme from '../../theme';

const { width } = Dimensions.get('window');
const mocks = [
  {
    id: 1,
    user: {
      name: 'Joy',
      relationship: 'Son',
    },
    images: [
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 2,
    user: {
      name: 'Julian',
      relationship: 'Niece',
    },
    images: [
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 3,
    user: {
      name: 'Aryan',
      relationship: 'Grandson',
    },
    images: [
      'https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80'
    ]
  },

]

const RecogScreen: React.FC = () => {

  const renderCard = ({ item }) => {
      return (
          <View style={styles.card}>
              <ImageBackground
                  source={{ uri: item.images[0] }}
                  style={styles.image}
              >
              </ImageBackground>
          </View>
      );
  }

  return (
      <FlatList
          data={mocks}
          renderItem={renderCard}
          keyExtractor={item => `${item.id}`}
          contentContainerStyle={styles.list}
      />
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
  },
  
  // TODO Aryan: Add white card design later
});

export default RecogScreen;
