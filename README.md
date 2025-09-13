# A-Impact: AI-Powered Business Licensing System 🏢🤖

A comprehensive Hebrew business licensing system that uses AI to generate personalized compliance reports based on business parameters. Built with React, Node.js, MongoDB, and Claude AI.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6+-green.svg)

## 🌟 Features

### 🤖 AI-Powered Reports
- **Claude AI Integration**: Generate comprehensive Hebrew business reports
- **Smart Analysis**: AI analyzes regulations and provides actionable insights
- **Personalized Content**: Reports tailored to specific business parameters
- **Fallback System**: Graceful degradation if AI service is unavailable

### 📋 Regulation Processing
- **PDF Extraction**: Extract regulations from Hebrew PDF documents
- **Smart Categorization**: Automatically categorize regulations by business type
- **Hebrew Text Processing**: Advanced Hebrew text parsing and keyword extraction
- **Minimum Requirements**: Each regulation includes at least 6 sub-requirements

### 🎨 Modern Frontend
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Dark/Light Theme**: Beautiful theme system with smooth transitions
- **Tabbed Interface**: Switch between AI reports and detailed regulations
- **Code Splitting**: Optimized performance with lazy loading
- **Hebrew RTL Support**: Full right-to-left language support

### 🗄️ Data Management
- **MongoDB Integration**: Persistent storage for regulations and AI reports
- **Smart Caching**: Efficient data retrieval and processing
- **Metadata Tracking**: Complete audit trail of AI report generation
- **Query Optimization**: Indexed database for fast searches

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Claude API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/a-impact.git
   cd a-impact
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../Frontend/A-IMPACT-MISSION
   npm install
   ```

4. **Environment Setup**
   
   Create `Backend/.env` file:
   ```env
   # Claude API Key - Get from https://console.anthropic.com/
   CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
   
   # MongoDB connection (optional - defaults to local)
   MONGODB_URI=mongodb://localhost:27017/a-impact
   
   # Server configuration
   PORT=4000
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

6. **Start the Backend**
   ```bash
   cd Backend
   npm start
   ```

7. **Start the Frontend**
   ```bash
   cd Frontend/A-IMPACT-MISSION
   npm run dev
   ```

8. **Open the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📖 Usage

