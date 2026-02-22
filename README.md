# Water Quality Monitoring System (WaterWatch)

A comprehensive real-time water quality monitoring platform that enables communities and authorities to track water safety, submit pollution reports, and receive contamination alerts.

## Features

### Core Functionality
- **Real-time Monitoring**: Government API integration for water station data
- **User Reports**: Citizens can submit pollution reports with images
- **Alert System**: Automated contamination and boil advisories
- **Historical Analysis**: Trends and analytics for water quality data
- **Role-based Access**: Different dashboards for citizens, NGOs, authorities, and admins
- **Map Integration**: Interactive maps showing stations, reports, and alerts

### Advanced Features
- **Image Upload**: Secure image validation and storage for reports
- **Audit Logging**: Complete audit trail for all administrative actions
- **Notification Subscriptions**: Users can subscribe to location-based alerts
- **Data Export**: CSV/JSON export for open data initiatives
- **Predictive Analytics**: Advanced analytics for water quality prediction

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **PostgreSQL**: Primary database (SQLite for development)
- **SQLAlchemy**: ORM for database operations
- **JWT**: Secure authentication with role-based access
- **Alembic**: Database migrations
- **Pillow**: Image processing
- **APScheduler**: Background job scheduling

### Frontend
- **React.js**: Modern JavaScript framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Leaflet**: Interactive maps
- **Recharts**: Data visualization
- **Axios**: HTTP client

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, defaults to SQLite)

### Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Water-Quality-Monitor-main
```

2. Set up virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run the application:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start development server:
```bash
npm start
```

## Database Schema

### Core Tables
- **Users**: Role-based user management (citizen, ngo, authority, admin)
- **Reports**: User-submitted pollution reports with images
- **WaterStations**: Monitoring stations with geographic data
- **StationReadings**: Water quality parameter measurements
- **Alerts**: Contamination alerts and boil advisories

### Supporting Tables
- **Collaborations**: NGO partnership projects
- **ReportImages**: Multiple images per report
- **NotificationSubscriptions**: User alert preferences
- **InAppNotifications**: Internal messaging system
- **AuditLogs**: Administrative action tracking

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `GET /users/me` - Get current user info

#### Reports
- `POST /reports` - Create new report
- `POST /reports/{id}/upload-image` - Upload report image
- `GET /reports` - List reports (with filters)
- `PATCH /reports/{id}/status` - Update report status (authority/admin)

#### Stations
- `GET /stations` - List monitoring stations
- `POST /stations` - Create station (authority/admin)
- `POST /stations/{id}/readings` - Add water quality reading
- `GET /stations/{id}/readings` - Get station readings

#### Alerts
- `GET /alerts` - List alerts (with filters)
- `POST /alerts` - Create alert (authority/admin)
- `GET /alerts/stats/summary` - Alert statistics

## User Roles

### Citizen
- Submit pollution reports
- View public water quality data
- Receive local alerts
- Manage profile

### NGO
- All citizen permissions
- Verify/reject reports
- Manage collaboration projects
- Access detailed analytics

### Authority
- All NGO permissions
- Manage water stations
- Create official alerts
- Full report moderation

### Admin
- All authority permissions
- User management
- System configuration
- Complete audit access

## Development

### Environment Variables

Key environment variables (see `.env.example`):
```
DATABASE_URL=sqlite:///./water_quality.db
SECRET_KEY=your_secret_key_here
ALLOWED_ORIGINS=["http://localhost:3000"]
```

### Database Migrations

For production deployments with PostgreSQL:
```bash
# Initialize migrations
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

### Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Deployment

### Production Considerations
1. Use PostgreSQL instead of SQLite
2. Set secure SECRET_KEY
3. Configure proper CORS origins
4. Set up file storage (S3/Cloudinary)
5. Configure email/SMS for notifications
6. Set up reverse proxy (nginx)
7. Enable HTTPS
8. Configure monitoring and logging

### Docker Deployment

```dockerfile
# Dockerfile example
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**WaterWatch** - Empowering communities with real-time water safety information
