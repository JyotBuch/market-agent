#!/bin/bash

# Pre-Deployment Checklist Script
# Validates that everything is ready for deployment

echo "╔════════════════════════════════════════════════════════╗"
echo "║    Market Agent - Pre-Deployment Checklist            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

errors=0

# Check Python files
echo "🐍 Checking Python setup..."
if [ -f "scripts/fetch_data.py" ]; then
    echo "✅ fetch_data.py exists"
else
    echo "❌ fetch_data.py missing"
    ((errors++))
fi

if [ -f "requirements.txt" ]; then
    echo "✅ requirements.txt exists"
else
    echo "❌ requirements.txt missing"
    ((errors++))
fi

# Check config files
echo ""
echo "⚙️  Checking configuration..."
if [ -f "config/stocks.json" ]; then
    echo "✅ stocks.json exists"
else
    echo "❌ stocks.json missing"
    ((errors++))
fi

if [ -f "config/thresholds.json" ]; then
    echo "✅ thresholds.json exists"
else
    echo "❌ thresholds.json missing"
    ((errors++))
fi

# Check data files
echo ""
echo "📊 Checking sample data..."
data_files=$(find data -name "*.json" 2>/dev/null | wc -l)
if [ "$data_files" -gt 0 ]; then
    echo "✅ Found $data_files data files"
else
    echo "⚠️  No data files found - run: python scripts/fetch_data.py"
fi

# Check workflows
echo ""
echo "🔄 Checking GitHub Actions..."
if [ -f ".github/workflows/fetch_market_data.yml" ]; then
    echo "✅ fetch_market_data.yml exists"
else
    echo "❌ fetch_market_data.yml missing"
    ((errors++))
fi

if [ -f ".github/workflows/deploy.yml" ]; then
    echo "✅ deploy.yml exists"
else
    echo "❌ deploy.yml missing"
    ((errors++))
fi

# Check frontend
echo ""
echo "⚛️  Checking frontend..."
if [ -f "frontend/package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json missing"
    ((errors++))
fi

if [ -f "frontend/vite.config.ts" ]; then
    echo "✅ vite.config.ts exists"
    
    # Check if base path is configured
    if grep -q "base:" "frontend/vite.config.ts"; then
        echo "✅ Base path configured in vite.config.ts"
    else
        echo "⚠️  Base path not set in vite.config.ts"
        echo "   Add: base: '/YOUR-REPO-NAME/'"
    fi
else
    echo "❌ vite.config.ts missing"
    ((errors++))
fi

if [ -d "frontend/src/pages" ]; then
    page_count=$(find frontend/src/pages -name "*.tsx" 2>/dev/null | wc -l)
    echo "✅ Found $page_count pages"
else
    echo "❌ Pages directory missing"
    ((errors++))
fi

if [ -d "frontend/src/components" ]; then
    component_count=$(find frontend/src/components -name "*.tsx" 2>/dev/null | wc -l)
    echo "✅ Found $component_count components"
else
    echo "❌ Components directory missing"
    ((errors++))
fi

# Check documentation
echo ""
echo "📚 Checking documentation..."
docs=("README.md" "QUICKSTART.md" "DEPLOYMENT.md" "LICENSE")
for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc exists"
    else
        echo "❌ $doc missing"
        ((errors++))
    fi
done

# Summary
echo ""
echo "╔════════════════════════════════════════════════════════╗"

if [ $errors -eq 0 ]; then
    echo "║        ✅ All Checks Passed! Ready to Deploy!         ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "🚀 Next steps:"
    echo ""
    echo "1. Review vite.config.ts and set your repo name"
    echo "2. Initialize git: git init"
    echo "3. Add remote: git remote add origin YOUR_REPO_URL"
    echo "4. Commit: git add . && git commit -m 'Initial commit'"
    echo "5. Push: git push -u origin master"
    echo "6. Enable GitHub Pages in repository settings"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
    exit 0
else
    echo "║       ⚠️  Found $errors Error(s) - Fix Before Deploy     ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
