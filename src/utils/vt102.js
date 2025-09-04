import { SerialPort } from 'serialport';

class VT102Terminal {
  constructor(portPath = null, baudRate = 9600) {
    this.port = null;
    this.portPath = portPath;
    this.baudRate = baudRate;
    this.isSerial = !!portPath;
    
    if (this.isSerial && portPath) {
      this.initSerial();
    }
  }

  initSerial() {
    try {
      this.port = new SerialPort({
        path: this.portPath,
        baudRate: this.baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        rtscts: false,
        xon: true,
        xoff: true
      });

      this.port.on('error', (err) => {
        console.error('Serial port error:', err);
        this.isSerial = false;
      });
    } catch (err) {
      console.error('Failed to initialize serial port:', err);
      this.isSerial = false;
    }
  }

  write(data) {
    if (this.isSerial && this.port && this.port.isOpen) {
      this.port.write(data);
    } else {
      process.stdout.write(data);
    }
  }

  clear() {
    this.write('\x1b[2J');
    this.write('\x1b[H');
  }

  setCursor(row, col) {
    this.write(`\x1b[${row};${col}H`);
  }

  hideCursor() {
    this.write('\x1b[?25l');
  }

  showCursor() {
    this.write('\x1b[?25h');
  }

  setColor(foreground = 37, background = 40) {
    this.write(`\x1b[${foreground};${background}m`);
  }

  resetColors() {
    this.write('\x1b[0m');
  }

  bold() {
    this.write('\x1b[1m');
  }

  dim() {
    this.write('\x1b[2m');
  }

  blink() {
    this.write('\x1b[5m');
  }

  reverse() {
    this.write('\x1b[7m');
  }

  drawBox(x, y, width, height, double = false) {
    const chars = double ? {
      tl: '╔', tr: '╗', bl: '╚', br: '╝',
      h: '═', v: '║'
    } : {
      tl: '┌', tr: '┐', bl: '└', br: '┘',
      h: '─', v: '│'
    };

    this.setCursor(y, x);
    this.write(chars.tl + chars.h.repeat(width - 2) + chars.tr);
    
    for (let i = 1; i < height - 1; i++) {
      this.setCursor(y + i, x);
      this.write(chars.v);
      this.setCursor(y + i, x + width - 1);
      this.write(chars.v);
    }
    
    this.setCursor(y + height - 1, x);
    this.write(chars.bl + chars.h.repeat(width - 2) + chars.br);
  }

  centerText(text, row, width = 80) {
    const padding = Math.floor((width - text.length) / 2);
    this.setCursor(row, padding);
    this.write(text);
  }

  typewriter(text, row, col, delay = 50) {
    return new Promise((resolve) => {
      let i = 0;
      this.setCursor(row, col);
      const interval = setInterval(() => {
        if (i < text.length) {
          this.write(text[i]);
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  }

  async readKey() {
    return new Promise((resolve) => {
      if (this.isSerial && this.port) {
        this.port.once('data', (data) => {
          resolve(data.toString());
        });
      } else {
        process.stdin.once('data', (data) => {
          resolve(data.toString());
        });
      }
    });
  }

  enableRawMode() {
    if (!this.isSerial) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
    }
  }

  disableRawMode() {
    if (!this.isSerial) {
      process.stdin.setRawMode(false);
    }
  }
}

export default VT102Terminal;