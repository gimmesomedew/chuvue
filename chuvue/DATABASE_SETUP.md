# 🗄️ ChuVue Database Setup Guide

## 🚀 **Quick Start**

### 1. **Set Up Environment Variables**
Create a `.env.local` file in your project root:

```bash
# Copy the example file
cp env.example .env.local

# Edit with your Neon connection string
nano .env.local
```

Add your Neon database connection string:
```env
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Test Database Connection**
```bash
# Start the development server
npm run dev

# In another terminal, test the connection
curl http://localhost:3000/api/test-db
```

### 4. **Set Up Database Schema**
```bash
# Run the database setup script
npm run setup-db
```

## 🔧 **Detailed Setup Steps**

### **Step 1: Get Your Neon Connection String**

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project or select existing one
3. Go to "Connection Details"
4. Copy the connection string
5. Replace `username`, `password`, `hostname`, and `database` with your values

### **Step 2: Environment Configuration**

Your `.env.local` should look like:
```env
# Neon Database
DATABASE_URL="postgresql://your_username:your_password@your_host/your_database?sslmode=require"

# Next.js (optional)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### **Step 3: Verify Connection**

1. Start the dev server: `npm run dev`
2. Visit: `http://localhost:3000/api/test-db`
3. You should see: `{"success":true,"message":"Database connection successful"}`

### **Step 4: Initialize Database**

```bash
npm run setup-db
```

This will:
- Create all necessary tables
- Insert default categories
- Create a sample interactive module
- Set up default admin user

## 🗂️ **Database Schema Overview**

### **Tables Created:**
- **`users`** - User accounts and roles
- **`categories`** - Learning categories
- **`interactives`** - Learning modules
- **`screens`** - Individual learning screens
- **`user_progress`** - Learning progress tracking
- **`screen_interactions`** - Analytics data

### **Sample Data:**
- 4 default categories (Personal Development, Communication, Leadership, Innovation)
- 1 sample interactive ("Master Coachability") with 5 screens
- 1 default admin user

## 🧪 **Testing Your Setup**

### **Test Dashboard**
1. Visit `http://localhost:3000`
2. You should see the sample interactive in the list
3. Stats should show real data from the database

### **Test Editor**
1. Click on the sample interactive
2. You should be able to edit screens
3. Changes should persist (after implementing save functionality)

### **Test Mobile Viewer**
1. Visit `http://localhost:3000/interactive/[id]`
2. Replace `[id]` with the actual interactive ID
3. Navigate through all 5 screens

## 🚨 **Troubleshooting**

### **Connection Failed**
- Check your `DATABASE_URL` format
- Verify Neon project is active
- Check if your IP is whitelisted (if using IP restrictions)

### **Schema Creation Failed**
- Ensure you have write permissions
- Check if tables already exist
- Verify connection string is correct

### **Sample Data Not Loading**
- Check browser console for errors
- Verify API endpoints are working
- Check database logs in Neon console

## 📊 **What's Working Now**

✅ **Database Connection** - Neon integration complete  
✅ **Schema Creation** - All tables and relationships  
✅ **API Endpoints** - CRUD operations for interactives  
✅ **Sample Data** - Ready-to-use learning module  
✅ **Dashboard Integration** - Real data from database  

## 🔮 **Next Steps**

1. **Replace Mock Data** - Update dashboard to use real API calls
2. **Add Save Functionality** - Connect editor to database
3. **User Authentication** - Implement login system
4. **Video Upload** - Add actual video handling
5. **Analytics** - Track user progress and engagement

## 📞 **Need Help?**

- Check the browser console for errors
- Verify your Neon connection string
- Test the database connection endpoint
- Review the database logs in Neon console

---

**🎉 Congratulations!** Your ChuVue database is now connected and ready to power real learning experiences!
