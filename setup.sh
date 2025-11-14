#!/bin/bash

# Market Agent Setup Script
# This script helps you set up the project quickly

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════╗"
echo "║         Market Agent - Setup Script                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check Python version
echo "🔍 Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✅ Python $python_version found"
echo ""

# Check Node.js version
echo "🔍 Checking Node.js version..."
node_version=$(node --version)
echo "✅ Node.js $node_version found"
echo ""

# Setup Python environment
echo "🐍 Setting up Python environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "✅ Python dependencies installed"
echo ""

# Fetch initial data
echo "📊 Fetching market data..."
python scripts/fetch_data.py
echo "✅ Market data fetched"
echo ""

# Setup frontend
echo "⚛️  Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    echo "✅ Node.js dependencies installed"
else
    echo "✅ Node.js dependencies already installed"
fi

cd ..
echo ""

# Done
echo "╔════════════════════════════════════════════════════════╗"
echo "║             ✅ Setup Complete!                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 To start the development server:"
echo ""
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "📱 The app will be available at: http://localhost:5173"
echo ""
echo "📚 For deployment instructions, see DEPLOYMENT.md"
echo ""
