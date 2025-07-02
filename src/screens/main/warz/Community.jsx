/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import AppColors from '../../../utils/AppColors';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import APPImages from '../../../assets/APPImages';
import AppText from '../../../components/AppTextComps/AppText';
import LineBreak from '../../../components/LineBreak';
import SeeMoreText from '../../../components/SeeMoreText';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {
  commentPost,
  getPostById,
  likePost,
  sharePost,
} from '../../../GlobalFunctions';
import {ImageBaseUrl} from '../../../BaseUrl';
import Modal from 'react-native-modal';
import AppTextInput from '../../../components/AppTextInput';
import AppButton from '../../../components/AppButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Community = ({navigation, route}) => {
  const {userData} = useSelector(state => state.user);
  const {item} = route?.params;
  const [liked, setLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();
  const [shareMessage, setShareMessage] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [commentmsg, setCommentMsg] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [allComments, setAllComments] = useState([]);

  console.log('data====>>>>', data);
  // console.log('data.Like====>>>>', data.Like);
  console.log('liked====>>>>', liked);
  const getPostByIdHandler = async () => {
    const response = await getPostById(item?._id);
    setData(response.data);
    setAllComments(response.data?.Comment);
  };
  useEffect(() => {
    if (data?.Like?.some(like => like._id === userData._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [data]);

  useEffect(() => {
    getPostByIdHandler();
  }, []);
  const likePostHandler = async () => {
    const response = await likePost(userData._id, data?._id);
    console.log('response', response);
    if (response.success) {
      getPostByIdHandler();
    }
  };

  const sharePostHandler = async () => {
    setShareLoading(true);
    await sharePost(userData._id, data?._id, shareMessage);
    setModalVisible(false);
    getPostByIdHandler();
    setShareLoading(false);
  };

  const addCommentHandler = async () => {
    if (commentmsg == '') {
      return Alert.alert('Please enter the comment');
    }
    const response = await commentPost(userData._id, data?._id, commentmsg);
    if (response.success) {
      setCommentMsg('');
      getPostByIdHandler();
      // setAllComments(response.data);
      console.log('response.data', response.data);
    } else {
      console.log('response.data', response.data);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: AppColors.BLACK}}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveHeight(3),
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <EvilIcons
              name={'close'}
              color={AppColors.WHITE}
              size={responsiveFontSize(3.5)}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Entypo
              name={'dots-three-horizontal'}
              color={AppColors.WHITE}
              size={responsiveFontSize(3)}
            />
          </TouchableOpacity>
        </View>

        <LineBreak space={20} />

        <Image
          source={{uri: `${ImageBaseUrl}${data?.Post_Image}`}}
          style={{width: responsiveWidth(100), height: responsiveHeight(45)}}
        />

        <View
          style={{
            paddingHorizontal: responsiveWidth(3),
            paddingVertical: responsiveHeight(2),
          }}>
          <SeeMoreText
            text={data?.Post_Caption || ''}
            textColor={AppColors.WHITE}
            textSize={1.8}
          />

          <LineBreak space={2} />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AppText
              title={`${data?.Like?.length || 0} Likes`}
              textColor={AppColors.WHITE}
              textSize={1.5}
            />
            <View style={{flexDirection: 'row', gap: 15}}>
              <AppText
                title={`${data?.Comment?.length || 0} Comments`}
                textColor={AppColors.WHITE}
                textSize={1.5}
              />
              <AppText
                title={`${data?.Share?.length || 0} Shares`}
                textColor={AppColors.WHITE}
                textSize={1.5}
              />
            </View>
          </View>

          <LineBreak space={5} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: responsiveWidth(7),
            }}>
            <TouchableOpacity
              onPress={likePostHandler}
              style={{flexDirection: 'row', gap: 7, alignItems: 'center'}}>
              <AntDesign
                name={'like2'}
                color={liked ? '#497FFF' : AppColors.WHITE}
                size={responsiveFontSize(2)}
              />
              <AppText
                title={'Like'}
                textColor={liked ? '#497FFF' : AppColors.WHITE}
                textSize={1.5}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCommentModal(!commentModal)}
              style={{flexDirection: 'row', gap: 7, alignItems: 'center'}}>
              <MaterialCommunityIcons
                name={'comment-text-multiple-outline'}
                color={AppColors.WHITE}
                size={responsiveFontSize(2)}
              />
              <AppText
                title={'Comment'}
                textColor={AppColors.WHITE}
                textSize={1.5}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{flexDirection: 'row', gap: 7, alignItems: 'center'}}>
              <Fontisto
                name={'share-a'}
                color={AppColors.WHITE}
                size={responsiveFontSize(2)}
              />
              <AppText
                title={'Share'}
                textColor={AppColors.WHITE}
                textSize={1.5}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        animationInTiming={600}
        animationOutTiming={600}
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        onBackdropPress={() => setModalVisible(false)}
        isVisible={modalVisible}
        style={{margin: 0}}>
        <View
          style={{
            borderTopLeftRadius: responsiveHeight(1.5),
            borderTopRightRadius: responsiveHeight(1.5),
            // height: responsiveHeight(10),
            width: responsiveWidth(100),
            position: 'absolute',
            backgroundColor: AppColors.WHITE,
            bottom: 0,
            padding: responsiveHeight(1),
          }}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{alignSelf: 'flex-end', marginTop: responsiveHeight(1)}}>
            <Entypo name="cross" size={30} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              gap: responsiveHeight(2),
            }}>
            <Image
              style={{
                height: responsiveHeight(8.3),
                width: responsiveWidth(16),
                borderRadius: responsiveHeight(5),
              }}
              source={{uri: `${ImageBaseUrl}${userData?.image}`}}
            />
            <AppText
              title={userData.username}
              // textColor={AppColors.WHITE}
              mrgnTop={1.5}
              textSize={2}
            />
          </View>
          <View
            style={{
              height: responsiveHeight(17),
              marginTop: responsiveHeight(2),
            }}>
            <AppTextInput
              onChangeText={value => setShareMessage(value)}
              multiline
              fntSize={2.3}
              inputPlaceHolder="Share your thoughts.."
            />
          </View>
          <View style={{alignSelf: 'flex-end', bottom: 5}}>
            <AppButton
              title={
                shareLoading ? (
                  <ActivityIndicator size={'large'} color={AppColors.WHITE} />
                ) : (
                  'Share Now'
                )
              }
              width={35}
              bgColor={AppColors.BTNCOLOURS}
              handlePress={sharePostHandler}
            />
          </View>
        </View>
      </Modal>

      <Modal
        isVisible={commentModal}
        style={{margin: 0, justifyContent: 'flex-end'}}
        onBackdropPress={() => setCommentModal(false)}>
        <View
          style={{
            height: responsiveHeight(70),
            backgroundColor: AppColors.WHITE,
            width: responsiveWidth(100),
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            padding: 20,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: responsiveWidth(60),
            }}>
            <TouchableOpacity style={{}} onPress={() => setCommentModal(false)}>
              <Entypo name="cross" size={30} />
            </TouchableOpacity>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: responsiveFontSize(2.5),
                fontWeight: 'bold',
                marginBottom: responsiveHeight(1),
              }}>
              Comment
            </Text>
          </View>
          {commentLoading ? (
            <ActivityIndicator size={'large'} color={AppColors.BLACK} />
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={allComments}
                contentContainerStyle={{gap: responsiveHeight(3),marginTop:responsiveHeight(5)}}
                renderItem={({item}) => {
                  console.log('item..................', item);
                  return (
                    <View style={{flex: 1}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: responsiveWidth(50),
                          gap: responsiveHeight(2),
                          alignItems: 'center',
                        }}>
                        {item?.userId?.image ? (
                          <Image
                          style={{height:responsiveHeight(5.5),width:responsiveWidth(11),borderRadius:responsiveHeight(3)}}
                            source={{
                              uri: `${ImageBaseUrl}${item?.userId.image}`,
                            }}
                          />
                        ) : (
                          <Ionicons
                            name={'person'}
                            size={responsiveFontSize(4)}
                            color={AppColors.BLACK}
                          />
                        )}

                        <View>
                          <Text
                            style={{
                              color: AppColors.BLACK,
                              fontSize: responsiveFontSize(1.8),
                              fontWeight: 'bold',
                            }}>
                            {item?.userId.username}
                          </Text>
                          <Text style={{fontSize: responsiveFontSize(2)}}>
                            {item?.message}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}

          <View
            style={{
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: responsiveWidth(90),
            }}>
            <AppTextInput
              // placeholder="Type here"
              inputPlaceHolder="Type here"
              inputWidth={70}
              // style={{width: responsiveWidth(80)}}
              onChangeText={txt => {
                setCommentMsg(txt);
              }}
              value={commentmsg}
            />

            <TouchableOpacity
              style={{flex: 1, alignItems: 'center'}}
              onPress={() => addCommentHandler()}>
              <FontAwesome
                name={'send'}
                size={responsiveFontSize(2)}
                color={AppColors.BLACK}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Community;
