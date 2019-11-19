import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import Common from './utils/Common';
import LoadingView from './components/LoadingView';

class setup extends Component {
    constructor(props) {
        super(props);
        this._init();
    }

    _init() {
        if (!__DEV__) {
            Common.isHack = false;
            // Common.httpServer = 'https://riab.luokuang.com';
            global.console = {
                info: () => {},
                log: () => {},
                warn: () => {},
                error: () => {},
            };
            global.alert = () => {}
        } else {
            // Common.httpServer = 'https://testriab.luokuang.com';
        }
    }

    render() {
    	// const { componentName, args } = this.props;
    	// ModuleName.MODULE_NAME = componentName;
    	// ModuleName.ARGS = args;
        return (
            <View
                style={{
                    flex : 1,
                }}
            >
                <App />
                {<LoadingView
                    ref={(ref) => {
                        global.mLoadingComponentRef = ref;
                    }}
                />}
            </View>
        );
    }
}

AppRegistry.registerComponent(appName, () => setup);
