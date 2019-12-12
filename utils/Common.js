'use strict';

import {
    NetInfo,
    Alert,
    AsyncStorage,
    Platform
} from 'react-native';
// import DeviceInfo from 'react-native-device-info';
import MockData from '../mockdata/mockdata';
import Storage from './Storage';

export default class Common {
    // Prod Env
    // static httpServer = 'https://practice.youzhi.tech';
    // QA Env
    static httpServer = 'http://pre-practice.youzhi.tech';
    static hackServer = 'http://rap2api.taobao.org/app/mock/227957';
    static baseUrl = 'http://static.youzhi.tech/';

    static isPreAlpha = false;   // 预览版
    static isHack = false;   // 默认为false，不使用mock数据
    static netStatus = 'unknown';
    static _netObserver = [];
    static inError = false;     // 控制请求失败后显示的错误提示
    // static inst = new Common();

    constructor(props) {
        var self = this;
        NetInfo.fetch().done((reach) => {
            console.log('NetInfo init ' + reach);
            Common.netStatus = reach;
            self.handleNetChange = (reach) => {
                console.log('NetInfo: changeTo: ' + reach);
                Common.netStatus = reach;

                for(var index in Common._netObserver)
                {
                    Common._netObserver[index].onNetStateChange(reach);
                }
            };
            NetInfo.addEventListener(
                'connectionChange',
                self.handleNetChange
            );
        });

        //测试网络情况，测试代码    
        // setTimeout(() => {
        //     this.handleNetChange('cell');
        // }, 23000);
    }

    //注册player
    static subscribeNetState(func)
    {
        console.log("common.js subscribeNetState");
        if (func && Common._netObserver.indexOf(func) < 0) Common._netObserver.push(func);
    }

    static unSubscribeNetState(func)
    {
        console.log("common.js unSubscribeNetState");
        if (func) {
            Common._netObserver.splice(Common._netObserver.indexOf(func),1);
        }
    }

    static httpRequest(url, params, method, contentType) {
        // if (Common.isHack) return MockData[url];
        let headers = {
            'Accept': 'application/json',
            'Content-Type': contentType ? contentType : 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': 'Bearer ' + global.token,
        };
        if (!method) method = params ? 'POST' : 'GET';
        params = params || {};
        if (params.pageNumber) params.pageNum = params.pageNumber;
        let bodyParams = '';
        let str = Common.parseObj(params);
        if (method == 'GET') {
            url = Common.isHack || str == '' ? url : url + '?' + str;
        } else if (contentType == 'application/json') {
            bodyParams = JSON.stringify(params);
        } else {
            bodyParams = str;
        }
        return fetch((Common.isHack ? Common.hackServer : Common.httpServer) + url, {
            method: method,
            mode: 'cors',
            // credentials: 'include',
            headers: headers,
            body: bodyParams
        })
            .then((resp) => resp.json())
            .then((json) => {
                Common.inError = false;           
                console.log('url ', url, bodyParams, json); // TODO: need to delete
                return Common.isHack ? MockData[url] : json;
            })
            .catch((error) => {
                // Alert.alert(Common.httpServer+url +error.toString());
                // 避免请求超时一直Loading，请求失败后移除Loading
                if (global && global.mLoadingComponentRef) {
                    global.mLoadingComponentRef.setState({ showLoading: false });
                }
                if (!Common.inError) {
                    var text = "网络出错啦！";
                    if (['none','NONE','unknown','UNKNOWN'].indexOf(Common.netStatus) >= 0) text = "网络出错啦，请检查网络设置！";
                    Alert.alert(text);
                    Common.inError = true;
                }
                return error;
            });
    }

    static get(url, params, contentType) {
        return Common.httpRequest(url, params, 'GET', contentType)
    }

    static post(url, params, contentType) {
        return Common.httpRequest(url, params, 'POST', contentType)
    }

