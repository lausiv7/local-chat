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

## Supabase 인증 연동

- 이메일/비밀번호 기반 회원가입 및 로그인 지원
- 환경변수 설정 필요: `.env.local` 파일에 아래 항목 추가

```
NEXT_PUBLIC_SUPABASE_URL=https://iqgycwryfqtxpuhwapoy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxZ3ljd3J5ZnF0eHB1aHdhcG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NDEyMTQsImV4cCI6MjA2NzQxNzIxNH0.vr_9Yf3nM6U_XHR-DfV3MIuHzuoG3Kxn5pUVlsQE8dY
```
- Vercel 등 배포 환경에도 동일하게 환경변수 등록 필요
- 로그인/회원가입은 사이드바 하단에서만 가능합니다.
- 로그인하지 않아도 로컬 LLM 채팅 기능은 항상 사용 가능합니다.

## 인증(로그인) 방식

- 현재는 **구글 소셜 로그인(OAuth)**만 지원합니다.
- 로그인 버튼 클릭 시 구글 계정으로 인증 후, 자동으로 원래 웹앱으로 복귀합니다.
- 이메일/비밀번호 로그인은 추후 지원 예정입니다.

### 구글 OAuth 연동 방법
1. 구글 클라우드 콘솔에서 새 프로젝트 생성
2. OAuth 동의화면 설정 및 OAuth 2.0 Client ID/Secret 발급
3. Supabase Auth > Providers > Google에 Client ID/Secret 등록
4. 승인된 리디렉션 URI: `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback` 