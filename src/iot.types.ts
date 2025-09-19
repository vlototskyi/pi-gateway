// Common envelope for all device messages
export interface IoTBaseMessage {
  device_id: string; // e.g., "esp32-dht01", "esp32-sound01"
  ts: string; // ISO-8601 UTC, e.g. "2025-09-02T23:03:57Z"
  ts_epoch?: number; // Unix seconds (optional but recommended)
}

// DHT payload
export interface DhtMessage extends IoTBaseMessage {
  temperature: number; // °C
  humidity: number; // %RH
}

// Sound payload (current version with floor + avg/peak + window info)
export interface SoundMessage extends IoTBaseMessage {
  sound_floor: number; // RMS baseline (ADC units)
  sound_rms_avg: number; // window RMS
  sound_rms_peak: number; // max segment RMS
  sound_delta_avg: number; // avg - floor
  sound_delta_peak: number; // peak - floor
  sound_percent_avg: number; // 0..100
  sound_percent_peak: number; // 0..100
  win_ms: number; // window length (ms)
  seg_ms: number; // segment length (ms)
}

// Union of all supported messages
export type IoTMessage = DhtMessage | SoundMessage;

// Optional: topic-aware envelope if you want to forward topic + data together
export interface ForwardEnvelope<T extends IoTMessage = IoTMessage> {
  topic: string; // e.g. "esp32/sensors/dht" or "esp32/sensors/sound"
  data: T;
}
