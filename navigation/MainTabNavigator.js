import React from 'react';
import {Platform, YellowBox, Dimensions} from 'react-native';
import { createBottomTabNavigator} from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import TabBarIcon from '../components/TabBarIcon';
import Home from '../screens/home/Home';
import Exam from '../screens/home/Exam';
import Category from '../screens/home/Category';
import Subject from '../screens/home/Subject';
import Timu from '../screens/home/Timu';
import Report from '../screens/home/Report';
import MyCollect from '../screens/home/MyCollect';
import MyRecord from '../screens/home/MyRecord';
import SingleTimu from '../screens/home/SingleTimu';
import WrongTimu from '../screens/home/WrongTimu';
import News from '../screens/news/News';
import NewsDetail from '../screens/news/NewsDetail';
import Column from '../screens/course/Column';
import ColumnDetail from '../screens/course/ColumnDetail';
import Articles from '../screens/course/Articles';
import Article from '../screens/course/Article';
import Comment from '../screens/course/Comment';
import Course from '../screens/course/Course';
import Account from '../screens/account/Account';
import Balance from '../screens/account/balance';
import Login from '../screens/account/login';
import FreeLogin from '../screens/account/freeLogin';
import Regist from '../screens/account/regist';
import Recharge from '../screens/account/recharge';
import SafeAccount from '../screens/account/safeAccount';
import Profile from '../screens/account/profile';
import UpdatePassword from '../screens/account/updatePassword';
import ForgetPassword from '../screens/account/forgetPassword';
import SetPassword from '../screens/account/setPassword';
import UpdatePhone from '../screens/account/updatePhone';
import Setting from '../screens/account/setting';
import About from '../screens/account/about';
import Service from '../screens/account/service';
import Contact from '../screens/account/contact';
// import Note from '../screens/account/note';
import Ticket from '../screens/account/ticket';
import HistoryTicket from '../screens/account/historyTicket';
import Message from '../screens/account/message';
import Suggest from '../screens/account/suggest';
import Colors from '../constants/Colors';
import ImageButton from '../components/ImageButton';
import Common from '../utils/Common';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
// YellowBox.ignoreWarnings(['react-native-i18n module is not correctly linked', 'Module react-native-i18n']);

console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.', 'source.uri should not be an empty string', 'Invalid props.style key'];

console.disableYellowBox = true; // 关闭全部黄色警告

const {width} = Dimensions.get('window');

const config = Platform.select({
    web: {headerMode: 'screen'},
    default: {},
});

const StackOptions = ({navigation}) => {
    let {state, goBack} = navigation;

    // 用来判断是否隐藏或显示header
    const visible = state.params.isVisible;
    let header;
    if (visible === false) {
        header = null;
    }
    const headerStyle = {backgroundColor: 'white'};
    const headerTitle = state.params.title;
    const headerTitleStyle = {
        fontSize: 20, color: 'black', fontWeight: '400',
        alignSelf: 'center', width: width - 140, textAlign: 'center'
    };
    const headerBackTitle = false;
    const headerLeft = (
        <ImageButton source={require('../images/icon/back.png')}
                     style={{marginLeft: 10, width: 24, height: 24}} onPress={() => {
            if (state.params.callback instanceof Function) {
                state.params.callback();
            }
            goBack();
        }}></ImageButton>
    );
    return {headerStyle, headerTitle, headerTitleStyle, headerBackTitle, headerLeft, header}
};

