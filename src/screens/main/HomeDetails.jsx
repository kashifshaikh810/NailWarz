import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { ScrollView } from 'react-native-gesture-handler';
import AppColors from '../../utils/AppColors';
import { useNavigation } from '@react-navigation/native';
import APPImages from '../../assets/APPImages';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../../utils/Responsive_Dimensions';
import AppText from '../../components/AppTextComps/AppText';
import LineBreak from '../../components/LineBreak';
import AntDesign from 'react-native-vector-icons/AntDesign'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AppButton from '../../components/AppButton';

const menuData = [
    {id: 1, title: 'Acrylic Set'},
    {id: 2, title: 'Manicure'},
    {id: 3, title: 'Pedicure'},
    {id: 4, title: 'Nail Art'},
]

const cardData = [
  {id: 1, colorName: 'Solid Color', amount: '$10.00', time: '30 Mins'},
  {id: 2, colorName: 'Toe Acrylic - Full set', amount: '$5.00', time: '24 Mins'},
]

const HomeDetails = () => {
  const navigation = useNavigation();
  const [menu, setMenu] = useState({id: 1})
  const [selectedItems, setSelectedItems] = useState([])

  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.APPBG}}>
        <AppHeader onPress={() => navigation.goBack()} />
        
        <View style={{paddingHorizontal: responsiveWidth(3), marginVertical: responsiveHeight(2)}}>
            <Image source={APPImages.NAILS} style={{width: responsiveWidth(95), height: responsiveHeight(30), borderRadius: 15}} />
        
            <LineBreak space={3} />
          <AppText title="Saloon name here" textSize={3} textFontWeight />
          <LineBreak space={1} />
          
          <View style={{flexDirection: 'row', gap: 10,}}>

          <View style={{gap: 12, alignItems: 'center'}}>
          <EvilIcons
                      name={"location"}
                      size={responsiveFontSize(2.7)}
                      color={AppColors.DARKGRAY}
                      
                      />
          <AntDesign
                      name={"clockcircleo"}
                      size={responsiveFontSize(2)}
                      color={AppColors.DARKGRAY}
                      
                      />
          <FontAwesome
                      name={"star"}
                      size={responsiveFontSize(2.7)}
                      color={AppColors.PEACHCOLOUR}
                      />
          </View>

          <View style={{gap: 12, justifyContent: 'center'}}>
              <AppText title="No 03,Brooklyn, Los Angeles, California" textSize={1.6} textColor={AppColors.DARKGRAY}  />
          <AppText title="9AM-10PM, Mon - Sun" textSize={1.6}  textColor={AppColors.DARKGRAY} />
              <AppText title="4.7 (312)" textSize={1.6}  textColor={AppColors.DARKGRAY} />
          </View>
          </View>

          <LineBreak space={2} />

          <AppText title="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard" textSize={1.9} textColor={AppColors.DARKGRAY}  />
          
          <LineBreak space={3} />
          
          <FlatList 
        data={menuData}
        horizontal
        contentContainerStyle={{gap: 15}}
        renderItem={({item}) => {
            return (
                <TouchableOpacity onPress={() => setMenu({id: item.id})}>
                    <AppText title={item.title} borderBottomWidth={menu.id === item.id ? 3 : 0} paddingBottom={menu.id === item.id ? 4 : 0} borderBottomColor={menu.id === item.id ? AppColors.BLUE : AppColors.WHITE } textSize={1.8} textFontWeight textColor={menu.id === item.id ? AppColors.BLUE : AppColors.DARKGRAY} />                   
                </TouchableOpacity>
        );
    }}
          />

<LineBreak space={2} />

<FlatList 
        data={cardData}
        contentContainerStyle={{gap: 15}}
        renderItem={({item}) => {
            return (
                <View style={{borderRadius: 10, backgroundColor: AppColors.WHITE, paddingHorizontal: responsiveWidth(4), paddingVertical: responsiveHeight(2)}}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View>
                   <AppText title={item.colorName} textSize={2.2} textFontWeight textColor={AppColors.BLACK} />
<LineBreak space={0.5} />
                   <View style={{flexDirection: 'row', gap: 20}}>
                   <AppText title={item.amount} textSize={1.5}  textColor={AppColors.DARKGRAY} />
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                   <AntDesign
                      name={"clockcircleo"}
                      size={responsiveFontSize(1.5)}
                      color={AppColors.DARKGRAY}
                      
                      />
                   <AppText title={item.time} textSize={1.5}  textColor={AppColors.DARKGRAY} />
                   </View>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => {
                       setSelectedItems(prev => {
                        const exists = prev.some(i => i.id === item.id);
                        if (exists) {
                          return prev.filter(i => i.id !== item.id);
                        } else {
                          return [...prev, { ...item }];
                        }
                      });
                    }}>
                  <AntDesign
                      name={selectedItems.some(i => i.id === item.id) ? 'checkcircle' : "pluscircleo"}
                      size={responsiveFontSize(2.7)}
                      color={selectedItems.some(i => i.id === item.id) ? AppColors.BLUE : AppColors.BLACK}
                      />
                      </TouchableOpacity>
                  </View>
                </View>
        );
    }}
          />

<LineBreak space={2} />

  <AppButton 
title={`Continue (${selectedItems?.length})`}
handlePress={() => navigation.navigate('StylistSelect')}
      />
        </View>
    </ScrollView>
  );
};

export default HomeDetails;