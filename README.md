# MU/TH/ER 6000 Terminal Interface

A retro-futuristic terminal interface inspired by the Alien franchise, designed specifically for vintage VT-102 terminals via RS232 serial connection.

## Features

- **Authentic Boot Sequence**: Stylized ASCII boot animation with system checks
- **Main Menu System**: Navigate with arrow keys or number shortcuts
- **Ship Navigation**: Real-time ASCII-based navigation with starfield
- **MU/TH/ER AI Interface**: Chat with an AI playing the role of MU/TH/ER via OpenRouter API
- **System Status**: View ship diagnostics and systems
- **Crew Manifest**: Check crew status and assignments  
- **Ship Log**: Access mission logs and records
- **Emergency Protocols**: View emergency procedures

## Hardware Requirements

- Raspberry Pi (or any computer with serial port)
- DEC VT-102 Terminal (or compatible)
- RS232 serial cable
- Null modem adapter (if needed)

## Software Requirements

- Node.js 18+
- npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/muther-os.git
cd muther-os
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Edit `.env` file:
```env
# For Raspberry Pi serial port (example)
SERIAL_PORT=/dev/ttyUSB0
BAUD_RATE=9600

# Get your API key from https://openrouter.ai/keys
OPENROUTER_API_KEY=your_api_key_here
```

## Running the Application

### Standard Terminal Mode (Development)
```bash
npm start
```

### With VT-102 Terminal
1. Connect VT-102 to Raspberry Pi via RS232
2. Configure terminal settings:
   - Baud rate: 9600
   - Data bits: 8
   - Stop bits: 1
   - Parity: None
   - Flow control: XON/XOFF

3. Run the application:
```bash
npm start
```

## Controls

### Main Menu
- **↑/↓** or **j/k**: Navigate menu
- **1-6**: Quick select menu items
- **0**: Logout
- **Enter**: Confirm selection
- **ESC**: Exit

### Navigation
- **W/S**: Thrust forward/backward
- **A/D**: Turn left/right
- **Q**: Return to menu

### MU/TH/ER Interface
- Type queries and press Enter
- Type "EXIT" to disconnect
- Arrow keys to edit input

## Technical Details

### VT-102 Compatibility
- Uses ANSI escape sequences compatible with VT-102
- 80x24 character display
- Monochrome with limited color support
- Hardware cursor control
- Box drawing with ASCII/extended ASCII

### Serial Communication
- 9600 baud default (configurable)
- 8N1 configuration
- XON/XOFF flow control
- Full duplex communication

### Limitations
- Text-only interface
- Limited to VT-102 escape sequences
- Response time dependent on serial baud rate
- API calls require internet connection

## Troubleshooting

### Serial Port Issues
- Check port permissions: `sudo chmod 666 /dev/ttyUSB0`
- Verify port exists: `ls -la /dev/tty*`
- Try different port names: `/dev/ttyAMA0`, `/dev/serial0`

### Display Issues
- Ensure terminal is set to VT-102 mode
- Check baud rate matches configuration
- Verify cable connections (use null modem if needed)

### API Issues
- Verify OpenRouter API key is valid
- Check internet connection
- Monitor API usage limits

## License

MIT

## Acknowledgments

Inspired by the Alien franchise and the iconic MU/TH/UR 6000 interface.