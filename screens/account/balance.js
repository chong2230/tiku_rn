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
    DeviceEventEmitter
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Bar from '../../components/Bar';
import Button from '../../components/Button';
import Colors from '../../components/Colors';
import Common from '../../utils/Common';
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

        this.state = ({
        	detail: {},
            tickets: [],
            voucher: null,
            voucherId: null,
        	money: 0
        })
    }

    componentWillMount() {
    	const { params } = this.props.navigation.state;
        this.setState({
            detail: JSON.parse(params.detail)
        });      
        this._getAccount();
        this._getTicket();
    }

    componentDidMount() {
        let self = this;        
        this.emitter = DeviceEventEmitter.addListener('navigationStateChange', (data) => {
            console.log('navigationStateChange ', data);
            
        })
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
        Common.getMyTickets(1, (result)=>{
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
        navigate('Ticket', {isVisiable: true, title: '使用礼券', type: 'choose', callback: (data)=>{
            if (!data) return;
            self.setState({
                voucher: data,
                voucherId: data.id
            })
        }});
    }

    _handle = () => {
        let self = this;
        let detail = this.state.detail;
        let cost = detail.price;
        if (this.state.voucherId) {
            cost -= this.state.voucher.price;
        }
     	if (this.state.money < cost) {
    		const { navigate } = this.props.navigation;
        	navigate('Recharge', {isVisiable: true, title: '账户', refresh: (money)=>{
        		// 更新余额
                self.setState({
                    money : money
                })
        	}});
    	} else {
    		Alert.alert('购买确认', '您确定要购买『' + detail.title + '』吗？', [
		       {text: '取消', onPress: () => {}, style: 'cancel'},
		       {text: '确定', onPress: () => {this._buy()}},
		   ])
    	}
    }

    _buy = () => {
    	const { params } = this.props.navigation.state;
    	Common.buy(params.columnId, this.state.voucherId, (result)=>{ 
            if (result.code == 0) {
            	Alert.alert('', '购买成功', [
    			    {text: '确定', onPress: () => {
                        const { navigate, goBack } = this.props.navigation;
                        if (params.callback instanceof Function) {
                            params.callback();
                        }
                        // goBack();
    			    	navigate("ColumnDetail", {id: params.columnId}); // 该方法跳转回专栏详情，不会请求数据
    			    }},
    			  ])
            } else {
                this.refs.toast.show(result.msg);
            }
    	});
    }

    render() {      
    	let detail = this.state.detail;
    	let btnTxt;
        let cost = detail.price;
        let ticketLabel = '无可用礼券';
        if (this.state.voucherId) {
            ticketLabel = this.state.voucher.title + '￠' + this.state.voucher.price;
            cost -= this.state.voucher.price;
            if (cost < 0) cost = 0;
        } else if (this.state.tickets.length > 0) {
            ticketLabel = '有' + this.state.tickets.length + '张礼券';
        }
        if (this.state.money < cost) {
            btnTxt = '余额不足，请充值';
        } else {
            btnTxt = '购买';
        }
        return (
            <View style={styles.container}>
                <Bar />
            	<View style={styles.info}>
            		<Image resizeMode={'stretch'} source={{uri:Common.baseUrl + detail.image}}
                       style={styles.img}/>
                    <View style={styles.right}>
                    	<Text style={styles.title}>{detail.title}</Text>
                    	<View style={styles.costStyle}>
                    		<Text style={styles.cost}>￠{detail.price}</Text>
                    		<Text style={styles.multiple}>x1</Text>
                    	</View>                        
                    </View>
                </View>
                <View style={styles.separator} />                
                <View style={styles.ticket}>
                    <Text style={styles.ticketLabel}>礼券：</Text>
                    <TouchableOpacity onPress={this._chooseTicket}>
                        <Text style={styles.ownTicket}>{ticketLabel} &gt;</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.needPay}>
                	<Text style={styles.emptyLabel}></Text>
                	<Text style={styles.costLabel}>需付款：</Text>
                	<Text style={styles.costPrice}>￠{cost}</Text>
                </View>   
                <View style={styles.separator} />
                <View style={styles.balanceStyle}>
                	<Icon name="copyright" size={px2dp(15)} color={Colors.highlight} style={styles.rmIcon} />
                	<Text style={styles.money}>余额：{this.state.money}元</Text>
                	<Icon name="check-circle" size={px2dp(15)} color={Colors.highlight} style={styles.check} />
                </View>
                <View style={styles.separator} />
                <Text style={styles.tip}>提示：礼券不与其他优惠同享</Text>            
                <Button text={btnTxt} onPress={this._handle} 
                        style={styles.payBtn} containerStyle={styles.payContainer} /> 
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
    	fontSize: 15,
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
    	color: Colors.highlight,
    	fontSize: 13
    },
    multiple: {
    	right: 10
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
    	marginLeft: 10
    },
    ownTicket: {
    	color: Colors.gray,
    	right: 10
    },
    needPay: {
    	flexDirection: 'row',
    	alignItems: 'center', 
        justifyContent: 'center',
    	height: 50
    },
    emptyLabel: {
    	flex: 1
    },
    costLabel: {
    	right: 10
    },
    costPrice: {
    	color: Colors.highlight,
    	right: 10
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
    	marginLeft: 10
    },
    check: {
    	right: 10
    },
    tip: {
    	flex: 1,
    	width: deviceW - 40,
    	textAlign: 'center',
    	margin: 20
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