import React, {PureComponent} from 'react';
import {
  Image,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const baseStyle = {
  backgroundColor: 'transparent',
  // marginBottom: 10,
};

export default class AutoSizedImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // set width 1 is for preventing the warning
      // You must specify a width and height for the image %s
      width: this.props.style.width || 1,
      height: this.props.style.height || 1,
    };
  }

  componentDidMount() {
    //avoid repaint if width/height is given
    if (this.props.style.width || this.props.style.height) {
      return;
    }
    // 会出现第一次加载时图片不显示的问题
    Image.getSize(this.props.source.uri, (w, h) => {
      this.setState({width: w, height: h});
    });
  }

  // _onLoad() {
  //   Image.getSize(this.props.source.uri, (w, h) => {
  //     this.setState({width: w, height: h});
  //   });
  // }

  render() {
    const finalSize = {};
    if (this.state.width > width) {
      finalSize.width = width;
      const ratio = width / this.state.width;
      finalSize.height = this.state.height * ratio;
    }
    const style = Object.assign(
      baseStyle,
      this.props.style,
      this.state,
      finalSize
    );
    let source = {};
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state);
      return null;
    } else {
      source = Object.assign(source, this.props.source, finalSize);
    }

    return <Image style={style} source={source} />;
  }
}
