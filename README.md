# OpenMART

OpenMART is an AI-powered social commerce platform that connects buyers with products from Instagram vendors.

## Features

- 🚀 **Simple Onboarding**: Quick login with Email or Instagram
- 🔍 **Smart Product Search**: AI-powered product discovery
- 📱 **Instagram Integration**: Direct access to Instagram products
- 💡 **AI Analysis**: DeepSeek-powered product understanding
- 🎯 **Trending Products**: Featured products section
- 🌙 **Dark Mode**: Full dark mode support
- 📱 **Responsive**: Works on all devices

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn UI

### Backend
- FastAPI
- PostgreSQL
- ChromaDB
- OpenRouter (DeepSeek AI)
- Instagram API

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- Instagram Developer Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/openmart.git
cd openmart
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Unix or MacOS:
source venv/bin/activate

pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Create environment variables:
Create a `.env` file in the root directory with:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/openmart

# OpenRouter API
OPENROUTER_API_KEY=your_api_key

# Instagram Credentials
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

5. Start the development servers:

Backend:
```bash
cd backend
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
openmart/
├── frontend/            # Next.js frontend
│   ├── app/            # App router pages
│   ├── components/     # React components
│   └── lib/           # Utilities and configs
├── backend/            # FastAPI backend
│   ├── app/           # Main application
│   │   ├── api/       # API routes
│   │   ├── core/      # Core configurations
│   │   └── services/  # Business logic
│   └── requirements.txt
└── docs/              # Documentation
```

## Authentication Flow

1. User visits site → redirected to `/auth`
2. User chooses login method (Email/Instagram)
3. Redirected to `/dashboard`
4. User connects Instagram account
5. Redirected to main page

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Style
- Backend: Black formatter, isort for imports
- Frontend: Prettier, ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenRouter for AI capabilities
- Instagram for product data
- All contributors and supporters
