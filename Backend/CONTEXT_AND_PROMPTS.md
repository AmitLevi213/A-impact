# A-IMPACT-MISSION - Context and Prompts History

## Project Overview
This is a business licensing system that processes Hebrew PDF regulations and provides relevant requirements based on business inputs (size, seating, gas, delivery).

## Original Technical Mission (Hebrew)
**משימה טכנית: מערכת הערכת רישוי עסקים**

### רקע כללי
פיתוח מערכת לעזרה לבעלי עסקים בישראל להבין את דרישות הרישוי הרלוונטיות לעסק שלהם. המערכת תקבל מידע על העסק ותחזיר דוח מותאם אישית עם הדרישות הרגולטוריות הרלוונטיות.

### חומרי עבודה
קובץ PDF עם נתוני רישוי עסקים למסעדות (נתונים גולמיים בעברית). עיבוד הנתונים ובניית מערכת שמשתמשת בהם.

### דרישות פונקציונליות

#### 1. עיבוד נתונים
- קריאה ועיבוד של הנתונים מהקובץ המצורף (PDF)
- המרה לפורמט מובנה (JSON/Database)
- מיפוי בין מאפייני עסק לדרישות רגולטוריות

#### 2. שאלון דיגיטלי
פיתוח שאלון שיאסוף את המידע הבא:
- **גודל העסק** (במ"ר)
- **מספר מקומות ישיבה/תפוסה**
- **מאפיין אחד נוסף לפחות** (שימוש בגז, הגשת בשר, משלוחים וכו')

#### 3. מנוע התאמה
פיתוח לוגיקה שמתאימה בין תשובות המשתמש לדרישות הרגולטוריות:
- סינון לפי גודל ותפוסה
- התחשבות במאפיינים מיוחדים

#### 4. **יצירת דוח חכם באמצעות AI** ⭐
**זהו החלק המרכזי והחשוב ביותר במשימה**

השימוש במודל שפה (LLM) ליצירת דוח מותאם:
- **אינטגרציה עם מודל שפה** (OpenAI GPT, Claude, Gemini וכו')
- **עיבוד חכם של הדרישות** - המודל יקבל את הנתונים הגולמיים ויעבד אותם לדוח/תמצית ברור ומובן
- **התאמה אישית** - הדוח יותאם למאפיינים הספציפיים של העסק
- **שפה ברורה ונגישה** - המודל יתרגם "שפת חוק" לשפה עסקית מובנת
- **ארגון תוכן** - חלוקה לקטגוריות עם עדיפויות והמלצות פעולה

### דרישות טכניות

#### ארכיטקטורה
- **Frontend**: ממשק משתמש פשוט (HTML/CSS/JS או React/Vue)
- **Backend**: שרת API (Node.js/Python/Java לבחירתך)
- **AI Integration**: אינטגרציה עם API של מודל שפה
- **נתונים**: אחסון הנתונים (קובץ/Database לבחירתך)

#### כלי פיתוח מומלצים ונדרשים
**שימוש בכלי AI לפיתוח הוא חובה ויש לתעד אותו:**

##### כלי פיתוח מומלצים:
- Cursor AI
- Windsurf
- Replit
- GitHub Copilot

##### טכנולוגיות מומלצות (לא מחייב)
- Frontend: React, Vue, או HTML/JS vanilla
- Backend: Node.js + Express, Python + Flask
- AI: OpenAI API, Claude API, או דומה
- Database: JSON files, SQLite, PostgreSQL

### תוצרים מצופים

#### 1. קוד מקור ומערכת
- **Repository מלא ב-Git** עם היסטוריית commits 
- **מערכת עובדת end-to-end** הניתנת להרצה מקומית
- **API עובד** עם נקודות קצה מתועדות
- **Frontend פונקציונלי** עם שאלון וממשק דוח
- **אינטגרציה פעילה עם מנוע AI** המייצרת דוחות אמיתיים

#### 2. עיבוד נתונים
- **סקריפט עיבוד** שמעבד את קובץ ה-PDF
- **נתונים מעובדים** בפורמט מובנה (JSON/CSV)

#### 3. תיעוד מקיף
##### README ראשי:
- תיאור הפרויקט ומטרותיו
- הוראות התקנה והרצה מפורטות
- רשימת dependencies וגרסאות

##### תיעוד טכני:
- **ארכיטקטורת המערכת** - דיאגרמה בסיסית ופירוט רכיבים
- **תיעוד API** - כל נקודות הקצה 
- **מבנה הנתונים** - סכמה
- **אלגוריתם ההתאמה** - הסבר הלוגיקה

##### תיעוד שימוש ב-AI:
- **כלי פיתוח**: אילו כלי AI נעשה בהם שימוש ואיך
- **מודל שפה מרכזי**: איזה מודל נבחר ולמה
- **Prompts**: prompts שנשלחו למודל (פרומטים שהשתמשת בהם בפיתוח)

#### 4. למידה ושיפורים
- **יומן פיתוח** - האתגרים שנתקלת בהם ואיך פתרת
- **שיפורים עתידיים** - רשימת תכונות נוספות אפשריות
- **לקחים** - מה למדת בתהליך הפיתוח

### קריטריונים להערכה

#### פונקציונליות AI 
- איכות הדוחות שמייצר המודל
- התאמה אישית לקלט המשתמש
- יכולת המערכת לטפל בקלט מגוון
- יצירתיות בשימוש במודל השפה

#### פונקציונליות כללית 
- המערכת עובדת end-to-end
- לוגיקת ההתאמה נכונה
- עיבוד נתונים תקין

#### איכות קוד וארכיטקטורה 
- קוד נקי ומסודר
- מבנה פרויקט לוגי
- אינטגרציה עם API חיצוני

#### תיעוד
- תיעוד מקיף וברור
- הסבר שימוש בכלי AI
- הוראות הרצה מדויקות

#### חדשנות ויצירתיות 
- גישות מקוריות לפתרון בעיות
- שימוש יצירתי בכלי AI
- תכונות נוספות שמעניקות ערך

### הגשה
- **העלאת הקוד ל-GitHub** עם repository מסודר
- **הגשה סופית דרך טופס Monday ייעודי** 
- **קובץ ZIP גיבוי** של כל הפרויקט במקרה של בעיות גישה

#### פרטים נדרשים בהגשה:
1. קישור ל-repository
2. רשימת כלי AI שבהם השתמשת
3. פירוט המודל השפה הראשי
4. 3 צילומי מסך של המערכת בפעולה

### זמן ביצוע
**עד ה14.9 בשעה 23:59** - טופס ההגשה לא יהיה זמין לאחר מועד זה

### הערות נוספות
- **AI First**: השימוש בכלי AI הוא יתרון, לא חסרון - להשתמש ולתעד
- **פונקציונליות מעל יופי** - אין צורך בעיצוב או ממשק משתמש מתוחכמים
- **דוגמאות אמיתיות** - תוודא שהמערכת מייצרת דוחות רלוונטיים
- **שאלות** - ניתן לפנות בכל עת לשאלות במייל
- **תיעוד החלטות** - חשוב לתעד מדוע בחרת בפתרונות מסוימים

---

**בהצלחה! אנחנו מחכים לראות איך תשלב בין כישורי פיתוח מסורתיים לבין כלי AI מתקדמים ליצירת פתרון יצירתי ומעשי**

## AI Tools Used in Development

### Primary AI Development Tool
- **Cursor AI** - Used extensively for:
  - Code generation and completion
  - Debugging and error resolution
  - Code refactoring and optimization
  - Architecture design and implementation
  - Hebrew text processing logic
  - MongoDB integration and schema design

### AI-Assisted Development Process
1. **Code Generation**: Cursor AI helped generate the PDF processing pipeline
2. **Hebrew Text Processing**: AI assisted in creating Hebrew keyword matching algorithms
3. **Database Design**: AI helped design the MongoDB schema for regulation storage
4. **API Development**: AI assisted in creating the Express.js API endpoints
5. **Error Resolution**: AI helped debug MongoDB connection issues and data validation
6. **Code Optimization**: AI suggested improvements for performance and maintainability

### AI Prompts Used
- **PDF Processing**: "Create a PDF processor that extracts Hebrew regulations and categorizes them"
- **Database Integration**: "Design a MongoDB schema for storing Hebrew regulation data"
- **API Development**: "Create an Express.js API that filters regulations based on business inputs"
- **Hebrew Text Processing**: "Create utilities for processing Hebrew text and extracting keywords"
- **Error Handling**: "Fix MongoDB connection issues and data validation errors"

## Key Prompts and Requirements from User

### Initial Requirements
1. **PDF Processing**: Extract regulations from Hebrew PDF (Food-Regulations.pdf)
2. **Minimum Sub-regulations**: Each regulation must have at least 6 sub-regulations
3. **MongoDB Integration**: Save data to MongoDB instead of JSON files
4. **Form Integration**: Process PDF through form submission, not terminal scripts
5. **Specific Categories**: Focus on seating/capacity, business size (מ"ר), gas, and delivery features

### Key Hebrew Keywords to Extract
- **Seating/Capacity**: ישיבה, מקומות ישיבה, כיסאות, מושבים, תכולה, קיבולת, אורחים
- **Business Size**: מ"ר, שטח, מטר רבוע, גודל, מידות
- **Gas**: גז, גז טבעי, גז בישול, מערכת גז
- **Delivery**: משלוח, הגשה, מסירה, הובלה

### Technical Requirements
1. **No Terminal Scripts**: User doesn't want separate scripts to be executed through terminal
2. **Form-Based Processing**: PDF processing should happen when form is submitted
3. **MongoDB Compass Compatible**: Data should be visible in MongoDB Compass
4. **Real PDF Extraction**: Extract actual regulations from PDF, not dummy data
5. **Minimum 6 Sub-regulations**: Each regulation must have at least 6 meaningful sub-requirements

## Current System Architecture

### Files Structure
```
Backend/
├── controllers/
│   └── businessController.js          # Main form processing logic
├── routes/
│   └── businessRoutes.js              # API routes
├── services/
│   ├── pdfProcessor.js                # Main PDF processing class
│   ├── core/
│   │   ├── categories.js              # Category definitions
│   │   ├── finalizeData.js            # Data finalization logic
│   │   └── processSection.js          # Section processing
│   └── utils/
│       ├── cleanText.js               # Hebrew text cleaning
│       ├── sectionSplitter.js         # PDF section splitting
│       ├── requirementExtractor.js    # Sub-regulation extraction
│       ├── standardsExtractor.js      # Israeli standards extraction
│       ├── numberExtractor.js         # Number extraction
│       └── importanceCalculator.js    # Importance calculation
├── DB/
│   ├── models/
│   │   └── businessSchema.js          # MongoDB schema (renamed to Regulation)
│   └── dbConnection.js                # MongoDB connection
└── Food-Regulations.pdf               # Source PDF file
```

### MongoDB Schema
```javascript
{
  id: String (unique),
  category: ['deliveries', 'seating', 'businessSize', 'fireAndGas'],
  title: String,
  content: String,
  requirements: [{
    text: String,
    type: ['mandatory', 'optional', 'forbidden', 'general'],
    mandatory: Boolean
  }],
  standards: [{
    standard: String,    // e.g., "ת\"י 921"
    context: String      // Context where standard was found
  }],
  numbers: [{
    value: Number,
    unit: String,
    context: String
  }],
  sourceReference: String,
  keywords: [String],
  importance: ['high', 'medium', 'low'],
  extractedAt: Date,
  metadata: {
    processedAt: Date,
    totalRegulations: Number,
    sourceFile: String
  }
}
```

### API Endpoints
- **POST /business**: Main form submission endpoint
  - Input: `{ size: number, seating: number, gas: boolean, delivery: boolean }`
  - Output: Filtered regulations based on inputs

### Processing Flow
1. **Form Submission** → **Check MongoDB** → **Process PDF if needed** → **Filter by inputs** → **Return results**

## Issues Resolved

### 1. MongoDB Validation Error
- **Problem**: Schema expected `standards: [String]` but data had objects
- **Solution**: Updated schema to `standards: [{ standard: String, context: String }]`
- **Added**: Data validation and parsing in pdfProcessor

### 2. Dummy Data vs Real Extraction
- **Problem**: System was generating fake sub-regulations
- **Solution**: Enhanced requirement extractor to find real sub-regulations from PDF
- **Result**: All regulations now have real content extracted from PDF

### 3. Terminal Scripts vs Form Integration
- **Problem**: User didn't want separate terminal scripts
- **Solution**: Integrated PDF processing into form submission flow
- **Result**: PDF processes automatically when form is submitted

### 4. Minimum Sub-regulations Requirement
- **Problem**: Some regulations had fewer than 6 sub-regulations
- **Solution**: Enhanced extraction logic with multiple splitting patterns
- **Result**: All regulations now have at least 6 meaningful sub-regulations

## Current Status
✅ PDF processing integrated into form system
✅ MongoDB schema fixed and working
✅ Real regulations extracted from PDF
✅ Minimum 6 sub-regulations per regulation
✅ Hebrew keyword extraction working
✅ Form-based processing (no terminal scripts)
✅ MongoDB Compass compatible

## Future Considerations
- User may want to add more Hebrew keywords for better extraction
- Could add more specific business categories
- Might want to add regulation search functionality
- Could add regulation update/refresh capability

## Key Technical Decisions
1. **MongoDB over JSON**: User prefers MongoDB for data persistence
2. **Form Integration**: All processing happens through form submission
3. **Real Data Only**: No dummy data generation, only real PDF extraction
4. **Hebrew-First**: All processing optimized for Hebrew text and regulations
5. **Exact Requirements**: Each regulation must have exactly 6 sub-regulations
6. **Maximum Regulations**: Each category (size, seating, gas, delivery) limited to maximum 6 regulations

## User Preferences
- No terminal script execution
- MongoDB for data storage
- Real PDF content extraction
- Form-based processing
- Hebrew language optimization
- Exactly 6 sub-regulations per regulation
- Maximum 6 regulations per category
