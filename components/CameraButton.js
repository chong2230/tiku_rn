import React from 'react'
import PropTypes from 'prop-types';
import {
    TouchableOpacity,
    StyleSheet,
    Platform,
    ActivityIndicator,
    Image,
    View,
    Text,
    ToastAndroid
} from 'react-native'

import ImagePicker from 'react-native-image-picker';
import Common from '../utils/Common';
import Storage from "../utils/Storage";

const options = {
    title: '选择图片', 
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照', 
    chooseFromLibraryButtonTitle: '图片库', 
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high', 
    durationLimit: 10,
    maxWidth: 600,
    maxHeight: 600,
    aspectX: 2, 
    aspectY: 1,
    quality: 0.8,
    angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: { 
        skipBackup: true, 
        path: 'images'
    }
};

class CameraButton extends React.Component {

    static propTypes = {
        name: PropTypes.string,
        source: PropTypes.any,
        style: PropTypes.any,
        iconOnly: PropTypes.bool,
        iconStyle: PropTypes.any,
        useCorp: PropTypes.bool,
        pickSuccess: PropTypes.func,
        pickFail: PropTypes.func
    };

    static defaultProps = {
        name: '',
        iconOnly: true,
        useCorp: true,
        pickSuccess: ()=>{},
        pickFail: ()=>{}
    }

    constructor(props){
        super(props);
        this.state = {
            loading:false
        }
    }
    render() {
        const {photos,type,avatarImage, source} = this.props;
        let conText;
        if(photos && photos.length > 0){
            conText = (<View style={styles.countBox}>
                <Text style={styles.count}>{photos.length}</Text>
            </View>);
        }
        let img;
        if (source) {
            img = <Image source={source} style={[styles.avatarIcon, this.props.iconStyle]} />;
        } else if (avatarImage) {
            img = <Image source={{uri : Common.baseUrl + avatarImage}} style={styles.avatarIcon} />;
        } else {
            img = <Image source={require('../images/defaultAvatar.jpg')} style={styles.avatarIcon} />;
        }
        return (
            <TouchableOpacity
                onPress={this.showImagePicker.bind(this)}
                style={[this.props.style,styles.cameraBtn]}>
                <View style={styles.avatar}>
                    {!this.props.iconOnly ? <Text style={styles.avatarText}>头像</Text> : null}
                    {img}
                    {!this.props.iconOnly ? conText : null}
                </View>
            </TouchableOpacity>
        )
    }

    showImagePicker() {
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let source;
                if (Platform.OS === 'android') {
                    source = {uri: response.uri, isStatic: true}
                } else {
                    source = {uri: response.uri.replace('file://', ''), isStatic: true}
                }

                let file;
                if(Platform.OS === 'android'){
                    file = response.uri
                }else {
                    file = response.uri.replace('file://', '')
                }

                // this.setState({
                //     loading:true
                // });
                this.onFileUpload(file, response.fileName||'none.jpg')
                // .then(result=>{
                //     this.setState({
                //         loading:false
                //     })
                // })
            }
        });
    }

    onFileUpload = (uri, fileName) => {
        let self = this;
        let url = Common.httpServer + '/file/upload';
        let formData = new FormData();
        let file = {uri: uri, type: 'multipart/form-data', name: fileName};

        formData.append("file", file);
        formData.append("classify", "avatar");

        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'multipart/form-data',
                'Authorization': 'Bearer ' + global.token
            },
            body:formData,
        })
            .then((response) => response.json() )
            .then((responseData)=>{
                console.log('responseData', responseData);
                this.props.onFileUpload(responseData);
            })
            .catch((error)=>{console.error('error',error)});
    }
}
const styles = StyleSheet.create({
    avatar: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    avatarText: {
        fontSize: 15,
        color: '#1a1a1a',
        textAlign: 'left'
    },
    avatarIcon: {
        width: 50,
        height: 50,        
        borderRadius: 25,
        alignSelf: 'center',
        right: 50
    },
    cameraBtn: {
        padding:5
    },
    count:{
        color:'#fff',
        fontSize:12
    },
    fullBtn:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#fff'
    },
    countBox:{
        position:'absolute',
        right:-5,
        top:-5,
        alignItems:'center',
        backgroundColor:'#34A853',
        width:16,
        height:16,
        borderRadius:8,
        justifyContent:'center'
    }
});

export default CameraButton;