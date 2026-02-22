# IMG to TXT - Image to Text OCR Application

A modern, production-ready web application for extracting text from images using advanced Optical Character Recognition (OCR) technology.

## 🎯 Features

- **Drag & Drop Upload**: Intuitive drag-and-drop interface for image uploads
- **Image Preview**: See your uploaded image before processing
- **Advanced OCR**: Server-side Tesseract.js for accurate text extraction
- **Editable Results**: Edit extracted text directly in the textarea
- **Copy & Download**: Easily copy text or download as .txt file
- **Loading Indicator**: Visual feedback during OCR processing
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Production-Ready**: Clean architecture, proper error handling, and security measures

## 📋 Supported Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **Maximum File Size**: 10MB

## 🌍 Supported Languages (OCR)

- **English** (eng)
- **Bulgarian** (bul)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Modern JavaScript (ES6+)** - Latest JavaScript features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Tesseract.js 5** - Server-side OCR engine
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

## 📦 Project Structure

```
IMGtoTXT/
├── backend/
│   ├── src/
│   │   ├── config.js           # Configuration management
│   │   ├── server.js           # Express server setup
│   │   ├── middleware/
│   │   │   ├── fileUpload.js   # Multer configuration
│   │   │   └── errorHandler.js # Error handling middleware
│   │   ├── routes/
│   │   │   └── ocr.js          # OCR endpoints
│   │   └── utils/
│   │       └── ocr.js          # Tesseract.js wrapper
│   ├── uploads/                # Temporary upload directory
│   ├── .env.example            # Environment variables template
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUploader.jsx    # Drag & drop upload
│   │   │   ├── TextDisplay.jsx      # Text editor
│   │   │   └── LoadingSpinner.jsx   # Loading indicator
│   │   ├── api/
│   │   │   └── ocr.js              # API client
│   │   ├── App.jsx                  # Main component
│   │   ├── App.css
│   │   ├── main.jsx                 # React entry point
│   │   └── index.html               # HTML template
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── vite.config.js               # Vite configuration
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore
│   └── package.json
│
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 16+** (download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js)

### Installation & Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev

# Or run directly
npm start
```

The backend will run on `http://localhost:5000`

**Backend environment variables** (`.env`):
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MAX_FILE_SIZE=10485760
```

#### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

**Frontend environment variables** (`.env`):
```
VITE_API_URL=http://localhost:5000
```

#### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Alternative: Docker Setup

**Prerequisites:**
- **Docker** (download from [docker.com](https://www.docker.com/products/docker-desktop))
- **Docker Compose** (included with Docker Desktop)

**One-Command Setup:**

```bash
# Navigate to project root
cd IMGtoTXT

# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

The application will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`

**Stop Services:**
```bash
docker-compose down
```

**View Logs:**
```bash
docker-compose logs -f
```

## 📖 API Documentation

### Extract Text Endpoint

**POST** `/api/ocr/extract`

Extract text from an uploaded image.

**Request:**
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: 
  - `image` (file): JPEG or PNG image (max 10MB)

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "text": "Extracted text from image...",
    "confidence": 0.95,
    "fileName": "image.jpg"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Error Codes:**
- `400` - Invalid file format or file too large
- `422` - OCR processing failed
- `500` - Server error

### Health Check Endpoint

**GET** `/api/ocr/health`

Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2024-02-22T10:30:00.000Z"
}
```

## 🔧 Configuration

### Backend Configuration

**File**: `backend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `NODE_ENV` | development | Node environment |
| `CORS_ORIGIN` | http://localhost:5173 | Frontend origin for CORS |
| `MAX_FILE_SIZE` | 10485760 | Max file size in bytes (10MB) |

### Frontend Configuration

**File**: `frontend/.env`

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:5000 | Backend API URL |

## 📝 Usage Guide

### Extract Text from Image

1. **Upload Image**:
   - Drag and drop an image onto the upload area
   - Or click to browse and select an image
   - Supported formats: JPEG, PNG

2. **Processing**:
   - Wait for OCR to process (shows loading spinner)
   - Processing time depends on image size and complexity

3. **View Results**:
   - Image preview on the left
   - Extracted text on the right

4. **Edit & Export**:
   - Edit extracted text in the textarea
   - Click "Copy" to copy to clipboard
   - Click "Download Text" to save as .txt file

5. **Reset**:
   - Click "Reset" to start over with a new image

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
# Change PORT in .env or kill process on port 5000
```

### Frontend can't connect to backend
- Verify backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is properly configured

### OCR taking too long
- Larger images take longer to process
- Complex images with small text are slower
- Consider optimizing/resizing images before upload

### File upload fails
- Check file format (JPEG or PNG only)
- Verify file size is under 10MB
- Check browser console for error messages

## 🔒 Security Considerations

- ✅ File type validation (MIME type checking)
- ✅ File size limits (10MB max)
- ✅ CORS enabled only for frontend origin
- ✅ Files deleted after processing
- ✅ Input sanitization
- ✅ Error messages don't expose sensitive info
- ⚠️ For production: Use HTTPS, add rate limiting, implement authentication

## 📚 Dependencies

### Backend
- `express`: Web framework
- `multer`: File upload handling
- `tesseract.js`: OCR engine
- `cors`: Cross-origin support
- `dotenv`: Environment variables

### Frontend
- `react`: UI library
- `react-dom`: React DOM rendering
- `vite`: Build tool
- `tailwindcss`: CSS framework
- `autoprefixer`: CSS vendor prefixes

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 📄 License

MIT License - feel free to use this project for personal and commercial purposes.

## 💡 Future Enhancements

- [ ] Multi-language support
- [ ] Language selection dropdown for OCR
- [ ] Dark mode

---

**Made with ❤️ for efficient text extraction from images**
