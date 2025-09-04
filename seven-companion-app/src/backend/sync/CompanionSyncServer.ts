
/**
 * Companion Sync Server
 * WebSocket relay for multi-device session synchronization
 */

import WebSocket from 'ws';

export interface SyncMessage {
  type: 'session_update' | 'device_join' | 'device_leave';
  deviceId: string;
  sessionId?: string;
  data?: any;
  timestamp: Date;
}

export class CompanionSyncServer {
  private wss: WebSocket.Server;
  private devices: Map<string, WebSocket> = new Map();
  private sessions: Map<string, any> = new Map();

  constructor(port = 3001) {
    this.wss = new WebSocket.Server({ port });
    this.setupHandlers();
    console.log(`Sync server listening on port ${port}`);
  }

  private setupHandlers() {
    this.wss.on('connection', (ws, req) => {
      const deviceId = req.url?.split('deviceId=')[1] || 'unknown';
      this.devices.set(deviceId, ws);
      
      ws.on('message', (data) => {
        this.handleMessage(deviceId, data.toString());
      });
      
      ws.on('close', () => {
        this.devices.delete(deviceId);
      });
      
      this.broadcastToOthers(deviceId, {
        type: 'device_join',
        deviceId,
        timestamp: new Date()
      });
    });
  }

  private handleMessage(fromDevice: string, message: string) {
    try {
      const syncMessage: SyncMessage = JSON.parse(message);
      
      if (syncMessage.type === 'session_update') {
        this.sessions.set(syncMessage.sessionId!, syncMessage.data);
        this.broadcastToOthers(fromDevice, syncMessage);
      }
    } catch (error) {
      console.error('Invalid sync message:', error);
    }
  }

  private broadcastToOthers(excludeDevice: string, message: SyncMessage) {
    const messageStr = JSON.stringify(message);
    
    this.devices.forEach((ws, deviceId) => {
      if (deviceId !== excludeDevice && ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
      }
    });
  }
}
