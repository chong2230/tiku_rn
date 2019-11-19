import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
export default class SafeAccountItem extends Component {
    render() {
        return (
            <TouchableOpacity  onPress={this.props.onPress} style={this.props.style}>
                <View style={styles.item}>
                    <Text style={{fontSize: 15, marginLeft: 10}}>{this.props.txt1}</Text>
                    <Text style={{fontSize:13, color:'#CCCCCC'}}>{this.props.txt2}</Text>
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
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    rightIcon: {
        width: 10,
        height: 10,
        position: 'absolute',
        right: 20
    }
});