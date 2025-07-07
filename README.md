# Local Chat - AI Chatbot

A local-first AI chatbot powered by MLC-AI Web-LLM. This project provides a complete chat experience that runs entirely in your browser, with no server costs and maximum privacy.

## Features

- 🤖 **Local AI Inference**: Uses MLC-AI Web-LLM to run AI models directly in your browser
- 💬 **Real-time Chat**: Stream responses from the AI model as they're generated
- 🔒 **Privacy First**: All data stays on your device - no server communication
- 📱 **PWA Support**: Install as a native app with offline capabilities
- 💾 **Persistent Storage**: Chat history saved locally using localStorage
- 🎨 **Modern UI**: Clean, responsive interface inspired by chat.webllm.ai

## Getting Started

### Prerequisites

- Node.js 18+ 
- Modern browser with WebAssembly support

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd local-chat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:9002](http://localhost:9002) in your browser

### Usage

1. **Initialize the Model**: Click "Initialize Model" to download and load the AI model (Llama 3.1 8B)
2. **Start Chatting**: Once the model is loaded, you can start sending messages
3. **Streaming Responses**: Watch as the AI responds in real-time
4. **Persistent History**: Your chat history is automatically saved and restored

## Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **AI Engine**: MLC-AI Web-LLM for local inference
- **Styling**: Tailwind CSS with ShadCN UI components
- **Storage**: localStorage for chat persistence
- **PWA**: Service Worker for offline caching

### Key Components

- `src/hooks/use-local-chat.ts`: Core AI chat logic
- `src/components/chat/`: Chat UI components
- `src/components/app-sidebar.tsx`: Navigation sidebar
- `public/sw.js`: Service Worker for PWA functionality

## Development

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── chat/           # Chat-specific components
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## Model Configuration

The default model is `Llama-3.1-8B-Instruct-q4f32_1-MLC`. You can change this in `src/hooks/use-local-chat.ts`:

```typescript
const MODEL_ID = 'Llama-3.1-8B-Instruct-q4f32_1-MLC'
```

Available models can be found in the [WebLLM documentation](https://github.com/mlc-ai/web-llm).

## Future Enhancements

### Phase 2 (Next)
- [ ] Multiple chat sessions
- [ ] IndexedDB for better storage
- [ ] Settings panel
- [ ] Model selection

### Phase 3 (Future)
- [ ] Cloud synchronization
- [ ] Premium features
- [ ] Team collaboration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 