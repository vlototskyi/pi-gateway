import { DhtMessage, IoTBaseMessage, SoundMessage } from './iot.types';

export function isIoTBaseMessage(m: any): m is IoTBaseMessage {
  return m && typeof m.device_id === 'string' && typeof m.ts === 'string';
}

export function isDhtMessage(m: any): m is DhtMessage {
  return (
    m && typeof m.temperature === 'number' && typeof m.humidity === 'number'
  );
}

export function isSoundMessage(m: any): m is SoundMessage {
  return (
    m &&
    typeof m.device_id === 'string' &&
    typeof m.ts === 'string' &&
    typeof m.sound_floor === 'number' &&
    typeof m.sound_rms_avg === 'number' &&
    typeof m.sound_rms_peak === 'number' &&
    typeof m.sound_delta_avg === 'number' &&
    typeof m.sound_delta_peak === 'number' &&
    typeof m.sound_percent_avg === 'number' &&
    typeof m.sound_percent_peak === 'number' &&
    typeof m.win_ms === 'number' &&
    typeof m.seg_ms === 'number'
  );
}
