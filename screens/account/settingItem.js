/**
 * Created by shaotingzhou on 2017/5/8.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
export default class SettingItem extends Component {

    static propTypes = {
        txt1: PropTypes.string,
        count: PropTypes.string,
        showBorder: PropTypes.bool
    };

    static defaultProps = {
        txt1: '',
        count: '',
        showBorder: true
    }

    render() {
        let borderStyle = this.props.showBorder ? null : {borderBottomWidth: 0};
        return (
            <TouchableOpacity  onPress={this.props.onPress}>
                <View style={[styles.item, borderStyle]}>
                    <Text style={{fontSize: 15, marginLeft: 10}}>{this.props.txt1}</Text>
                    <Text style={styles.count}>{this.props.count}   </Text>
                    <Image source={require('../../images/account/right-arrow.png')} style={styles.rightIcon} />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection:'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 0.5,
        backgroundColor: 'white'
    },
    rightIcon: {
        width: 10,
        height: 10,
        position: 'absolute',
        right: 20
    },
    count: {
        color: '#828282',
        position: 'absolute',
        right: 35
    }
});