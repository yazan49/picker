import React from 'react';
import { Text, View, Image, TouchableOpacity ,StyleSheet , FlatList} from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export default function ActorCard({ title, data , navigation }) {
  const handleOnClick = (item) => {
    // Handle click logic here
    navigation.navigate('Actor', { actorData: item });
  };

  const renderActorCard = ({ item, index }) => {


    return (
      <TouchableOpacity onPress={() => handleOnClick(item)}>
        <Image
          style={styles.Image}
          source={{
            uri: `https://image.tmdb.org/t/p/w500/${item.profile_path}`,
          }}
        />
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
    <Text style={{color:'white', fontSize :17, 
    fontWeight:'bold', letterSpacing:1,marginTop:5}}>{title}</Text>
   
    <FlatList horizontal 
    showsHorizontalScrollIndicator={false} 
    data={data} 
    
    renderItem={renderActorCard}
    ItemSeparatorComponent={() => <View style={{width:15}}>

    </View> }
    />


</View>
);
}
const styles = StyleSheet.create({
container : {
flex:1
}, 
Image : {
resizeMode:'contain',
height: '100%',
borderRadius:10,
width:responsiveWidth(40),

aspectRatio: 2 / 3.5,



}
})
