
export enum DiagnosticCategory {
  POWER = 'Power/Charging',
  DISPLAY = 'Display/No Video',
  BIOS = 'BIOS/Firmware',
  AUDIO = 'Audio/Speakers',
  STORAGE = 'Storage/Boot',
  NETWORKING = 'Networking/WiFi',
  THERMAL = 'Thermal/Cooling',
  GPU = 'GPU/Graphics Cards',
  SYSTEM_OS = 'General OS Errors',
  OS_WINDOWS = 'Windows OS Support',
  OS_MACOS = 'macOS/MacBook Support',
  OS_LINUX = 'Linux/Server Support',
  CREATIVE_SUITE = 'Adobe/Creative Apps',
  ENGINEERING_TOOLS = 'Engineering Software',
  PHONE_IOS = 'iPhone/iOS Support',
  PHONE_ANDROID = 'Android Support',
  PERIPHERALS = 'Printer & Scanner',
  SURVEILLANCE = 'CCTV & Security',
  MONITOR_TECH = 'Monitor & Display',
  SOFTWARE_SECURITY = 'Software Security & Licensing'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 image data
  timestamp: number;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface DiagnosticLog {
  id: string;
  issue: string;
  repairPath: string;
  complexity: number;
  solution2026: string;
  category: DiagnosticCategory;
  date: number;
  image?: string;
  rawResponse?: string;
}
