import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    View,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import Colors from '../../constants/Colors';

var {width,height} = Dimensions.get('window');

export default class RechargeItem extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            
        };
    }

    _onItemClick() {
        this.props.onPress(this.props.data.id);
    }

    render() {
        let textStyle = {}
        let borderStyle = {}
        if (this.props.selectId == this.props.data.id) {
            textStyle = { color: Colors.highlight };
            borderStyle = { borderColor: Colors.highlight, borderWidth: 1 };
        }
        let data = this.props.data;
        return (
            <TouchableWithoutFeedback onPress={()=>{this._onItemClick()}}>
                <View style={[styles.item, borderStyle]}>
                    <Text style={[styles.rm, textStyle]}>{data.rm} 余额</Text>
                    <Text style={[styles.money, textStyle]}> ¥ {data.money}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const styles = StyleSheet.create({    
    item: {
        flexDirection: 'column',
        width: width/3 - 20,
        height: 60,
        margin: 10,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        alignItems: 'center',  
        justifyContent: 'center'
    },
    rm: {
        fontSize: 13
    },
    money: {
        fontSize: 12,
        color: '#828282'
    }
});

