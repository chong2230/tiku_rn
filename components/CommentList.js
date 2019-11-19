/**
* 评论列表
**/

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    Image,
    View,
    FlatList,
    ActivityIndicator,
    TouchableWithoutFeedback,
    StatusBar,
    Dimensions
} from 'react-native';

import CommentItem from './CommentItem';
import Button from './Button';
import Colors from './Colors';
import Common from '../utils/Common';

const {width, height} = Dimensions.get('window');
const emptyHeight = width/height * 289;
const emptyOffset = 120;
var pageNumber = 1;
var pageSize = 10;
var hasMore = false;
// var isLoading = false;  // 加载更多

export default class CommentList extends Component {

    constructor(props) {
        super(props);
        this.reason = [];
        this.state = {
            isLoading: false,
            comments : [],
            total : 0
        };
    }

    componentDidMount() {
    	let self = this;
        pageNumber = 1;
        hasMore = false;
    	this._load();
    }

    _load = (callback) => {
        let self = this;
        let params = {
            iid: this.props.mid,
            page: pageNumber,
            page_size: pageSize
        }
        Common.getCommentList(params, (result)=>{
            console.log('comments ', result.data);
            if (result.code == 0) {
                if (result.data.comments && result.data.comments.length > 0) {
                    let list = result.data.comments || [];
                    hasMore = list.length == pageSize;
                    let data = this.state.comments;
                    if (this.state.isLoading) {
                        for (let i in list) {
                            data.push(list[i]);
                        }
                    } else {
                        data = list;                    
                    }
                    this.setState({
                        isLoading: false,
                        comments: data,
                        total: result.data.length
                    });
                    this.props.loadCallback(result.data.comments, result.data.length);                   
                }
                
            }
        });
    }

    _renderItem = (item) => {
        let rowData = item.item;
        return (
            <CommentItem index={item.index} key={rowData.id} comment={rowData}
                onClickAuthor={()=>{this.props.onClickAuthor(rowData)}}
                onReply={()=>{this.props.handleInput(rowData.id, rowData)}}
                handleModal={()=>{this.props.handleModal(rowData)}}
            ></CommentItem>
        );
    }

    _footer = () => {
        if (this.state.isLoading) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator />
                    <Text style={{marginLeft: 10}}>加载中...</Text>
                </View>
            );
        } else if (this.state.total > 0 && this.state.total == this.state.comments.length) {
            return (
                <View style={styles.footer}>
                    <Text style={{color:'#242424'}}>哎呀，已经加载到底了</Text>
                </View>
            );
        }
        return null;
    }

    addComment = (comment, callback) => {
        console.log(JSON.stringify(comment));
        let total = this.state.total + 1;
        let comments = this.state.comments.concat();
        comments.splice(0, 0, comment);        
        this.setState({
            total: total,
            comments: comments
        });
        if (callback instanceof Function) callback(comments, total);
     }

    deleteComment = (comment, callback) => {
        let total = this.state.total - 1;
        let comments = this.state.comments.concat();
        for (let i in comments) {
            if (comments[i].id == comment.id) {
                comments.splice(i, 1);
                break;
            }
        }
        this.setState({
            total: total,
            comments: comments
        }); 
        if (callback instanceof Function) callback(comments, total);       
    }

    _loadMore = () => {
        if (hasMore) {
            this.state.isLoading = true;
            this.setState({
                isLoading: true
            });
            pageNumber++;
            this._load();
        }
    }

    reload = () => {
        pageNumber = 1;
        pageSize = 10;
        this._load();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.comments !== this.state.comments;
    }

    render() {
        if (!this.props.showMore) {
            let commentsListView = [];
            let comments = this.state.comments;
            for (let i=0; i<comments.length; i++) {
                let comment = comments[i];
                let item = { item: comment, index: i };
                commentsListView.push(this._renderItem(item));
            }
            return commentsListView;       
        } else {
            return (
                <FlatList 
                    style={styles.list}
                    keyExtractor={(item, index) => {return 'cl-' + item.id}}
                    renderItem={this._renderItem}
                    ListFooterComponent={this._footer}
                    refreshing={false}
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}   
                    onEndReachedThreshold={0.1}
                    onEndReached={
                        this._loadMore
                    }             
                    data={this.state.comments}>
                    extraData={this.state}
                </FlatList>
            );
        }
    }

}

const styles = StyleSheet.create({
    list: {
	   
    },
    footer: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height:40,
        backgroundColor: '#f9f9f9'
    }
});
