/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Text,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import ImagePicker from 'react-native-image-picker';
import {
  Image,
  StyleSheet,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const DEFAULT_PHOTO_URL = 'https://cdn.vanderbilt.edu/vu-wp0/wp-content/uploads/sites/181/2019/09/09091628/Image-Coming-Soon.png';

const END_POINT_URL = '';

const App = () => {
  const [imgUri, setImgUri] = useState(DEFAULT_PHOTO_URL);
  const [isPhoto, setIsPhoto] = useState(false);
  const [img, setImg] = useState({ type: "", data: "" });
  const [predictText, setPredictText] = useState("");
  const [predictProbability, setPredictProbability] = useState("");

  const uploadPhoto = () => {
    RNFetchBlob.fetch(
      'POST',
      END_POINT_URL,
      {
        'Prediction-Key': '',
        'Content-Type': '',
      },
      [
        {
          name: 'photo',
          filename: 'photo.jpg',
          type: img.type,
          data: img.data,
        },
      ],
    )
      .then((response) => {
        var dataJSON = JSON.parse(response.data);
        console.log('Upload success' + dataJSON.predictions[0].tagName);
        setPredictProbability('Probability: ' + dataJSON.predictions[0].probability);
        setPredictText('Name: ' + dataJSON.predictions[0].tagName);
        setIsPhoto(false);
      })
      .catch((error) => {
        console.log('Error', error);
        setIsPhoto(false);
        setImgUri(DEFAULT_PHOTO_URL);
        setPredictText('Error');
        setPredictProbability("");
      });
  };

  const handleChoosePhoto = () => {
    ImagePicker.showImagePicker({}, (response) => {
      if (response.data) {
        setImgUri(response.uri);
        setIsPhoto(true);
        setImg({ type: response.type, data: response.data });
        setPredictText("");
        setPredictProbability("");
      }
      else {
        setIsPhoto(false);
        setImgUri(DEFAULT_PHOTO_URL);
      }
    });
  };

  return (
    <>
      <Container>
        <Header style={{ backgroundColor: '#000000' }}>
          <Left />
          <Body>
            <Title>Who is it ...</Title>
          </Body>
          <Right />
        </Header>
        <Grid style={{ width: "100%", alignItems: "center", padding: 10 }}>
          <Row style={{ flex: 4 }}>
            <Image
              source={{ uri: imgUri }}
              style={{ width: '100%', height: '100%' }}
            />
          </Row>
          <Row style={{ flex: 1 }}>
            {
              predictText !== "" ?
                <Col>
                  <Row>
                    <Text style={{ marginTop: 20 }}>{predictText}</Text>
                  </Row>
                  <Row>
                    <Text style={{ marginBottom: 20 }}>{predictProbability}</Text>
                  </Row>
                </Col>
                : null
            }
          </Row>
          <Row style={{ flex: 1 }}>
            <Col style={styles.buttonCol}>
              <Button onPress={handleChoosePhoto} dark full>
              {/* <Button dark full> */}
                <Text>Choose Photo!</Text>
              </Button>
            </Col>
            {isPhoto ?
              <Col style={styles.buttonCol}>
                <Button onPress={uploadPhoto} dark full>
                {/* <Button dark full> */}
                  <Text>Predict</Text>
                </Button>
              </Col>
              : null}
          </Row>
        </Grid>
      </Container>
    </>
  );
}


const styles = StyleSheet.create({
  buttonCol: {
    padding: 15,
  },
});

export default App;
