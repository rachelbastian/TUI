import VT102Terminal from '../utils/vt102.js';
import MutherAPI from '../api/openrouter.js';

class MutherInterface {
  constructor(terminal, apiKey) {
    this.terminal = terminal;
    this.api = new MutherAPI(apiKey);
    this.history = [];
    this.currentInput = '';
    this.cursorPos = 0;
    this.running = true;
  }

  drawInterface() {
    this.terminal.clear();
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 1, 78, 3, true);
    this.terminal.bold();
    this.terminal.centerText('MU/TH/UR 6000 INTERFACE', 2);
    this.terminal.resetColors();
    
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 4, 78, 18, false);
    
    this.terminal.setCursor(5, 3);
    this.terminal.setColor(33);
    this.terminal.write('SECURE COMMUNICATION CHANNEL ESTABLISHED');
    this.terminal.setCursor(6, 3);
    this.terminal.write('TYPE YOUR QUERY AND PRESS ENTER. TYPE "EXIT" TO DISCONNECT.');
    this.terminal.resetColors();
    
    this.drawHistory();
    this.drawInputLine();
  }

  drawHistory() {
    let row = 8;
    const maxDisplay = 10;
    const startIdx = Math.max(0, this.history.length - maxDisplay);
    
    for (let i = startIdx; i < this.history.length && row < 20; i++) {
      const entry = this.history[i];
      this.terminal.setCursor(row, 3);
      
      if (entry.type === 'user') {
        this.terminal.setColor(36);
        this.terminal.write('> ');
        this.terminal.setColor(37);
      } else {
        this.terminal.setColor(32);
        this.terminal.write('# ');
      }
      
      const lines = this.wrapText(entry.text, 72);
      for (const line of lines) {
        if (row >= 20) break;
        this.terminal.setCursor(row, 5);
        this.terminal.write(line);
        row++;
      }
      
      this.terminal.resetColors();
    }
  }

  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  drawInputLine() {
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 21, 78, 3, false);
    this.terminal.setCursor(22, 3);
    this.terminal.setColor(36);
    this.terminal.write('> ');
    this.terminal.setColor(37);
    this.terminal.write(this.currentInput);
    this.terminal.setCursor(22, 5 + this.cursorPos);
    this.terminal.showCursor();
    this.terminal.resetColors();
  }

  clearInputArea() {
    this.terminal.setCursor(22, 5);
    this.terminal.write(' '.repeat(72));
  }

  async processInput() {
    const query = this.currentInput.trim();
    
    if (query.toLowerCase() === 'exit') {
      this.running = false;
      return;
    }
    
    if (query) {
      this.history.push({ type: 'user', text: query });
      
      this.terminal.hideCursor();
      this.terminal.setCursor(22, 3);
      this.terminal.setColor(33);
      this.terminal.write('PROCESSING QUERY...');
      this.terminal.resetColors();
      
      const response = await this.api.query(query);
      
      this.history.push({ type: 'muther', text: response });
      
      this.currentInput = '';
      this.cursorPos = 0;
      this.drawInterface();
    }
  }

  async run() {
    this.drawInterface();
    this.terminal.enableRawMode();
    
    while (this.running) {
      const key = await this.terminal.readKey();
      
      if (key === '\r' || key === '\n') {
        await this.processInput();
      } else if (key === '\x7f' || key === '\b') {
        if (this.cursorPos > 0) {
          this.currentInput = 
            this.currentInput.slice(0, this.cursorPos - 1) + 
            this.currentInput.slice(this.cursorPos);
          this.cursorPos--;
          this.clearInputArea();
          this.drawInputLine();
        }
      } else if (key === '\x1b[D') {
        if (this.cursorPos > 0) {
          this.cursorPos--;
          this.drawInputLine();
        }
      } else if (key === '\x1b[C') {
        if (this.cursorPos < this.currentInput.length) {
          this.cursorPos++;
          this.drawInputLine();
        }
      } else if (key === '\x1b' || key === '\x03') {
        this.running = false;
      } else if (key.length === 1 && key.charCodeAt(0) >= 32 && key.charCodeAt(0) < 127) {
        if (this.currentInput.length < 70) {
          this.currentInput = 
            this.currentInput.slice(0, this.cursorPos) + 
            key + 
            this.currentInput.slice(this.cursorPos);
          this.cursorPos++;
          this.clearInputArea();
          this.drawInputLine();
        }
      }
    }
    
    this.terminal.disableRawMode();
    this.terminal.showCursor();
    return 'menu';
  }
}

export default MutherInterface;