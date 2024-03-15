import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function ImageButtonComp({
  label,
  onPress,
  imageSource,
  imageStyle = {},
  buttonStyle = {},
  labelStyle = {},
}) {
  return (
      <TouchableOpacity onPress={() => onPress()}>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          ...buttonStyle,
        }}
      >
        {imageSource && (
          <Image
            source={imageSource}
            style={{
              width: 20,
              height: 20,
              marginRight: 5,
              ...imageStyle,
            }}
          />
        )}
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            ...labelStyle,
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
