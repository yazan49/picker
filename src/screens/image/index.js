// ImageScreen.js
import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Swiper from 'react-native-swiper';

export const getImages = async (id, mediaType) => {
  const apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwM2M5MzRiOWMwNDllZjU0ZWFhYzhhNWM2MjNmZGNhNCIsInN1YiI6IjY1ZGIwNzE4NjJmMzM1MDE3YzRkMGQxYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SCC3Ww2JJcqSljzFlhzUwVyBg5PBl5D-XNZaZWHa1fw'; // Replace with your TMDb API key
  const baseURL =
    mediaType === 'movie'
      ? 'https://api.themoviedb.org/3/movie/'
      : 'https://api.themoviedb.org/3/tv/';

  try {
    const response = await axios.get(`${baseURL}${id}/images`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data = response.data;
    const status = response.status;
    return {success: true, data: data, status: status};
  } catch (error) {
    console.log(error);
    return {success: false, data: error};
  }
};

const ImageScreen = ({route}) => {
  const {id, mediaType} = route.params;
  const [images, setImages] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Define isLoading state
  const [isBackdropModalVisible, setBackdropModalVisible] = useState(false);
  const [backdropImageUrl, setBackdropImageUrl] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  console.log('Fetching images for id:', id); // Log the id to ensure it's correct

        const {data, success, status} = await getImages(id, mediaType);

        if (success) {
          //console.log('Movie Images:', data);

          setImages(data); // Store movie details in state
        } else {
          console.error('Error fetching movie Images. Status:', status);
        }
      } catch (error) {
        console.error('Error fetching movie Images:', error);
      } finally {
        setIsLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, [id, mediaType]);

  const toggleBackdropModal = index => {
    setSelectedIndex(index);
    setBackdropModalVisible(!isBackdropModalVisible);
  };

  const handleIndexChanged = index => {
    setSelectedIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 10,
            fontSize: 15,
            paddingHorizontal: 20,
          }}>
          More Images
        </Text>

        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <View style={styles.imageContainer}>
            {images &&
              images.backdrops &&
              images.backdrops.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleBackdropModal(index)}>
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${image.file_path}`,
                    }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              ))}
          </View>
        )}
      </ScrollView>
      <Modal
        visible={isBackdropModalVisible}
        transparent={true}
        onRequestClose={() => toggleBackdropModal()}>
        {isBackdropModalVisible && (
          <View style={styles.modalContainer}>
            <Swiper
              style={styles.wrapper}
              loop={false}
              showsButtons={true}
              index={selectedIndex}
              onIndexChanged={handleIndexChanged}>
              {images &&
                images.backdrops &&
                images.backdrops.map((image, index) => (
                  <View style={styles.slide} key={index}>
                    <Image
                      style={styles.enlargedImage}
                      source={{
                        uri: `https://image.tmdb.org/t/p/w500${image.file_path}`,
                      }}
                      defaultSource={require('../../assets/gbook.png')}
                    />
                  </View>
                ))}
            </Swiper>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleBackdropModal()}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#080808',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: responsiveWidth(100),
    height: responsiveHeight(25),
    margin: 5,
    resizeMode: 'contain',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  enlargedImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(60),
    borderRadius: 10,
    resizeMode: 'contain',
  },
  closeButton: {
    marginBottom: 30,
    position: 'absolute',
    bottom: 50,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImageScreen;
