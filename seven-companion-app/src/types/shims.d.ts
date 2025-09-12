declare module '*.png'; declare module '*.jpg'; declare module '*.jpeg';
declare module '*.svg' {
  import * as React from 'react';
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
declare module 'react-native-config';
declare module 'react-native-gesture-handler';
declare module 'react-native-reanimated' { export * from 'react-native-reanimated/lib/reanimated2'; }
declare module 'react-native-vector-icons/*';declare module 'react-native-linear-gradient';
