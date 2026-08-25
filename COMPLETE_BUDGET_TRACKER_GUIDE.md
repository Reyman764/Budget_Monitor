# 💰 Complete Budget Tracker Build Guide
## Full-Stack Couples' Monthly Budget Tracker Application

**Last Updated:** August 2026  
**Target Users:** Couples who want to track, visualize, and review monthly budget together  
**Estimated Timeline:** 10 weeks (4 phases)  
**Tech Stack:** React + Node.js/Express + PostgreSQL  
**Total Features:** 30+ functions across 4 phases

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [All Features List (30+)](#all-features-list-30)
3. [Architecture & Tech Stack](#architecture--tech-stack)
4. [Phase 1: MVP (Weeks 1-3)](#phase-1-mvp-weeks-1-3)
5. [Phase 2: Visualizations (Weeks 4-5)](#phase-2-visualizations-weeks-4-5)
6. [Phase 3: Categorization & Filtering (Weeks 6-8)](#phase-3-categorization--filtering-weeks-6-8)
7. [Phase 4: Analytics & Planning (Weeks 9-10)](#phase-4-analytics--planning-weeks-9-10)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [Deployment Guide](#deployment-guide)

---

## 🎯 Project Overview

### What This App Does
A web application for couples to:
- **Track income and expenses manually** (no bank API)
- **Record who received/spent money** with details
- **View monthly summary** with charts and trends
- **Categorize transactions** for insights
- **Split costs** and track who owes what
- **Plan budgets** with spending limits and alerts
- **Generate reports** for monthly financial review discussions

### Why Manual Tracking?
- ✅ Works with any income source (salary, freelance, business, gifts)
- ✅ Works with any payment method (cash, bank transfer, credit card)
- ✅ No API dependency - always available
- ✅ Complete control over data
- ✅ Simple to understand and use
- ✅ Fast data entry (30 seconds per transaction)

---

## 📊 All Features List (30+)

### Phase 1: MVP (Weeks 1-3) - 10 Features
1. ✅ User signup with email/password
2. ✅ User login with JWT auth
3. ✅ Create household with partner
4. ✅ Generate & share invite code
5. ✅ Partner joins household
6. ✅ Add income entry (manual)
7. ✅ Add expense entry (manual)
8. ✅ View transaction list
9. ✅ Edit transaction
10. ✅ Delete transaction

### Phase 2: Visualizations (Weeks 4-5) - 8 Features
11. ✅ Dashboard with summary cards
12. ✅ Category breakdown pie chart
13. ✅ Daily spending trend line chart
14. ✅ Monthly summary page
15. ✅ Export monthly report to PDF
16. ✅ Shareable report link
17. ✅ Income vs expense comparison
18. ✅ Dark mode toggle

### Phase 3: Categorization & Filtering (Weeks 6-8) - 7 Features
19. ✅ Categorize transactions (Food, Transport, Bills, etc.)
20. ✅ Filter by category
21. ✅ Filter by date range
22. ✅ Filter by transaction type (income/expense)
23. ✅ Search transactions
24. ✅ Bill tracker (recurring expenses)
25. ✅ Track who paid (income source/expense payer)

### Phase 4: Analytics & Planning (Weeks 9-10) - 8 Features
26. ✅ Set monthly budget limits per category
27. ✅ Alert when spending exceeds 80% of budget
28. ✅ Actual vs budgeted comparison chart
29. ✅ Category spending breakdown table
30. ✅ Savings goal tracker
31. ✅ Monthly vs previous month comparison
32. ✅ Yearly spending trends
33. ✅ Net worth calculator (total income - total expenses)

---

## 🏗️ Architecture & Tech Stack

### Frontend
```
Technology: React 18 + Vite
Styling: Tailwind CSS
Charts: Recharts (for visualizations)
HTTP Client: Axios
State Management: React Hooks (useState, useContext)
Auth: JWT tokens in localStorage
Form Handling: React Hook Form
```

### Backend
```
Framework: Node.js + Express.js
Database: PostgreSQL
ORM: Sequelize
Auth: JWT + bcrypt
Input Validation: Joi
Logging: Morgan
CORS: Enabled for frontend
```

### Database
```
RDBMS: PostgreSQL
Hosted: Local dev / AWS RDS / Heroku / DigitalOcean / Railway
Backup: Weekly automated snapshots
```

### Deployment
```
Frontend: Vercel / Netlify
Backend: Render / Heroku / Railway
Database: Managed PostgreSQL service
Version Control: GitHub
```

### Folder Structure
```
budget-tracker/
├── backend/
│   ├── config/
│   │   ├── config.json (Sequelize config)
│   │   └── database.js
│   ├── models/
│   │   ├── index.js
│   │   ├── user.js
│   │   ├── household.js
│   │   ├── transaction.js
│   │   ├── budgetLimit.js
│   │   └── savingsGoal.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── household.js
│   │   ├── transactions.js
│   │   ├── reports.js
│   │   └── budget.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── server.js
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── HouseholdSetup.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── MonthlyReview.jsx
│   │   │   ├── BudgetPlanning.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── Settings.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── TransactionListItem.jsx
│   │   │   ├── SummaryCard.jsx
│   │   │   ├── CategoryChart.jsx
│   │   │   ├── TrendChart.jsx
│   │   │   ├── BudgetCard.jsx
│   │   │   └── Modal.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTransactions.js
│   │   │   ├── useBudget.js
│   │   │   └── useHousehold.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── formatters.js
│   │   │   └── localStorage.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

---

## 🚀 Phase 1: MVP (Weeks 1-3)

### Goal
Users can sign up, create/join households, add income/expenses manually, and see basic totals.

### Features (10)
- User signup & login (JWT auth)
- Household creation & partner linking
- Manual transaction entry (income + expense)
- Transaction list view
- Edit/delete transactions
- Basic dashboard (total income, total expenses, net balance)
- Mobile-responsive layout

### Step 1: Backend Setup

#### 1.1 Initialize Node Project
```bash
mkdir budget-tracker && cd budget-tracker
mkdir backend frontend
cd backend

npm init -y
npm install express pg sequelize dotenv bcrypt jsonwebtoken cors morgan joi
npm install --save-dev nodemon
```

#### 1.2 Create .env File
```bash
# backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=budget_tracker_dev
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

NODE_ENV=development
PORT=5000
```

#### 1.3 Initialize Sequelize
```bash
npx sequelize-cli init
```

Edit `config/config.json`:
```json
{
  "development": {
    "username": "postgres",
    "password": "your_password",
    "database": "budget_tracker_dev",
    "host": "127.0.0.1",
    "port": 5432,
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": true
    }
  }
}
```

#### 1.4 Create Database
```bash
createdb budget_tracker_dev
```

#### 1.5 Generate Models
```bash
# User model
npx sequelize-cli model:generate --name User \
  --attributes email:string,passwordHash:string,name:string

# Household model
npx sequelize-cli model:generate --name Household \
  --attributes name:string,currency:string,createdBy:integer,inviteCode:string

# Transaction model (income + expense)
npx sequelize-cli model:generate --name Transaction \
  --attributes amount:decimal,type:string,category:string,description:string,date:date,recordedBy:integer,householdId:integer,status:string
```

#### 1.6 Setup Models with Relationships

**models/user.js:**
```javascript
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Household, { through: 'HouseholdUsers' });
      User.hasMany(models.Transaction, { foreignKey: 'recordedBy' });
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  );

  return User;
};
```

**models/household.js:**
```javascript
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Household extends Model {
    static associate(models) {
      Household.belongsToMany(models.User, { through: 'HouseholdUsers' });
      Household.hasMany(models.Transaction);
      Household.hasMany(models.BudgetLimit);
      Household.hasMany(models.SavingsGoal);
    }
  }

  Household.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'NPR'
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      inviteCode: {
        type: DataTypes.STRING,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Household'
    }
  );

  return Household;
};
```

**models/transaction.js:**
```javascript
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Household);
      Transaction.belongsTo(models.User, { foreignKey: 'recordedBy' });
    }
  }

  Transaction.init(
    {
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Other'
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      recordedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      householdId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed'),
        defaultValue: 'confirmed'
      }
    },
    {
      sequelize,
      modelName: 'Transaction',
      indexes: [
        { fields: ['householdId'] },
        { fields: ['date'] },
        { fields: ['type'] },
        { fields: ['category'] }
      ]
    }
  );

  return Transaction;
};
```

**models/budgetlimit.js:**
```javascript
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BudgetLimit extends Model {
    static associate(models) {
      BudgetLimit.belongsTo(models.Household);
    }
  }

  BudgetLimit.init(
    {
      householdId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      limitAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      month: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'BudgetLimit'
    }
  );

  return BudgetLimit;
};
```

**models/savingsgoal.js:**
```javascript
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SavingsGoal extends Model {
    static associate(models) {
      SavingsGoal.belongsTo(models.Household);
    }
  }

  SavingsGoal.init(
    {
      householdId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      goalName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      targetAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currentAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'SavingsGoal'
    }
  );

  return SavingsGoal;
};
```

#### 1.7 Run Migrations
```bash
npx sequelize-cli db:migrate
```

#### 1.8 Create Auth Routes

**routes/auth.js:**
```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      name
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

