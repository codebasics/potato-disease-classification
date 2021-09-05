import {Alert, Platform} from 'react-native';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

export const isIOS = Platform.OS === 'ios';

function showAlert(msg) {
  Alert.alert('', msg, [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'Settings',
      onPress: () => {
        openSettings().catch(() => console.warn('cannot open settings'));
      },
    },
  ]);
}

const hasCameraPermission = async (withAlert = true) => {
  try {
    const permission = isIOS
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
    const response = await check(permission);
    let camera;
    if (response.camera !== RESULTS.GRANTED) {
      camera = await request(permission);
    }
    if (camera === RESULTS.DENIED || camera === RESULTS.BLOCKED) {
      if (withAlert) {
        showAlert(
          'Permission not granted for camera. You will not able to use camera in this application.',
        );
      }
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const hasPhotoPermission = async (withAlert = true) => {
  try {
    const permission = isIOS
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.WRITE_EXTERNAL_StorageService;
    const response = await check(permission);
    let photo;
    if (response.photo !== RESULTS.GRANTED) {
      photo = await request(permission);
    }
    if (photo === RESULTS.DENIED || photo === RESULTS.BLOCKED) {
      if (withAlert) {
        showAlert(
          'Permission not granted for photos. You will not able to get photos in this application.',
        );
      }
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const PermissionsService = {
  hasCameraPermission,
  hasPhotoPermission,
};

export default PermissionsService;
