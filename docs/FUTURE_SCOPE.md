# Future Scope & Feature Roadmap

## 📋 Overview
This document outlines planned features and enhancements for the Market Agent Dashboard project.

---

## 🎯 Priority Features

### 1. Display Latest Data Retrieval Date
**Priority:** HIGH  
**Status:** Planned

#### Description
Show users when the market data was last updated to ensure data freshness awareness.

#### Implementation Details

**Frontend Changes:**
- Add a timestamp display in the header/navigation bar
- Show "Last Updated: Nov 13, 2025, 7:30 PM IST" format
- Add refresh indicator/icon
- Color-code freshness:
  - 🟢 Green: < 6 hours old
  - 🟡 Yellow: 6-12 hours old
  - 🔴 Red: > 12 hours old

**Data Source:**
- Read `last_updated` field from stock summary JSON files
- Example: `"last_updated": "2025-11-13T18:49:21.971253"`

**Files to Modify:**
```
frontend/src/components/Navigation.tsx
frontend/src/services/marketData.ts
frontend/src/types/index.ts (add LastUpdateInfo interface)
```

**Code Snippet:**
```typescript
// Add to marketData.ts
export const getLastUpdateTime = async (): Promise<Date> => {
  try {
    const summary = await fetchStockSummary('RELIANCE');
    return new Date(summary.last_updated);
  } catch (error) {
    return new Date();
  }
};

// Add to Navigation.tsx
const LastUpdateBadge = () => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  useEffect(() => {
    getLastUpdateTime().then(setLastUpdate);
  }, []);
  
  return (
    <div className="text-sm text-gray-600">
      Last Updated: {lastUpdate?.toLocaleString('en-IN')}
    </div>
  );
};
```

#### Estimated Effort
- Development: 2-3 hours
- Testing: 1 hour

---

### 2. Portfolio Import via Excel
**Priority:** HIGH  
**Status:** Planned

#### Description
Allow users to upload an Excel file with their portfolio holdings instead of manually adding stocks one by one.

#### User Flow
1. User clicks "Import Portfolio" button
2. File picker opens (accepts .xlsx, .xls, .csv)
3. User selects Excel file with portfolio data
4. System validates and previews data
5. User confirms import
6. Portfolio data saved to localStorage

#### Excel File Format

**Expected Columns:**
| Ticker | Quantity | Purchase Price | Purchase Date |
|--------|----------|----------------|---------------|
| RELIANCE.NS | 10 | 1450.00 | 2024-01-15 |
| TCS.NS | 5 | 3500.00 | 2024-02-20 |
| INFY.NS | 15 | 1400.00 | 2024-03-10 |

**Template File:** Create `docs/templates/portfolio_template.xlsx`

#### Implementation Details

**Required Libraries:**
```bash
npm install xlsx
npm install @types/xlsx --save-dev
```

**Frontend Changes:**

**New Component:** `frontend/src/components/PortfolioImport.tsx`
```typescript
import * as XLSX from 'xlsx';

interface ImportedHolding {
  ticker: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
}

const PortfolioImport = () => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<ImportedHolding>(worksheet);
      
      // Validate and save to portfolio
      validateAndImport(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const validateAndImport = (data: ImportedHolding[]) => {
    // Validate ticker format
    // Check if stocks exist in available tickers
    // Save to localStorage via portfolio service
  };

  return (
    <div className="p-4">
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
        id="portfolio-upload"
      />
      <label
        htmlFor="portfolio-upload"
        className="btn btn-primary cursor-pointer"
      >
        📊 Import from Excel
      </label>
    </div>
  );
};
```

**Service Layer:** Update `frontend/src/services/portfolio.ts`
```typescript
export const importPortfolio = (holdings: ImportedHolding[]): void => {
  const validHoldings = holdings.filter(h => 
    // Validate ticker exists
    availableTickers.includes(h.ticker)
  );
  
  // Clear existing portfolio or merge?
  localStorage.setItem('portfolio', JSON.stringify(validHoldings));
};
```

**Files to Create/Modify:**
```
frontend/src/components/PortfolioImport.tsx (NEW)
frontend/src/services/portfolio.ts (UPDATE)
frontend/src/pages/Portfolio.tsx (UPDATE - add import button)
docs/templates/portfolio_template.xlsx (NEW)
docs/IMPORT_GUIDE.md (NEW - user documentation)
```

#### Validation Rules
- ✅ Ticker must be in format `SYMBOL.NS` or `SYMBOL.BO`
- ✅ Ticker must exist in available stocks list
- ✅ Quantity must be positive integer
- ✅ Purchase price must be positive number
- ✅ Purchase date must be valid date (YYYY-MM-DD)
- ❌ Reject duplicate tickers
- ⚠️  Warn if purchase date is in future

#### Error Handling
- Invalid file format → Show error message
- Missing columns → Show required columns list
- Invalid tickers → Highlight invalid rows, allow partial import
- Empty file → Show "No data found" message

#### Estimated Effort
- Development: 6-8 hours
- Template creation: 1 hour
- Documentation: 2 hours
- Testing: 3 hours

---

## 🚀 Additional Future Features

### 3. Export Portfolio to Excel
**Priority:** MEDIUM  
**Status:** Planned

Allow users to download their current portfolio as Excel file with current values and P&L.

**Export Format:**
| Ticker | Quantity | Purchase Price | Current Price | Investment | Current Value | P&L | P&L % |
|--------|----------|----------------|---------------|------------|---------------|-----|-------|

