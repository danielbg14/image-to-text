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
- **Dark Mode**: Light/dark color scheme with toggle and automatic preference detection
- **Production-Ready**: Clean architecture, proper error handling, and security measures

## 📋 Supported Formats

- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **Maximum File Size**: 10MB

## 🌍 Supported Languages (OCR)

By default the project ships with English and Bulgarian data. The backend scans its directory for all `*.traineddata` files and makes the codes available to the frontend. When running in Docker the build also downloads a couple additional packs (Spanish and French) so they are available automatically.

- **English** (eng)
- **Bulgarian** (bul)
- **Spanish** (spa) *(docker build will fetch this)*
- **French** (fra) *(docker build will fetch this)*

You can add any other language simply by placing the corresponding `.traineddata` file in the `backend` folder or in a `backend/languages` subfolder (the server will look in both locations). This keeps custom data organized. The Docker build also copies from `backend/languages` automatically.

A small helper script is included to make this easy:

```bash
# from project root
node backend/scripts/download-traineddata.js spa fra deu
# or via npm script inside backend
cd backend && npm run download-langs -- spa fra deu
```

This will save `spa.traineddata`, `fra.traineddata`, `deu.traineddata` etc. in `backend/`. After adding or removing files, restart the backend or rebuild the Docker image and reload the frontend; the checkbox list will automatically reflect the changes.


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
│   ├── scripts/                     # utility scripts (download traineddata, etc.)
│   │   └── download-traineddata.js  # helper to fetch language packs
│   ├── .env.example                 # Environment variables template
│   ├── .gitignore
│   └── package.json
│
└── README.md                        # This file
```

## 🚀 Quick Start

### Language Selection
Before uploading an image, choose one or more OCR languages in the upload panel. The frontend fetches a list of available languages from the backend and displays them as checkboxes; you can select any combination and the languages will be joined with `+` when sent to the server. The upload logic reads the current checkbox state directly from the DOM to avoid React state timing issues.

#### Auto‑detect mode
If you'd rather not pick a language, check the **Auto‑detect language** box above the list. When enabled the client sends `lang=auto`, prompting the server to analyze the image and guess the correct language automatically.

The detection strategy:
1. a quick OCR pass is performed across all available traineddata packs.
2. the resulting text (first ~2000 characters) is run through a language detector (`franc` – added as a dependency in the backend) limited to installed languages.
3. if franc returns a specific code, a full OCR pass is run with that single language for improved accuracy; otherwise the initial result is used.

The detected language is returned in `data.detected` and displayed under the results.


The backend automatically detects which `.traineddata` files it has access to and exposes them via the `/api/ocr/languages` endpoint. This makes it easy to add new languages later (see below).

### Theme Toggle
Once running, use the 🌙/☀️ button in the header to switch between light and dark modes. The choice is remembered in `localStorage` and defaults to your system preference.


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

The backend image now includes Spanish and French OCR data by default. It also exposes an endpoint (`GET /api/ocr/languages`) that returns all detected language codes and names; the frontend uses this to build the checkbox list.


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

**Request body:**
- `image` (file): JPEG or PNG image (max 10MB)
- `lang` (string, optional): OCR language code(s) to use (e.g. `eng`, `bul`, `eng+bul`). Special value `auto` triggers automatic language detection. Defaults to `eng+bul`.

**Response (Success):**
- `data.detected` (string|null): if auto-detection was used, this contains the language that was guessed.

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

- [X] Multi-language support
- [X] Language selection dropdown for OCR
- [X] Dark mode
- [ ] Batch Processing
- [ ] Multiple Export Formats
- [ ] Image Editing Tools

---

**Made with ❤️ for efficient text extraction from images**
