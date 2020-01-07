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
    NativeModules
} from 'react-native';

import loadingImage from '../images/loading.gif';

const { LKHudBridgeModule } = NativeModules;
let {width, height} = Dimensions.get('window');

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

    show(bool=true) {
        this.setState({
            showLoading: bool
        });
    }

    render() {
        const {showLoading, opacity, backgroundColor} = this.props;
        if (!this.state.showLoading) {
            return null;
        }
        return (
            <View style={styles.container}>
                <View style={ styles.loadingView }>
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
    container: {
        flex: 1,
        position: 'absolute'
    },
    loadingView: {
        left: width/2 - 40,
        top: height/2 - 40,
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        opacity: 0.5,
        backgroundColor: 'black',
        borderRadius: 5
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