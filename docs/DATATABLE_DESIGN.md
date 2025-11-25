# DataTable Component - Design Document

## Overview

A production-ready, feature-rich DataTable component that integrates seamlessly with our simplified collection system. Built with TailwindCSS and Vue 3 Composition API.

## Architecture

```
┌──────────────────────────────────────────────────┐
│                   TOOLBAR                        │ ← 50-60px (Fixed)
│  [+ Add] [↻ Refresh] [Filter] [Export] [Search] │
├──────────────────────────────────────────────────┤
│ Column 1    │ Column 2    │ Column 3    │ ...   │
│ [Filter...] │ [Filter...] │ [Filter...] │ ...   │ ← Headers (Fixed)
├──────────────────────────────────────────────────┤
│                                                  │
│              TABLE BODY (Scrollable)             │
│                                                  │
│  Row 1 data...                                   │
│  Row 2 data...                                   │
│  Row 3 data...                                   │
│  ...                                             │
│                                                  │
├──────────────────────────────────────────────────┤
│                   FOOTER                         │ ← 50-60px (Fixed)
│  Showing 1-20 of 100  [< Prev] [1] [2] [Next >] │
└──────────────────────────────────────────────────┘
```

## Component API

### Props

```typescript
interface DataTableProps {
  // Collection Configuration
  collectionName: string              // Firestore collection name
  storeId: string                    // Unique store ID
  
  // Column Definitions
  fields: FieldConfig[]              // Array of field configurations
  
  // Features
  enableCreate?: boolean             // Default: true
  enableEdit?: boolean               // Default: true
  enableDelete?: boolean             // Default: true
  enableExport?: boolean             // Default: true
  enableSearch?: boolean             // Default: true
  enableFilter?: boolean             // Default: true
  enableSort?: boolean               // Default: true
  enablePagination?: boolean         // Default: true
  enableSelection?: boolean          // Default: false (checkboxes)
  
  // Collection Store Config
  authenticated?: boolean            // Default: false
  userOwned?: boolean               // Default: false
  realtime?: boolean                // Default: false
  
  // Pagination
  defaultPageSize?: number          // Default: 20
  pageSizeOptions?: number[]        // Default: [10, 20, 50, 100]
  
  // Display
  title?: string                    // Table title
  emptyMessage?: string             // Default: "No data available"
  height?: string                   // Default: "calc(100vh - 200px)"
  
  // Callbacks
  onRowClick?: (row: any) => void
  onRowDoubleClick?: (row: any) => void
  onSelectionChange?: (rows: any[]) => void
}
```

### Field Configuration

```typescript
interface FieldConfig {
  // Basic
  name: string                      // Field key in document
  label: string                     // Display caption
  
  // Type & Display
  type: FieldType                   // 'text' | 'number' | 'date' | 'boolean' | 'select' | 'custom'
  width?: string                    // Column width (e.g., '200px', '20%')
  align?: 'left' | 'center' | 'right'  // Default: 'left'
  
  // Visibility
  visible?: boolean                 // Default: true
  hideOnMobile?: boolean           // Default: false
  
  // Editing
  editable?: boolean               // Default: true
  required?: boolean               // Default: false
  
  // Validation
  min?: number                     // For numbers/dates
  max?: number                     // For numbers/dates
  pattern?: RegExp                 // For text
  validator?: (value: any) => string | null  // Custom validation
  
  // Filtering
  filterable?: boolean             // Default: true
  filterOperators?: FilterOperator[]  // Available operators for this field
  filterType?: 'input' | 'select' | 'date' | 'range'  // Filter input type
  
  // Sorting
  sortable?: boolean               // Default: true
  sortField?: string               // Custom sort field (if different from name)
  
  // Select Options (for type: 'select')
  options?: Array<{ value: any; label: string }>
  
  // Custom Rendering
  render?: (value: any, row: any) => string | VNode  // Custom cell renderer
  renderEdit?: (value: any, row: any) => VNode       // Custom edit renderer
  
  // Formatting
  format?: (value: any) => string  // Format display value
  parse?: (value: string) => any   // Parse input value
}
```

### Filter Types

```typescript
type FilterOperator = 
  | '=='      // Equal
  | '!='      // Not equal
  | '<'       // Less than
  | '<='      // Less than or equal
  | '>'       // Greater than
  | '>='      // Greater than or equal
  | 'contains'         // String contains (client-side)
  | 'startsWith'       // String starts with (client-side)
  | 'endsWith'         // String ends with (client-side)
  | 'in'              // In array
  | 'not-in'          // Not in array
  | 'array-contains'   // Array contains
  | 'array-contains-any' // Array contains any

interface Filter {
  field: string
  operator: FilterOperator
  value: any
}

interface FilterState {
  filters: Filter[]
  quickFilters: Record<string, string>  // Field name -> quick search text
}
```

## Component Structure

```
DataTable.vue (Main component)
├── DataTableToolbar.vue
│   ├── ActionButtons
│   ├── SearchBar
│   └── FilterPanel
├── DataTableHeader.vue
│   ├── HeaderRow (Captions + Sort)
│   └── FilterRow (Quick filters)
├── DataTableBody.vue
│   ├── DataTableRow.vue
│   │   └── DataTableCell.vue
│   └── EmptyState.vue
├── DataTableFooter.vue
│   ├── PaginationInfo
│   └── PaginationControls
└── DataTableModals.vue
    ├── AdvancedFilterModal.vue
    ├── CreateRowModal.vue
    ├── EditRowModal.vue
    └── DeleteConfirmModal.vue
```

