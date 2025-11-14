# Implementation Guide: Priority Features

## Feature 1: Display Latest Data Retrieval Date

### Step-by-Step Implementation

#### 1. Update Type Definitions
**File:** `frontend/src/types/index.ts`

Add new interface:
```typescript
export interface DataFreshness {
  lastUpdated: Date;
  hoursAgo: number;
  status: 'fresh' | 'stale' | 'outdated';
}
```

#### 2. Create Utility Function
**File:** `frontend/src/utils/dataFreshness.ts` (NEW)

```typescript
export const getDataFreshness = (lastUpdated: string): DataFreshness => {
  const updateTime = new Date(lastUpdated);
  const now = new Date();
  const hoursAgo = (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60);
  
  let status: 'fresh' | 'stale' | 'outdated';
  if (hoursAgo < 6) status = 'fresh';
  else if (hoursAgo < 12) status = 'stale';
  else status = 'outdated';
  
  return { lastUpdated: updateTime, hoursAgo, status };
};

export const formatUpdateTime = (date: Date): string => {
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });
};
```

#### 3. Update Navigation Component
**File:** `frontend/src/components/Navigation.tsx`

Add this component:
```typescript
const DataFreshnessBadge: React.FC = () => {
  const [freshness, setFreshness] = useState<DataFreshness | null>(null);

  useEffect(() => {
    const checkFreshness = async () => {
      try {
        const summary = await fetchStockSummary('RELIANCE');
        const freshnessData = getDataFreshness(summary.last_updated);
        setFreshness(freshnessData);
      } catch (error) {
        console.error('Error checking data freshness:', error);
      }
    };

    checkFreshness();
    // Refresh every 5 minutes
    const interval = setInterval(checkFreshness, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!freshness) return null;

  const statusColors = {
    fresh: 'bg-green-100 text-green-800',
    stale: 'bg-yellow-100 text-yellow-800',
    outdated: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    fresh: '🟢',
    stale: '🟡',
    outdated: '🔴'
  };

  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[freshness.status]}`}>
      {statusIcons[freshness.status]} Last Updated: {formatUpdateTime(freshness.lastUpdated)}
      <span className="ml-2 text-xs opacity-75">
        ({freshness.hoursAgo.toFixed(1)}h ago)
      </span>
    </div>
  );
};
```

Add to Navigation return statement:
```typescript
<nav className="bg-white shadow-sm">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      {/* Existing navigation items */}
      <DataFreshnessBadge />
    </div>
  </div>
</nav>
```

---

## Feature 2: Portfolio Import via Excel

### Step-by-Step Implementation

#### 1. Install Dependencies
```bash
cd frontend
npm install xlsx
npm install --save-dev @types/xlsx
```

#### 2. Create Template File
**File:** `docs/templates/portfolio_template.xlsx`

Create Excel with these columns:
- Ticker (e.g., RELIANCE.NS)
- Quantity (number)
- Purchase Price (number)
- Purchase Date (YYYY-MM-DD)

#### 3. Create Import Component
**File:** `frontend/src/components/PortfolioImport.tsx` (NEW)

```typescript
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { addToPortfolio } from '../services/portfolio';
import { fetchAvailableTickers } from '../services/marketData';

interface ImportedHolding {
  Ticker: string;
  Quantity: number;
  'Purchase Price': number;
  'Purchase Date': string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export const PortfolioImport: React.FC = () => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [preview, setPreview] = useState<ImportedHolding[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateHolding = (holding: ImportedHolding, row: number, availableTickers: string[]): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validate ticker
    if (!holding.Ticker) {
      errors.push({ row, field: 'Ticker', message: 'Ticker is required' });
    } else if (!availableTickers.includes(holding.Ticker)) {
      errors.push({ row, field: 'Ticker', message: `${holding.Ticker} is not available` });
    }

    // Validate quantity
    if (!holding.Quantity || holding.Quantity <= 0 || !Number.isInteger(holding.Quantity)) {
      errors.push({ row, field: 'Quantity', message: 'Quantity must be a positive integer' });
    }

    // Validate purchase price
    if (!holding['Purchase Price'] || holding['Purchase Price'] <= 0) {
      errors.push({ row, field: 'Purchase Price', message: 'Purchase price must be positive' });
    }

    // Validate date
    const date = new Date(holding['Purchase Date']);
    if (isNaN(date.getTime())) {
      errors.push({ row, field: 'Purchase Date', message: 'Invalid date format (use YYYY-MM-DD)' });
    } else if (date > new Date()) {
      errors.push({ row, field: 'Purchase Date', message: 'Purchase date cannot be in future' });
    }

    return errors;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);
    setPreview([]);

