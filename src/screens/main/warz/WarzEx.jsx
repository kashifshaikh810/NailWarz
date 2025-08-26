/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import AppText from '../../../components/AppTextComps/AppText';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import APPImages from '../../../assets/APPImages';
import LineBreak from '../../../components/LineBreak';
import AppButton from '../../../components/AppButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {getAllPosts} from '../../../GlobalFunctions';
import {ImageBaseUrl} from '../../../BaseUrl';
import moment from 'moment';
import SharePost from '../../../components/SharePost';

const Warz = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  console.log('posts', posts);
  const focus = useIsFocused();
  const getAllPostsHandler = async () => {
    setIsLoading(true);
    const response = await getAllPosts();
    setIsLoading(false);
    setPosts(response.data);
  };
  useEffect(() => {
    getAllPostsHandler();
  }, [focus]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: responsiveWidth(4),
          paddingVertical: responsiveHeight(2),
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <AppText title="WARZ" textColor={AppColors.BLACK} textSize={2.5} />
            <View style={{width: responsiveWidth(60)}}>
              <AppText
                title="Current Warriors in NAIL WARZ. VOTE NOW Below for your favorite nail set"
                textColor={AppColors.BLACK}
                textSize={1.4}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              padding: responsiveHeight(1.5),
              borderRadius: 10,
              borderColor: '#F5F5F5',
            }}>
            <Ionicons
              name={'notifications-outline'}
              size={responsiveFontSize(3)}
              color={AppColors.BLACK}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreatePost')}
          style={{
            borderColor: 'gray',
            borderWidth: 2,
            borderRadius: responsiveHeight(3),
            padding: responsiveHeight(1),
            paddingHorizontal: responsiveHeight(2),
            marginTop: responsiveHeight(2.5),
            marginBottom: responsiveHeight(1),
          }}>
          <AppText
            title="What's On Your Mind ?"
            textColor={AppColors.LIGHTGRAY2}
            textSize={2.5}
          />
        </TouchableOpacity>
        <LineBreak space={2} />
        <View style={{flex: 1}}>
          {isLoading ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
            </View>
          ) : (
            <FlatList
              data={posts}
              contentContainerStyle={{gap: 20}}
              renderItem={({item}) => {
                return (
                  <View>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        paddingHorizontal: responsiveWidth(4),
                        paddingVertical: responsiveHeight(2),
                        borderColor: AppColors.PEACHCOLOUR,
                        borderRadius: 10,
                      }}
                      onPress={() => {
                        if (item.Post_Type === 'Post') {
                          navigation.navigate('Community', {item});
                        }
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          gap: 10,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 10,
                          }}>
                          <Image
                            source={{
                              uri: `${ImageBaseUrl}${item.userId.image}`,
                            }}
                            style={{width: 45, height: 45, borderRadius: 100}}
                          />
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                gap: 7,
                                alignItems: 'flex-end',
                              }}>
                              <AppText
                                title={item.userId.username}
                                textColor={AppColors.BLACK}
                                textSize={1.8}
                              />
                              <AppText
                                title={
                                  item.Post_Type === 'Post'
                                    ? 'added a new post'
                                    : 'added a new poll'
                                }
                                textColor={AppColors.DARKGRAY}
                                textSize={1.4}
                              />
                            </View>
                            <AppText
                              title={moment(item.createdAt).fromNow()}
                              textColor={AppColors.DARKGRAY}
                              textSize={1.5}
                            />
                          </View>
                        </View>

                        <AppText
                          title={item.Post_Type === 'Post' ? 'post' : 'poll'}
                          textColor={AppColors.BTNCOLOURS}
                          textSize={1.7}
                          textFontWeight
                        />
                      </View>

                      <LineBreak space={2} />

                      <View
                        style={
                          item.isPost
                            ? {
                                borderWidth: 1,
                                borderColor: AppColors.BLUE,
                                borderRadius: 10,
                              }
                            : {}
                        }>
                        <LineBreak space={1} />
                        <View
                          style={
                            item.isPost
                              ? {paddingHorizontal: responsiveWidth(3)}
                              : {}
                          }>
                          <AppText
                            title={item.Post_Caption}
                            textColor={AppColors.BLACK}
                            textSize={1.4}
                          />
                        </View>

                        <LineBreak space={1} />

                        <Image
                          source={{uri: `${ImageBaseUrl}${item.Post_Image}`}}
                          style={{
                            borderRadius: 10,
                            width: responsiveWidth(83),
                            height: responsiveHeight(20),
                          }}
                        />
                      </View>

                      <LineBreak space={1.5} />

                      {item.Post_Type !== 'Post' && (
                        <AppButton
                          title={'VOTE'}
                          handlePress={() =>
                            navigation.navigate('BattlePoll', {_id: item._id})
                          }
                        />
                      )}
                    </TouchableOpacity>
                    {item.Share?.length > 0 && (
                      <TouchableOpacity style={{marginTop: 10}}>
                        {item.Share.map((sharedItem, index) => (
                          <SharePost
                            key={index}
                            postData={item}
                            item={sharedItem}
                          />
                        ))}
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default Warz;
