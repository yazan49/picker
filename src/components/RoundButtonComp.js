import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

export default function RoundButtonComp({
    label, 
    border = false, 
    onPress, 
    width = '100%',
    marginTop = 0,
    backgroundColor = border ? 'white' : '#034ef7', // Default or specified background color
}) {
    return (
        <TouchableOpacity style={{ marginTop: marginTop }} onPress={onPress}>
            <View
                style={{
                    backgroundColor: backgroundColor,
                    width: width,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 15,
                    marginLeft: 10,
                    borderColor: 'black',
                    borderWidth: border ? 1 : 0,
                }}
            >
                <Text
                    style={{
                        color: border ? 'black' : 'white',
                        fontWeight: 'bold',
                        textAlign: 'center',
                    }}
                >
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
}