const HomeStack = createStackNavigator(
    {
        Home: Home,
        Exam: Exam,
        Category: Category,
        Subject: {
            screen: Subject,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Timu: {
            screen: Timu,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Report: {
            screen: Report,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        MyCollect: {
            screen: MyCollect,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        SingleTimu: {
            screen: SingleTimu,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        MyRecord: {
            screen: MyRecord,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        WrongTimu: {
            screen: WrongTimu,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        // Note: {
        //     screen: Note,
        //     navigationOptions: ({navigation}) => StackOptions({navigation})
        // },
        NewsDetail: {
            screen: NewsDetail,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Login: {
            screen: Login,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
    },
    config
);

HomeStack.path = '';

const CourseStack = createStackNavigator(
    {
        Course: Course,
        NewsDetail: {
            screen: NewsDetail,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Column: {
            screen: Column,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        ColumnDetail: {
            screen: ColumnDetail,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Articles: {
            screen: Articles,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Article: {
            screen: Article,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Comment: {
            screen: Comment,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
    },
    config
);

CourseStack.path = '';

const NewsStack = createStackNavigator(
    {
        News: News,
        NewsDetail: {
            screen: NewsDetail,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
    },
    config
);

NewsStack.path = '';

const AccountStack = createStackNavigator(
    {
        Account: Account,
        Login: {
            screen: Login
        },
        FreeLogin: {
            screen: FreeLogin,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Regist: {
            screen: Regist,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Recharge: {
            screen: Recharge,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Balance: {
            screen: Balance,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        SafeAccount: {
            screen: SafeAccount,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Profile: {
            screen: Profile,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Setting: {
            screen: Setting,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        About: {
            screen: About,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Service: {
            screen: Service,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Contact: {
            screen: Contact,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        UpdatePassword: {
            screen: UpdatePassword,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        ForgetPassword: {
            screen: ForgetPassword,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        SetPassword: {
            screen: SetPassword,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        UpdatePhone: {
            screen: UpdatePhone,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Column: {
            screen: Column,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        // Note: {
        //     screen: Note,
        //     navigationOptions: ({navigation}) => StackOptions({navigation})
        // },
        Ticket: {
            screen: Ticket,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        HistoryTicket: {
            screen: HistoryTicket,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Message: {
            screen: Message,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Suggest: {
            screen: Suggest,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        MyCollect: {
            screen: MyCollect,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        SingleTimu: {
            screen: SingleTimu,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        MyRecord: {
            screen: MyRecord,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Timu: {
            screen: Timu,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        Report: {
            screen: Report,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
        WrongTimu: {
            screen: WrongTimu,
            navigationOptions: ({navigation}) => StackOptions({navigation})
        },
    },
    config
);

AccountStack.path = '';

let Stacks = [HomeStack, NewsStack, AccountStack];
let tabBarLabels = ['题库', '资讯', '我的'];
let tabBarIcons = [
    Platform.OS === 'ios' ? 'ios-home' : 'md-home',
    Platform.OS === 'ios' ? 'ios-navigate' : 'md-navigate',
    Platform.OS === 'ios' ? 'ios-person' : 'md-person'
];
let stackParams = {
    HomeStack,
    NewsStack,
    AccountStack,
};
if (Common.isPreAlpha) {
    Stacks.splice(1, 0, CourseStack);
    tabBarLabels.splice(1, 0, '课程');
    tabBarIcons.splice(1, 0, Platform.OS === 'ios' ? 'ios-paper' : 'md-paper');
    stackParams = {
        HomeStack,
        CourseStack,
        NewsStack,
        AccountStack,
    };
}
Stacks.forEach((item, index) => {
    item.navigationOptions = ({navigation}) => {
        let tabBarVisible = true;
        if (navigation.state.index > 0) {
            tabBarVisible = false
        }
        return {
            tabBarLabel: tabBarLabels[index],
            tabBarOptions: {
                activeTintColor: Colors.highlight
            },
            tabBarIcon: ({focused}) => (
                <TabBarIcon focused={focused} name={tabBarIcons[index]}/>
            ),
            tabBarVisible,
        }
    }
});

const tabNavigator = createBottomTabNavigator(stackParams, {
    defaultNavigationOptions: ({navigation}) => ({
        tabBarVisible: Stacks.forEach
    }),
});

tabNavigator.path = '';

export default tabNavigator;
