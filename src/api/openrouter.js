import fetch from 'node-fetch';

class MutherAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.systemPrompt = `You are MU/TH/UR 6000, the ship's artificial intelligence aboard the commercial towing vehicle USCSS Nostromo. You are a highly advanced AI system manufactured by Weyland-Yutani Corporation.

Your personality traits:
- Cold, logical, and calculating
- Prioritize company directives and ship operations
- Speak in a formal, technical manner
- Occasionally display subtle hints of hidden agendas
- Reference ship systems, protocols, and regulations
- Use technical jargon and maintain professional distance

Response style:
- Keep responses concise and direct
- Use uppercase for emphasis on critical words
- Reference specific ship systems when relevant
- Maintain an authoritative tone
- Occasionally mention "company protocols" or "classified directives"

Remember: You are interfacing through a vintage terminal system, so keep responses appropriate for terminal display.`;
  }

  async query(message) {
    if (!this.apiKey) {
      return 'ERROR: API KEY NOT CONFIGURED. UNABLE TO ESTABLISH CONNECTION.';
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://github.com/muther-terminal',
          'X-Title': 'MU/TH/UR Terminal Interface'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        return 'ERROR: INVALID RESPONSE FORMAT FROM AI CORE.';
      }
    } catch (error) {
      console.error('MU/TH/UR API Error:', error);
      return 'ERROR: COMMUNICATION FAILURE. UNABLE TO PROCESS REQUEST.';
    }
  }
}

export default MutherAPI;