    try {
      const availableTickers = await fetchAvailableTickers();
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<ImportedHolding>(worksheet);

          if (jsonData.length === 0) {
            setErrors([{ row: 0, field: 'File', message: 'Excel file is empty' }]);
            setIsProcessing(false);
            return;
          }

          // Validate all holdings
          const allErrors: ValidationError[] = [];
          jsonData.forEach((holding, index) => {
            const holdingErrors = validateHolding(holding, index + 2, availableTickers); // +2 for header row
            allErrors.push(...holdingErrors);
          });

          if (allErrors.length > 0) {
            setErrors(allErrors);
          } else {
            setPreview(jsonData);
            setShowPreview(true);
          }
        } catch (error) {
          setErrors([{ row: 0, field: 'File', message: 'Invalid Excel file format' }]);
        }
        setIsProcessing(false);
      };

      reader.onerror = () => {
        setErrors([{ row: 0, field: 'File', message: 'Error reading file' }]);
        setIsProcessing(false);
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      setErrors([{ row: 0, field: 'File', message: 'Error processing file' }]);
      setIsProcessing(false);
    }

    // Reset input
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    preview.forEach(holding => {
      addToPortfolio(
        holding.Ticker,
        holding.Quantity,
        holding['Purchase Price'],
        holding['Purchase Date']
      );
    });

    alert(`Successfully imported ${preview.length} holdings!`);
    setShowPreview(false);
    setPreview([]);
    window.location.reload(); // Refresh to show new portfolio
  };

  const downloadTemplate = () => {
    const template = [
      { Ticker: 'RELIANCE.NS', Quantity: 10, 'Purchase Price': 1450, 'Purchase Date': '2024-01-15' },
      { Ticker: 'TCS.NS', Quantity: 5, 'Purchase Price': 3500, 'Purchase Date': '2024-02-20' },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Portfolio');
    XLSX.writeFile(wb, 'portfolio_template.xlsx');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">📊 Import Portfolio from Excel</h3>
      
      <div className="flex gap-4 mb-4">
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="hidden"
          id="portfolio-upload"
          disabled={isProcessing}
        />
        <label
          htmlFor="portfolio-upload"
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? '⏳ Processing...' : '📤 Upload Excel File'}
        </label>

        <button
          onClick={downloadTemplate}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          📥 Download Template
        </button>
      </div>

      {/* Errors Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-red-800 mb-2">⚠️ Validation Errors ({errors.length})</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, idx) => (
              <li key={idx}>
                Row {error.row}, {error.field}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-semibold mb-4">Preview Import ({preview.length} holdings)</h3>
            
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ticker</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purchase Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Purchase Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {preview.map((holding, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm">{holding.Ticker}</td>
                      <td className="px-4 py-2 text-sm">{holding.Quantity}</td>
                      <td className="px-4 py-2 text-sm">₹{holding['Purchase Price'].toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">{holding['Purchase Date']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                ✅ Confirm Import
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 mt-4">
        <p className="mb-2">📋 <strong>Required columns:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li><code>Ticker</code> - Stock symbol with exchange (e.g., RELIANCE.NS)</li>
          <li><code>Quantity</code> - Number of shares (positive integer)</li>
          <li><code>Purchase Price</code> - Price per share in INR</li>
          <li><code>Purchase Date</code> - Date in YYYY-MM-DD format</li>
        </ul>
      </div>
    </div>
  );
};
```

#### 4. Update Portfolio Page
**File:** `frontend/src/pages/Portfolio.tsx`

Add import at top:
```typescript
import { PortfolioImport } from '../components/PortfolioImport';
```

Add component before portfolio list:
```typescript
return (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>
    
    <PortfolioImport />  {/* Add this line */}
    
    {/* Existing portfolio content */}
  </div>
);
```

#### 5. Test the Feature

1. Download the template
2. Fill in some test data
3. Upload the file
4. Check for validation errors
5. Preview the data
6. Confirm import
7. Verify data in portfolio

---

## Testing Checklist

### Latest Data Display
- [ ] Badge appears in navigation
- [ ] Shows correct timestamp
- [ ] Color changes based on freshness
- [ ] Updates automatically every 5 minutes
- [ ] Handles errors gracefully

### Excel Import
- [ ] Template downloads correctly
- [ ] File upload works
- [ ] Validates all fields
- [ ] Shows errors clearly
- [ ] Preview shows correct data
- [ ] Import saves to portfolio
- [ ] Handles invalid files
- [ ] Works with .xlsx, .xls, .csv

---

## Next Steps

1. Implement Feature 1 (2-3 hours)
2. Test Feature 1 (1 hour)
3. Implement Feature 2 (6-8 hours)
4. Test Feature 2 (3 hours)
5. Create user documentation
6. Commit and deploy

---

**Created:** November 13, 2025  
**Author:** JyotBuch
