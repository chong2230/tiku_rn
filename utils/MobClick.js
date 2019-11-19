import { 
	NativeModules
} from 'react-native';

const { LKMobClickBridgeModule } = NativeModules;

// 设置用户id
export const setUserId = (userId) => {
	LKMobClickBridgeModule && LKMobClickBridgeModule.setUserId(userId);
}

// 统计事件
export const onEvent = (eventId, attributes = { label: '', label2: '' }) => {
	LKMobClickBridgeModule && LKMobClickBridgeModule.event(eventId, attributes);
}