---

### 4. Portfolio Performance Charts
**Priority:** MEDIUM  
**Status:** Planned

- Overall portfolio value over time
- Individual stock performance comparison
- Sector-wise allocation pie chart
- P&L trends (daily, weekly, monthly)

---

### 5. Price Alerts
**Priority:** MEDIUM  
**Status:** Planned

- Set target price alerts for stocks
- Email/browser notifications when target reached
- Stop-loss alerts

**Implementation:**
- Use Web Push API for browser notifications
- Store alerts in localStorage
- Check alerts when data refreshes

---

### 6. Real-Time Data Updates
**Priority:** LOW (Cost implications)  
**Status:** Research Phase

**Options:**
1. **WebSocket Integration**
   - Provider: Alpha Vantage, Polygon.io
   - Cost: $50-200/month
   - Latency: < 1 second

2. **Serverless Function**
   - Deploy AWS Lambda/Vercel Functions
   - Fetch on-demand from yfinance
   - Cost: ~$5/month for moderate usage

3. **Increase GitHub Actions Frequency**
   - From 6 hours to 1 hour
   - Free tier: 2000 minutes/month
   - Current usage: ~10 minutes/run × 4 runs/day = 1200 min/month
   - New usage: ~10 minutes × 24 runs/day = 7200 min/month (exceeds free tier)

---

### 7. Advanced Analytics
**Priority:** LOW  
**Status:** Planned

- Portfolio diversification score
- Risk analysis (beta, volatility)
- Correlation matrix between holdings
- Rebalancing recommendations
- Tax loss harvesting suggestions

---

### 8. Multi-Currency Support
**Priority:** LOW  
**Status:** Planned

- Support for USD, EUR, GBP alongside INR
- Currency conversion rates
- International stocks (US, UK markets)

---

### 9. Mobile App
**Priority:** LOW  
**Status:** Planned

- React Native mobile app
- Push notifications for alerts
- Offline data caching
- Face ID/Touch ID for security

---

### 10. Social Features
**Priority:** LOW  
**Status:** Planned

- Share portfolio performance (anonymized)
- Community recommendations
- Expert insights/tips
- Discussion forums

---

## 🛠️ Technical Debt & Improvements

### Code Quality
- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Improve error handling and logging
- [ ] Add loading states and skeleton screens
- [ ] Implement proper error boundaries

### Performance
- [ ] Implement data caching strategy
- [ ] Lazy load chart components
- [ ] Optimize bundle size (code splitting)
- [ ] Add service worker for offline support

### Security
- [ ] Implement authentication (Firebase/Auth0)
- [ ] Encrypt sensitive portfolio data
- [ ] Rate limiting for API calls
- [ ] CORS configuration

### DevOps
- [ ] Add staging environment
- [ ] Implement CI/CD pipeline tests
- [ ] Add performance monitoring (Lighthouse CI)
- [ ] Set up error tracking (Sentry)

---

## 📊 Feature Priority Matrix

| Feature | Priority | Effort | Impact | Status |
|---------|----------|--------|--------|--------|
| Latest Data Display | HIGH | Low | High | Planned |
| Excel Import | HIGH | Medium | High | Planned |
| Excel Export | MEDIUM | Low | Medium | Planned |
| Performance Charts | MEDIUM | Medium | High | Planned |
| Price Alerts | MEDIUM | Medium | Medium | Planned |
| Real-Time Data | LOW | High | High | Research |
| Advanced Analytics | LOW | High | Medium | Planned |
| Multi-Currency | LOW | Medium | Low | Planned |
| Mobile App | LOW | High | Medium | Planned |
| Social Features | LOW | High | Low | Planned |

---

## 📝 Implementation Timeline

### Phase 1: Q1 2026 (Jan-Mar)
- ✅ Latest data retrieval date display
- ✅ Portfolio import via Excel
- ✅ Portfolio export to Excel

### Phase 2: Q2 2026 (Apr-Jun)
- ⏳ Portfolio performance charts
- ⏳ Price alerts system
- ⏳ Unit tests implementation

### Phase 3: Q3 2026 (Jul-Sep)
- ⏳ Advanced analytics
- ⏳ Real-time data integration (if budget allows)
- ⏳ Mobile app development

### Phase 4: Q4 2026 (Oct-Dec)
- ⏳ Multi-currency support
- ⏳ Social features
- ⏳ Production optimization

---

## 🤝 Contributing

If you'd like to contribute to any of these features:

1. Check if there's an existing issue
2. Comment on the issue to avoid duplicate work
3. Fork the repository
4. Create a feature branch
5. Submit a pull request

---

## 📞 Contact & Feedback

Have ideas for new features? Found a bug? Want to contribute?

- **GitHub Issues:** https://github.com/JyotBuch/market-agent/issues
- **Discussions:** https://github.com/JyotBuch/market-agent/discussions

---

## 📚 References

### Libraries & APIs
- **Excel Processing:** [SheetJS (xlsx)](https://sheetjs.com/)
- **Real-Time Data:** [Alpha Vantage](https://www.alphavantage.co/), [Polygon.io](https://polygon.io/)
- **Charts:** [Recharts](https://recharts.org/), [Chart.js](https://www.chartjs.org/)
- **Notifications:** [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

### Learning Resources
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Last Updated:** November 13, 2025  
**Version:** 1.0  
**Maintainer:** JyotBuch
