# FormCraft - Advanced Form Builder

A powerful, modern form builder application built with Next.js, React, and TypeScript. Create beautiful, responsive forms with drag-and-drop functionality, multi-step workflows, and real-time preview.

## ✨ Features

### 🎨 **Intuitive Form Building**
- **Drag & Drop Interface** - Effortlessly add and reorder form fields
- **Real-time Preview** - See your form as you build it
- **Responsive Design** - Forms look great on desktop, tablet, and mobile
- **Glass Morphism UI** - Modern, beautiful interface with smooth animations

### 📝 **Rich Field Types**
- Text Input & Textarea
- Email & Phone validation
- Number inputs with validation
- Date pickers
- Dropdown selects
- Radio button groups
- Checkbox groups

### 🔧 **Advanced Functionality**
- **Multi-step Forms** - Break long forms into manageable steps
- **Field Validation** - Built-in validation rules with custom patterns
- **Conditional Logic** - Show/hide fields based on user input
- **Auto-save** - Never lose your work with automatic saving
- **Form Templates** - Start with pre-built templates or create your own

### 🎯 **User Experience**
- **Keyboard Shortcuts** - Speed up your workflow
- **Undo/Redo** - Easily revert changes
- **Dark/Light Mode** - Choose your preferred theme
- **Mobile Optimized** - Full functionality on all devices

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/formcraft.git
   cd formcraft
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to start building forms!

## 📖 Usage Guide

### Creating Your First Form

1. **Start Fresh** - Click "Create New Form" and give your form a name
2. **Add Fields** - Drag field components from the left panel to your form
3. **Customize** - Select any field to edit its properties in the right panel
4. **Preview** - Switch to preview mode to test your form
5. **Share** - Generate a shareable link when you're ready

### Using Templates

1. Click "Browse Templates" on the home page
2. Choose from featured templates like:
   - Job Application Forms
   - Event Registration
   - Product Feedback Surveys
   - Contact Forms
3. Customize the template to match your needs

### Multi-step Forms

1. Click "Convert to Multi-Step" in your form
2. Add new steps with the "Add Step" button
3. Drag fields between steps to organize your form
4. Each step can have its own title and description

## 🛠️ Technical Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

### State Management
- **Zustand** - Lightweight state management
- **Local Storage** - Client-side persistence

### UI Components
- **shadcn/ui** - Beautiful, accessible components
- **Lucide React** - Consistent iconography
- **Recharts** - Data visualization

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
formcraft/
├── app/                    # Next.js app directory
│   ├── form/[id]/         # Dynamic form pages
│   ├── responses/[id]/    # Form analytics pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── form-builder/      # Form builder components
│   │   ├── enhanced-*.tsx # Enhanced UI components
│   │   ├── field-*.tsx    # Field-related components
│   │   └── form-*.tsx     # Form management components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── store.ts           # Zustand store
│   ├── types.ts           # TypeScript definitions
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🎨 Customization

### Themes
FormCraft supports both light and dark themes. The theme preference is automatically saved and restored.

### Styling
The application uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.ts`
- Component styles in individual component files
- Global styles in `app/globals.css`

### Adding New Field Types
1. Add the new type to `FieldType` in `lib/types.ts`
2. Update the field palette in `components/form-builder/enhanced-field-palette.tsx`
3. Add rendering logic in form preview components
4. Update validation logic if needed

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
# Optional: Analytics tracking
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Optional: Custom branding
NEXT_PUBLIC_APP_NAME=FormCraft
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Local Storage
FormCraft uses browser local storage for:
- Form data persistence
- User preferences (theme, etc.)
- Form responses
- Saved templates

## 📱 Mobile Support

FormCraft is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Collapsible panels on small screens
- Mobile-specific navigation
- Optimized form filling experience

## 🔒 Data Privacy

- **Local Storage Only** - All data is stored locally in your browser
- **No Server Required** - Forms work entirely client-side
- **Export Control** - You control your data with CSV exports
- **Shareable Links** - Forms are shared via URL parameters

## 🤝 Local Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful component and variable names
- Add JSDoc comments for complex functions
- Ensure responsive design
- Test on multiple browsers

## 🐛 Troubleshooting

### Common Issues

**Forms not saving?**
- Check if local storage is enabled in your browser
- Clear browser cache and try again

**Drag and drop not working?**
- Ensure you're using a modern browser
- Try refreshing the page

**Mobile interface issues?**
- Clear browser cache
- Try in an incognito/private window

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide](https://lucide.dev/) - Icon library
