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

## Technology Stack

### Frontend
- React.js
- Material-UI
- Redux for state management
- React Router for navigation
- Jest and React Testing Library for testing

### Backend
- Django (Python) with Django REST Framework
- JWT for authentication
- PostgreSQL for database
- Redis for caching
- Celery for background tasks

### Infrastructure
- AWS S3 for file storage
- AWS EC2 for hosting
- Docker for containerization
- Nginx as a reverse proxy
- Let's Encrypt for SSL

### External Services
- Stripe/PayPal for payment processing
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
   git clone https://github.com/yourusername/hopebridge.git
   cd hopebridge
   ```

2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

3. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Create a `.env` file in the backend directory based on `.env.example`
   - Create a `.env` file in the frontend directory based on `.env.example`

5. Initialize the database:
   ```bash
   cd backend
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py loaddata initial_data
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
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