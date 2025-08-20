# Search System Deprecation Notice

## ⚠️ Important: Old Search System Deprecated

**Date**: December 2024  
**Status**: DEPRECATED - No longer the default search system

## 🔄 What Changed

The Dog Services Directory has **migrated to a new, superior search system** that replaces the old complex search implementation.

### **Old System (DEPRECATED)**
- **Complex SearchForm** with multiple toggles and filters
- **Hardcoded service types** and limited state support
- **Complex state management** with multiple hooks
- **Limited natural language processing**
- **Manual service type configuration**

### **New System (ACTIVE)**
- **Dynamic service type detection** from database
- **Comprehensive state support** (all 50 US states + territories)
- **Advanced natural language processing** with 22+ proximity patterns
- **Zip code search support**
- **Simplified, user-friendly interface**
- **Automatic database adaptation**

## 🚫 Deprecated Components

The following components are **no longer used** and should not be referenced in new code:

### **Components to Avoid:**
- ❌ `components/search/SearchForm.tsx` - Old complex form
- ❌ `components/search/SearchSection.tsx` - Old search section
- ❌ `hooks/useSearchServices.ts` - Old search hook
- ❌ `hooks/useServicesQuery.ts` - Old query hook
- ❌ `lib/search/` directory - Old search library

### **Components to Use:**
- ✅ `app/homepage-v2/components/SearchFormV2.tsx` - New simplified form
- ✅ `app/api/search-simple/route.ts` - New dynamic search API
- ✅ `app/search-results/components/SearchResultsPage.tsx` - New results page
- ✅ `components/search/SearchResultsDisplay.tsx` - Results display (updated)

## 🔧 Migration Guide

### **For Developers:**

**Old Search Implementation:**
```typescript
// ❌ DEPRECATED - Don't use this
import { SearchForm } from '@/components/search/SearchForm';
import { useSearchServices } from '@/hooks/useSearchServices';

<SearchForm onSearch={handleSearch} />
```

**New Search Implementation:**
```typescript
// ✅ ACTIVE - Use this instead
import { SearchFormV2 } from '@/app/homepage-v2/components/SearchFormV2';

<SearchFormV2 onSearch={handleSearch} />
```

### **For API Calls:**

**Old API Endpoint:**
```typescript
// ❌ DEPRECATED
fetch('/api/search', { ... })
```

**New API Endpoint:**
```typescript
// ✅ ACTIVE
fetch('/api/search-simple', { ... })
```

## 📊 Benefits of New System

| Feature | Old System | New System |
|---------|------------|------------|
| **Service Types** | 5 hardcoded | Dynamic from database |
| **States Supported** | 5 states | All 50 + territories |
| **Proximity Patterns** | 2 patterns | 22+ patterns |
| **Zip Code Search** | ❌ No | ✅ Yes |
| **Natural Language** | Basic | Advanced |
| **Maintenance** | High | Low |
| **Scalability** | Unlimited | Unlimited |

## 🗓️ Timeline

- **✅ December 2024**: New system becomes default
- **⚠️ January 2025**: Old system marked as deprecated
- **🗑️ March 2025**: Old system components removed
- **🔒 April 2025**: Old API endpoints disabled

## 🚨 Action Required

### **Immediate Actions:**
1. **Update imports** to use new search components
2. **Migrate API calls** to `/api/search-simple`
3. **Remove references** to deprecated search hooks
4. **Test new functionality** with dynamic service types

### **Code Updates Needed:**
- Replace `SearchForm` with `SearchFormV2`
- Update search API endpoints
- Remove old search hook dependencies
- Update search result handling

## 📚 Documentation

- **New Search Capabilities**: `docs/search-capabilities.md`
- **API Reference**: See `/api/search-simple` endpoint
- **Component Usage**: See `SearchFormV2` examples

## 🆘 Support

If you need help migrating from the old search system:

1. **Check the new documentation** first
2. **Review the new search examples** in the codebase
3. **Test with the new API endpoints**
4. **Contact the development team** for complex migrations

---

**Remember**: The new search system is **more powerful, more maintainable, and more user-friendly**. Migrate early to take advantage of all the new features!
