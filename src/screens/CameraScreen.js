import {StyleSheet, Text, View} from 'react-native';
import {useEffect, useState, useRef} from 'react';
import {
  Camera,
  runAsync,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Face,
  useFaceDetector,
  FaceDetectionOptions,
} from 'react-native-vision-camera-face-detector';
import {Worklets} from 'react-native-worklets-core';

export default function App() {
  const faceDetectionOptions =
    useRef <
    FaceDetectionOptions >
    {
      // detection options
    }.current;

  const device = useCameraDevice('front');
  const {detectFaces} = useFaceDetector(faceDetectionOptions);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log({status});
    })();
  }, [device]);

  const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
    console.log('faces detected', faces);
  });

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      runAsync(frame, () => {
        'worklet';
        const faces = detectFaces(frame);
        // ... chain some asynchronous frame processor
        // ... do something asynchronously with frame
        handleDetectedFaces(faces);
      });
      // ... chain frame processors
      // ... do something with frame
    },
    [handleDetectedFaces],
  );

  return (
    <View style={{flex: 1}}>
      {!!device ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          frameProcessor={frameProcessor}
        />
      ) : (
        <Text>No Device</Text>
      )}
    </View>
  );
}
