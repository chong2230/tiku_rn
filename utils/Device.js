import { 
    Platform,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

// iPhoneX / iPhoneXS
const X_XS_width = 375;
const X_XS_height = 812;
// iPhoneXR / iPhoneXSMax
const XR_XS_width = 414;
const XR_XS_height = 896;

function getDevice(w, h) {
	return Platform.OS === 'ios' && ( (height === h && width === w) 
	|| (height === w && width === h) );
}
const isIphoneX_XS = getDevice(X_XS_width, X_XS_height);

const isIphoneXR_XSMax = getDevice(XR_XS_width, XR_XS_height);
//异性全面屏
const isFullScreen = (isIphoneX_XS || isIphoneXR_XSMax);

const StatusBarHeight = isFullScreen ? 44 : 20;

const NavigationBarHeight = 44;

const TabbarHeight = isFullScreen ? (49 + 34) : 49;

const TabbarSafeBottomMargin = isFullScreen ? 34 : 0;

const StatusBarAndNavigationBarHeight = isFullScreen ? 88 : 64;

export { isIphoneX_XS, isIphoneXR_XSMax, isFullScreen, StatusBarHeight, NavigationBarHeight, 
	TabbarHeight, TabbarSafeBottomMargin, StatusBarAndNavigationBarHeight
}

