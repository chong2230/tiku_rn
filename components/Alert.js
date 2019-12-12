import React from 'react';
import PropTypes from 'prop-types';

import {
    Text, 
    View, 
    Modal, 
    Image, 
    Dimensions, 
    Platform,
    Keyboard,
    TouchableOpacity, 
    TextInput, 
    StyleSheet,
    KeyboardAvoidingView,
} from 'react-native';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            placeViewHeight: 0,
            checkIndex: 1,
            modalVisible:false,
        }
    }

    static propTypes = {
        /****************是否显示************************/
        modalVisible: PropTypes.bool,//是否显示对话框
        subTitleVisible: PropTypes.bool,//是否显示审核按钮
        showOkBtn: PropTypes.bool,
        showCancelBtn: PropTypes.bool,

        /********文字****************/
        titleText: PropTypes.any,//标题文字
        desText:PropTypes.any,//描述文字
        cancelText: PropTypes.any,//取消文字
        okText: PropTypes.any,//确定文字

        /***********宽高距离*************/
        modalHeight: PropTypes.any,//这个弹窗的高度
        modalWidth: PropTypes.any,//这个弹窗的宽度
        titleHeight: PropTypes.any,//这个弹窗的标题高度
        titleMarginTop: PropTypes.any,//标题顶部距离
        titleMarginBottom: PropTypes.any,//标题底部距离
        bottomHeight: PropTypes.any,//这个弹窗的底部高度

        /********字体****************/
        titleFontSize: PropTypes.number,//标题的文字大小
        titleFontColor:PropTypes.any,//标题的文字颜色
        titleFontWeight: PropTypes.any,
        descFontSize: PropTypes.number,
        descFontColor: PropTypes.string,
        descFontWeight: PropTypes.any,
        descriptionFontSize: PropTypes.number,//描述的文字大小
        descriptionFontColor: PropTypes.any,//描述的文字颜色
        bottomFontSize: PropTypes.number,//下面取消确定的文字大小
        okFontColor: PropTypes.any,
        cancelFontColor: PropTypes.any,
    }

    static defaultProps = {
        modalWidth: 303,
        modalHeight: 150,
        titleFontSize: 18,
        titleFontWeight: 'normal',
        titleFontColor: '#243047',
        descFontSize: 18,
        descFontWeight: 'normal',
        descFontColor: '#243047',
        titleMarginBottom: 10,
        bottomHeight: 50,
        bottomFontSize: 18,
        okFontColor: 'red',
        cancelFontColor: '#4789F7',
        cancelText: '取消',
        okText: '确定',
        showOkBtn: true,
        showCancelBtn: true,
    }

    show(){
        this.setState({modalVisible:true})
    }

    close(){
        this.setState({modalVisible:false})
    }

    confirm(){
        this.props.confirm();
        this.setState({modalVisible:false})
    }

    cancel(){
        this.props.cancel();
        this.setState({modalVisible:false})
    }

    render(){
        return(
            <View>
                <Modal
                    animationType={"fade"}
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose={()=>this.setState({modalVisible:false})}
                >
                    {this.renderContent()}
                </Modal>
            </View>
        );
    }

    renderContent(){
        return(
            <View style={styles.ViewPage}>
                <View style={{
                    // height: this.props.modalHeight ? this.props.modalHeight : (this.props.TextInputVisible?300:150),
                    height: this.props.modalHeight,
                    width: this.props.modalWidth,
                    backgroundColor: '#FCFCFC',
                    borderRadius: 8,
                    display:'flex',
                    marginBottom:this.state.placeViewHeight,
                }}>
                    <View style={{flex: 1,justifyContent:'space-around',marginTop:10}}>
                        {
                            /********title**********/
                            <View style={{
                                height: this.props.titleHeight ? this.props.titleHeight : (this.props.modalHeight?(this.props.modalHeight-50):100),
                                width: this.props.modalWidth,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Text style={{
                                    fontSize: this.props.titleFontSize,
                                    fontWeight: this.props.titleFontWeight,
                                    color: this.props.titleFontColor,
                                    // marginTop: this.props.titleMarginTop ? this.props.titleMarginTop : 18,
                                    marginBottom: this.props.titleMarginBottom,
                                    marginLeft:15,
                                    marginRight:15,
                                }}>{this.props.titleText}</Text>
                                {
                                    this.props.desText &&
                                    <Text style={{
                                        fontSize: this.props.descFontSize,
                                        fontWeight: this.props.descFontWeight,
                                        color: this.props.descFontColor,
                                        // marginTop: this.props.titleMarginTop ? this.props.titleMarginTop : 18,
                                        marginBottom: this.props.titleMarginBottom ? this.props.titleMarginBottom : 10,
                                        marginLeft: 15,
                                        marginRight: 15,
                                    }}>{this.props.desText}</Text>
                                }
                            </View>
                        }

                        <View style={{flex: 1}}/>

                        <View style={{
                            /***取消确定**/
                            height: this.props.bottomHeight,
                            width: this.props.modalWidth,
                            flexDirection: 'row',
                            borderTopWidth: 1,
                            borderColor: '#E5E5E5',
                        }}>
                            {
                                this.props.showOkBtn ? 
                                <TouchableOpacity style={{flex: 1}} onPress={()=>this.confirm()}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',/*borderBottomRightRadius:8,*/ borderRightWidth: 1, borderColor: '#E5E5E5'}}>
                                        <Text style={{
                                            fontSize: this.props.bottomFontSize, 
                                            color: this.props.okFontColor
                                        }}>{this.props.okText}</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                            }
                            {
                                this.props.showCancelBtn ?
                                <TouchableOpacity style={{flex: 1}} onPress={()=>this.cancel()}>
                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        // borderRightWidth: 1,
                                        borderColor: '#E5E5E5'
                                    }}>
                                        <Text style={{
                                            fontSize: this.props.bottomFontSize, 
                                            color: this.props.cancelFontColor
                                        }}>{this.props.cancelText}</Text>
                                    </View>
                                </TouchableOpacity>
                                : null
                            }
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    ViewPage: {
        width: deviceWidth,
        height:deviceHeight,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});