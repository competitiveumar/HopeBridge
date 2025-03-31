# HopeBridge - Connecting Donors with Causes Worldwide

HopeBridge is a crowdfunding platform that connects donors with nonprofits and causes worldwide. The platform enables users to discover, donate to, and track the impact of various charitable projects across the globe.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Testing](#testing)
- [Test Accounts](#test-accounts)
- [Gift Card Codes](#gift-card-codes)
- [Voice Commands](#voice-commands)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure login and registration with social login options
- **Campaign Discovery**: Browse, search, and filter campaigns by category, location, and more
- **Donation Processing**: Secure payment processing with Stripe/PayPal integration
- **User Dashboard**: Track donations, saved campaigns, and personal information
- **Campaign Management**: For nonprofits to create and manage fundraising campaigns
- **Impact Tracking**: Real-time updates on campaign progress and impact
- **Responsive Design**: Fully responsive UI that works on all devices
- **Gift Cards**: Purchase and redeem gift cards for charitable donations
- **Accessibility**: Enhanced accessibility features with react-axe and react-aria
- **Voice Commands**: Navigate the application using voice commands

## Technology Stack

### Frontend
- React.js
- Material-UI
- Redux for state management
- React Router for navigation
- Jest and React Testing Library for testing
- i18next for internationalization
- Firebase integration
- Socket.io for real-time features
- Recharts for data visualization

### Backend
- Django (Python) with Django REST Framework
- JWT for authentication
- PostgreSQL for database
- Redis for caching
- Celery for background tasks
- Channels and Daphne for WebSocket support
- Google Generative AI integration

### Infrastructure
- AWS S3 for file storage
- AWS EC2 for hosting
- Docker for containerization
- Nginx as a reverse proxy
- Let's Encrypt for SSL

### External Services
- Stripe for payment processing
- SendGrid for email notifications
- Google Maps API for location services
- Social login providers (Google, Facebook)

## Project Structure

```
hopebridge/
├── frontend/                # React frontend application
│   ├── public/              # Static files
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── tests/           # Frontend tests
│   │   └── App.js           # Main application component
│   └── package.json         # Frontend dependencies
├── backend/                 # Django backend application
│   ├── about/               # About page models and API
│   ├── accounts/            # User authentication and profiles
│   ├── campaigns/           # Campaign models and API
│   ├── donations/           # Donation processing
│   ├── core/                # Core functionality
│   ├── gift_cards/          # Gift card functionality
│   ├── events/              # Events management
│   ├── disasters/           # Disaster relief campaigns
│   ├── ai_chatbot/          # AI chatbot integration
│   └── hopebridge/          # Django project settings
├── docker/                  # Docker configuration
├── docs/                    # Documentation
└── README.md                # Project overview
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/competitiveumar/HopeBridge.git
   cd HopeBridge
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   
   # Install additional frontend dependencies
   npm install firebase socket.io-client --legacy-peer-deps
   npm install i18next react-i18next react-axe --legacy-peer-deps
   npm install i18next-http-backend i18next-browser-languagedetector --save
   npm install react-aria react-focus-on --save
   npm install --save-dev source-map-loader
   npm install @craco/craco --save-dev
   npm install mui-tel-input --legacy-peer-deps
   npm install react-helmet
   npm install react-helmet-async --legacy-peer-deps
   npm install recharts
   ```

3. Set up the backend:
   ```bash
   cd backend
   python -m venv .venv
   
   # On Windows:
   .venv\Scripts\Activate.ps1
   # On Unix/MacOS:
   source .venv/bin/activate
   
   pip install -r requirements.txt
   
   # Install additional backend dependencies
   pip install channels channels-redis daphne
   pip install psutil
   pip install google-generativeai
   ```

4. Set up environment variables:
   - Create a `.env` file in the backend directory based on `.env.example`
   - Create a `.env` file in the frontend directory based on `.env.example`

5. Initialize the database:
   ```bash
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py loaddata initial_data
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   .venv\Scripts\Activate.ps1  # On Windows
   # source .venv/bin/activate  # On Unix/MacOS
   python manage.py runserver
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/
   - Admin interface: http://localhost:8000/admin/

## Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
python manage.py test
```

## Test Accounts

### Donor Accounts
- Email: avabob@gmail.com
  Password: a1b2c3d4

- Email: johnsmith@gmail.com
  Password: a5b6v7f8&

### Volunteer Accounts
- Email: andrewjohnson@gmail.com
  Password: a1b2c3d4

- Email: susanevans@gmail.com
  Password: a1b2c3d4

## Gift Card Codes

The following gift card codes can be used for testing:

- **HOPE25**: £25 gift card
- **GIVE50**: £50 gift card
- **CARE75**: £75 gift card
- **HELP100**: £100 gift card

## Voice Commands

The application supports voice navigation. Use the following format:

```
"Go to [name of page or action]"
```

Examples:
- "Go to Home"
- "Go to Donations"
- "Go to About Us"
- "Go to My Account"

## API Documentation

API documentation is available at `/api/docs/` when the backend server is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Deployment

### Using Docker

1. Build the Docker images:
   ```bash
   docker-compose build
   ```

2. Start the containers:
   ```bash
   docker-compose up -d
   ```

3. Access the application at http://localhost

### Manual Deployment

Detailed instructions for deploying to various environments (AWS, Heroku, etc.) can be found in the `docs/deployment.md` file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Material-UI](https://mui.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Stripe](https://stripe.com/)
- [AWS](https://aws.amazon.com/)
- [i18next](https://www.i18next.com/)
- [Firebase](https://firebase.google.com/)
- [Socket.io](https://socket.io/)
- [Recharts](https://recharts.org/) 