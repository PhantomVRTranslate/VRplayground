import React from 'react';
import {
  Animated,
  AppRegistry,
  asset,
  StyleSheet,
  Image,
  Pano,
  Text,
  Sound,
  Model,
  AmbientLight,
  View,
} from 'react-vr';
import Intro from './components/Intro';
import Logo from './components/Logo';
import MovingText from './components/MovingText';
import Button from './components/button.js';

const spaceSkymap = [
  asset('space/space_right.png'),
  asset('space/space_left.png'),
  asset('space/space_up.png'),
  asset('space/space_down.png'),
  asset('space/space_back.png'),
  asset('space/space_front.png'),
];

export default class World extends React.Component {

  constructor() {
    super();
    this.state = {
      rotation: 130,
      zoom: -70,
      panoLoaded: false,
      logoLoaded: false,
      audioLoaded: false,
    };
    this.lastUpdate = Date.now();

    this.styles = StyleSheet.create({
	  menu: {
		flex: 1,
        flexDirection: 'column',
        width: 1,
        alignItems: 'stretch',
        transform: [{translate: [2, 2, -5]}],
	  },
	 });

   this.rotate = this.rotate.bind(this);
   this.loadedPano = this.loadedPano.bind(this);
   this.loadedLogo = this.loadedLogo.bind(this);
   this.loadedAudio = this.loadedAudio.bind(this);
  }


  loadedPano = () => {

    this.setState({panoLoaded: true});
  };

  loadedLogo = () => {
    this.setState({logoLoaded: true});
  };

  loadedAudio = () => {
    this.setState({audioLoaded: true});
  };

  componentDidMount() {
    this.rotate();
  }

  componentWillUnmount() {
    if (this.frameHandle) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  rotate() {
    const now = Date.now();
    const delta = now - this.lastUpdate;
    this.lastUpdate = now;

    this.setState({
		rotation: this.state.rotation + delta / 150
	});
    this.frameHandle = requestAnimationFrame(this.rotate);
  }

  render() {
    const loaded = this.state.panoLoaded && this.state.logoLoaded;
    return (
      <View>
        <Sound
          playStatus={loaded ? 'play' : 'stop'}
          source={{
            mp3: '/static_assets/song.mp3',
          }}
        />
        <Pano source={spaceSkymap} onLoadEnd={this.loadedPano}/>
        <AmbientLight intensity={ 2.6 }  />
        <Image
          onLoadEnd={this.loadedLogo}
          source={{uri: '/static_assets/logo.png'}}
          style={{
            position: 'absolute',
            opacity: 0,
          }}
        />
        {!loaded
          ? <View>
              <Text
                style={{
                  color: 'rgb(68, 220, 213)',
                  layoutOrigin: [0.5, 0.5],
                  transform: [{translateZ: -1.5}],
                }}
              >
                Loading...
              </Text>
            </View>
          : <View>
              <Logo />
              <Intro />
              <Animated.View
                style={{
                  transform: [{rotateX: -60}],
                }}
              >
                <MovingText />
              </Animated.View>

            <Model
        		  style={{
                    transform: [
                      {translate: [-25, 0, this.state.zoom]},
                      {scale: 0.05 },
                      {rotateY: this.state.rotation},
                      {rotateX: 20},
                      {rotateZ: -10}
                    ],
                  }}
                  source={{obj:asset('earth/earth.obj'), mtl:asset('earth/earth.mtl')}}
        		  lit={true}
                />

        		<Model
        		  style={{
        			transform: [
        			  {translate: [10, 10, this.state.zoom - 30]},
        			  {scale: 0.05},
                      {rotateY: this.state.rotation / 3},
        			],
        		  }}
        		  source={{obj:asset('moon/moon.obj'), mtl:asset('moon/moon.mtl')}}
        		  lit={true}
        		/>
            </View>
          }


      </View>
    );
  }
}

AppRegistry.registerComponent('World', () => World);
