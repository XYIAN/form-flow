# Form Flow

A full-stack web application for creating, managing, and sharing custom forms for class action lawsuits. Built with Next.js, PrimeReact, and React Hook Form.

## 🚀 Features

- **Email-based Authentication**: Simple login system with demo accounts
- **Dynamic Form Creation**: Create forms manually or upload CSV files
- **Multiple Field Types**: Support for text, email, number, date, textarea, dropdown, checkbox, and radio inputs
- **Responsive Design**: Mobile-first design with hamburger navigation
- **Form Management**: View, edit, and delete forms with a clean dashboard
- **Form Rendering**: Dynamic form rendering with validation and submission
- **Submission Display**: Styled modal showing submitted data

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.3+, React 18
- **UI Framework**: PrimeReact with Lara Dark Purple theme
- **Form Handling**: React Hook Form with validation
- **Styling**: Tailwind CSS + PrimeFlex
- **State Management**: React Context API
- **Type Safety**: TypeScript
- **Icons**: PrimeIcons

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd form-flow
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Login page
│   ├── form/[formid]/     # Public form view
│   └── user/[userid]/     # User dashboard & management
├── components/            # Reusable components
│   └── Navigation.tsx     # Responsive navigation
├── context/              # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   └── FormContext.tsx   # Form management state (MCP integrated)
├── lib/                  # Business logic layer
│   └── mcp/              # Model Context Protocol
│       ├── protocols/    # MCP interfaces & types
│       ├── implementations/ # MCP implementations
│       └── index.ts      # MCP exports
├── types/                # TypeScript type definitions
│   └── index.ts
├── utils/                # Utility functions
│   └── index.ts
└── constants/            # Application constants
    └── index.ts
```

## 🏛️ Architecture

Form Flow v1.1.0 implements the **Model Context Protocol (MCP)** pattern for clean architecture and separation of concerns:

### MCP Layer Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    Form Flow Application                    │
├─────────────────────────────────────────────────────────────┤
│  UI Layer (React Components)                               │
│  ├── Form Creation Pages                                   │
│  ├── Form Rendering Pages                                  │
│  └── Dashboard & Management                                │
├─────────────────────────────────────────────────────────────┤
│  Context Layer (React Context API)                         │
│  ├── AuthContext                                           │
│  └── FormContext (MCP Integration)                         │
├─────────────────────────────────────────────────────────────┤
│  MCP Layer (Business Logic)                                │
│  ├── FormMCP (Form Operations)                             │
│  ├── FieldMCP (Field Rendering & Validation)               │
│  ├── SubmissionMCP (Submission Processing)                 │
│  └── MCPLogger (Logging & Debugging)                       │
├─────────────────────────────────────────────────────────────┤
│  Protocol Layer (Interfaces & Types)                       │
│  ├── IFormProtocol                                         │
│  ├── IFieldProtocol                                        │
│  ├── ISubmissionProtocol                                   │
│  └── MCP Types & Error Objects                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Benefits
- **Separation of Concerns**: Business logic separated from UI components
- **Type Safety**: Complete TypeScript coverage with compile-time checking
- **Error Handling**: Structured error objects with rich context
- **Performance**: Built-in performance tracking and optimization
- **Debugging**: Comprehensive logging and debugging capabilities
- **Maintainability**: Centralized business logic with consistent patterns

### MCP Components
- **FormMCP**: Handles form creation, validation, and management
- **FieldMCP**: Manages field rendering with PrimeReact components
- **SubmissionMCP**: Processes form submissions with validation
- **MCPLogger**: Provides structured logging and performance tracking

## 🔐 Authentication

The application uses a simple email-based authentication system:

### Demo Accounts
- **Email**: `admin@lawfirm.com` | **Company**: Smith & Associates Law Firm
- **Email**: `manager@classaction.com` | **Company**: Class Action Management LLC

### New Users
New users can register by entering their email and company name. The system will create a new account automatically.

## 📝 Form Creation

### Manual Creation
1. Navigate to the Create Form page
2. Enter form title and description
3. Add fields with different types:
   - Text Input
   - Email
   - Number
   - Date
   - Text Area
   - Dropdown (with options)
   - Checkbox (with options)
   - Radio Button (with options)
4. Set field properties (required, placeholder, options)
5. Save the form

### CSV Upload
1. Upload a CSV file with headers
2. The first row will be used as field labels
3. Enter form title and description
4. Create form automatically from CSV headers

## 🎨 UI Components

The application uses PrimeReact components with the Lara Dark Purple theme:

- **Cards**: Form containers and content sections
- **DataTable**: Forms listing with pagination
- **Input Components**: Text, textarea, calendar, dropdown, checkbox, radio
- **Buttons**: Primary, secondary, outlined variants
- **Dialog**: Form submission modal
- **Message**: Error and success notifications
- **Sidebar**: Mobile navigation menu

## 📱 Responsive Design

- **Mobile-first approach** with responsive breakpoints
- **Hamburger navigation** for mobile devices
- **Flexible layouts** using PrimeFlex grid system
- **Touch-friendly** interface elements

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js configuration
- **Prettier**: Code formatting
- **Conventions**: PascalCase for components, camelCase for variables

## 🚀 Deployment

The application is designed to be deployed on Netlify:

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Deploy automatically on push to main branch

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository.
