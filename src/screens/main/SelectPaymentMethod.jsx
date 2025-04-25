/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, FlatList} from 'react-native';
import AppColors from '../../utils/AppColors';
import {useNavigation} from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../utils/Responsive_Dimensions';
import LineBreak from '../../components/LineBreak';
import AppButton from '../../components/AppButton';
import AppText from '../../components/AppTextComps/AppText';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SVGXml from '../../components/SVGXML';
import {AppIcons} from './../../assets/Icons/index';
import AppTextInput from '../../components/AppTextInput';
import LoadingModal from '../../components/LoadingModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const timesData = [
  {id: 1, time: 'Credit/ Debit Card'},
  {id: 2, time: 'Apple Pay', iconName: 'apple-pay'},
  {id: 3, time: 'Google Pay'},
];

const SelectPaymentMethod = () => {
  const navigation = useNavigation();
  const [isSelectedCard, setIsSelectedCard] = useState({id: 0});
  const [visibleConfirmationModal, setVisibleConfirmationModal] = useState({id: 0});

  return (
    <ScrollView style={{flex: 1, backgroundColor: AppColors.APPBG}}>
      <AppHeader
        onPress={() => navigation.goBack()}
        title="Select payment method"
      />

      <View
        style={{
          paddingHorizontal: responsiveWidth(5),
          marginVertical: responsiveHeight(2),
        }}>
        <FlatList
          data={timesData}
          contentContainerStyle={{gap: 15}}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  backgroundColor: AppColors.WHITE,
                  borderRadius: 10,
                  paddingHorizontal: responsiveWidth(4),
                  paddingVertical: responsiveHeight(3),
                  gap: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                      alignItems: 'center',
                    }}
                    onPress={() => setIsSelectedCard({id: item.id})}>
                    <Fontisto
                      name={
                        isSelectedCard.id === item.id
                          ? 'radio-btn-active'
                          : 'radio-btn-passive'
                      }
                      size={responsiveFontSize(2.5)}
                      color={
                        isSelectedCard.id === item.id
                          ? AppColors.BLUE
                          : AppColors.DARKGRAY
                      }
                    />
                    <AppText
                      title={item.time}
                      textSize={2.2}
                      textColor={AppColors.BLACK}
                      textFontWeight
                    />
                  </TouchableOpacity>
                  {item.iconName ? (
                    <Fontisto
                      name={item.iconName}
                      size={responsiveFontSize(3.5)}
                      color={AppColors.BLACK}
                    />
                  ) : (
                    item.id == 3 && (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: AppColors.DARKGRAY,
                          paddingHorizontal: 7,
                          borderRadius: 5,
                        }}>
                        <SVGXml
                          width={'27'}
                          height={'27'}
                          icon={AppIcons.Google_Pay}
                        />
                      </View>
                    )
                  )}
                </View>

                {isSelectedCard.id == 1 && index == 0 && (
                  <View>
                    <LineBreak space={1.5} />
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        gap: 10,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            borderWidth: 1,
                            borderColor: AppColors.DARKGRAY,
                            paddingHorizontal: 7,
                            borderRadius: 5,
                          }}>
                          <SVGXml
                            width={'27'}
                            height={'27'}
                            icon={AppIcons.master_card}
                          />
                        </View>
                        <AppText
                          title="**** 2345"
                          textSize={2}
                          textColor={AppColors.BLACK}
                        />
                      </View>
                      <Fontisto
                        name={
                          isSelectedCard.id === item.id
                            ? 'radio-btn-active'
                            : 'radio-btn-passive'
                        }
                        size={responsiveFontSize(2.5)}
                        color={
                          isSelectedCard.id === item.id
                            ? AppColors.BLUE
                            : AppColors.DARKGRAY
                        }
                      />
                    </TouchableOpacity>

                    <LineBreak space={3} />

                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                        gap: 10,
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 10,
                          alignItems: 'center',
                        }}>
                        <View
                          style={{
                            borderWidth: 1,
                            backgroundColor: AppColors.BLUE,
                            paddingHorizontal: 7,
                            borderRadius: 5,
                          }}>
                          <SVGXml
                            width={'27'}
                            height={'27'}
                            icon={AppIcons.visa}
                          />
                        </View>
                        <AppText
                          title="**** 2345"
                          textSize={2}
                          textColor={AppColors.BLACK}
                        />
                      </View>
                      <Fontisto
                        name={'radio-btn-passive'}
                        size={responsiveFontSize(2.5)}
                        color={AppColors.DARKGRAY}
                      />
                    </TouchableOpacity>

                    <LineBreak space={2} />
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <AppText
                        title="Add New Card"
                        textSize={2}
                        textColor={AppColors.BLACK}
                        textFontWeight
                      />
                      <AntDesign
                        name={'close'}
                        size={responsiveFontSize(2.5)}
                        color={AppColors.BLACK}
                      />
                    </TouchableOpacity>

                    <LineBreak space={2} />

                    <TouchableOpacity style={{flexDirection: 'row', gap: 5}}>
                      <Entypo
                        name={'plus'}
                        size={responsiveFontSize(2.5)}
                        color={AppColors.BLUE}
                      />
                      <AppText
                        title="Add Card"
                        textSize={1.8}
                        textColor={AppColors.BLUE}
                        textFontWeight
                      />
                    </TouchableOpacity>

                    <LineBreak space={2} />
                    <AppTextInput
                      containerBg="#f5f5f5"
                      inputPlaceHolder={'Card Number'}
                    />
                    <LineBreak space={1.5} />
                    <View style={{flexDirection: 'row', gap: 10}}>
                      <AppTextInput
                        containerBg="#f5f5f5"
                        inputPlaceHolder={'MM/YY'}
                        inputWidth={20}
                      />
                      <AppTextInput
                        containerBg="#f5f5f5"
                        inputPlaceHolder={'CVC'}
                        inputWidth={20}
                      />
                    </View>
                    <LineBreak space={1.5} />
                    <AppTextInput
                      containerBg="#f5f5f5"
                      inputPlaceHolder={'Card Holder Name'}
                    />
                  </View>
                )}
              </View>
            );
          }}
        />

        {/* <LoadingModal /> */}
        <ConfirmationModal
          iconName={'check'}
          title={'You nail appointment is confirmed!'}
          subTitle={
            'Thank you for your payment. We look forward to seeing you soon.'
          }
          buttonOneTitle={'View Receipt'}
          buttonTwoTitle={'Back to Home'}
          visible={visibleConfirmationModal}
          setVisible={() => {
            navigation.navigate('DownloadReceipt');
            setVisibleConfirmationModal(false)
          }}
        />

        {/* <ConfirmationModal
          iconName={'close'}
          title={'Payment Failed'}
          subTitle={
            'We couldn"t process your payment. Please check your card details or try another payment method.'
          }
          buttonOneTitle={'Try Again'}
          buttonTwoTitle={'Change Payment Method'}
          isChangeColor={true}
          visible={visibleConfirmationModal}
        /> */}

        <LineBreak space={4} />

        <AppButton
          title="Pay Now"
          handlePress={() => setVisibleConfirmationModal(true)}
          //   bgColor={AppColors.DARKGRAY}
          //   textColor={AppColors.WHITE}
        />

        <LineBreak space={2} />
      </View>
    </ScrollView>
  );
};

export default SelectPaymentMethod;
