import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

export default function InputFeildComp({
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
}) {
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateInput = (inputText) => {
    setText(inputText);

    // Validate email
    if (keyboardType === 'email-address') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(inputText);
      setIsValid(isValidEmail);
    } else {
      // For other types, you can add additional validations
      // For example, you can check if the password is at least 6 characters long
      // or any other validation specific to the input type
      setIsValid(true);
    }
  };

  return (
    <View style={{
      backgroundColor: 'white',
      borderColor: isValid ? 'black' : 'red',
      borderWidth: 1.3,
      marginBottom: 25,
      paddingHorizontal: 15,
      borderRadius: 8,
    }}>
      <TextInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        onChangeText={validateInput}
        value={text}
      />
      {!isValid && <Text style={{ color: 'red' }}>Invalid input</Text>}
    </View>
  );
}