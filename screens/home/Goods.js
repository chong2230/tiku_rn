/**
 * @Description: 购买商品
 * @author cluo
 * @date 2020/2/22
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import Bar from '../../components/Bar';
import Header from '../../components/Header';
import Button from '../../components/Button';
import ImageButton from '../../components/ImageButton';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import Toast from '../../components/Toast';
import {StatusBarAndNavigationBarHeight, TabbarSafeBottomMargin} from '../../utils/Device';

const { width, height } = Dimensions.get('window');

export default class Goods extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            list: [],
            selected: 0,
            cost: 0,
            selectData: {}
        };
    }

    componentDidMount() {
        let self = this;
        let { state } = this.props.navigation;
        let params = {
            // professionId: global.course.professionId,
            courseId: global.course.courseId || global.course.id,
        }
        if (state.params.paperId) params.paperId = state.params.paperId;
        Common.getGoodsList(params, (result)=>{
            if (result.code == 0) {
                let data = result.data;
                // let data = {
                //     list: [
                //         { id: 1, name: '购买当前试卷', price: 1, descri: '' },
                //         { id: 2, name: '购买初级会计师普通会员', price: 10, descri: '初级会计师普通会员：以周期日期为单位（例如：信息系统项目管理师，考试时间是每年5月20日考试，如果用户在2020年5月21日-2021年5月20日这个期间内，任何一个时间购买服务周期日期都是到2021年5月20日，比如有两个用户，一个用户是2020年10月10日花100元购买成为普通会员，另外一个用户是2021年3月3日也是花100元购买成为普通会员，那么这两个用户使用题库的服务日期都是一样的，都是到2021年5月20日）' },
                //         { id: 3, name: '购买初级会计师Vip会员', price: 25, descri: '初级会计师Vip会员：其实就是保过班会员，用户购买了这项服务，这次考试没有通过，下次他还可以继续使用这个题库里面的服务，直到考试通过为止。购买这项服务的用户，在购买的时候我们就会提示清楚，至于怎么判断他们有没有通过，我们要增加一个简单的申请和审核环节（例如：需要提供成绩截图向我们申请开通，如果缺考或者没有成绩则不予开通）' },
                //         { id: 4, name: '购买初级会计师包月会员', price: 20, descri: '初级会计师包月会员：购买即日起，30天后结束' },
                //         { id: 5, name: '购买初级会计师三月会员', price: 30, descri: '初级会计师三个月会员：购买即日起，90天后结束' },
                //         { id: 6, name: '购买初级会计师半年会员', price: 40, descri: '初级会计师半年会员：购买即日起，180天后结束' },
                //         { id: 7, name: '购买初级会计师一年会员', price: 50, descri: '初级会计师一年会员：购买即日起，360天后结束' }
                //     ]
                // }
                // let rightTxt = '';
                // for (let i in data.list) {
                //     let desc = data.list[i].descri;
                //     if (desc) rightTxt += desc + '\n';
                // }
                this.setState({
                    list: data.list,
                    // rightTxt: rightTxt
                });
                if (data.list.length > 0) this._choose(data.list[0]);
            }
        })
    }

    _renderList = () => {
        let listView = [];
        for (let i in this.state.list) {
            let goodView = this._renderItem(this.state.list[i]);
            listView.push(goodView);
        }
        return <View style={styles.listView}>{listView}</View>;
    }

    _renderItem = (data) => {
        return (
            <TouchableOpacity onPress={()=>this._choose(data)} key={data.goodsId}>
            <View style={styles.item}>
                <Image source={this.state.selected == data.goodsId ?
                        require('../../images/icon/radio_selected.png') : require('../../images/icon/radio.png')}
                    style={styles.radioIcon} />
                <Text style={styles.name}>{data.goodsName}</Text>
                <Text style={styles.price}>价格：{data.price}余额</Text>
            </View>
            </TouchableOpacity>
        );
    }

    _renderRight = () => {
        // let rightTxt = '初级会计师普通会员：以周期日期为单位（例如：信息系统项目管理师，考试时间是每年5月20日考试，如果用户在2020年5月21日-2021年5月20日这个期间内，任何一个时间购买服务周期日期都是到2021年5月20日，比如有两个用户，一个用户是2020年10月10日花100元购买成为普通会员，另外一个用户是2021年3月3日也是花100元购买成为普通会员，那么这两个用户使用题库的服务日期都是一样的，都是到2021年5月20日）\n' +
        //     '初级会计师Vip会员：其实就是保过班会员，用户购买了这项服务，这次考试没有通过，下次他还可以继续使用这个题库里面的服务，直到考试通过为止。购买这项服务的用户，在购买的时候我们就会提示清楚，至于怎么判断他们有没有通过，我们要增加一个简单的申请和审核环节（例如：需要提供成绩截图向我们申请开通，如果缺考或者没有成绩则不予开通）\n' +
        //     '初级会计师包月会员：购买即日起，30天后结束\n' +
        //     '初级会计师三个月会员：购买即日起，90天后结束\n' +
        //     '初级会计师半年会员：购买即日起，180天后结束\n' +
        //     '初级会计师一年会员：购买即日起，360天后结束';
        return (
                <View style={styles.rightView}>
                    <Text style={styles.rightTip}>{this.state.list.length > 0 ? '权益说明：' : ''}</Text>
                    <Text style={styles.rightTxt}>{this.state.rightTxt}</Text>
                </View>
        );
    }

    _choose = (data) => {
        this.setState({
            selected: data.goodsId,
            cost: data.price,
            selectData: data,
            rightTxt: data.descri
        });
    }

    _buy = () => {
        const { navigate, state } = this.props.navigation;
        navigate('Balance', {isVisible: false, title: '结算台',
            paperId: state.params.paperId || '',
            goods: JSON.stringify(this.state.selectData),
            returnKey: state.key,
            refresh: ()=>{
                const { state } = this.props.navigation;
                if (state.params.refresh instanceof Function) {
                    state.params.refresh();
                }
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Bar></Bar>
                <Header title="商品列表" goBack={()=>{
                    let { state, goBack } = this.props.navigation;
                    goBack(state.params.returnKey);
                }}></Header>
                <ScrollView style={styles.scrollView}>
                    {this._renderList()}
                    <View style={styles.separator}></View>
                    {this._renderRight()}
                </ScrollView>
                <View style={styles.bottom}>
                    <Text style={styles.money}>金额：{this.state.cost}余额</Text>
                    <Button disabled={this.state.selected == 0}
                            text={'去购买'}
                            style={styles.buyBtn}
                            containerStyle={[styles.buyBtnContainer, this.state.selected == 0 ? {opacity: 0.6} : null]}
                            onPress={this._buy} />
                </View>
                <View style={styles.safeBottom}></View>
                <Toast ref="toast" position="center" />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg
    },
    scrollView: {
        backgroundColor: 'white',
        height: height - StatusBarAndNavigationBarHeight - TabbarSafeBottomMargin,
    },
    listView: {
        paddingBottom: 15
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: 10
    },
    radioIcon: {
        width: 20,
        height: 20
    },
    name: {
        fontSize: 16,
        marginLeft: 10,
        height: 20,
        lineHeight: 20,
        fontWeight: '500'
    },
    price: {
        fontSize: 15,
        marginLeft: 10,
        height: 20,
        lineHeight: 20
    },
    rightView: {

    },
    rightTip: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 15,
        lineHeight: 20,
        fontWeight: '500'
    },
    rightTxt: {
        fontSize: 15,
        paddingHorizontal: 15,
        lineHeight: 22
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 60,
        backgroundColor: 'white'
    },
    money: {
        fontSize: 18,
        width: 150,
        color: Colors.special
    },
    buyBtnContainer: {
        width: 150,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.special,
    },
    buyBtn: {
        width: 150,
        height: 40,
        lineHeight: 40,
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    line: {
        width: 1,
        height: 18,
        backgroundColor: '#DFDFDF'
    },
    separator: {
        backgroundColor: '#f2f2f2',
        height: 10
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});