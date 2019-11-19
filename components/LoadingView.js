/**
 * Created by cluo on 16/10/31.
 */
import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import loadingImage from '../images/loading.gif';

let wndSize = Dimensions.get('window');

class LoadingView extends Component {
    constructor(props) {
        super(props);
        this.state = {
          showLoading: false
        }
    }

    _close() {
        console.log("onRequestClose ---- ")
    }

    render() {
        const {showLoading, opacity, backgroundColor} = this.props;
        if (!this.state.showLoading) {
            return null;
        }
        return (
            <View style={ [styles.loadingView, {opacity: opacity || 0.3, backgroundColor: backgroundColor || 'black'}]}>
                <View style={ styles.loadingImage }>
                    {
                        this.props.loadingViewClick ?
                            <TouchableOpacity onPress={ this.props.loadingViewClick }>
                                <Image style={ styles.loadingImage } source={ loadingImage }/>
                            </TouchableOpacity>
                            :
                            <Image style={ styles.loadingImage } source={ loadingImage }/>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingView: {
        flex: 1,
        left: 0,
        top: 0,
        width: wndSize.width,
        height: wndSize.height,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute'
    },
    loadingImage: {
        width: 30,
        height: 30,
    },
});
var PropTypes = require('prop-types');
LoadingView.propTypes = {
    loadingViewClick: PropTypes.func, //.isRequired,
    opacity: PropTypes.number,
    backgroundColor: PropTypes.string
};

export default LoadingView;