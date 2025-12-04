# QueryX Website

A modern, dynamic web application for business statistics managers to manage database tables, execute queries, and perform CRUD operations with an AI-powered natural language query interface.

## 🚀 Features

- **📊 Dashboard**: Overview of database statistics with quick action cards
- **🗂️ Table Manager**: Complete CRUD operations for database tables
  - Create new tables with custom schemas
  - View and edit existing table structures
  - Delete tables
  - View detailed schema information
- **🔍 Query Executor**: Dual-mode query interface
  - **Human SQL Query**: Execute raw SQL queries directly
  - **AI-Enhanced Query**: Natural language to SQL conversion using AI
  - Table selection for AI queries
  - Beautiful result visualization
- **💾 Data Manager**: Insert data into tables with a user-friendly interface
  - Dynamic form generation based on table schema
  - Support for multiple rows insertion
  - Type-aware input fields

## 🎨 Design Features

- **Gradient CSS**: Beautiful gradient backgrounds and elements throughout
- **Smooth Animations**: Fade-in, slide, scale, and other transitions
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with intuitive navigation
- **Glass Morphism**: Modern glassmorphic design elements

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2.0
- **Routing**: React Router DOM 6.22.0
- **HTTP Client**: Axios 1.6.7
- **Build Tool**: Vite 7.2.4
- **Styling**: Custom CSS with CSS Variables, Gradients, and Animations

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- QueryX Backend Server running on `http://localhost:8080`

## 🔧 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API Base URL (if needed):
   - Open `src/config/api.js`
   - Update `BASE_URL` if your backend is running on a different address

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 📁 Project Structure

```
QueryXWebsite/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation component
│   │   ├── Dashboard/              # Dashboard component
│   │   ├── TableManager/           # Table CRUD operations
│   │   ├── QueryExecutor/          # SQL & AI query interface
│   │   └── DataManager/            # Data insertion interface
│   ├── services/
│   │   ├── queryService.js         # Query API calls
│   │   ├── schemaService.js        # Schema/Table API calls
│   │   └── dataService.js          # Data insertion API calls
│   ├── config/
│   │   └── api.js                  # API configuration & endpoints
│   ├── styles/
│   │   ├── variables.css           # CSS variables
│   │   ├── gradients.css           # Gradient utilities
│   │   └── animations.css          # Animation keyframes
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # App entry point
│   └── index.css                   # Global styles
├── package.json
└── vite.config.js
```

## 🎯 Usage

### Dashboard
- View database statistics (total tables, columns)
- Quick access to all features via action cards
- Overview of available features

### Table Manager
1. View all existing tables in the left panel
2. Click on a table to view its schema details
3. Create new tables using the "Create New Table" button
4. Edit table structure using the edit icon
5. Delete tables using the delete icon

### Query Executor

#### Human SQL Query
1. Select "SQL Query" tab
2. Enter your SQL query in the textarea
3. Click "Execute Query"
4. View results in a formatted table

#### AI Query
1. Select "AI Query" tab
2. Describe what data you need in natural language
3. Select the tables to query from the chip selector
4. Click "Generate & Execute"
5. View the AI-generated SQL and results

### Data Manager
1. Select a table from the dropdown
2. Fill in the form fields for each row
3. Add multiple rows using "Add Row" button
4. Click "Insert Data" to save

## 🔌 API Integration

The application connects to the QueryX backend API. Ensure the backend is running before using the frontend.

**Default Backend URL**: `http://localhost:8080`

## 🎨 Customization

### Changing Colors
Edit `src/styles/variables.css` to customize the color scheme.

### Adding Animations
Check `src/styles/animations.css` for available animation classes.

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

## 🚀 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:
```bash
npm run preview
```

## 🐛 Troubleshooting

### API Connection Issues
- Ensure the backend server is running on `http://localhost:8080`
- Check browser console for CORS errors
- Verify API base URL in `src/config/api.js`

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

---

Built with ❤️ using React, Vite, and modern web technologies.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
