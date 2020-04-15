import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    ScrollView,
    Dimensions,
} from 'react-native';

import Page from '../../components/Page';
import Bar from '../../components/Bar';
import Header from '../../components/Header';
import {TabbarSafeBottomMargin} from "../../utils/Device";
import Colors from "../../constants/Colors";

const {width, height} = Dimensions.get('window');

export default class AccountLogoffNotice extends Page {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        let noticeTxt1 = '在你注销你的有知学堂账号之前，请充分阅读、理解并同意下列事项：\n' +
            '\n' +
            '注销有知学堂账号为不可恢复的操作，除你已授权提供之第三方的信息以外，账号注销后你将无法再使用本有知学堂账号或找回你关注、添加、绑定的任何内容或信息（即使你使用相同的手机号再次注册并使用有知学堂）。请确保你所申请注销的有知学堂账号应当是你本人依照《有知学堂用户协议》的约定创建并由本公司提供给你本人的账号。你应当依照本公司规定的程序或网页上的提示注销有知学堂账号。建议你在注销前自行备份有知学堂账号相关的所有信息，并确认与本有知学堂账号相关的所有服务均已进行妥善处理。注销完成后，有知学堂将删除你的个人信息或对其进行匿名化处理（相关法律法规另有规定的除外）。请你知悉并理解，根据相关法律法规规定，相关日志记录有知学堂将保留不少于6个月的时间。\n' +
            '\n' +
            '1. 我们对你注销有知学堂账号的决定深表遗憾，如果你仍决定继续进行账号注销，你的账号需要同时满足以下条件：';
        let noticeTxt2 =
            '1.1 账号处于安全状态：账号处于正常使用状态，无任何账号被限制的记录且无被盗风险；\n' +
            '\n' +
            '1.2 账号权限接触：账号已解除第三方产品、网站授权登录或绑定关系；\n' +
            '\n' +
            '1.3 账号无任何未结争议纠纷，包括投诉举报或被投诉举报。';
        let noticeTxt3 =
            '2.\t有知学堂账号注销后，你将无法登录、使用本有知学堂账号，也将无法找回本有知学堂账号及账号相关的任何内容或信息，包括但不限于：';
        let noticeTxt4 =
            '2.1 个人已提交的账号信息、身份信息等；\n' +
            '\n' +
            '2.2 做题记录、已购记录、错题库、收藏等内容数据；\n' +
            '\n' +
            '2.3 通过本有知学堂账号使用、授权登录或绑定本有知学堂账号后使用的有知学堂或第三方服务的相关记录将无法找回。你将无法再登录、使用上述服务，通过上述服务层获得的资产或虚拟权益等财产性利益视为你同意放弃，将无法继续使用。你理解并同意，有知学堂无法协助你重新恢复上述服务；\n' +
            '\n' +
            '2.4 账号内钱包账户余额、实名认证信息、交易记录等信息将作废及删除。请确认账号内无任何资产或虚拟权益，你曾获得的资产、虚拟权益等财产性利益视为你同意放弃，将无法继续使用。你理解并同意，你将放弃有知学堂的资产或权益，有知学堂将无法协助你恢复上述服务也无法找回账号相关的任何内容或信息。';
        let noticeTxt5 =
            '3. 有知学堂账号注销将导致本公司终止为你提供服务，依《有知学堂用户协议》约定的双方权利义务终止，相关法律法规另有规定、本页面其他条款另行约定不得终止的或依其性质不能终止的除外。\n' +
            '\n' +
            '4. 在有知学堂帐号注销期间，如果你的有知学堂帐号涉及争议纠纷，包括但不限于投诉、举报、诉讼、仲裁、国家有权机关调查等，你理解并同意，有知学堂有权自行决定是否终止该帐号的注销而无需另行得到你的同意。\n' +
            '\n' +
            '5. 注销有知学堂账号并不代表本有知学堂账号注销前的账户行为和相关责任得到豁免或减轻。\n';
        return (
            <View style={styles.container}>
                <Bar />
                <Header title="有知学堂注销须知" goBack={() => {
                    let { goBack } = this.props.navigation;
                    goBack();
                }}></Header>
                <ScrollView>
                    <View style={styles.noticeView}>
                        <Text style={styles.noticeTxt}>{noticeTxt1}</Text>
                        <Text style={styles.subNoticeTxt}>{noticeTxt2}</Text>
                        <Text style={styles.noticeTxt}>{noticeTxt3}</Text>
                        <Text style={styles.subNoticeTxt}>{noticeTxt4}</Text>
                        <Text style={styles.noticeTxt}>{noticeTxt5}</Text>
                    </View>
                </ScrollView>
                <View style={styles.safeBottom}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
        justifyContent: 'center'
    },
    noticeTxt: {
        color: Colors.text,
        margin: 15,
        fontSize: 15,
        lineHeight: 23,
        fontWeight: '500'
    },
    subNoticeTxt: {
        color: Colors.gray,
        marginHorizontal: 15,
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '500'
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});
