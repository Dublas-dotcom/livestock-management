# VaxWise - Livestock Vaccination Management System

VaxWise is a comprehensive livestock vaccination management application designed to help farmers and veterinarians track, schedule, and manage animal vaccinations efficiently. The application provides features for vaccination scheduling, health record tracking, and automated notifications.

## Features

### Core Features
- Custom vaccination scheduling per herd/animal
- Push notification and SMS reminders
- Vaccination history and health record tracking
- Visual analytics and compliance reports
- Integration with local vet contacts
- Offline-first operation with data synchronization
- Multi-language support (English, Afrikaans, isiZulu)
- Tiered subscription levels (Freemium to Premium)

### Technical Features
- RESTful API architecture
- JWT authentication
- Role-based access control
- Real-time notifications
- Data synchronization
- Multi-language support
- Responsive design
- Offline capabilities

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Twilio (SMS notifications)
- Socket.IO (real-time features)

### Frontend (Coming Soon)
- React.js
- Redux
- Material-UI
- PWA capabilities
- Offline storage
- i18next (internationalization)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Twilio account (for SMS notifications)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vaxwise.git
cd vaxwise
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vaxwise
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Start the development server:
```bash
npm run dev
```

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- PUT /api/auth/updatedetails - Update user details
- PUT /api/auth/updatepassword - Update password

### Animals
- GET /api/animals - Get all animals
- POST /api/animals - Create new animal
- GET /api/animals/:id - Get single animal
- PUT /api/animals/:id - Update animal
- DELETE /api/animals/:id - Delete animal

### Vaccinations
- POST /api/animals/:id/vaccinations - Add vaccination record
- PUT /api/animals/:id/vaccinations/:vaccinationId - Update vaccination
- DELETE /api/animals/:id/vaccinations/:vaccinationId - Delete vaccination

### Notifications
- GET /api/notifications - Get all notifications
- POST /api/notifications - Create notification
- GET /api/notifications/:id - Get single notification
- PUT /api/notifications/:id/read - Mark as read
- DELETE /api/notifications/:id - Delete notification

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@vaxwise.com or join our Slack channel.

## Acknowledgments

- Thanks to all contributors
- Special thanks to the farming community for their valuable feedback
- Inspired by the need for better livestock management tools 