import VT102Terminal from '../utils/vt102.js';

const bootSequence = [
  { text: 'WEYLAND-YUTANI SYSTEMS', delay: 100 },
  { text: 'MU/TH/UR 6000', delay: 150 },
  { text: 'SYSTEM VERSION 2.42', delay: 50 },
  { text: '', delay: 200 },
  { text: 'INITIALIZING...', delay: 100 },
  { text: '', delay: 500 },
  { text: '[OK] LOADING KERNEL MODULES', delay: 80 },
  { text: '[OK] MOUNTING FILE SYSTEMS', delay: 60 },
  { text: '[OK] INITIALIZING NETWORK INTERFACES', delay: 70 },
  { text: '[OK] STARTING SYSTEM SERVICES', delay: 90 },
  { text: '[OK] CHECKING CRYO CHAMBERS', delay: 120 },
  { text: '[OK] LIFE SUPPORT SYSTEMS ONLINE', delay: 80 },
  { text: '[OK] NAVIGATION SYSTEMS ONLINE', delay: 75 },
  { text: '[OK] COMMUNICATIONS ARRAY ONLINE', delay: 85 },
  { text: '', delay: 300 },
  { text: 'PERFORMING SYSTEM DIAGNOSTICS...', delay: 100 },
  { text: '  MAIN COMPUTER: OPERATIONAL', delay: 60 },
  { text: '  AUXILIARY SYSTEMS: OPERATIONAL', delay: 60 },
  { text: '  SHIP INTEGRITY: 98.7%', delay: 60 },
  { text: '  FUEL RESERVES: 74.2%', delay: 60 },
  { text: '', delay: 200 },
  { text: 'SECURITY CLEARANCE REQUIRED', delay: 150 },
  { text: 'ENTER AUTHORIZATION CODE: ****', delay: 100 },
  { text: '', delay: 500 },
  { text: 'ACCESS GRANTED', delay: 200 },
  { text: '', delay: 300 }
];

const mutherLogo = [
  '╔══════════════════════════════════════════════════════════════════════╗',
  '║                                                                      ║',
  '║     ███╗   ███╗██╗   ██╗    ██╗████████╗██╗  ██╗    ██╗██████╗     ║',
  '║     ████╗ ████║██║   ██║   ██╔╝╚══██╔══╝██║  ██║   ██╔╝██╔══██╗    ║',
  '║     ██╔████╔██║██║   ██║  ██╔╝    ██║   ███████║  ██╔╝ ██████╔╝    ║',
  '║     ██║╚██╔╝██║██║   ██║ ██╔╝     ██║   ██╔══██║ ██╔╝  ██╔══██╗    ║',
  '║     ██║ ╚═╝ ██║╚██████╔╝██╔╝      ██║   ██║  ██║██╔╝   ██║  ██║    ║',
  '║     ╚═╝     ╚═╝ ╚═════╝ ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝    ╚═╝  ╚═╝    ║',
  '║                                                                      ║',
  '║                         MODEL 6000 SERIES                           ║',
  '║                    ARTIFICIAL INTELLIGENCE SYSTEM                    ║',
  '║                                                                      ║',
  '╚══════════════════════════════════════════════════════════════════════╝'
];

async function runBootSequence(terminal) {
  terminal.clear();
  terminal.hideCursor();
  terminal.setColor(32);
  
  let row = 2;
  for (const line of bootSequence) {
    if (line.text) {
      await terminal.typewriter(line.text, row, 2, 15);
      row++;
    } else {
      row++;
    }
    await new Promise(resolve => setTimeout(resolve, line.delay));
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  terminal.clear();
  terminal.setColor(32);
  
  const startRow = 5;
  for (let i = 0; i < mutherLogo.length; i++) {
    terminal.centerText(mutherLogo[i], startRow + i);
  }
  
  terminal.blink();
  terminal.centerText('SYSTEM READY', startRow + mutherLogo.length + 2);
  terminal.resetColors();
  
  terminal.setColor(33);
  terminal.centerText('Press any key to continue...', startRow + mutherLogo.length + 4);
  terminal.resetColors();
  
  terminal.showCursor();
  await terminal.readKey();
}

export default runBootSequence;