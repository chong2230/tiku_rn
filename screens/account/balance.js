/**
 * 结算台
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    StatusBar,
    Alert,
    Dimensions,
    DeviceEventEmitter, Platform
} from 'react-native';

import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import Bar from '../../components/Bar';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Alipay from '../../utils/Alipay';
import Toast from '../../components/Toast';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const deviceW = Dimensions.get('window').width;
const imgWidth = 91;
const imgHeight = 87;
const basePx = 375;

function px2dp(px) {
  return px *  deviceW / basePx
}

export default class Balance extends Component {
    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;
        this.state = ({
        	goods: JSON.parse(params.goods),
            tickets: [],
            voucher: null,
            voucherId: null,
        	money: 0
        })
    }

    componentDidMount() {
        let self = this;
        this._createOrder();
        this._getAccount();
        this._getTicket();
        this.emitter = DeviceEventEmitter.addListener('navigationStateChange', (data) => {
            console.log('navigationStateChange ', data);
            
        })
    }

    _createOrder = () => {
        const { state } = this.props.navigation;
        let params = {
            professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id,
            productId: this.state.goods.goodsId,
        };
        if (state.params.paperId) params.paperId = state.params.paperId;
        Common.createOrder(params, (result)=>{
            if (result.code == 0) {
                this.orderNo = result.data.orderNo;
            }
        });
    }

    _getAccount = () => {
        Common.getAccount((result)=>{
            if (result.code == 0) {
                this.setState({
                    money : result.data.balance
                });                
            }
        });
    }

    _getTicket = () => {
        let params = {
            type: 1
        }
        Common.getMyTickets(params, (result)=>{
            if (result.code == 0) {
                this.setState({
                    tickets: result.data
                });
            }            
        })
    }

    // 选择礼券
    _chooseTicket = () => {
        let self = this;
        const { navigate } = this.props.navigation;
        navigate('Ticket', {isVisible: false, title: '使用礼券', type: 'choose', callback: (data)=>{
            if (!data) return;
            self.setState({
                voucher: data,
                voucherId: data.id
            })
        }});
    }

    _handle = () => {
        let self = this;
        let goods = this.state.goods;
        let cost = goods.price;
        if (this.state.voucherId) {
            cost -= this.state.voucher.price;
        }
     	if (Platform.OS === 'ios' && this.state.money < cost) {
    		const { navigate } = this.props.navigation;
        	navigate('Recharge', {isVisible: false, title: '账户', refresh: (money)=>{
        		// 更新余额
                self.setState({
                    money : money
                })
        	}});
    	} else {
            let name = goods.goodsName || goods.title; // 适配name和title
    		Alert.alert('购买确认', '您确定要购买『' + name + '』吗？', [
		       {text: '取消', onPress: () => {}, style: 'cancel'},
		       {text: '确定', onPress: () => {this._buy()}},
		   ])
    	}
    }

    _buy = () => {
        if (Platform.OS === 'android') {
            this._buyAndroid();
            return;
        }
    	const { state } = this.props.navigation;

    	let params = {
            productId: this.state.goods.goodsId,
            orderNo: this.orderNo
        };
        if (this.state.voucherId) params.userVoucherId = this.state.voucherId;
    	Common.buy(params, (result)=>{
            if (result.code == 0) {
            	Alert.alert('', '购买成功', [
    			    {text: '确定', onPress: () => {
                        const { navigate, goBack } = this.props.navigation;
                        if (state.params.refresh instanceof Function) {
                            state.params.refresh();
                        }
                        goBack(state.params.returnKey);
                        // navigate("ColumnDetail", {id: params.columnId}); // 该方法跳转回专栏详情，不会请求数据
    			    }},
    			  ]);
                DeviceEventEmitter.emit('memberChange');
            } else {
                this.refs.toast.show(result.msg);
            }
    	});
    }

    _buyAndroid = () => {
        let params = {
            productId: this.state.goods.goodsId,
            orderNo: this.orderNo,
            typeId: 1   // 支付方式,1-支付宝；2-微信；3-支付宝沙箱测试
        };
        if (this.state.voucherId) params.userVoucherId = this.state.voucherId;
    	Common.buyAndroid(params, (result)=>{
            console.log(result);
            if (result.code == 0) {
                this.aliPayAction(result.data.prePayId);            	
            } else {
                this.refs.toast.show(result.msg);
            }
    	});
    }

    async aliPayAction(payStr){
        //payStr为从后台获取的支付字符串
         Alipay.pay(payStr).then((data) =>{
             console.log('pay: ', data);
            let resultDic = {};
        /*笔者iOS端和安卓端返回的支付回调结果数据不一致，可能和支付宝sdk版本有关，
        读者可自行根据返回数据进行相关处理，iOS(RCTAlipay.m)和安卓(AlipayModule)
        可自行选择需要resolve回调判断处理的数据，如只返回resultStatus*/
             if (Platform.OS === 'ios'){
                 resultDic = data[0];
             } else {
                 resultDic = data;
             }
             if (resultDic.resultStatus == '9000'){
                 //支付成功                
                Alert.alert('', '购买成功', [
    			    {text: '确定', onPress: () => {
                        const { state, goBack } = this.props.navigation;
                        if (state.params.refresh instanceof Function) {
                            state.params.refresh();
                        }
                        goBack(state.params.returnKey);
                        // navigate("ColumnDetail", {id: params.columnId}); // 该方法跳转回专栏详情，不会请求数据
    			    }},
    			  ]);
                DeviceEventEmitter.emit('memberChange');
             }else {
                 //支付失败
                 Alert.alert('', '购买失败', [
    			    {text: '确定', onPress: () => {
                        
    			    }},
    			  ]);
             }
         }).catch((err) => {
             console.log('err='+err);
             this.refs.toast.show('支付失败');
         });
     }

    render() {  
        const unit = Platform.OS === 'ios' ? '余额' : '元';
    	let goods = this.state.goods;
        let name = goods.goodsName || goods.title; // 适配name和title
    	let btnTxt;
        let cost = goods.price;
        let ticketLabel = '无可用礼券';
        if (this.state.voucherId) {
            ticketLabel = this.state.voucher.title + this.state.voucher.price + unit;
            cost -= this.state.voucher.price;
            if (cost < 0) cost = 0;
        } else if (this.state.tickets.length > 0) {
            ticketLabel = '有' + this.state.tickets.length + '张礼券';
        }
        if (Platform.OS === 'ios' && this.state.money < cost) {
            btnTxt = '余额不足，请充值';
        } else {
            btnTxt = '购买';
        }
        return (
            <View style={styles.container}>
                <Bar />
                <Header title="结算台" goBack={()=>{
                    let { goBack } = this.props.navigation;
                    goBack();
                }}></Header>
            	<View style={styles.info}>
            		{/*<Image resizeMode={'stretch'} source={{uri:Common.baseUrl + goods.image}}*/}
                       {/*style={styles.img}/>*/}
                    <View style={styles.right}>
                    	<Text style={styles.title}>{name}</Text>
                    	<View style={styles.costStyle}>
                    		<Text style={styles.cost}>{goods.price + unit}</Text>
                    		<Text style={styles.multiple}>x1</Text>
                    	</View>                        
                    </View>
                </View>
                <View style={styles.separator} /> 
                {!global.isAudit ?               
                <View style={styles.ticket}>
                    <Text style={styles.ticketLabel}>礼券：</Text>
                    <TouchableOpacity onPress={this._chooseTicket}>
                        <Text style={styles.ownTicket}>{ticketLabel} &gt;</Text>
                    </TouchableOpacity>
                </View> : null
                }
                <View style={styles.needPay}>
                	<Text style={styles.emptyLabel}></Text>
                	<Text style={styles.costLabel}>需付款：</Text>
                	<Text style={styles.costPrice}>{cost + unit}</Text>
                </View>   
                <View style={styles.separator} />
                {
                    Platform.OS === 'ios' ?
                    <View style={styles.balanceStyle}>
                        {/*<Icon name="copyright" size={px2dp(15)} color={Colors.highlight} style={styles.rmIcon} />*/}
                        <Text style={styles.money}>余额：{this.state.money}余额</Text>
                        <Icon name="check-circle" size={px2dp(15)} color={Colors.special} style={styles.check} />
                    </View> : 
                    <View style={styles.payStyle}>
                        <Text style={styles.payLabel}>支付方式：支付宝</Text>
                        <Icon name="check-circle" size={px2dp(15)} color={Colors.special} style={styles.check} />
                    </View>
                }
                <View style={styles.separator} />
                {!global.isAudit ? <Text style={styles.tip}>提示：礼券不与其他优惠同享</Text> : null}
                <Button text={btnTxt} onPress={this._handle} 
                        style={styles.payBtn} containerStyle={styles.payContainer} />
                <View style={styles.safeBottom}></View>
                <Toast ref="toast" position="center" />                                       
            </View>
        );
    }

    componentWillUnmount() {
        this.emitter.remove();
    } 
}

