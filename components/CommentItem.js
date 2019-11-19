import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';

import HTMLView from '../components/HTMLView';
import Button from '../components/Button';
import ImageButton from '../components/ImageButton';
import Colors from '../components/Colors';
import { formatDateToMonthDay, emojiReplace, parseNativeArgs } from '../utils/Util';

const {width, height} = Dimensions.get('window');

const propTypes = {
    onClickAuthor: PropTypes.func,
    onReply: PropTypes.func,
    handleModal: PropTypes.func
};

const defaultProps = {
    onClickAuthor: () => {},
    onReply: () => {},
    handleModal: () => {},
}

function renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.name == 'mytag') {
        const specialSyle = node.attribs.style;
        return (
            <Text key={index} style={[specialSyle, styles.commentParentName]}>
                {/*defaultRenderer(node.children, parent)*/}
                {node.children[0].data}
            </Text>
        )
    }
}

export default class CommentItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // comment : {},
        };
    }    

    render() {
        let comment = this.props.comment;
        let content = emojiReplace(comment.content);
        let textProps = {
            style: styles.commentHtmlTextStyle
        }
        let parentName = '';
        let parentContent = '';
        if (comment.parent) {
            parentName = `<mytag>@${comment.parent.user_name}：</mytag>`;
            parentContent = parentName + emojiReplace(comment.parent.content);
        }
        let parentTextProps = {
            style: styles.commentParentHtmlTextStyle
        }
        let style;
        if (this.props.index == 0) style = styles.specCommentItem;
        else style = {};
        return (
            <View style={[styles.commentItem, style]} key={comment.id}>
                <TouchableOpacity onPress={()=>{this.props.onClickAuthor(comment)}}>
                    <View style={styles.commentAuthorAvatar}>
                        <View style={{width: 34, height: 34, borderRadius: 17, overflow: 'hidden'}}>                    
                            <Image roundAsCircle={true} resizeMode={'stretch'} source={{uri:comment.icon}}
                                style={styles.commentAvatarImage} />
                        </View>
                        {
                            comment.creator_level > 0 ? 
                            <Image resizeMode={'stretch'} source={{uri: comment.creator_level_icon}} style={styles.vstarImage}/>
                            : null
                        }
                    </View>
                </TouchableOpacity>
                <View style={styles.commentInfo}>
                    <Text style={styles.commentAuthorName}>{comment.user_name}</Text>
                    <HTMLView value={content} style={styles.commentHtmlStyle}
                        textComponentProps={textProps}></HTMLView>
                    {
                        comment.parent ? 
                        <View style={styles.commentParentView}>
                            
                            {/*<Text style={styles.commentParentContent}>
                                <Text style={styles.commentParentName}>@{comment.parent.user_name}</Text>
                                {'  ' + comment.parent.content}
                            </Text>*/}
                            <HTMLView value={parentContent} style={styles.commentParentContent}
                                textComponentProps={parentTextProps} renderNode={renderNode}></HTMLView>
                        </View>
                        : null
                    }
                    <View style={styles.commentBottom}>
                        <Text style={styles.commentTime}>{formatDateToMonthDay(comment.comment_time)}</Text>
                        <Button text="回复" containerStyle={styles.replyBtnContainer} 
                            style={styles.replyBtn} onPress={()=>{this.props.onReply(comment)}}></Button>
                        <View style={{flex: 1}}></View>
                        <ImageButton source={require('../images/icon/point.png')} 
                            style={styles.commentPointBtn} onPress={()=>{this.props.handleModal(comment)}}></ImageButton>    
                    </View>                        
                </View>
            </View>
        );
    }
}

CommentItem.propTypes = propTypes;

const styles = StyleSheet.create({
    commentItem: {
        flexDirection: 'row',
        marginLeft: 10,
        marginTop: 25
    },
    // specCommentItem: {
    //     marginTop: 10
    // },
    commentInfo: {
        marginLeft: 10,
        width: width - 80
    },
    commentAuthorAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'white',
        flexShrink: 0,
        justifyContent: 'center',
        marginTop: 2
    },
    commentAvatarImage: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    commentAuthorName: {
        fontSize: 14,
        textAlign: 'left',
        color: Colors.text
    },
    commentTop: {
        marginTop: 10,
    },
    commentParentView: {
        flexDirection: 'row',
        backgroundColor: '#F7F7F7',
        width: width - 80,
        alignItems: 'center'
    },
    commentParentName: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
        padding: 5,
    },
    commentParentContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 5,
        alignItems: 'center'
    },
    commentBottom: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    commentContent: {
        flexDirection: 'row',
        marginTop: 6,
        marginBottom: 5,
        fontSize: 16,
        color: Colors.reply,
    },
    commentHtmlStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: width - 80,
        marginTop: 6,
        marginBottom: 5,
    },
    commentHtmlTextStyle: {
        fontSize: 16,
        color: Colors.reply,
        lineHeight: 24
    },
    commentParentHtmlTextStyle: {
        fontSize: 14,
        color: Colors.reply,
        lineHeight: 20
    },
    commentTime: {
        marginTop: 6,
        marginBottom: 5,
        fontSize: 12,
        color: '#929292'
    },
    commentPointBtn: {
        width: 23,
        height: 23
    },
    replyBtnContainer: {
        marginLeft: 20,
        width: 42,
        height: 23,
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        justifyContent: 'center', 
        alignItems: 'center'        
    },
    replyBtn: {
        color: Colors.text
    },
});

