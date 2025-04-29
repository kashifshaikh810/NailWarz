import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AppText from './AppTextComps/AppText'; // adjust the path if needed
import  AppColors from '../utils/AppColors'; // adjust as needed

const SeeMoreText = ({ text, textColor = AppColors.WHITE, textSize = 1.8, numberOfLines = 2 }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(prev => !prev);

  const displayText = expanded ? text : text?.slice(0, 60) + (text?.length > 60 ? '...' : '');

  return (
    <View>
      <AppText
        title={displayText}
        textColor={textColor}
        textSize={textSize}
      />
      {text?.length > 60 && (
        <TouchableOpacity onPress={toggleExpanded}>
          <Text style={{ color: 'lightblue'}}>
            {expanded ? 'See less' : 'See more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SeeMoreText;
