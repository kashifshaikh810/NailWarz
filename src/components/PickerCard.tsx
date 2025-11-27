/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { responsiveHeight, responsiveWidth } from '../utils/Responsive_Dimensions';
import { Dropdown } from 'react-native-element-dropdown';
import AppColors from '../utils/AppColors';

// PickerCard component replace karo
const PickerCard: React.FC<PickerProps> = ({
  mrgnTop, top, padding, bgColor, dropDownBgColor,
  placeHolder, items, value, setValue, height,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={[styles.container, { marginTop: mrgnTop, padding: padding ? padding : 3 }]}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: 'blue' },
          { backgroundColor: AppColors.INPUTBG, height: responsiveHeight(height) }
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={items}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? (placeHolder || 'Select Service') : '...'}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};
// Styles update karo

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
  label: {
    fontSize: 18, // Customize size as needed
    color: '#000', // Label color
    marginBottom: 8, // Space between label and dropdown
  },
  dropdown: {
    borderWidth: 1,
    backgroundColor: AppColors.INPUTBG,
    borderColor: '#ccc',
    borderRadius: 8,
    height: responsiveHeight(7.5),
    width: responsiveWidth(91),
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'absolute', // Ensure the dropdown is positioned above other elements
    top: responsiveHeight(7.5), // Adjust top positioning if needed
  },
  textStyle: {
    fontSize: 16,
    color: '#3B4B68',
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3B4B68',
  },
});

export default PickerCard;
