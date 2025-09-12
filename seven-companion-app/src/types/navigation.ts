import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
export type RootStackParamList = {
  Chat: undefined;
  Memory: { tag?: string } | undefined;
  Dashboard: undefined;
  Modes: undefined;
  Settings: undefined;
  Auth: undefined;
};
export type Nav<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};