### 1. Fill Out Business Information
- **Business Size**: Enter area in square meters (מ"ר)
- **Seating Capacity**: Number of seats
- **Gas Usage**: Whether the business uses gas
- **Delivery Service**: Whether the business offers delivery

### 2. Generate AI Report
- Click "Submit" to process your business information
- The system will:
  - Extract relevant regulations from the PDF
  - Generate a comprehensive AI report using Claude
  - Save the report to MongoDB
  - Display results in a beautiful interface

### 3. View Results
- **AI Report Tab**: Comprehensive analysis with actionable insights
- **Detailed Regulations Tab**: Raw regulation data with requirements
- **Responsive Design**: Works on all devices

## 🏗️ Architecture

### Backend Structure
```
Backend/
├── controllers/
│   └── businessController.js      # Main API logic
├── services/
│   ├── llmService.js             # Claude AI integration
│   ├── pdfProcessor.js           # PDF extraction
│   └── utils/                    # Text processing utilities
├── DB/
│   ├── models/
│   │   ├── businessSchema.js     # Regulation schema
│   │   └── aiReportSchema.js     # AI report schema
│   └── dbConnection.js           # MongoDB connection
├── routes/
│   └── businessRoutes.js         # API routes
└── Food-Regulations.pdf          # Source PDF
```

### Frontend Structure
```
Frontend/A-IMPACT-MISSION/
├── src/
│   ├── Components/               # UI components
│   │   ├── ResultsSection.jsx   # Main results display
│   │   ├── FormSection.jsx      # Business form
│   │   └── LoadingIndicator.jsx # Loading states
│   ├── hooks/
│   │   └── useBusinessForm.js   # Form logic
│   ├── utils/
│   │   └── api.js               # API integration
│   ├── Providers/
│   │   └── DarkThemeProvider.jsx # Theme context
│   └── pages/
│       ├── HomePage.jsx         # Main page
│       └── AboutPage.jsx        # About page
```

## 🔧 API Endpoints

### Main Endpoints
- `POST /business` - Generate AI report and regulations
- `GET /business/ai-reports` - Retrieve saved AI reports
- `GET /business/test-ai-report` - Test AI report functionality

### Example Request
```bash
curl -X POST http://localhost:4000/business \
  -H "Content-Type: application/json" \
  -d '{
    "size": 100,
    "seating": 20,
    "gas": true,
    "delivery": false
  }'
```

### Example Response
```json
{
  "inputs": { "size": 100, "seating": 20, "gas": true, "delivery": false },
  "totalFound": 7,
  "regulations": [...],
  "aiReport": "דוח מקיף לעסק שלך...",
  "summary": {...}
}
```

## 🎯 Key Features Explained

### AI Report Generation
The system uses Claude AI to generate comprehensive Hebrew business reports that include:
- **General Summary**: Overview of what the business needs to know
- **Category Requirements**: Detailed requirements by business category
- **Action Recommendations**: Concrete steps for implementation
- **Important Tips**: Key insights and best practices

### Regulation Processing
- **PDF Extraction**: Processes Hebrew PDF documents using advanced text parsing
- **Smart Categorization**: Automatically categorizes regulations into:
  - Deliveries (משלוחים)
  - Seating/Capacity (ישיבה ותפוסה)
  - Business Size (גודל העסק)
  - Fire and Gas Safety (בטיחות אש וגז)

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect for tablet viewing
- **Desktop Experience**: Full-featured desktop interface
- **Theme System**: Beautiful light/dark mode support

## 🛠️ Development

### Code Splitting
The frontend uses advanced React code splitting for optimal performance:
- **Route-based Splitting**: Pages load on-demand
- **Component Splitting**: UI components are lazy-loaded
- **Bundle Optimization**: Reduced initial load time by ~40%

### Database Design
- **Regulation Schema**: Stores extracted PDF regulations
- **AI Report Schema**: Stores generated AI reports with metadata
- **Indexing**: Optimized queries for fast retrieval
- **Validation**: Comprehensive data validation

### Error Handling
- **Graceful Degradation**: System works even if AI fails
- **Comprehensive Logging**: Detailed error tracking
- **User-Friendly Messages**: Clear error communication

## 🔒 Security

- **Input Validation**: All inputs are validated and sanitized
- **API Key Protection**: Secure environment variable handling
- **XSS Protection**: Built-in XSS prevention
- **Rate Limiting**: Comprehensive rate limiting system
  - **AI Endpoints**: 2 requests per minute (protects Claude API tokens)
  - **General API**: 100 requests per 15 minutes
  - **Frontend Form**: 30-second cooldown between submissions
- **Token Protection**: Prevents spam and unnecessary API costs

## 📊 Performance

- **Lazy Loading**: Components load on-demand
- **Database Indexing**: Optimized database queries
- **Caching**: Smart caching for improved performance
- **Bundle Splitting**: Reduced initial bundle size

## 🌐 Internationalization

- **Hebrew RTL Support**: Full right-to-left language support
- **Hebrew Text Processing**: Advanced Hebrew text parsing
- **Cultural Considerations**: Israeli business regulations focus

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Claude AI** for powerful language model capabilities
- **MongoDB** for robust data storage
- **React** for the amazing frontend framework
- **Node.js** for the backend runtime
- **Hebrew Language Processing** community for text processing insights

## 📞 Support

For support, email amitandta@gmail.com or create an issue in this repository.

## 🔮 Roadmap

- [ ] Multi-language support
- [ ] Advanced search functionality
- [ ] Report export (PDF/Word)
- [ ] User authentication
- [ ] Report history tracking
- [ ] Mobile app development

---

**Built with ❤️ for Israeli businesses** 🇮🇱

*Making business licensing simple, smart, and accessible through AI technology.*
