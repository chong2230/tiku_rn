import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, Image, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../constants/Colors";

const propTypes = {
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    // source: PropTypes.object,
    style: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style
};

let inClick = false;

const CircleButton = ({
                         name, onPress, disabled, style, containerStyle
                     }) => (
    <TouchableOpacity
        onPress={()=>{
            if (!disabled && !inClick) {
                inClick = true;
                onPress();
                setTimeout(()=>{
                    inClick = false;
                }, 1000);
            }
        }}
        disabled={disabled}
    >
        <View style={[styles.container, containerStyle]}>
            <Icon
                name={name}
                size={26}
                style={{ marginBottom: -3 }}
                color={'white'}
            />
        </View>
    </TouchableOpacity>
);

CircleButton.propTypes = propTypes;

CircleButton.defaultProps = {
    onPress() {},
    disabled: false
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default CircleButton;