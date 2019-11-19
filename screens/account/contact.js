/**
 * 联系我们 
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Linking,
    Alert
} from 'react-native';

// import I18n from '../../language/i18n';
import Bar from '../../components/Bar';
import DisplayItem from '../../components/DisplayItem';

export default class Contact extends Component {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
        	tel: '',
        	email: 'service@youzhi.tech',
        	account: '有知学堂'//I18n.t('common.name')
        };
    }

    //拨打电话
   linking = (url) => { 
       Linking.canOpenURL(url).then(supported => {
           if (!supported) {
               console.log('Can\'t handle url: ' + url);
           } else {
               Alert.alert('', this.state.tel, [
      			       {text: '取消', onPress: () => {}, style: 'cancel'},
      			       {text: '呼叫', onPress: () => {Linking.openURL(url)}},
      			   ])
           }
       });
    }

    render() {
        let telItem;
        if (this.state.tel) {
            telItem = <DisplayItem txt1='联系电话' txt2={this.state.tel} showRight={true} onPress={()=>this.linking('tel:'+this.state.tel)}/>;
        }
        return (
            <View style={styles.container}>
                <Bar />
                {telItem}
                <DisplayItem txt1='联系邮箱' txt2={this.state.email} />
                <DisplayItem txt1='公众号' txt2={this.state.account} />                
            </View>
        );
    }    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});
