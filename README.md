# AI Study Buddy

AI Study Buddy is an intelligent learning companion application that helps students enhance their learning experience by leveraging AI to automatically generate quizzes and flashcards from uploaded study materials.

![AI Study Buddy](https://placeholder-for-your-app-screenshot.png)

## Features

### User Authentication

- **Registration:** Create a new account with username, email, password, and school information
- **Login:** Secure authentication using JWT tokens
- **User Profile:** Access your personal profile information

### Note Management

- **PDF Upload:** Upload PDF documents containing your study notes
- **Text Extraction:** Advanced OCR (Optical Character Recognition) using Google Cloud Vision to extract text from PDFs
- **Organized Storage:** All your notes are stored securely and accessible from your dashboard

### AI-Powered Learning Tools

- **Quiz Generation:** Automatically create multiple-choice quizzes from your uploaded notes
- **Flashcard Creation:** Generate study flashcards with questions, answers, and explanations
- **Various Difficulty Levels:** Content is created with different difficulty levels to match your learning needs

### Interactive Study Experience

- **Quiz Interface:** Take quizzes with immediate feedback and explanations
- **Flashcard Study:** Interactive flashcards with flip animation for effective studying
- **Progress Tracking:** Track your learning progress as you study

## Technical Architecture

### Frontend (React + TypeScript)

- **Modern UI:** Built with React 19 and TypeScript for a robust, type-safe application
- **Responsive Design:** Fully responsive design that works on mobile and desktop
- **Component Library:** Uses a custom component library based on shadcn/ui principles
- **State Management:** Context API for managing global state (user authentication, loading states)
- **Routing:** React Router for seamless navigation
- **API Integration:** Axios for API requests to the backend

### Backend (Node.js + Express)

- **API Server:** RESTful API built with Express.js
- **Authentication:** JWT-based authentication system
- **Database:** MongoDB for storing user data, notes, quizzes, and flashcards
- **AI Integration:**
  - OpenAI GPT models for generating educational content
  - Google Cloud Vision API for OCR text extraction
- **File Handling:** PDF processing and storage system

## Getting Started

### Prerequisites

- Node.js v16 or later
- MongoDB
- Google Cloud Vision API credentials
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-study-buddy.git
   cd ai-study-buddy
   ```
