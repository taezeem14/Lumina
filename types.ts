export enum ToolId {
  NONE = 'NONE',
  BG_REMOVE = 'BG_REMOVE',
  OBJECT_REMOVE = 'OBJECT_REMOVE',
  FACE_ENHANCE = 'FACE_ENHANCE',
  UPSCALE = 'UPSCALE',
  CARTOONIFY = 'CARTOONIFY',
  COLOR_CORRECT = 'COLOR_CORRECT',
  RESTORE_OLD = 'RESTORE_OLD',
  STYLE_TRANSFER = 'STYLE_TRANSFER',
}

export interface ToolConfig {
  id: ToolId;
  label: string;
  icon: string;
  description: string;
  promptTemplate: string;
  requiresInput?: boolean; // If the user needs to type something (e.g., what object to remove)
}

export interface HistoryItem {
  id: string;
  imageData: string; // Base64
  action: string;
  timestamp: number;
}

export interface SystemStats {
  gpuLoad: number;
  memoryUsage: number;
  requests: number;
  latency: number;
}