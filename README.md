# Frica Learn Frontend

A comprehensive educational platform frontend built with React, TypeScript, and Vite. Frica Learn provides an integrated learning management system with support for students, tutors, parents, and administrators.

## 📋 Overview

Frica Learn Frontend is a full-featured web application that powers an online learning platform. It supports multiple user roles with tailored dashboards and functionality for each:

- **Students**: Access courses, complete lessons, take quizzes, participate in live classes, and earn rewards
- **Tutors**: Manage courses and lessons, track student progress, and conduct live classes
- **Parents**: Monitor children's progress, manage enrollments, and make payments
- **Administrators**: Manage users, courses, payments, analytics, and system settings

## ✨ Features

### Core Learning
- **Course Management**: Browse, enroll in, and complete courses
- **Interactive Lessons**: Video player with lesson content and resources
- **Quizzes**: Take assessments with real-time feedback and scoring
- **Leaderboard**: Compete and track standings with other students
- **Progress Tracking**: Detailed analytics on learning progress

### Live Learning
- **Live Classes**: Real-time video conferencing using Jitsi integration
- **Live Class Scheduling**: View and manage scheduled live sessions
- **Class Management**: Administrators can schedule and manage live classes

### Advanced Features
- **Pronunciation Trainer**: Audio-based pronunciation practice and feedback
- **Rewards System**: Earn and redeem rewards from the marketplace
- **Chat**: Student-tutor communication with messaging
- **Payment Integration**: Secure payment processing for course enrollment
- **Email Verification**: Email-based account verification and password recovery

### Admin Dashboard
- **User Management**: Manage student, tutor, and parent accounts
- **Content Management**: Create and edit courses and lessons
- **Analytics**: Track platform usage and student performance
- **Payment Verification**: Monitor and verify payment transactions
- **Redemptions**: Manage student reward redemptions
- **Master Schedule**: Central scheduling for all live classes

### Parent Portal
- **Child Progress**: Monitor children's learning progress and analytics
- **Course Enrollment**: Manage course enrollments for children
- **Payment Management**: Handle payments for course enrollment
- **Messaging**: Communicate with tutors about child's progress

## 🛠 Tech Stack

- **Frontend Framework**: React 19.2
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 8.0
- **Styling**: Tailwind CSS 4.2
- **State Management**: TanStack Query 5.90
- **Routing**: React Router DOM 7.13
- **HTTP Client**: Axios 1.13
- **Video Conferencing**: Jitsi React SDK 1.4
- **Animations**: Framer Motion 12.38
- **Icons**: Lucide React & React Icons
- **UI Utilities**: Canvas Confetti, Date-fns

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frica-learn-frontend

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 📁 Project Structure

```
src/
├── api/              # API integration (Axios configuration)
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable React components
│   ├── LiveClass/    # Live class components
│   ├── Onboarding/   # User onboarding components
│   └── Parent/       # Parent-specific components
├── hooks/            # Custom React hooks
├── pages/            # Page components
│   ├── admin/        # Admin dashboard pages
│   ├── parent/       # Parent portal pages
│   ├── student/      # Student pages
│   └── LandingPage/  # Landing page components
├── App.tsx           # Root application component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

### Key Pages & Components

**Student Pages**:
- `Dashboard.tsx` - Student home and course overview
- `Courses.tsx` - Course catalog and browsing
- `CourseDetail.tsx` - Individual course information
- `LessonPlayer.tsx` - Video lesson playback
- `StudentQuiz.tsx` - Quiz interface
- `Leaderboard.tsx` - Leaderboard view
- `StudentAnalytics.tsx` - Student performance metrics

**Admin Pages**:
- `AdminDashboard.tsx` - Admin home
- `AdminCourseList.tsx` - Course management
- `AdminAddLesson.tsx` / `AdminEditLesson.tsx` - Lesson creation/editing
- `AdminUsers.tsx` - User management
- `AdminAnalytics.tsx` - Platform analytics
- `AdminPayments.tsx` - Payment management

**Parent Pages**:
- `ParentDashboard.tsx` - Parent home
- `ParentProgressView.tsx` - Child progress monitoring
- `ParentPortal.tsx` - Parent portal interface
- `PaymentPage.tsx` - Payment handling

**Authentication**:
- `Login.tsx` - User login
- `Register.tsx` - User registration
- `ForgotPassword.tsx` - Password recovery
- `ResetPassword.tsx` - Password reset
- `VerifyEmailHandler.tsx` - Email verification

**Other**:
- `LiveRoom.tsx` - Live class room
- `LandingPage/` - Public landing page with marketing content

## 🔌 API Integration

The application communicates with a backend API via Axios. Configuration is located in `src/api/axios.ts`.

### Key Features:
- Centralized HTTP client configuration
- Automatic request/response interceptors
- Error handling and status code management

## 🎨 Styling

The project uses **Tailwind CSS** for styling with PostCSS for processing. Configuration files:
- `tailwind.config.js` - Tailwind customization
- `postcss.config.js` - PostCSS configuration

## 🔐 Authentication

Authentication is managed through:
- Login/Register flow with JWT tokens (assumed backend)
- Email verification process
- Password recovery via email
- Custom `useAuth` hook for authentication state management

## 📱 Responsive Design

The application is fully responsive and works across:
- Desktop browsers
- Tablets
- Mobile devices

Built with mobile-first Tailwind CSS utilities.

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This generates an optimized production build in the `dist/` directory.

### Environment Configuration

Create a `.env` file in the root directory for environment-specific configuration:

```
VITE_API_URL=https://api.example.com
```

Refer to Vite's documentation for more environment configuration options.

## 🤝 Contributing

When contributing to this project:

1. Follow the existing code structure and naming conventions
2. Use TypeScript for type safety
3. Keep components focused and reusable
4. Write clear commit messages
5. Run linting before submitting changes:
   ```bash
   npm run lint
   ```

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

Ensure TypeScript compilation is correct:
```bash
npx tsc --noEmit
```

## 📄 License

[Add your license information here]

## 📞 Support

For issues and questions, please refer to the project's issue tracker or contact the development team.