#### 1.9 Create Auth Middleware

**middleware/authMiddleware.js:**
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
```

#### 1.10 Create Household Routes

**routes/household.js:**
```javascript
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Household, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create household
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, currency } = req.body;
    const inviteCode = uuidv4().slice(0, 8).toUpperCase();

    const household = await Household.create({
      name,
      currency: currency || 'NPR',
      createdBy: req.userId,
      inviteCode
    });

    await household.addUser(req.userId);

    res.status(201).json({
      success: true,
      household,
      inviteCode
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current household
router.get('/', authMiddleware, async (req, res) => {
  try {
    const household = await Household.findOne({
      include: [{ model: User, attributes: ['id', 'email', 'name'], through: { attributes: [] } }]
    });

    if (!household) {
      return res.status(404).json({ error: 'Household not found' });
    }

    res.json({ success: true, household });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Join household with invite code
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const household = await Household.findOne({
      where: { inviteCode }
    });

    if (!household) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    await household.addUser(req.userId);

    res.json({
      success: true,
      message: 'Joined household',
      household
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

#### 1.11 Create Transaction Routes

**routes/transactions.js:**
```javascript
const express = require('express');
const { Transaction } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const { Op } = require('sequelize');

// Create transaction (income or expense)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, type, category, description, date, householdId } = req.body;

    if (!amount || !type || !category || !householdId) {
      return res.status(400).json({ error: 'Amount, type, category, and householdId required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be income or expense' });
    }

    const transaction = await Transaction.create({
      amount: parseFloat(amount),
      type,
      category,
      description: description || '',
      date: date || new Date(),
      recordedBy: req.userId,
      householdId: parseInt(householdId),
      status: 'confirmed'
    });

    res.status(201).json({
      success: true,
      transaction
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get transactions for household (with filters)
router.get('/:householdId', authMiddleware, async (req, res) => {
  try {
    const { householdId } = req.params;
    const { month, type, category } = req.query;

    let where = { householdId: parseInt(householdId) };

    // Filter by month (YYYY-MM)
    if (month) {
      const startDate = new Date(`${month}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Filter by type (income/expense)
    if (type && ['income', 'expense'].includes(type)) {
      where.type = type;
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    const transactions = await Transaction.findAll({
      where,
      include: [{ association: 'User', attributes: ['name'] }],
      order: [['date', 'DESC']]
    });

    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update transaction
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.update({
      amount: amount !== undefined ? parseFloat(amount) : transaction.amount,
      type: type || transaction.type,
      category: category || transaction.category,
      description: description !== undefined ? description : transaction.description,
      date: date || transaction.date
    });

    res.json({ success: true, transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await transaction.destroy();
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

#### 1.12 Create Main Express Server

**server.js:**
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const householdRoutes = require('./routes/household');
const transactionRoutes = require('./routes/transactions');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/household', householdRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Sync database and start server
sequelize.sync({ alter: true }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`✅ Server running on port ${process.env.PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME}`);
  });
});

module.exports = app;
```

#### 1.13 Update package.json Scripts

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "migrate": "sequelize-cli db:migrate",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

### Step 2: Frontend Setup

#### 2.1 Create React App
```bash
cd ../frontend
npm create vite@latest . -- --template react
npm install axios tailwindcss recharts react-router-dom
npm run dev
```

#### 2.2 Setup Tailwind
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js:**
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {}
  },
  plugins: []
};
```

#### 2.3 Create API Client

**src/utils/api.js:**
```javascript
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### 2.4 Create Custom Hooks

**src/hooks/useAuth.js:**
```javascript
import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    const { data } = await api.post('/auth/signup', { email, password, name });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return { user, loading, signup, login, logout };
};
```

**src/hooks/useTransactions.js:**
```javascript
import { useState, useEffect } from 'react';
import api from '../utils/api';

export const useTransactions = (householdId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (month, type, category) => {
    setLoading(true);
    try {
      const params = {};
      if (month) params.month = month;
      if (type) params.type = type;
      if (category) params.category = category;

      const { data } = await api.get(`/transactions/${householdId}`, { params });
      setTransactions(data.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    const { data } = await api.post('/transactions', {
      ...transactionData,
      householdId
    });
    setTransactions([data.transaction, ...transactions]);
    return data.transaction;
  };

  const updateTransaction = async (id, transactionData) => {
    const { data } = await api.put(`/transactions/${id}`, transactionData);
    setTransactions(transactions.map(t => t.id === id ? data.transaction : t));
    return data.transaction;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions(transactions.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (householdId) {
      fetchTransactions();
    }
  }, [householdId]);

  return { transactions, loading, fetchTransactions, addTransaction, updateTransaction, deleteTransaction };
};
```

#### 2.5 Create Login Page

**src/pages/Login.jsx:**
```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">💰 Budget Tracker</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
```

#### 2.6 Create Signup Page

**src/pages/Signup.jsx:**
```javascript
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/household-setup');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">💰 Budget Tracker</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
```

#### 2.7 Create Dashboard Page

**src/pages/Dashboard.jsx:**
```javascript
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import SummaryCards from '../components/SummaryCards';

export default function Dashboard() {
  const { user } = useAuth();
  const [householdId, setHouseholdId] = useState(null);
  const { transactions, loading, fetchTransactions, addTransaction } = useTransactions(householdId);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    const hId = localStorage.getItem('householdId');
    if (hId) setHouseholdId(parseInt(hId));
  }, []);

  useEffect(() => {
    if (householdId) {
      fetchTransactions(currentMonth);
    }
  }, [currentMonth, householdId]);

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">💰 Budget Tracker</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4">
        <SummaryCards 
          income={totalIncome} 
          expense={totalExpense}
          balance={netBalance}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <TransactionForm onAdd={addTransaction} householdId={householdId} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : transactions.length === 0 ? (
                <p className="text-gray-500">No transactions yet. Add one to get started!</p>
              ) : (
                <TransactionList transactions={transactions} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 2.8 Create Transaction Form Component

**src/components/TransactionForm.jsx:**
```javascript
import { useState } from 'react';

export default function TransactionForm({ onAdd, householdId }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Other',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const categories = {
    expense: ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'],
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other']
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: categories[value][0] })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAdd({
        ...formData,
        amount: parseFloat(formData.amount),
        householdId
      });

      setFormData({
        type: 'expense',
        amount: '',
        category: 'Other',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      alert('Error adding transaction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="expense">Expense (Money Out)</option>
            <option value="income">Income (Money In)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {categories[formData.type].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional details"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}
```

#### 2.9 Create Summary Cards Component

**src/components/SummaryCards.jsx:**
```javascript
export default function SummaryCards({ income, expense, balance }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow">
        <p className="text-gray-600 text-sm">Total Income</p>
        <p className="text-3xl font-bold text-green-600">NPR {income.toFixed(2)}</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg shadow">
        <p className="text-gray-600 text-sm">Total Expenses</p>
        <p className="text-3xl font-bold text-red-600">NPR {expense.toFixed(2)}</p>
      </div>

      <div className={`bg-gradient-to-br p-6 rounded-lg shadow ${balance >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'}`}>
        <p className="text-gray-600 text-sm">Net Balance</p>
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
          NPR {balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
```

#### 2.10 Create Transaction List Component

**src/components/TransactionList.jsx:**
```javascript
export default function TransactionList({ transactions }) {
  return (
    <div className="space-y-2">
      {transactions.map(transaction => (
        <div key={transaction.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div className="flex-1">
            <p className="font-medium">{transaction.description || transaction.category}</p>
            <p className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
            </p>
          </div>
          <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'income' ? '+' : '-'} NPR {parseFloat(transaction.amount).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}
```

#### 2.11 Create Main App Component

**src/App.jsx:**
```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import HouseholdSetup from './pages/HouseholdSetup';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
        <Route path="/household-setup" element={user ? <HouseholdSetup /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
```

### Step 3: Test Phase 1

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Visit http://localhost:5173
```

**Test Checklist:**
- [ ] Sign up with new email
- [ ] Login with credentials
- [ ] Create household with invite code
- [ ] Add 5 expenses with different categories
- [ ] Add 2 income entries
- [ ] View summary cards (income, expense, balance)
- [ ] Edit an expense
- [ ] Delete a transaction
- [ ] Invite partner with code
- [ ] Partner joins household
- [ ] Both see same transactions

---

## 📊 Phase 2: Visualizations (Weeks 4-5)

### Features (8)
- Dashboard with summary cards
- Category breakdown pie chart
- Daily spending trend line chart
- Monthly summary page
- Export monthly report to PDF
- Shareable report link
- Income vs expense comparison
- Dark mode toggle

### Key Components

**src/components/CategoryChart.jsx:**
```javascript
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export default function CategoryChart({ transactions }) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    const existing = acc.find(item => item.name === t.category);
    if (existing) {
      existing.value += parseFloat(t.amount);
    } else {
      acc.push({ name: t.category, value: parseFloat(t.amount) });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
      {categoryTotals.length === 0 ? (
        <p className="text-gray-500">No expenses to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryTotals}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(0)}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {categoryTotals.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `NPR ${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
```

**src/components/TrendChart.jsx:**
```javascript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrendChart({ transactions }) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const dailyTotals = expenseTransactions.reduce((acc, t) => {
    const date = new Date(t.date).toISOString().slice(0, 10);
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += parseFloat(t.amount);
    } else {
      acc.push({ date, amount: parseFloat(t.amount) });
    }
    return acc;
  }, []).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Daily Spending Trend</h2>
      {dailyTotals.length === 0 ? (
        <p className="text-gray-500">No expenses to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyTotals}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `NPR ${value.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
```

**src/pages/MonthlyReview.jsx:**
```javascript
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';

export default function MonthlyReview({ transactions, household }) {
  const componentRef = useRef();
  
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Monthly Review'
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Monthly Review</h1>
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            📄 Export to PDF
          </button>
        </div>

        <div ref={componentRef} className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">Monthly Budget Review</h2>
            <p className="text-gray-600">{household?.name || 'Household'} • {new Date().toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded">
              <p className="text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">NPR {totalIncome.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded">
              <p className="text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">NPR {totalExpense.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded">
              <p className="text-gray-600">Net Balance</p>
              <p className="text-2xl font-bold text-blue-600">NPR {netBalance.toFixed(2)}</p>
            </div>
          </div>

          <CategoryChart transactions={transactions} />
          <div className="mt-8">
            <TrendChart transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔍 Phase 3: Categorization & Filtering (Weeks 6-8)

### Features (7)
- Categorize transactions (predefined categories)
- Filter by category
- Filter by date range
- Filter by transaction type (income/expense)
- Search transactions
- Bill tracker (recurring expenses)
- Track who paid (income source/expense payer)

### Reports Route

**routes/reports.js:**
```javascript
const express = require('express');
const { Transaction } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const { Op } = require('sequelize');

// Get monthly summary
router.get('/monthly/:month', authMiddleware, async (req, res) => {
  try {
    const { month } = req.params;
    const householdId = req.query.householdId;

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const transactions = await Transaction.findAll({
      where: {
        householdId,
        date: { [Op.between]: [startDate, endDate] }
      }
    });

    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const netBalance = totalIncome - totalExpense;

    const categoryBreakdown = expenseTransactions.reduce((acc, t) => {
      const existing = acc.find(item => item.category === t.category);
      if (existing) {
        existing.total += parseFloat(t.amount);
      } else {
        acc.push({ category: t.category, total: parseFloat(t.amount) });
      }
      return acc;
    }, []);

    res.json({
      success: true,
      month,
      totalIncome,
      totalExpense,
      netBalance,
      transactionCount: transactions.length,
      categoryBreakdown
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

---

## 💡 Phase 4: Analytics & Planning (Weeks 9-10)

### Features (8)
- Set monthly budget limits per category
- Alert when spending exceeds 80% of budget
- Actual vs budgeted comparison chart
- Category spending breakdown table
- Savings goal tracker
- Monthly vs previous month comparison
- Yearly spending trends
- Net worth calculator

### Budget Routes

**routes/budget.js:**
```javascript
const express = require('express');
const { BudgetLimit, SavingsGoal, Transaction } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const { Op } = require('sequelize');

// Create budget limit
router.post('/limit', authMiddleware, async (req, res) => {
  try {
    const { householdId, category, limitAmount, month } = req.body;

    const limit = await BudgetLimit.create({
      householdId,
      category,
      limitAmount,
      month: month || new Date().toISOString().slice(0, 7)
    });

    res.status(201).json({ success: true, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get budget progress
router.get('/progress/:householdId', authMiddleware, async (req, res) => {
  try {
    const { householdId } = req.params;
    const currentMonth = new Date().toISOString().slice(0, 7);

    const limits = await BudgetLimit.findAll({
      where: { householdId, month: currentMonth }
    });

    const budgetData = [];
    for (const limit of limits) {
      const startDate = new Date(`${currentMonth}-01`);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

      const expenses = await Transaction.findAll({
        where: {
          householdId,
          category: limit.category,
          type: 'expense',
          date: { [Op.between]: [startDate, endDate] }
        }
      });

      const spent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
      const percentageUsed = (spent / limit.limitAmount) * 100;

      budgetData.push({
        ...limit.toJSON(),
        spent,
        percentageUsed: Math.round(percentageUsed),
        remaining: limit.limitAmount - spent,
        alert: percentageUsed >= 80
      });
    }

    res.json({ success: true, budgets: budgetData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create savings goal
router.post('/goal', authMiddleware, async (req, res) => {
  try {
    const { householdId, goalName, targetAmount, deadline } = req.body;

    const goal = await SavingsGoal.create({
      householdId,
      goalName,
      targetAmount,
      deadline
    });

    res.status(201).json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Households Table
```sql
CREATE TABLE "Households" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NPR',
  createdBy INTEGER REFERENCES "Users"(id),
  inviteCode VARCHAR(10) UNIQUE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### HouseholdUsers Table (Many-to-Many)
```sql
CREATE TABLE "HouseholdUsers" (
  id SERIAL PRIMARY KEY,
  householdId INTEGER REFERENCES "Households"(id) ON DELETE CASCADE,
  userId INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Transactions Table
```sql
CREATE TABLE "Transactions" (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  category VARCHAR(100),
  description VARCHAR(255),
  date DATE NOT NULL,
  recordedBy INTEGER REFERENCES "Users"(id),
  householdId INTEGER REFERENCES "Households"(id) ON DELETE CASCADE,
  status ENUM('pending', 'confirmed') DEFAULT 'confirmed',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  INDEX idx_householdId (householdId),
  INDEX idx_date (date),
  INDEX idx_type (type),
  INDEX idx_category (category)
);
```

### BudgetLimits Table
```sql
CREATE TABLE "BudgetLimits" (
  id SERIAL PRIMARY KEY,
  householdId INTEGER REFERENCES "Households"(id) ON DELETE CASCADE,
  category VARCHAR(100),
  limitAmount DECIMAL(10, 2),
  month VARCHAR(7),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  INDEX idx_householdMonth (householdId, month)
);
```

### SavingsGoals Table
```sql
CREATE TABLE "SavingsGoals" (
  id SERIAL PRIMARY KEY,
  householdId INTEGER REFERENCES "Households"(id) ON DELETE CASCADE,
  goalName VARCHAR(255),
  targetAmount DECIMAL(10, 2),
  currentAmount DECIMAL(10, 2) DEFAULT 0,
  deadline DATE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/signup              Register new user
POST   /api/auth/login               Login user
```

### Household
```
POST   /api/household                Create household
GET    /api/household                Get current household
POST   /api/household/join           Join with invite code
```

### Transactions
```
POST   /api/transactions             Create transaction (income/expense)
GET    /api/transactions/:householdId List with filters
PUT    /api/transactions/:id         Update transaction
DELETE /api/transactions/:id         Delete transaction
```

### Reports
```
GET    /api/reports/monthly/:month   Get monthly summary & breakdown
```

### Budget
```
POST   /api/budget/limit             Set budget limit
GET    /api/budget/progress/:householdId Get budget progress & alerts
POST   /api/budget/goal              Create savings goal
```

---

## 🚀 Deployment Guide

### Backend (Render / Heroku)

1. Create `Procfile`:
```
web: npm start
release: npx sequelize-cli db:migrate
```

2. Set environment variables in dashboard
3. Deploy:
```bash
git push heroku main
```

### Frontend (Vercel / Netlify)

1. Create `.env.production`:
```
VITE_API_URL=https://your-backend.herokuapp.com/api
```

2. Deploy:
```bash
npm run build
# Upload dist/ to Vercel/Netlify
```

---

## 🧪 Testing Checklist

**Phase 1:**
- [ ] Signup works
- [ ] Login works
- [ ] Create household
- [ ] Invite partner
- [ ] Partner joins
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] View transactions
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] Summary cards show correct totals

**Phase 2:**
- [ ] Category chart displays
- [ ] Trend chart displays
- [ ] Export to PDF works
- [ ] Monthly review page loads

**Phase 3:**
- [ ] Filter by category works
- [ ] Filter by date range works
- [ ] Filter by type (income/expense) works
- [ ] Search transactions works

**Phase 4:**
- [ ] Can set budget limits
- [ ] Alert shows at 80%
- [ ] Budget chart displays
- [ ] Savings goal tracker works

---

## 🎯 Success Metrics

After 10 weeks, you should have:
- ✅ 30+ functional features
- ✅ Full-stack production-ready app
- ✅ Mobile responsive
- ✅ Real-time data sync
- ✅ Professional charts & visualizations
- ✅ Complete budget tracking system
- ✅ Monthly reports & analysis
- ✅ Deployed on production servers

---

**Happy coding! Build this step by step, test thoroughly, and enjoy tracking your household budget together! 🚀**