## Implementation Steps

### Step 1: Types & Basic Structure
- Create TypeScript interfaces
- Build main component shell
- Implement fixed layout (toolbar, scrollable table, footer)
- Test: Empty table with proper layout

### Step 2: Collection Integration
- Connect createCollectionStore
- Display data in table
- Handle loading/error states
- Test: Display static data

### Step 3: Column Headers
- Dual-row headers (caption + filter)
- Sort functionality
- Column resizing (optional)
- Test: Headers display correctly, sorting works

### Step 4: Basic Filtering
- Quick filter inputs in header
- Text-based filtering
- Filter state management
- Test: Type in filter cells, see results

### Step 5: Advanced Filtering
- Filter modal with operator selection
- Multiple filter conditions
- Filter persistence
- Test: Complex filters work correctly

### Step 6: Pagination
- Page size selector
- Previous/Next buttons
- Page number display
- Jump to page
- Test: Navigate through pages

### Step 7: CRUD Operations
- Create new row
- Inline editing
- Update existing row
- Delete with confirmation
- Test: All CRUD operations work

### Step 8: Toolbar & Actions
- Add all toolbar buttons
- Bulk actions (if selection enabled)
- Export functionality
- Test: All actions work

### Step 9: Polish & Features
- Loading skeletons
- Empty states
- Responsive design
- Accessibility (ARIA labels, keyboard navigation)
- Error handling
- Test: Complete end-to-end testing

### Step 10: Documentation & Examples
- Usage examples
- Integration guide
- API documentation

## Styling Strategy (TailwindCSS)

### Color Scheme
- Primary: `blue-600` (actions)
- Secondary: `gray-600` (neutral)
- Success: `green-600` (create/save)
- Danger: `red-600` (delete)
- Warning: `yellow-600` (warnings)

### Layout Classes
```css
Toolbar: h-14 border-b bg-white
Headers: h-12 border-b bg-gray-50 (caption row)
         h-10 border-b bg-gray-50 (filter row)
Body:    overflow-y-auto (calculated height)
Footer:  h-14 border-t bg-white
```

### Responsive Breakpoints
- Mobile: < 640px (hide some columns)
- Tablet: 640px - 1024px (compact view)
- Desktop: > 1024px (full view)

## State Management

```typescript
interface DataTableState {
  // Data
  items: any[]
  selectedItems: any[]
  
  // UI State
  loading: boolean
  error: string | null
  editingRow: any | null
  
  // Pagination
  currentPage: number
  pageSize: number
  totalItems: number
  
  // Filtering
  filters: Filter[]
  quickFilters: Record<string, string>
  showAdvancedFilter: boolean
  
  // Sorting
  sortField: string | null
  sortDirection: 'asc' | 'desc'
  
  // Modals
  showCreateModal: boolean
  showEditModal: boolean
  showDeleteModal: boolean
}
```

## Performance Considerations

1. **Virtual Scrolling**: For large datasets (>1000 rows)
2. **Debounced Filtering**: 300ms debounce on quick filters
3. **Memoization**: Computed properties for filtered/sorted data
4. **Lazy Loading**: Load data on demand with pagination
5. **Optimistic Updates**: Update UI before server confirmation

## Accessibility

- Keyboard navigation (Tab, Arrow keys)
- ARIA labels for all interactive elements
- Screen reader support
- Focus management
- High contrast mode support

## Testing Checklist

- [ ] Layout renders correctly
- [ ] Data loads and displays
- [ ] Sorting works on all columns
- [ ] Quick filters work
- [ ] Advanced filters work
- [ ] Pagination works
- [ ] Create new row works
- [ ] Edit row works
- [ ] Delete row works
- [ ] Loading states display
- [ ] Error states display
- [ ] Empty state displays
- [ ] Responsive on mobile
- [ ] Keyboard navigation works
- [ ] Real-time updates work (if enabled)

## Future Enhancements

1. Column reordering (drag & drop)
2. Column visibility toggle
3. Save/load table state
4. Export to CSV/Excel
5. Print view
6. Bulk edit
7. Row grouping
8. Column grouping
9. Frozen columns
10. Custom cell templates

---

## Usage Example

```vue
<template>
  <DataTable
    collection-name="services"
    store-id="services-table"
    title="Services Management"
    :fields="fields"
    :enable-create="true"
    :enable-edit="true"
    :enable-delete="true"
    :realtime="true"
    :default-page-size="20"
    @row-click="handleRowClick"
  />
</template>

<script setup lang="ts">
const fields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Service Name',
    type: 'text',
    width: '200px',
    required: true,
    sortable: true,
    filterable: true
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    width: '120px',
    align: 'right',
    format: (value) => `$${value.toFixed(2)}`,
    sortable: true,
    filterable: true,
    filterOperators: ['==', '>', '<', '>=', '<=']
  },
  {
    name: 'active',
    label: 'Status',
    type: 'boolean',
    width: '100px',
    align: 'center',
    render: (value) => value ? '✓ Active' : '✗ Inactive'
  }
]
</script>
```

This design provides a solid foundation for building a powerful, flexible, and user-friendly data table component!
