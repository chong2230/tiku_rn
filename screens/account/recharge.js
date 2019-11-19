/**
 * 账户和充值
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,
    ScrollView,
    Platform,
    NativeModules,
    AsyncStorage
} from 'react-native';

import * as RNIap from 'react-native-iap';

// import HTMLView from 'react-native-htmlview';
import Bar from '../../components/Bar';
import HTMLView from '../../components/HTMLView';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';
import Storage from '../../utils/Storage';
import { saveReceipt, removeReceipt } from '../../utils/Util';
import RechargeItem from './rechargeItem';
import {TabbarSafeBottomMargin} from "../../utils/Device";

var itemSkus = [];

export default class Recharge extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectId: null,
            listData: [],
            products: [],
            money: 0
        };
    }

    componentWillMount() {
        let self = this;
        const { params } = this.props.navigation.state;
        this.state.money = params.money;
        Common.getRechargeList((result)=>{ 
            if (result.code == 0) {
                self.setState({listData: result.data});
                self.fetchProducts(result.data);
            }
        });
        this._getAccount(); // 重新请求用户信息，获取余额
    }

    _getAccount = () => {
        let self = this;
        Common.getAccount((result)=>{
            if (result.code == 0) {
                self.setState({
                    money : result.data.balance
                });                
            }
        });
    }

    fetchProducts = (list) => {
        let self = this;
        itemSkus = [];
        for (let i=0; i<list.length; i++) {
            itemSkus.push(list[i].id);
        }
        try {
            RNIap.getProducts(itemSkus).then(products => { 
                self.setState({ products });            
            }).catch(error => { Alert.alert('获取商品列表失败'); })
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
    }

    _onPress = (id) => {  
        this.setState({
            selectId: id
        })
    }

    async pay() {
        let payIndex = 0;
        let self = this;
        if (this.state.selectId == null) return;
        let payObj = {};
        for (let i=0; i<this.state.listData.length; i++) {
            let d = this.state.listData[i];
            if (this.state.selectId == d.id) {
                payIndex = i;
                payObj = d;
            }
        }
        global.mLoadingComponentRef.setState({ showLoading: true });
        await RNIap.clearTransaction(); // add this method at the start of purchase.
        RNIap.buyProductWithoutFinishTransaction(this.state.selectId).then(purchase => {
            saveReceipt(purchase.transactionReceipt);   // 保存凭证
            Common.checkPurchase(purchase.transactionReceipt, (result) => {
                if (result.code == 0) {
                    self.setState({
                        money: result.data
                    });
                    const { params } = this.props.navigation.state;
                    if (params.refresh) params.refresh(result.data);    // 更新余额
                    removeReceipt(purchase.transactionReceipt); // 移除凭证
                } else {
                    self.refs.toast.show(result.msg);
                }
                global.mLoadingComponentRef.setState({ showLoading: false });
                RNIap.finishTransaction();
            });
        }).catch(error => { 
            global.mLoadingComponentRef.setState({ showLoading: false });
            Alert.alert('支付失败'); 
            console.log(error.toString());
        })         
    }

    render() {      
        const { params } = this.props.navigation.state;
        let listView = [];
        for (let i=0; i<this.state.listData.length; i++) {
            let data = this.state.listData[i];
            let item = (
                <RechargeItem key={i+1} data={data} selectId={this.state.selectId} onPress={this._onPress} />
            );
            listView.push(item);
        }  
        let intro = "1. 充值金额仅限iOS版使用；<br>2. 充值成功后，暂不支持账户余额退款、提现或转赠他人；<br>3. 使用苹果系统充值可以参考App Store充值引导；<br> 4. 如在充值过程中遇到任何问题，请关注公众号，我们将为您提供解决方案，帮助您快速完成充值。";
        return (
            <ScrollView style={styles.container}>
                <Bar />
                <View style={styles.top}>
                    <Text style={styles.money}>￠ {this.state.money || 0.00}</Text>
                    <Text style={styles.title}>账户余额</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.rechargeLabel}>充值</Text>
                    <Text style={styles.rechargeTip}>充值金额仅限{Platform.OS === 'ios' ? 'iOS' : 'Android'} App使用</Text>
                </View>
                <View style={styles.listView}>
                    { listView }
                </View>
                <Button text="确认支付" onPress={this.pay.bind(this)} 
                        style={styles.payBtn} containerStyle={styles.payContainer} />
                <View style={styles.separator}></View>
                <View>
                    <Text style={styles.introLabel}>充值说明</Text>
                    <View style={styles.line}></View>
                    <HTMLView value={intro} style={styles.htmlStyle} />
                </View>
                <View style={styles.safeBottom}></View>
                <Toast ref="toast" position="center" />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom:0, 
        backgroundColor: 'white'
    },
    top: {
        padding: 10,
        borderBottomColor: '#e0e0e0',
        borderBottomWidth: 1,
    },
    money: {
        fontSize: 30,
        fontWeight: '500',
        textAlign: 'center'
    },
    title: {
        fontSize: 15,
        color: '#828282',
        textAlign: 'center'
    },
    center: {
        flexDirection: 'row',
        margin: 15       
    },
    rechargeLabel: {
        flex: 1,
        marginLeft: 10
    },
    rechargeTip: {
        fontSize: 11,
        marginRight: 10,
        color: '#a4a4a4',
        fontSize: 12
    },
    listView: {
        justifyContent: 'space-around',  
        flexDirection: 'row',  
        flexWrap: 'wrap',
        backgroundColor: 'white'
    },
    payContainer: {
        borderColor: Colors.highlight,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.highlight,
        height: 40,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    payBtn: {        
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
    payBtnDisabled: {
        opacity: .6
    },
    introLabel: {
        margin: 10,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500'
    },
    htmlStyle: {
        padding: 10,
    },
    separator: {
        backgroundColor: '#ECEFF2',
        height: 10
    },
    line: {
        backgroundColor: '#ECEFF2',
        height: 1
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
