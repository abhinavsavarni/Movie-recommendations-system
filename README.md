# Movie Recommendation System

A full-stack movie recommendation system that uses machine learning to provide personalized movie suggestions to users. The system consists of three main components: a React frontend, a Node.js/TypeScript backend, and a Python-based ML model.

## 🎬 Features

- Personalized movie recommendations based on user preferences
- Modern and responsive user interface
- Real-time movie data fetching
- Machine learning-powered recommendation engine
- RESTful API architecture
- Voice search functionality for hands-free movie discovery
- AI-powered movie chatbot for interactive recommendations
- Movie trailers and streaming information
- Mood-based movie recommendations
- Advanced filtering and sorting options
- Dark/Light theme support

## 🏗️ Project Structure

```
movie-recommendation-system/
├── frontend/           # React frontend application
├── backend/           # Node.js/TypeScript backend server
└── ml_model/         # Python-based recommendation engine
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SaanviGupta2005/movie-recommendation-system.git
cd movie-recommendation-system
```

2. Install all dependencies:
```bash
npm run install-all
```

3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add necessary API keys and configuration variables

### Running the Application

To start both frontend and backend servers concurrently:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🛠️ Technology Stack

### Frontend
- React.js
- Modern JavaScript (ES6+)
- CSS/SCSS for styling

### Backend
- Node.js
- TypeScript
- Express.js
- RESTful API architecture

### Machine Learning
- Python
- scikit-learn
- pandas
- numpy

## 📦 Dependencies

### Frontend Dependencies
- React
- React Router
- Axios
- Other UI libraries

### Backend Dependencies
- Express
- TypeScript
- Node.js
- Various middleware packages

### ML Model Dependencies
- numpy >= 1.26.0
- pandas >= 2.1.0
- scikit-learn >= 1.3.0
- requests >= 2.31.0
- python-dotenv >= 1.0.0
- setuptools >= 69.0.0

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Saanvi Gupta - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the open-source community for their invaluable tools and libraries

### Environment Variables

Create separate `.env` files in the following directories:

1. Root Directory (`.env`):
```env
# API Keys
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here

# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/movie_recommendation

# Backend API Key
TMDB_API_KEY=your_tmdb_api_key_here
```

2. Frontend Directory (`frontend/.env`):
```env
# TMDB API Key for frontend requests
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here

# Backend API Key
TMDB_API_KEY=your_tmdb_api_key_here

# Voice Recognition Configuration
REACT_APP_VOICE_RECOGNITION_LANG=en-US
```

3. Backend Directory (`backend/.env`):
```env
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/movie_recommendation

# API Keys
TMDB_API_KEY=your_tmdb_api_key_here
DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id_here
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials.json
```

Note: 
- Replace `your_tmdb_api_key_here` with your actual TMDB API key
- Replace `your_dialogflow_project_id_here` with your Dialogflow project ID
- Replace `path_to_your_google_credentials.json` with the path to your Google Cloud credentials file
- The voice recognition feature uses the Web Speech API, which is built into modern browsers and doesn't require an external API key
- Never commit any `.env` files to version control
- Make sure to add `.env` to your `.gitignore` file 