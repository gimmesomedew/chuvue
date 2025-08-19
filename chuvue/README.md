# ChuVue - Interactive Learning Dashboard

ChuVue is a modern, interactive video-based learning system designed to create and manage engaging learning experiences. Built with Next.js, TypeScript, and Tailwind CSS, it features a beautiful dark glass morphism design that provides an immersive user experience.

## 🎯 Features

### Admin Dashboard
- **Interactive Management**: Create, edit, and manage learning modules
- **Multi-Screen Support**: Build experiences with up to 5 screens per module
- **Screen Types**: Start, Introduction, Video, Content, and Completion screens
- **Real-time Preview**: See changes as you build
- **Drag & Drop**: Reorder screens easily
- **Status Management**: Draft and published states

### Mobile-First Learning Experience
- **Responsive Design**: Optimized for mobile devices
- **Progressive Navigation**: Step-by-step learning flow
- **Video Integration**: Support for video content (max 2 minutes)
- **Interactive Elements**: Engaging content presentation
- **Progress Tracking**: Visual progress indicators

### Design System
- **Dark Glass Morphism**: Modern, sophisticated aesthetic
- **Frosted Glass Panels**: Semi-transparent, blurred backgrounds
- **Gradient Backgrounds**: Rich, dynamic visual appeal
- **Consistent Typography**: Clear hierarchy and readability
- **Smooth Animations**: Subtle, professional interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chuvue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Dashboard (`/`)
- View all interactive modules
- Monitor statistics and analytics
- Quick access to create new modules
- Filter and search existing content

### Interactive Editor (`/editor/[id]`)
- Create and edit learning modules
- Add up to 5 screens per module
- Configure screen types and content
- Preview and test user experience

### Interactive Viewer (`/interactive/[id]`)
- Mobile-optimized learning experience
- Navigate through screens with previous/next buttons
- Watch videos and read content
- Track progress through the module

## 🎨 Screen Types

### 1. Start Screen
- Module introduction and overview
- Call-to-action to begin learning
- Visual branding and description

### 2. Introduction Screen
- Welcome message and learning objectives
- What to expect from the module
- Preparation for the learning journey

### 3. Video Screen
- Video content (max 2 minutes)
- Video controls and progress bar
- Description and context

### 4. Content Screen
- Text-based learning content
- Key concepts and principles
- Interactive elements and examples

### 5. Completion Screen
- Module summary and congratulations
- Inspirational quotes
- Next steps or additional resources

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom glass morphism components
- **Icons**: Lucide React
- **State Management**: React hooks and local state
- **Build Tool**: Next.js built-in bundler

## 🎨 Design Principles

### Glass Morphism
- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows
- Layered depth perception

### Color Palette
- **Primary**: Blue tones (#0ea5e9)
- **Accent**: Purple (#8b5cf6), Green (#10b981), Orange (#f59e0b)
- **Background**: Dark gradients (slate-900 to blue-900)
- **Text**: High contrast white and gray tones

### Typography
- **Font**: Inter (system fallback)
- **Hierarchy**: Clear heading and body text distinction
- **Readability**: Optimal line spacing and contrast

## 📱 Responsive Design

- **Mobile First**: Optimized for smartphone screens
- **Tablet**: Responsive layouts for medium screens
- **Desktop**: Full dashboard experience with sidebars
- **Touch Friendly**: Large touch targets and gestures

## 🔮 Future Enhancements

- **Database Integration**: Neon database for persistent storage
- **User Authentication**: Admin and learner accounts
- **Analytics Dashboard**: Detailed learning metrics
- **Content Library**: Reusable screen templates
- **Multi-language Support**: Internationalization
- **Accessibility**: WCAG compliance improvements
- **Offline Support**: Progressive Web App features

## 🚧 Development

### Project Structure
```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Main dashboard
│   ├── editor/[id]/         # Interactive editor
│   └── interactive/[id]/    # Mobile learning viewer
├── components/               # Reusable UI components
└── types/                   # TypeScript type definitions
```

### Key Components
- **Glass Panel**: Reusable glass morphism container
- **Glass Card**: Content cards with glass effects
- **Glass Button**: Interactive buttons with glass styling
- **Glass Input**: Form inputs with glass treatment

### Styling System
- **Utility Classes**: Tailwind CSS for rapid development
- **Custom Components**: Glass morphism component library
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Consistent dark mode throughout

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the repository or contact the development team.

---

**ChuVue** - Transforming learning through interactive experiences ✨
