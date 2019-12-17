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

import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  acknowledgePurchaseAndroid,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

// import HTMLView from 'react-native-htmlview';
import Bar from '../../components/Bar';
import Header from '../../components/Header';
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
let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class Recharge extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectId: null,
            listData: [],
            products: [],
            money: 0,
            receipt: '',
            availableItemsMessage: '',
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
                self.getAvailablePurchases();
            }
        });
        this._getAccount(); // 重新请求用户信息，获取余额
    }

    fetchProducts = (list) => {
        let self = this;
        itemSkus = [];
        for (let i=0; i<list.length; i++) {
            itemSkus.push(list[i].id);
        }
        try {
            RNIap.getProducts(itemSkus).then(products => {
                console.log('products ', products);
                self.setState({ products });            
            }).catch(error => { Alert.alert('获取商品列表失败'); })
        } catch(err) {
            console.warn(err); // standardized err.code and err.message available
        }
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

    async componentDidMount(): void {
        try {
          const result = await RNIap.initConnection();
          await RNIap.consumeAllItemsAndroid();
          console.log('result', result);
        } catch (err) {
          console.warn(err.code, err.message);
        }

        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase: InAppPurchase | SubscriptionPurchase) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
              try {
                // if (Platform.OS === 'ios') {
                //   finishTransactionIOS(purchase.transactionId);
                // } else if (Platform.OS === 'android') {
                //   // If consumable (can be purchased again)
                //   consumePurchaseAndroid(purchase.purchaseToken);
                //   // If not consumable
                //   acknowledgePurchaseAndroid(purchase.purchaseToken);
                // }
                Common.checkPurchase(receipt, (result) => {
                    if (result.code == 0) {
                        self.setState({
                            money: result.data
                        });
                        const { params } = this.props.navigation.state;
                        if (params.refresh) params.refresh(result.data);    // 更新余额
                        // removeReceipt(purchase.transactionReceipt); // 移除凭证
                    } else {
                        self.refs.toast.show(result.msg);
                    }
                    // RNIap.finishTransaction();
                });
                const ackResult = await finishTransaction(purchase);
                global.mLoadingComponentRef.setState({ showLoading: false });
              } catch (ackErr) {
                console.warn('ackErr', ackErr);
                  global.mLoadingComponentRef.setState({ showLoading: false });
              }

              this.setState({receipt}, () => this.goNext());
            }
          },
        );

        purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            console.log('purchaseErrorListener', error);
            // Alert.alert('purchase error', JSON.stringify(error));
              Alert.alert('购买失败');
          },
        );
      }

      componentWillUnmount(): void {
        if (purchaseUpdateSubscription) {
          purchaseUpdateSubscription.remove();
          purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
          purchaseErrorSubscription.remove();
          purchaseErrorSubscription = null;
        }
      }

      goNext = (): void => {
        console.log('Receipt', this.state.receipt);
      };

      getAvailablePurchases = async (): void => {
        try {
          console.info(
            'Get available purchases (non-consumable or unconsumed consumable)',
          );
          const purchases = await RNIap.getAvailablePurchases();
          console.info('Available purchases :: ', purchases);
          if (purchases && purchases.length > 0) {
            this.setState({
              availableItemsMessage: `Got ${purchases.length} items.`,
              receipt: purchases[0].transactionReceipt,
            });
          }
        } catch (err) {
          console.warn(err.code, err.message);
          // Alert.alert(err.message);
          Alert.alert('获得可用的购买失败~');
        }
      };

      requestSubscription = async (sku): void => {
        try {
          RNIap.requestSubscription(sku);
        } catch (err) {
          // Alert.alert(err.message);
            Alert.alert('购买失败');
        }
      };


    _onPress = (id) => {  
        this.setState({
            selectId: id
        })
    }

    pay() {
        let payIndex = 0;
        let self = this;
        if (Platform.os == 'android') {
            this.toast.show('暂不支持充值哦~');
            return;
        }
        if (this.state.selectId == null) {
            this.toast.show('请选择要充值的金额~');
            return;
        }
        let payObj = {};
        for (let i=0; i<this.state.listData.length; i++) {
            let d = this.state.listData[i];
            if (this.state.selectId == d.id) {
                payIndex = i;
                payObj = d;
            }
        }
        this.requestSubscription(this.state.selectId);
        global.mLoadingComponentRef.setState({ showLoading: true });      
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
        let intro = '';
        if (Platform.OS == 'ios') {
            intro = "1. 充值金额仅限iOS版使用；<br>2. 充值成功后，暂不支持账户余额退款、提现或转赠他人；<br>3. 使用苹果系统充值可以参考App Store充值引导；<br> 4. 如在充值过程中遇到任何问题，请关注公众号，我们将为您提供解决方案，帮助您快速完成充值。";
        } else {
            intro = "1. 充值成功后，暂不支持账户余额退款、提现或转赠他人；<br>2. 如在充值过程中遇到任何问题，请关注公众号，我们将为您提供解决方案，帮助您快速完成充值。";
        }
        let btnDisabled = !this.state.selectId || Platform.os == 'android';
        let btnStyle = btnDisabled ? {opacity: 0.6} : null;
        return (
            <ScrollView style={styles.container}>
                <Bar />
                <Header title={'账户'} goBack={()=>{
                        let { goBack } = this.props.navigation;
                        goBack();
                    }}
                        bottomLineColor={'rgba(0, 0, 0)'} />
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
                <Button text="确认支付" disabled={btnDisabled} onPress={this.pay.bind(this)}
                        style={[styles.payBtn, btnStyle]} containerStyle={styles.payContainer} />
                <View style={styles.separator}></View>
                <View>
                    <Text style={styles.introLabel}>充值说明</Text>
                    <View style={styles.line}></View>
                    <HTMLView value={intro} style={styles.htmlStyle} />
                </View>
                <View style={styles.safeBottom}></View>
                <Toast ref={(ref)=>{this.toast = ref}} position="center" />
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
