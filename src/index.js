import dotenv from 'dotenv';
import VT102Terminal from './utils/vt102.js';
import runBootSequence from './screens/boot.js';
import MainMenu from './screens/menu.js';
import Navigation from './screens/navigation.js';
import MutherInterface from './screens/muther.js';

dotenv.config();

class MutherOS {
  constructor() {
    const serialPort = process.env.SERIAL_PORT || null;
    const baudRate = parseInt(process.env.BAUD_RATE) || 9600;
    
    this.terminal = new VT102Terminal(serialPort, baudRate);
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.currentScreen = 'boot';
    this.running = true;
    
    if (serialPort) {
      console.log(`Initializing serial connection on ${serialPort} at ${baudRate} baud...`);
    } else {
      console.log('Running in standard terminal mode...');
    }
  }

  async showSystemStatus() {
    this.terminal.clear();
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 1, 78, 22, true);
    
    this.terminal.bold();
    this.terminal.centerText('SYSTEM STATUS', 3);
    this.terminal.resetColors();
    
    const statusItems = [
      'MAIN COMPUTER: OPERATIONAL',
      'LIFE SUPPORT: OPTIMAL - O2 LEVELS 21.3%',
      'HULL INTEGRITY: 98.7%',
      'REACTOR CORE: STABLE - OUTPUT 87%',
      'NAVIGATION: ONLINE',
      'COMMUNICATIONS: ONLINE',
      'CRYO CHAMBERS: 4/7 OCCUPIED',
      'FUEL RESERVES: 74.2%',
      'WATER RESERVES: 81.5%',
      'FOOD SUPPLIES: ADEQUATE',
      '',
      'NO CRITICAL ALERTS',
      '',
      'NEXT SCHEDULED MAINTENANCE: 72 HOURS'
    ];
    
    let row = 5;
    for (const item of statusItems) {
      this.terminal.setCursor(row, 5);
      this.terminal.setColor(item.includes('CRITICAL') ? 31 : 32);
      this.terminal.write(item);
      row++;
    }
    
    this.terminal.setColor(33);
    this.terminal.centerText('Press any key to return to menu...', 21);
    this.terminal.resetColors();
    
