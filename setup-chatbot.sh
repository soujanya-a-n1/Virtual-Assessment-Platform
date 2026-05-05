#!/bin/bash

# Chatbot Setup Script for Virtual Assessment Platform
# This script sets up the chatbot feature

echo "=========================================="
echo "  Chatbot Setup - Virtual Assessment"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}Error: backend/.env file not found!${NC}"
    echo "Please create backend/.env file first."
    exit 1
fi

# Load database credentials from .env
source backend/.env

echo -e "${BLUE}Step 1: Creating chat_messages table...${NC}"

# Run the migration
mysql -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} < database/chatbot_migration.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database table created successfully!${NC}"
else
    echo -e "${RED}✗ Failed to create database table${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Verifying backend files...${NC}"

# Check if backend files exist
if [ -f "backend/src/controllers/chatbotController.js" ] && \
   [ -f "backend/src/routes/chatbotRoutes.js" ] && \
   [ -f "backend/src/models/ChatMessage.js" ]; then
    echo -e "${GREEN}✓ Backend files verified!${NC}"
else
    echo -e "${RED}✗ Some backend files are missing${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 3: Verifying frontend files...${NC}"

# Check if frontend files exist
if [ -f "frontend/src/components/Chatbot.js" ] && \
   [ -f "frontend/src/components/Chatbot.css" ]; then
    echo -e "${GREEN}✓ Frontend files verified!${NC}"
else
    echo -e "${RED}✗ Some frontend files are missing${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 4: Checking server.js integration...${NC}"

if grep -q "chatbotRoutes" backend/src/server.js; then
    echo -e "${GREEN}✓ Chatbot routes integrated in server.js!${NC}"
else
    echo -e "${RED}✗ Chatbot routes not found in server.js${NC}"
    echo "Please add the following to backend/src/server.js:"
    echo "  const chatbotRoutes = require('./routes/chatbotRoutes');"
    echo "  app.use('/api/chatbot', chatbotRoutes);"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 5: Checking App.js integration...${NC}"

if grep -q "Chatbot" frontend/src/App.js; then
    echo -e "${GREEN}✓ Chatbot component integrated in App.js!${NC}"
else
    echo -e "${RED}✗ Chatbot component not found in App.js${NC}"
    echo "Please add the following to frontend/src/App.js:"
    echo "  import Chatbot from './components/Chatbot';"
    echo "  {isAuthenticated && <Chatbot />}"
    exit 1
fi

echo ""
echo -e "${GREEN}=========================================="
echo "  ✓ Chatbot Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Restart your backend server: cd backend && npm run dev"
echo "2. Restart your frontend: cd frontend && npm start"
echo "3. Login to the platform"
echo "4. Look for the chat button in the bottom-right corner"
echo ""
echo "For more information, see CHATBOT_GUIDE.md"
echo ""
