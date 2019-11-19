/**
 * 服务条款
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';

import Bar from '../../components/Bar';
import HTMLView from '../../components/HTMLView';
// import I18n from '../../language/i18n';
import I18n from '../../constants/I18n';

export default class Service extends Component {

    // 构造
    constructor(props) {
        super(props);        
    }    

    render() {
        var reg1 = new RegExp(":company","g");
        // let intro = I18n.t('account.about').replace(reg1, I18n.t('common.company'));
        let intro = I18n['account']['about'].replace(reg1, I18n['common']['company']);
        var reg2 = new RegExp(":name","g");
        // intro = intro.replace(reg2, I18n.t('common.name'));
        intro = intro.replace(reg2, I18n.t(['common']['name']));
        var reg3 = new RegExp(":website","g");
        // intro = intro.replace(reg3, I18n.t('common.website'));
        intro = intro.replace(reg3, I18n.t(['common']['website']));
        return (
            <ScrollView style={styles.container}>
                <Bar />
                <HTMLView value={intro} style={styles.htmlStyle} stylesheet={htmlStyles} />
            </ScrollView>
        );
    }    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    htmlStyle: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'white'
    }
});

const htmlStyles = StyleSheet.create({
    p: {
        color: '#31424e',
        fontSize: 16,
        lineHeight: 20
    }
});
