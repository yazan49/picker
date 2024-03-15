import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {searchMovies, searchTv, searchPerson} from '../api/network';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';

const Search = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  const handleResultPress = item => {
    if (item.release_date) {
      // It's a movie, navigate to Movie screen and send movie data
      console.log(item.original_title, item.id);
      navigation.navigate('Movie', {movieData: item});
    } else if (item.first_air_date) {
      // It's a TV show, navigate to TV screen and send TV data
      navigation.navigate('Tv', {mediaData: item});
    } else if (item.profile_path) {
      navigation.navigate('Actor', {actorData: item});
    }
  };

  useEffect(() => {
    let timeoutId;

    const delayedSearch = async () => {
      if (!query) {
        setResults([]);
        setError('');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const movieResults = await searchMovies(query);

        if (movieResults.success && movieResults.status === 200) {
          const mergedResults = movieResults.data.results.sort(
            (a, b) => b.popularity - a.popularity,
          );
          setResults(mergedResults);
          setError('');
          flatListRef.current.scrollToOffset({offset: 0});
        } else {
          setResults([]);
          setError('Error fetching search results.');
        }
      } catch (error) {
        console.error('Error in handleSearch:', error);
        setResults([]);
        setError('Error fetching search results.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      // Set a timeout for 300ms before triggering the search
      timeoutId = setTimeout(delayedSearch, 300);
    }

    return () => {
      // Cleanup on component unmount or when a new keystroke occurs
      clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <View style={styles.View}>
      <View style={styles.search}>
        <TextInput
          style={styles.inputSearch}
          placeholder="Enter movie or TV show title..."
          value={query}
          onChangeText={text => setQuery(text)}
        />

        {loading && <Text style={{color: 'white'}}>Loading...</Text>}
        {error && query && !loading && (
          <Text style={{color: 'red'}}>{error}</Text>
        )}
      </View>

      <FlatList
        ref={flatListRef} // Set the ref
        data={results}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={() =>
          query && !loading ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>Sorry, no results found</Text>
              <Text style={styles.noResultsExtraText}>
                Double-check the title and try again.{' '}
              </Text>
            </View>
          ) : null
        }
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleResultPress(item)} // Call a function to handle the press
          >
            <View style={styles.Main}>
              <View style={styles.img}>
                <Image
                  style={styles.img}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500/${
                      item.poster_path || item.profile_path
                    }`,
                  }}
                />
              </View>
              <View style={styles.descrebtion}>
                <Text style={styles.title} numberOfLines={2}>
                  {item.title || item.name}
                </Text>
                <Text style={styles.release_date}>{item.release_date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  View: {
    flex: 1,
    backgroundColor: '#080808',
  },
  inputSearch: {
    backgroundColor: 'white',
    padding: 20,
    fontWeight: 'bold',
    borderRadius: 20,
  },
  search: {
    backgroundColor: '#080808',
    marginTop: 50,
    padding: 10,
    borderRadius: 20,
  },
  Main: {
    padding: 5,
    backgroundColor: '#121212',
    flexDirection: 'row',
    marginTop: 20,
  },
  img: {
    width: responsiveWidth(35),
    height: responsiveHeight(20),
    resizeMode: 'contain',
  },
  title: {
    fontWeight: '700',
    padding: 10,
    color: 'white',
  },
  release_date: {
    padding: 10,
    color: 'white',
  },
  descrebtion: {
    justifyContent: 'center',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  noResultsText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsExtraText: {
    marginTop: 15,
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});
