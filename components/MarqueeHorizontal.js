import React, { Component } from 'react';
import { View, Animated, Easing, Text, TouchableOpacity, InteractionManager } from 'react-native';

const styles = {
    bgContainerStyle : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'flex-start',
        // backgroundColor : 'red',
        // overflow : 'hidden'
    },
    textMeasuringViewStyle: {
        flexDirection : 'row',
        opacity : 0,
    },
    textMeasuringTextStyle: {
        fontSize : 16,
    },
    textStyle : {
        fontSize : 16,
        color : '#000000',
        // backgroundColor: 'green'
    }
};

export default class MarqueeHorizontal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animation : null,
            text : [],
            textWidth : 0,
            viewWidth : 0,
        }
    }

    static defaultProps = {
        duration : 10000, 
        speed : 0,
        text : [],
        width : 375,
        height : 50,
        direction : 'left',
        reverse : false,
        separator : 20,
    }

    componentWillMount(){
        this.setState({
            text : this.props.text || '',
        })
        this.animatedTransformX = new Animated.Value(0);
    }

    componentDidUpdate(){
        let { textWidth, viewWidth } = this.state;
        let { duration, speed, width, direction } = this.props;
        let mDuration = duration;
        if(speed && speed > 0){
            mDuration = (width + textWidth) / speed * 1000;
        }
        if(!this.state.animation && textWidth && viewWidth){
            this.animatedTransformX.setValue(direction == 'left' ? width : (direction == 'right' ? -textWidth : width));
            this.setState({
                animation : Animated.timing(this.animatedTransformX, {
                        toValue: direction == 'left' ? -textWidth : (direction == 'right' ? width : -textWidth),
                        duration: mDuration,
                        useNativeDriver: true,
                        easing: Easing.linear,
                    }),
            }, () => {
                this.state.animation && this.state.animation.start(() => {
                    this.setState({
                        animation: null,
                    });
                });
            })
        }
    }

    componentWillReceiveProps(nextProps){
        let newText = nextProps.text || '';
        let oldText = this.props.text || '';
        if (newText !== oldText) {
            this.state.animation && this.state.animation.stop();
            this.setState({
                text : newText,
                animation: null,
            });
        }
    }

    componentWillUnmount(){
        this.state.animation && this.state.animation.stop();
    }

    textOnLayout = (e) => {
        let width = e.nativeEvent.layout.width;
        let { textList, separator } = this.props;
        this.setState({
            textWidth : width,
        })
    }

    viewOnLayout = (e) => {
        let width = e.nativeEvent.layout.width;
        this.setState({
            viewWidth : width,
        })
    }

    textView(text){
        let { textStyle } = this.props;
        return(
            <Animated.View
                style = {{flexDirection : 'row',width : this.state.textWidth,transform: [{ translateX: this.animatedTransformX }]}}
                onLayout={(event) => this.viewOnLayout(event)}
            >
                <View style = {{flexDirection : 'row',marginRight : 0}}>
                    <Text style = {{
                        ...styles.textStyle,
                        ...textStyle
                    }}
                    >{text}</Text>
                </View>
            </Animated.View>
        )
    }

    textLengthView(text){
        let { textStyle } = this.props;
        
        return(
            <View style = {{
                ...styles.textMeasuringViewStyle,
                width : 1024
            }}>
                <Text style = {{
                    ...styles.textMeasuringTextStyle,
                    ...textStyle
                }}
                    onLayout={(event) => this.textOnLayout(event)}
                    
                >{text}</Text>
            </View>
        )
    }

    render(){
        let { width, height, bgContainerStyle } = this.props;
        let { text } = this.state;
        return(
            <View style = {{
                ...styles.bgContainerStyle,
                width : width,
                height : height,
                ...bgContainerStyle,
            }} opacity = {this.state.animation ? 1 : 0}>
                { this.textView(text) }
                { this.textLengthView(text) }
            </View>
        )
    }
}