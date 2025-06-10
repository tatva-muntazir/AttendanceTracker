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
  const [faces, setFaces] = useState([]);

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

  const handleDetectedFaces = Worklets.createRunOnJS((detectedFaces: Face[]) => {
      console.log('faces detected', detectedFaces);
      setFaces(detectedFaces);
  });

  const frameProcessor = useFrameProcessor(
    frame => {
      'worklet';
      console.log("frame: ", JSON.stringify(frame)) // <-- "rgb"
      runAsync(frame, () => {
        'worklet';
        const detectedFaces = detectFaces(frame);
        handleDetectedFaces(detectedFaces);
      });
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

      {/* Render face rectangles */}
      {faces.map((face, index) => (
        <View
          key={index}
          style={[
            styles.faceRect,
            {
              top: face.bounds.y,
              left: face.bounds.x - 50,
              width: face.bounds.width + 70,
              height: face.bounds.height + 70,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  faceRect: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'lime',
    borderRadius: 4,
  },
});
