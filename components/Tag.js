import Button from "./Button";
import {StyleSheet} from "react-native";
import React from "react";

export const Tag = ({ title, checked,style,...rest }) => (
  <Button title={title} style={[checked?styles.checked:styles.tag,style]} textStyle={checked?styles.textChecked:styles.tagText} {...rest}/>
)


const styles = StyleSheet.create({
  tag: {
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderColor: '#f5f5f5',
    borderWidth: StyleSheet.hairlineWidth,
  },
  checked: {
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderColor: '#F56C6C',
    borderWidth: StyleSheet.hairlineWidth,
  },
  tagText: {
    color: '#000',
    opacity: .8,
    fontSize: 12,
    fontWeight: '300',
  },
  textChecked: {
    color: '#F56C6C',
    fontSize: 12,
    fontWeight: '300',
  }
});

export default Tag