    await this.terminal.readKey();
    return 'menu';
  }

  async showCrewManifest() {
    this.terminal.clear();
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 1, 78, 22, true);
    
    this.terminal.bold();
    this.terminal.centerText('CREW MANIFEST - USCSS NOSTROMO', 3);
    this.terminal.resetColors();
    
    const crew = [
      ['DALLAS', 'CAPTAIN', 'ACTIVE'],
      ['RIPLEY', 'WARRANT OFFICER', 'ACTIVE'],
      ['ASH', 'SCIENCE OFFICER', 'ACTIVE'],
      ['LAMBERT', 'NAVIGATOR', 'ACTIVE'],
      ['KANE', 'EXECUTIVE OFFICER', 'MEDICAL BAY'],
      ['PARKER', 'CHIEF ENGINEER', 'ACTIVE'],
      ['BRETT', 'ENGINEERING TECH', 'ACTIVE']
    ];
    
    this.terminal.setCursor(5, 5);
    this.terminal.setColor(33);
    this.terminal.write('NAME'.padEnd(20) + 'POSITION'.padEnd(25) + 'STATUS');
    this.terminal.setCursor(6, 5);
    this.terminal.write('-'.repeat(60));
    
    let row = 7;
    for (const [name, position, status] of crew) {
      this.terminal.setCursor(row, 5);
      this.terminal.setColor(37);
      this.terminal.write(name.padEnd(20));
      this.terminal.setColor(36);
      this.terminal.write(position.padEnd(25));
      this.terminal.setColor(status === 'ACTIVE' ? 32 : 33);
      this.terminal.write(status);
      row++;
    }
    
    this.terminal.setColor(33);
    this.terminal.centerText('Press any key to return to menu...', 21);
    this.terminal.resetColors();
    
    await this.terminal.readKey();
    return 'menu';
  }

  async showShipLog() {
    this.terminal.clear();
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 1, 78, 22, true);
    
    this.terminal.bold();
    this.terminal.centerText('SHIP LOG - RECENT ENTRIES', 3);
    this.terminal.resetColors();
    
    const logs = [
      'STARDATE 2122.06.12 - Departed Thedus with cargo',
      'STARDATE 2122.06.19 - Course correction completed',
      'STARDATE 2122.06.28 - Routine maintenance performed',
      'STARDATE 2122.07.03 - Intercepted unknown transmission',
      'STARDATE 2122.07.03 - Course diverted per Company directive',
      'STARDATE 2122.07.04 - Approaching signal source',
      'STARDATE 2122.07.04 - Landing sequence initiated',
      '',
      '[CLASSIFIED ENTRIES REQUIRE AUTHORIZATION]'
    ];
    
    let row = 5;
    for (const log of logs) {
      this.terminal.setCursor(row, 5);
      this.terminal.setColor(log.includes('CLASSIFIED') ? 31 : 32);
      this.terminal.write(log);
      row++;
    }
    
    this.terminal.setColor(33);
    this.terminal.centerText('Press any key to return to menu...', 21);
    this.terminal.resetColors();
    
    await this.terminal.readKey();
    return 'menu';
  }

  async showEmergency() {
    this.terminal.clear();
    this.terminal.setColor(31);
    this.terminal.drawBox(1, 1, 78, 22, true);
    
    this.terminal.bold();
    this.terminal.blink();
    this.terminal.centerText('EMERGENCY PROTOCOLS', 3);
    this.terminal.resetColors();
    
    const protocols = [
      '1. FIRE SUPPRESSION: Activate halon system',
      '2. HULL BREACH: Seal affected compartments',
      '3. REACTOR FAILURE: Initiate emergency shutdown',
      '4. LIFE SUPPORT FAILURE: Don emergency suits',
      '5. ALIEN CONTAMINATION: Quarantine protocols',
      '6. SELF-DESTRUCT: Authorization required',
      '',
      'EMERGENCY BEACON: INACTIVE',
      'ESCAPE PODS: 2/2 READY',
      '',
      'SPECIAL ORDER 937:',
      '[SCIENCE OFFICER EYES ONLY]'
    ];
    
    let row = 5;
    for (const protocol of protocols) {
      this.terminal.setCursor(row, 5);
      this.terminal.setColor(protocol.includes('SPECIAL') ? 31 : 33);
      this.terminal.write(protocol);
      row++;
    }
    
    this.terminal.setColor(33);
    this.terminal.centerText('Press any key to return to menu...', 21);
    this.terminal.resetColors();
    
    await this.terminal.readKey();
    return 'menu';
  }

  async run() {
    process.on('SIGINT', () => {
      this.terminal.clear();
      this.terminal.showCursor();
      this.terminal.disableRawMode();
      process.exit(0);
    });

    while (this.running) {
      try {
        switch (this.currentScreen) {
          case 'boot':
            await runBootSequence(this.terminal);
            this.currentScreen = 'menu';
            break;
            
          case 'menu':
            const menu = new MainMenu(this.terminal);
            const choice = await menu.show();
            
            switch (choice) {
              case 'nav':
                this.currentScreen = 'navigation';
                break;
              case 'muther':
                this.currentScreen = 'muther';
                break;
              case 'status':
                this.currentScreen = await this.showSystemStatus();
                break;
              case 'crew':
                this.currentScreen = await this.showCrewManifest();
                break;
              case 'log':
                this.currentScreen = await this.showShipLog();
                break;
              case 'emergency':
                this.currentScreen = await this.showEmergency();
                break;
              case 'exit':
                this.running = false;
                break;
            }
            break;
            
          case 'navigation':
            const nav = new Navigation(this.terminal);
            this.currentScreen = await nav.run();
            break;
            
          case 'muther':
            if (!this.apiKey) {
              this.terminal.clear();
              this.terminal.setColor(31);
              this.terminal.centerText('ERROR: OPENROUTER API KEY NOT CONFIGURED', 12);
              this.terminal.setColor(33);
              this.terminal.centerText('Set OPENROUTER_API_KEY in .env file', 14);
              this.terminal.centerText('Press any key to continue...', 16);
              this.terminal.resetColors();
              await this.terminal.readKey();
              this.currentScreen = 'menu';
            } else {
              const muther = new MutherInterface(this.terminal, this.apiKey);
              this.currentScreen = await muther.run();
            }
            break;
        }
      } catch (error) {
        console.error('Error in main loop:', error);
        this.terminal.clear();
        this.terminal.setColor(31);
        this.terminal.centerText('SYSTEM ERROR', 12);
        this.terminal.centerText(error.message, 14);
        this.terminal.resetColors();
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.currentScreen = 'menu';
      }
    }
    
    this.terminal.clear();
    this.terminal.setColor(32);
    this.terminal.centerText('SESSION TERMINATED', 12);
    this.terminal.centerText('WEYLAND-YUTANI CORPORATION', 14);
    this.terminal.resetColors();
    this.terminal.showCursor();
    this.terminal.setCursor(24, 1);
    
    if (this.terminal.port) {
      this.terminal.port.close();
    }
    
    process.exit(0);
  }
}

const app = new MutherOS();
app.run().catch(console.error);