const styles = StyleSheet.create({
    container: {
    	flex: 1,
        flexDirection: 'column',    	
        marginBottom:0, 
        backgroundColor: 'white'
    }, 
    info: {
    	flexDirection: 'row',
    	height: imgHeight,
    	margin: 10
    },
    img: {
        width: imgWidth,
        height: imgHeight,
    },
    right: {
    	flexDirection: 'column',
    	width: deviceW - imgWidth - 20,
    	height: imgHeight,
    	margin: 10
    },
    title: {
    	flex: 1,
    	fontSize: 16,
    	flexWrap: 'wrap',
    	width: deviceW - imgWidth - 20
    },
    costStyle: {
    	flex: 1,
    	flexDirection: 'row',
    	width: deviceW - imgWidth - 20,
    	height: 20
    },
    cost: {
    	flex: 1,
    	color: Colors.special,
    	fontSize: 15,
        fontWeight: '500'
    },
    multiple: {
    	right: 10,
        fontSize: 15
    },
    ticket: {
    	flexDirection: 'row',
    	alignItems: 'center', 
        justifyContent: 'center',
    	height: 50,
    	borderBottomColor: Colors.border,
    	borderBottomWidth: 1
    },
    ticketLabel: {
    	flex: 1,
    	marginLeft: 20,
        fontSize: 15
    },
    ownTicket: {
    	color: Colors.gray,
    	right: 20
    },
    needPay: {
    	flexDirection: 'row',
    	alignItems: 'center', 
        justifyContent: 'center',
    	height: 50,
        fontSize: 15
    },
    emptyLabel: {
    	flex: 1,
        fontSize: 15
    },
    costLabel: {
    	right: 20,
        fontSize: 15
    },
    costPrice: {
    	color: Colors.special,
    	right: 20,
        fontSize: 15
    },
    balanceStyle: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 50
    },
    rmIcon: {
    	marginLeft: 10
    },
    money: {
    	flex: 1,
    	fontSize: 15,
    	marginLeft: 20
    },
    payStyle: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 50
    },
    payLabel: {
    	flex: 1,
    	fontSize: 15,
    	marginLeft: 20
    },
    check: {
    	right: 20
    },
    tip: {
    	flex: 1,
    	width: deviceW - 40,
    	textAlign: 'center',
    	margin: 20
    },
    payContainer: {
        borderColor: Colors.special,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.special,
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
    separator: {
        backgroundColor: Colors.bg,
        height: 5
    },
    line: {
        backgroundColor: Colors.bg,
        height: 1
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});