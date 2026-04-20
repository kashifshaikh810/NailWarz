/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
} from '../../utils/Responsive_Dimensions';
import ReviewsCard from '../../components/ReviewsCard';
import {getAllReviews} from '../../GlobalFunctions';
import {ShowToast} from '../../GlobalFunctions/auth';
import AppColors from '../../utils/AppColors';
import AppText from '../../components/AppTextComps/AppText';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppButton from '../../components/AppButton';
import AddReviewModal from '../../components/AddReviewModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {globalStyles} from '../../GlobalFunctions/styles';

const AllReviews = ({navigation, route}) => {
  const [allReviews, setAllReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [avgAndTotalRatings, setAvgAndTotalRatings] = useState({
    averageRating: '',
    totalReviews: '',
  });
  const getAllReviewsHandler = async () => {
    setIsLoading(true);
    const response = await getAllReviews(route?.params?.saloonId);
    setIsLoading(false);

    console.log('response', response);
    if (response.success) {
      setAvgAndTotalRatings({
        averageRating: response.averageRating,
        totalReviews: response.totalReviews,
      });
      setAllReviews(response?.data);
    } else {
      // ShowToast('error', response.message);
    }
  };
  useEffect(() => {
    getAllReviewsHandler();
  }, [refresh]);
  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: AppColors.WHITE,
          padding: responsiveHeight(2),
          paddingBottom: responsiveHeight(10),
        }}
        showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: responsiveHeight(2),
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: responsiveHeight(1.5),
                }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name={'chevron-back'}
                    size={25}
                    color={AppColors.RED}
                  />
                </TouchableOpacity>
                <AppText
                  title="Reviews"
                  textFontWeight
                  textSize={2.2}
                  textColor={AppColors.RED}
                />
              </View>

              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <FontAwesome name={'star'} size={18} color={AppColors.RED} />
                <AppText
                  title={`${avgAndTotalRatings?.averageRating} (${avgAndTotalRatings?.totalReviews})`}
                  textSize={2}
                  textColor={AppColors.RED}
                />
              </View>
            </View>
            {allReviews?.length ? (
              <View>
                <FlatList
                  contentContainerStyle={{
                    gap: responsiveHeight(2),
                    marginTop: responsiveHeight(2.5),
                    margin: responsiveHeight(0.7),
                    paddingBottom: responsiveHeight(3),
                  }}
                  showsHorizontalScrollIndicator={false}
                  data={allReviews}
                  renderItem={({item}) => {
                    return <ReviewsCard data={item} />;
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <AppText title="No Reviews Found..." textSize={2.5} />
              </View>
            )}

            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              <AppButton
                handlePress={() => setModalVisible(true)}
                title="Add Review"
              />
            </View>
          </View>
        )}
        <AddReviewModal
          setRefresh={() => setRefresh(!refresh)}
          saloonId={route?.params?.saloonId}
          modalVisible={modalVisible}
          onBackdropPress={() => setModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllReviews;
