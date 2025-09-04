import VT102Terminal from '../utils/vt102.js';

class Navigation {
  constructor(terminal) {
    this.terminal = terminal;
    this.shipX = 40;
    this.shipY = 12;
    this.heading = 0;
    this.velocity = 0;
    this.maxVelocity = 10;
    this.stars = this.generateStars();
    this.running = true;
  }

  generateStars() {
    const stars = [];
    for (let i = 0; i < 30; i++) {
      stars.push({
        x: Math.floor(Math.random() * 60) + 10,
        y: Math.floor(Math.random() * 16) + 5,
        char: Math.random() > 0.7 ? '*' : '.'
      });
    }
    return stars;
  }

  drawShip() {
    const shipDesigns = [
      ['  ^  ', ' /|\\ ', '/_|_\\'],
      [' /\\  ', '/||\\', '/__\\'],
      ['  |> ', ' /|> ', '/_|>'],
      [' \\/ ', ' \\||/', ' \\__/'],
      ['  v  ', ' \\|/ ', '\\_|_/'],
      [' /\\ ', '\\||/', '__\\'],
      [' <|  ', ' <|\\ ', '<|_\\'],
      [' /\\  ', '/||\\', '/__\\']
    ];
    
    const design = shipDesigns[Math.floor(this.heading / 45)];
    
    for (let i = 0; i < design.length; i++) {
      this.terminal.setCursor(this.shipY + i - 1, this.shipX - 2);
      this.terminal.setColor(36);
      this.terminal.write(design[i]);
    }
    this.terminal.resetColors();
  }

  drawStarfield() {
    this.terminal.setColor(37);
    for (const star of this.stars) {
      this.terminal.setCursor(star.y, star.x);
      this.terminal.write(star.char);
    }
    this.terminal.resetColors();
  }

  updateStars() {
    if (this.velocity > 0) {
      for (const star of this.stars) {
        star.x -= Math.cos(this.heading * Math.PI / 180) * this.velocity * 0.1;
        star.y -= Math.sin(this.heading * Math.PI / 180) * this.velocity * 0.05;
        
        if (star.x < 10) star.x = 70;
        if (star.x > 70) star.x = 10;
        if (star.y < 5) star.y = 20;
        if (star.y > 20) star.y = 5;
      }
    }
  }

  drawHUD() {
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 1, 78, 3, false);
    this.terminal.bold();
    this.terminal.setCursor(2, 3);
    this.terminal.write('NAVIGATION CONTROL');
    this.terminal.resetColors();
    
    this.terminal.setColor(32);
    this.terminal.drawBox(1, 4, 78, 18, true);
    
    this.terminal.drawBox(1, 22, 78, 3, false);
    this.terminal.setCursor(23, 3);
    this.terminal.setColor(33);
    this.terminal.write(`HEADING: ${this.heading.toString().padStart(3, '0')}° | `);
    this.terminal.write(`VELOCITY: ${this.velocity.toFixed(1).padStart(4)} | `);
    this.terminal.write(`POSITION: X:${Math.floor(this.shipX)} Y:${Math.floor(this.shipY)} | `);
    this.terminal.write('[W/S] Thrust [A/D] Turn [Q] Exit');
    this.terminal.resetColors();
  }

  clearViewport() {
    for (let y = 5; y < 21; y++) {
      this.terminal.setCursor(y, 2);
      this.terminal.write(' '.repeat(76));
    }
  }

  async run() {
    this.terminal.clear();
    this.terminal.hideCursor();
    this.terminal.enableRawMode();
    
    const updateInterval = setInterval(() => {
      if (!this.running) {
        clearInterval(updateInterval);
        return;
      }
      
      this.updateStars();
      this.clearViewport();
      this.drawHUD();
      this.drawStarfield();
      this.drawShip();
      
      if (this.velocity > 0) {
        this.velocity = Math.max(0, this.velocity - 0.1);
      }
    }, 100);
    
    while (this.running) {
      const key = await this.terminal.readKey();
      
      if (key === 'w' || key === 'W') {
        this.velocity = Math.min(this.maxVelocity, this.velocity + 1);
      } else if (key === 's' || key === 'S') {
        this.velocity = Math.max(-this.maxVelocity / 2, this.velocity - 1);
      } else if (key === 'a' || key === 'A') {
        this.heading = (this.heading - 15) % 360;
        if (this.heading < 0) this.heading += 360;
      } else if (key === 'd' || key === 'D') {
        this.heading = (this.heading + 15) % 360;
      } else if (key === 'q' || key === 'Q' || key === '\x1b') {
        this.running = false;
        clearInterval(updateInterval);
        this.terminal.disableRawMode();
        this.terminal.showCursor();
        return 'menu';
      } else if (key === '\x03') {
        clearInterval(updateInterval);
        this.terminal.disableRawMode();
        this.terminal.showCursor();
        process.exit(0);
      }
    }
  }
}

export default Navigation;