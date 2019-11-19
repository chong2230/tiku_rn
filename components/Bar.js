import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    StatusBar
} from 'react-native';

import { StatusBarHeight } from '../utils/Device';

export default class Bar extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            
        };
    }

    static propTypes = {
        color: PropTypes.string
    }

    static defaultProps = {
        color: 'white'
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.color != this.props.color;
    }

    render() {
        return (
            <View style={[styles.statusBar, {backgroundColor: this.props.color}]}>
                <StatusBar
                    animated={false}
                    hidden={false}
                    backgroundColor={this.props.color}
                    translucent={true}
                    barStyle={this.props.color === 'white' ? 'dark-content' : 'light-content'}>
                </StatusBar>
            </View> 
        )
    }
}

const styles = StyleSheet.create({
    statusBar: {
        backgroundColor: 'white',
        height: StatusBarHeight
    }
})
