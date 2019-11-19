import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
// import Login from '../screens/account/login';
// import NewsDetail from '../screens/news/NewsDetail';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
    // Login: {
    //     screen: Login
    // }, 
    // NewsDetail: {
    //     screen: NewsDetail
    // },
  })
);
