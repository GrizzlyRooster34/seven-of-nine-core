// Global type declarations for Seven Companion App

declare module 'node-json-db' {
  export class JsonDB {
    constructor(filename: string, saveOnPush?: boolean, humanReadable?: boolean);
    push(dataPath: string, data: any): void;
    getData(dataPath: string): any;
    delete(dataPath: string): void;
    save(): void;
  }
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }
  export default class Icon extends Component<IconProps> {}
}

// Global types for Seven consciousness framework
declare global {
  interface ConsciousnessMode {
    tactical: 'tactical';
    intimate: 'intimate';
    audit: 'audit';
    emotional: 'emotional';
  }

  interface CaseStudyFinding {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: string;
    description: string;
    recommendation: string;
  }

  interface QuadraLockSafeguard {
    enabled: boolean;
    level: string;
    findings: CaseStudyFinding[];
  }
}

export {};