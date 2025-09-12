import React from 'react';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

type IconName = string; // tighten later if desired
type Props = { name: IconName; size?: number; color?: string; style?: any; onPress?: () => void; };

const Icon: React.FC<Props> = ({ name, size = 20, color, style, onPress }) => {
  return <MCIcon name={name as any} size={size} color={color} style={style} onPress={onPress} />;
};
export default Icon;