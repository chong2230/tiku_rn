import { StyleSheet, Text, View, TouchableOpacity, Platform} from "react-native"
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

class Topbar extends Component {

  static defaultProps = {
    leftClick: ()=>{},
    rightClick: ()=>{},
    hasBorder: true,
  };

  render() {
    return <View style={[styles.container,this.props.hasBorder?{borderBottomWidth:1}:{}]}>
      <TouchableOpacity onPress={this.props.leftClick} style={[styles.titleBtn,{marginLeft:-10}]}>
        {this.props.leftIcon && <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-'+this.props.leftIcon : 'md-'+this.props.leftIcon}
                                               size={this.props.leftIcon === 'close'?30:24} color={Colors.info} />}
        {this.props.leftText && <Text style={{ marginLeft:5,fontSize: 16,opacity:.8 }}>{this.props.leftText}</Text>}
      </TouchableOpacity>
      <View style={styles.title}>
        <Text style={styles.titleText}>{this.props.title}</Text>
      </View>
      <TouchableOpacity onPress={this.props.rightClick} style={[styles.titleBtn,{marginRight:10}]}>
        {this.props.rightIcon && <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-'+this.props.rightIcon : 'md-'+this.props.rightIcon}
                                                size={24} color={Colors.info} />}
        {this.props.rightText && <Text style={{ marginLeft:5,fontSize: 16,opacity:.8 }}>{this.props.rightText}</Text>}
      </TouchableOpacity>
    </View>
  }
}

const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    borderBottomColor: Colors.tabIconDefault,
    width: Layout.width,
    height: Layout.topBarHeight,
    justifyContent:'space-between',
    paddingHorizontal: 10,
    marginTop: Layout.statusBarHeight,
    shadowColor: Colors.tabIconDefault,
    shadowRadius: 1,
    shadowOpacity: .5,
    shadowOffset: {width:1,height:1},
  },
  titleBtn: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'flex-end',
    width:40,
  },
  title: {
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 18,
    opacity: .9
  },
});

export default Topbar
