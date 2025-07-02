import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import AppHeader from '../../../components/AppHeader';
import AppColors from '../../../utils/AppColors';
import AppTextInput from '../../../components/AppTextInput';
import AppText from '../../../components/AppTextComps/AppText';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../utils/Responsive_Dimensions';
import PickerCard from '../../../components/PickerCard';
import {useSelector} from 'react-redux';
import {createPost, selectImage} from '../../../GlobalFunctions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {ShowToast} from '../../../GlobalFunctions/auth';

const CreatePost = ({navigation}) => {
  const [value, setValue] = useState();
  const {_id} = useSelector(state => state?.user?.userData);
  const [caption, setCaption] = useState();
  const [imageUri, setImageUri] = useState();
  const [isLoading, setIsLoading] = useState(false);
  console.log('_id', _id);

  const [postType, setPostType] = useState([
    {label: 'Post', value: 'Post'},
    {label: 'Vote', value: 'Poll'},
  ]);
  const selectImageHandler = async () => {
    const response = await selectImage();
    setImageUri(response);
  };
  const handleCreatePost = async () => {
    if (!caption) {
      return ShowToast('error', 'Post text cannot be empty.');
    }

    if (!value) {
      return ShowToast('error', 'Please select the type of your post.');
    }

    if (!imageUri) {
      return ShowToast('error', 'Please choose an image to proceed.');
    }

    setIsLoading(true);
    await createPost(_id, imageUri, caption, value, navigation);
    setIsLoading(false);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1, backgroundColor: AppColors.WHITE}}>
      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size={50} color={AppColors.BTNCOLOURS} />
        </View>
      ) : (
        <View>
          <AppHeader
            isBtn
            handleBtnPress={handleCreatePost}
            onPress={() => navigation.goBack()}
            title="Create Post"
          />
          <AppTextInput
            onChangeText={value => setCaption(value)}
            multiline
            fntSize={2.3}
            inputPlaceHolder="What's On Your Mind ?"
          />
          <View style={{paddingHorizontal: responsiveHeight(2)}}>
            {/* <AppText title="Plz Select The Post Type" textSize={2} textFontWeight={300}/> */}
            <PickerCard
              value={value}
              setValue={setValue}
              items={postType}
              placeHolder="Post Type"
              mrgnTop={responsiveHeight(2)}
            />
          </View>
          {imageUri ? (
            <View
              style={{
                paddingHorizontal: responsiveHeight(2),
                marginTop: responsiveHeight(4),
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => setImageUri('')}
                style={{
                  position: 'absolute',
                  backgroundColor: AppColors.BTNCOLOURS,
                  borderRadius: responsiveHeight(2),
                  top: responsiveHeight(2),
                  zIndex: 100,
                  right: responsiveHeight(4),
                }}>
                <Entypo name="cross" color={AppColors.WHITE} size={35} />
              </TouchableOpacity>
              <Image
                source={{uri: imageUri}}
                style={{
                  height: responsiveHeight(40),
                  borderRadius: responsiveHeight(1),
                  width: '100%',
                }}
              />
            </View>
          ) : (
            <View
              style={{
                alignSelf: 'center',
                marginTop: responsiveHeight(10),
                gap: responsiveHeight(1),
              }}>
              <TouchableOpacity
                onPress={selectImageHandler}
                style={{
                  width: responsiveWidth(90),
                  alignItems: 'center',
                  elevation: 15,
                  backgroundColor: 'white',
                  borderRadius: responsiveHeight(1),
                  borderWidth: 1,
                  marginBottom: responsiveHeight(3),
                  padding: 20, // important for visible shadow around content
                }}>
                <AntDesign name="upload" size={80} />
                <AppText
                  mrgnTop={1.5}
                  textSize={2.6}
                  title="Tap to Upload Image"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default CreatePost;
