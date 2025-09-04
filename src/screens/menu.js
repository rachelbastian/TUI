import VT102Terminal from '../utils/vt102.js';

const menuOptions = [
  { id: 'nav', label: '1. SHIP NAVIGATION', description: 'Access navigation and ship controls' },
  { id: 'muther', label: '2. INTERFACE WITH MU/TH/ER', description: 'Communicate with ship AI' },
  { id: 'status', label: '3. SYSTEM STATUS', description: 'View ship systems diagnostics' },
  { id: 'crew', label: '4. CREW MANIFEST', description: 'View crew status and assignments' },
  { id: 'log', label: '5. SHIP LOG', description: 'Access mission logs and records' },
  { id: 'emergency', label: '6. EMERGENCY PROTOCOLS', description: 'Emergency procedures' },
  { id: 'exit', label: '0. LOGOUT', description: 'Exit system' }
];

class MainMenu {
  constructor(terminal) {
    this.terminal = terminal;
    this.selectedIndex = 0;
  }

  drawHeader() {
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 1, 78, 5, true);
    this.terminal.bold();
    this.terminal.centerText('WEYLAND-YUTANI CORPORATION', 2);
    this.terminal.centerText('MU/TH/ER 6000 - MAIN INTERFACE', 3);
    this.terminal.centerText(`SESSION: ${new Date().toISOString().split('T')[0]}`, 4);
    this.terminal.resetColors();
  }

  drawMenu() {
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 7, 78, 15, false);
    
    this.terminal.bold();
    this.terminal.centerText('MAIN MENU', 8);
    this.terminal.resetColors();
    
    let row = 10;
    for (let i = 0; i < menuOptions.length; i++) {
      const option = menuOptions[i];
      this.terminal.setCursor(row, 5);
      
      if (i === this.selectedIndex) {
        this.terminal.reverse();
        this.terminal.setColor(32);
      } else {
        this.terminal.setColor(32);
      }
      
      this.terminal.write(option.label.padEnd(30));
      
      if (i === this.selectedIndex) {
        this.terminal.resetColors();
        this.terminal.setColor(33);
        this.terminal.setCursor(row, 40);
        this.terminal.write(option.description);
      }
      
      this.terminal.resetColors();
      row++;
    }
  }

  drawFooter() {
    this.terminal.setColor(33);
    this.terminal.setCursor(23, 2);
    this.terminal.write('Use ↑/↓ or number keys to select | ENTER to confirm | ESC to logout');
    this.terminal.resetColors();
  }

  async show() {
    this.terminal.clear();
    this.terminal.hideCursor();
    
    this.drawHeader();
    this.drawMenu();
    this.drawFooter();
    
    return await this.handleInput();
  }

  async handleInput() {
    this.terminal.enableRawMode();
    
    while (true) {
      const key = await this.terminal.readKey();
      
      if (key === '\x1b[A' || key === 'k') {
        this.selectedIndex = Math.max(0, this.selectedIndex - 1);
        this.drawMenu();
      } else if (key === '\x1b[B' || key === 'j') {
        this.selectedIndex = Math.min(menuOptions.length - 1, this.selectedIndex + 1);
        this.drawMenu();
      } else if (key >= '0' && key <= '6') {
        const num = parseInt(key);
        if (num === 0) {
          this.selectedIndex = menuOptions.length - 1;
        } else if (num <= menuOptions.length - 1) {
          this.selectedIndex = num - 1;
        }
        this.drawMenu();
      } else if (key === '\r' || key === '\n') {
        this.terminal.disableRawMode();
        this.terminal.showCursor();
        return menuOptions[this.selectedIndex].id;
      } else if (key === '\x1b' || key === 'q') {
        this.terminal.disableRawMode();
        this.terminal.showCursor();
        return 'exit';
      } else if (key === '\x03') {
        this.terminal.disableRawMode();
        this.terminal.showCursor();
        process.exit(0);
      }
    }
  }
}

export default MainMenu;