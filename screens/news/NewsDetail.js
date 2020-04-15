import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    // Button,
    Image,
    View,
    ScrollView,
    StatusBar,
    Alert,
    FlatList,
    TouchableOpacity,
    Dimensions
} from 'react-native';

// import Orientation from 'react-native-orientation';
// import HTMLView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';
// import MyWebView from 'react-native-webview-autoheight';
// import { WebView } from 'react-native-webview';

import HTMLView from '../../components/HTMLView';
import Button from '../../components/Button';
import Colors from '../../constants/Colors';
import Common from '../../utils/Common';
import { formatDate } from '../../utils/Util';
import {TabbarSafeBottomMargin} from "../../utils/Device";

const deviceW = Dimensions.get('window').width;
const deviceH = Dimensions.get('window').height;
const imgHeight = deviceW*640/1142;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
var isLoading = false;  // 加载更多

export default class NewsDetail extends Component<{}> {
    // 构造
    constructor(props) {
        super(props);
        this.state = {
            data : {},
            comments : []
        };
        
    }

    componentWillMount() {
        // Orientation.lockToLandscape();
        const { state } = this.props.navigation;
        let params = {
            id: state.params.id
        };
        Common.getNewsInfo(params, (result)=>{
            if (result.code == 0) {
                this.setState({
                    data : result.data
                });
            }
        });        
    }

    onWebViewMessage = (event) => {
        this.setState({ webViewHeight: Number(event.nativeEvent.data) });
    }

    render() {
        let headerView;
        let data = this.state.data;
        let brReg = /<br\s*\/?>/gi;
        let meta = '<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />\n';
        let content = data.content || '';
        if (content) content = content.replace(brReg, '').replace(/\n/g, '').replace(/^(<!--)(-->)$/g, '');
        // console.log('content ', content);
        if (data && data.image) {
            headerView = <Image resizeMode={'stretch'} source={{uri:Common.baseUrl + data.image}}
                           style={styles.img}/>;
        }        
        
        return (
            <View style={styles.container}>
                <ScrollView 
                        style={styles.scrollView}
                        scrollEventThrottle={50}>
                    <StatusBar
                        animated={true}
                        hidden={false}
                        backgroundColor={'white'}
                        translucent={true}
                        barStyle={'dark-content'}>
                    </StatusBar>    

                    <Text numberOfLines={2} style={styles.title}>{data.name}</Text>
                    <View style={styles.viewStyle}>
                        <Text style={styles.time}>{formatDate(data.publishTime)}</Text>
                        <Text style={styles.authorName}>{data.author}</Text>
                    </View>
                    {headerView}                  
                    
                    <HTMLView value={content} style={styles.htmlStyle} />
                    {/*<View style={{ height: this.state.webViewHeight }}>*/}
                        {/*<WebView*/}
                            {/*// originWhitelist={['*']}*/}
                            {/*source={{ html: meta+ content }}*/}
                            {/*scalesPageToFit={Platform.OS == 'ios' ? false : true}*/}
                            {/*injectedJavaScript='window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)'*/}
                            {/*onMessage={this.onWebViewMessage}*/}
                        {/*/>*/}
                    {/*</View>*/}
                </ScrollView>
                <View style={styles.safeBottom}></View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        backgroundColor: 'white'
    },
    title: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 10,
        marginLeft: 10
    },
    viewStyle: {
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        height: 20,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10
    },
    time: {
        fontSize: 13,
        color: Colors.gray,
    },
    authorName: {
        fontSize: 13,
        color: Colors.gray,
        marginLeft: 10
    },
    img: {
        width: deviceW-20,
        height: imgHeight,
        resizeMode: 'stretch',
        marginLeft: 10
    },     
    htmlStyle: {
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        backgroundColor: 'white'
    },
    safeBottom: {
        backgroundColor: 'white',
        height: TabbarSafeBottomMargin
    },
});