import axios from 'axios';
import {Linking} from 'react-native';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {constants} from '../constants';
import {notification} from '../constants/variables';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import Sound from 'react-native-sound';

export const helper = {
  async resizeImageBalanced(image) {
    try {
      const resized = await ImageResizer.createResizedImage(
        image.uri,
        5200,
        5200,
        'JPEG',
        80, // perfect balance
        0,
        undefined,
        false,
      );

      return {
        uri: resized.uri,
        type: 'image/jpeg',
        name: `image_${Date.now()}.jpg`,
      };
    } catch (error) {
      console.log('resize error 👉', error);
      throw error;
    }
  },
  async ImageUploadService(imagee) {
    const form = new FormData();
    form.append('file', imagee);
    form.append('upload_preset', 'znuys2j4');
    form.append('cloud_name', 'dcmawlfn2');

    return new Promise((resolve, reject) => {
      axios
        .post(`https://api.cloudinary.com/v1_1/dcmawlfn2/image/upload`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          if (response.status == 200 || response.status == 201) {
            resolve(response.data.secure_url);
          } else {
            reject('Image uploading failed.');
          }
        })
        .catch(error => {
          reject('Image uploading failed.');
        });
    });
  },

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, error => reject(error => {}), {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
    });
  },

  async checkLocation() {
    console.log('CALEd');
    if (Platform.OS == 'android') {
      return await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
        async status => {
          if (status == 'granted') {
            return 'granted';
          } else if (status == 'denied') {
            console.log('DENIED');
            let result = await request(
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            );
            console.log(result, 'resultresultresult');
            if (result === 'granted') {
              return 'granted';
            } else if (result == 'blocked') {
              constants?.confirmationModal.isVisible({
                message:
                  'Please turn On your Location from settings in order to get Resturants Near You',
                NegText: 'Later',
                PosText: 'Open Settings',
                PosPress: () => Linking.openSettings(),
              });
            } else {
              request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            }
          } else if (status == 'blocked') {
            console.log('BLOCKED');
            return 'blocked';
          } else {
            request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
          }
        },
      );
    } else {
      return await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(
        async status => {
          console.log(status, 'STATUS_IOS');
          if (status == 'granted') {
            return 'granted';
          } else if (status == 'denied') {
            console.log('DENIED');
            let result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            console.log(result, 'resultresultresult');
            if (result === 'granted') {
              return 'granted';
            } else if (result == 'blocked') {
              alert('You need to allow your location to get nearby orders');
              // constants?.confirmationModal.isVisible({
              //   message:
              //   'Please turn On your Location from settings in order to get orders',
              //   NegText: 'Later',
              //   PosText: 'Open Settings',
              //   PosPress: () => Linking.openSettings(),
              // });
            } else {
              request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            }
          } else if (status == 'blocked') {
            console.log('BLOCKED');
            alert('You need to allow your location to get nearby orders');
            // constants?.confirmationModal.isVisible({
            //   message:
            //     'Please turn On your Location from settings in order to get orders',
            //   NegText: 'Later',
            //   PosText: 'Open Settings',
            //   PosPress: () => Linking.openSettings(),
            // });
            return 'blocked';
          } else {
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          }
        },
      );
    }
  },

  async getLocationAddress(lat, long) {
    return new Promise((resolve, reject) => {
      Geocoder.init('AIzaSyDgm3VBE9YF9fIYqHU6Cue4OfJBtJBlxj4');
      Geocoder.from(lat, long)
        .then(json => resolve(json))
        .catch(error => reject(error));
    });
  },

  async notificationCall(titleee, bodyyy, handlePress) {
    return notification?.popup?.show({
      onPress: () => {
        if (handlePress) handlePress();
      },
      appIconSource: require('../assets/launch_screen.png'),
      appTitle: 'Zanny Merchant',
      timeText: 'Now',
      title: titleee,
      body: bodyyy,
      slideOutTime: 4000,
    });
  },
  async playSound(soundFile = 'new_orders.wav') {
    return new Promise((resolve, reject) => {
      const sound = new Sound(soundFile, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log('Failed to load sound:', error);
          reject(error);
          return;
        }

        sound.play(success => {
          if (success) {
            console.log('Sound played successfully');
            resolve(true);
          } else {
            console.log('Sound playback failed');
            reject('Playback failed');
          }
        });
      });
    });
  },
};
