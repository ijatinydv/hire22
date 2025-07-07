# Hire22.ai: AI-Powered Hiring Platform

## Project Overview
Hire22.ai is an innovative hiring platform that uses artificial intelligence to match employers with the perfect candidates in just 22 hours. The platform streamlines the hiring process, reduces friction, and optimizes conversions through a modern, user-friendly interface.

## Features

### For Employers
- **AI-Powered Matching**: Intelligent algorithms that find the best candidates based on skills, experience, and cultural fit
- **22-Hour Turnaround**: Get matched with qualified candidates in less than a day
- **Smart Screening**: Automated initial screening saves HR teams valuable time
- **Interactive Dashboard**: Monitor recruitment progress in real-time
- **Custom Hiring Forms**: Tailor application forms to specific job requirements

### For Candidates
- **Skill-Based Matching**: Get matched with jobs that align with your actual skills, not just keywords
- **Quick Application Process**: Apply to multiple positions with your stored profile
- **Career Development**: Receive AI-powered suggestions to improve your employability
- **Interview Preparation**: Get tailored tips for upcoming interviews

### General Features
- **Responsive Design**: Fully optimized for all devices (desktop, tablet, mobile)
- **Dark Mode**: Reduced eye strain with elegant dark theme option
- **Interactive UI Elements**: Engaging animations and micro-interactions
- **Accessibility**: WCAG-compliant design for all users
- **Secure Authentication**: Protected user data and login system

## Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome
- **Animations**: CSS animations and JavaScript transitions
- **Form Validation**: Custom form validation with real-time feedback
- **Authentication**: Custom authentication module with local storage
- **SVG Animations**: Interactive brain visualization representing AI matching

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### Installation
1. Clone the repository
   ```
   git clone https://github.com/yourusername/hire22.git
   ```
2. Navigate to the project directory
   ```
   cd hire22
   ```
3. Open the index.html file in your browser or set up a local server
   ```
   # Using Python
   python -m http.server
   
   # Using Node.js
   npx serve
   ```

### Demo Credentials
For testing purposes, you can use any of the following credentials:

**Employers:**
- Email: john@example.com / Password: Password123!
- Email: jane@example.com / Password: Password123!
- Email: employer@hire22.ai / Password: demo123

**Candidates:**
- Email: mike@example.com / Password: Password123!
- Email: candidate@hire22.ai / Password: demo123

## Project Structure
```
hire22/
├── assets/             # Images and SVG illustrations
├── css/                # Stylesheets
│   └── styles.css      # Main stylesheet
├── js/                 # JavaScript files
│   ├── auth.js         # Authentication module
│   ├── form-validation.js  # Form validation
│   └── script.js       # Main JavaScript file
├── index.html          # Homepage
├── login.html          # Login page
├── signup.html         # Signup page
└── README.md           # Project documentation
```

## Key Code Features

### Dark Mode Implementation
The site features a comprehensive dark mode that respects user preferences:
```javascript
// Check for saved theme preference or use device preference
const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Apply saved theme
htmlElement.setAttribute('data-theme', savedTheme);
```

### Interactive SVG Animations
The AI brain visualization uses dynamic SVG animations:
```javascript
// Animate neural connections
connections.forEach((connection, index) => {
    connection.style.strokeDasharray = connection.getTotalLength();
    connection.style.strokeDashoffset = connection.getTotalLength();
    connection.style.animation = `drawLine 1.5s ease forwards ${index * 0.1}s`;
});
```

### Real-time Form Validation
Forms include comprehensive validation with immediate feedback:
```javascript
function validateEmail(email, showMessage = false) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    // ...validation logic
}
```

## Submission Notes
This project was created as part of the internship project at Hire22.ai. It demonstrates:
- Modern UI/UX design principles
- Responsive web development
- Interactive user interfaces
- Form handling and validation
- Authentication systems
- CSS animations and transitions
- JavaScript DOM manipulation
- Accessibility considerations

## Future Improvements
- Backend integration with Node.js/Express
- Database implementation with MongoDB
- Real-time notifications using WebSockets
- Enhanced AI features with TensorFlow.js
- Mobile app versions using React Native

## Credits
- Design and Development: [Your Name]
- SVG Illustrations: Custom-created for Hire22.ai
- Icons: Font Awesome
- Fonts: Inter, system fonts

## License
This project is licensed under the MIT License 