    static getBanners(params, cb) {
        Common.httpRequest('/home/slide', {

        }).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    static getHomeFunc(cb) {
        Common.httpRequest('/home/functions', {
            
        }).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    static getHomeMy(cb) {
        Common.httpRequest('/home/my', {
            
        }).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 题库列表
    static getSubjectList(params, cb) {
        Common.httpRequest('/home/functionInfo', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 获取考试科目
    static getExamList(params, cb) {
        Common.httpRequest('/course/list', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 获取参加的考试（专业列表）
    static getCategoryList(params, cb) {
        Common.httpRequest('/profession/list', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 获取课程
    static getClassesList(params, cb) {
        Common.httpRequest('/course/curriculumList', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 获取题目列表
    static getTimuList(params, cb) {
        Common.httpRequest('/question/list', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 获取题目
    static getTimu(params, cb) {
        Common.httpRequest('/question/info', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 获取题目解析
    static getTimuAnalyse(params, cb) {
        Common.httpRequest('/timu/analyse', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }
    
    // 收藏题目
    static collectTimu(params, cb) {
        Common.httpRequest('/question/collect', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 保存题目
    static saveTimu(params, cb) {
        Common.post('/question/saveDoRecord', params, 'application/json').then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 交卷
    static handlePaper(params, cb) {
        Common.httpRequest('/exam/submit', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 我的收藏
    static getMyCollect(params, cb) {
        Common.httpRequest('/question/collection', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 我的做题记录
    static getMyRecord(params, cb) {
        Common.httpRequest('/question/doRecord', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 获取错题列表
    static getWrongTimuList(params, cb) {
        Common.httpRequest('/question/wrong', params).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    static getHomeList(cb) {
        Common.httpRequest('/home/list', {
            pageSize: 4
        }).then((result)=>{
            // console.log(result);
            cb(result);
        })
    }

    // 新闻
    static getNews(params, cb) {
        Common.httpRequest('/news/list', params).then((result)=>{
            cb(result);
        })
    }

    // 新闻详情
    static getNewsInfo(params, cb) {
        Common.httpRequest('/news/info', params).then((result)=>{
            cb(result);
        })
    }

    // 专栏列表，params.from = 'purchase'时，为已购列表
    static getColumnList(params, cb) {
        let url = params.from == 'purchase' ? '/user/hadsubColumnList' : '/column/list';
        Common.httpRequest(url, params).then((result)=>{
            cb(result);
        })
    }

    // 获取专栏详情 params: {id}
    static getColumnInfo(id, cb) {
        Common.httpRequest('/column/info', {
            id : id
        }).then((result)=>{
            cb(result);
        })
    }

    // 获取最新章节列表
    static getLatest(params, cb) {
        Common.httpRequest('/article/list', params).then((result)=>{
            cb(result);
        })
    }

    // 章节列表 params: {columnId, order} order: 排序方式 DESC：倒序  ASC：升序
    static getArticles(params, cb) {
        Common.httpRequest('/article/list', params).then((result)=>{
            cb(result);
        })
    }

    // 文章详情
    static getArticle(id, cb) {
        Common.httpRequest('/article/info', {
            id: id
        }).then((result)=>{
            cb(result);
        })
    }

    // 文章评论详情
    static getComments(params, cb) {
        Common.httpRequest('/comment/list', params).then((result)=>{
            cb(result);
        })
    }

    // 购买
    static buy(id, voucherId, cb) {
        let params = { id: id };
        if (voucherId) params.userVoucherId = voucherId;
        Common.httpRequest('/column/buy', params).then((result)=>{
            console.log(result);
            cb(result);
        })
    }

    // 获取用户信息
    static getAccount(cb) {
        Common.httpRequest('/user/info', {
            
        }).then((result)=>{
            cb(result);
        })
    } 

    // 修改密码
    static changePwd(oldPwd, newPwd, cb) {
        Common.httpRequest('/user/modifyPassword', {
            oldPassword: oldPwd,
            newPassword: newPwd
        }).then((result)=>{
            cb(result);
        })
    }    

    static updateUser(user, cb) {
        Common.httpRequest('/user/update', user).then((result)=>{
            cb(result);
        })
    } 

    static getRechargeList(cb) {
        Common.httpRequest('/recharge/list', {
            
        }).then((result)=>{
            // result = Mockdata['/recharge/list'];
            cb(result);
        })
    }   

    static restorePurchases(transactionIdentifiers, cb) {
        Common.httpRequest('/recharge/restorePurchases', {
            transactionIdentifiers: transactionIdentifiers
        }).then((result) => {
            cb(result);
        });
    }

    // 苹果支付验证
    static checkPurchase(receiptData, cb) {
        let receipt = receiptData.replace(/\+/g, "%2B").replace(/\\n/g, "").replace(/\\r/g, "");
        Common.httpRequest('/recharge/appleverify', {
            receipt: receipt
        }).then((result) => {
            cb(result);
        });
    }   

    static login(phone, password, cb) {
        Common.httpRequest('/user/login', {
            phone: phone,
            password: password
        }).then((result)=>{
            cb(result);
        })
    } 

    static regist(uname, phone, password, email, cb) {
        Common.httpRequest('/user/register', {
            nickName: uname,
            phone: phone,
            password: password,
            email: email
        }).then((result)=>{
            cb(result);
        })
    } 

    // 安全验证
    static safeValidate(phone, code, cb) {
        Common.httpRequest('/account/safeValidate', {
            phone: phone,
            code: code
        }).then((result)=>{
            cb(result);
        })
    }

    // 通过发送邮件来找回密码
    static sendEmail(email, cb) {
        Common.httpRequest('/user/findPassword', {
            email: email
        }).then((result)=>{
            console.log(result);
            cb(result);
        })
    }

    // 设置密码
    static setPassword(email, code, pwd, cb) {
        Common.httpRequest('/user/resetPassword', {
            email: email,
            code: code,
            newPassword: pwd
        }).then((result)=>{
            cb(result);
        })
    }

    // 免密登录
    static freeLogin(phone, code, cb) {
        Common.httpRequest('/account/freeLogin', {
            phone: phone,
            code: code
        }).then((result)=>{
            cb(result);
        })
    }

    // 已购列表
    static getPurchase(params, cb) {
        Common.httpRequest('/user/purchase', params).then((result)=>{
            cb(result);
        })
    }

    // 我的笔记列表
    static getMyNotes(cb) {
        Common.httpRequest('/note/all', {
            
        }).then((result)=>{
            cb(result);
        })
    }

    // 我的笔记
    static getNote(id, type, cb) {
        Common.httpRequest('/note/listByResource', {
            resourceId: id,
            type: type
        }).then((result)=>{
            cb(result);
        })
    }

    // 我的优惠券列表 type: 0 过期 1 有效
    static getMyTickets(params, cb) {
        Common.httpRequest('/user/voucher', params).then((result)=>{     
            // result = Mockdata['/user/voucher'];
            cb(result);
        })
    }

    // 我的留言
    static getMyMessages(params, cb) {
        Common.httpRequest('/comment/my', params).then((result)=>{
            // console.log('message ', result);
            cb(result);
        })
    }

    // 反馈 params: {name, email, content}
    static suggest(name, email, content, cb) {
        Common.httpRequest('/user/feedback', {
            name: name,
            email: email,
            content: content
        }).then((result)=>{
            cb(result);
        })
    }

    // 给章节点赞 params: {id, type: 0 取消点赞, 1 点赞 }
    static addZan(id, type, cb) {
        Common.httpRequest('/article/addLike', {
            id: id,
            type: type
        }).then((result)=>{
            cb(result);
        })
    }

    // 给留言点赞
    static zanComment(id, type, cb) {
        Common.httpRequest('/comment/addLike', {
            id: id,
            type: type
        }).then((result)=>{
            cb(result);
        })
    }

    // 指定章节留言
    static publishComment(articleId, content, cb) {
        Common.httpRequest('/comment/publish', {
            articleId: articleId,
            content: content
        }).then((result)=>{
            cb(result);
        })
    }

    // 第三方登录 type 微信：'wx', QQ：'qq', 微博：'wb'
    static thirdPartyLogin(type, openid, accessToken, cb) {
        Common.httpRequest('/user/thirdPartyLogin', {
            type: type,
            openid: openid,
            accessToken: accessToken
        }).then((result)=>{
            cb(result);
        })
    }

    static parseObj(obj) {
        var str = '';
        for (var key in obj) {
            // android端encode后评论失败，提示access_token匹配失败
            let val = Platform.OS == 'ios' ? encodeURIComponent(obj[key]) : obj[key];
            str += key + '=' + val + '&';
        }
        return str.substr(0, str.length-1);
    }

    static isInArray(val, arr) {
        for (let value of arr) {
            if (value == val) return true;
        }
        return false;
    }

}
