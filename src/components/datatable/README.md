# DataTable Component

A comprehensive, feature-rich data table component for Vue 3 with Firestore integration via Pinia collection stores.

## Features

- ✅ **Pinia Integration**: Seamless connection to `createCollectionStore` for reactive Firestore data
- ✅ **Sorting**: Multi-state column sorting (none → asc → desc → none)
- ✅ **Filtering**: Per-column filtering with 13 Firestore operators
- ✅ **Pagination**: Smart pagination with page size selector and navigation
- ✅ **CRUD Operations**: Built-in create, edit, and delete modals
- ✅ **Search**: Global search across all visible fields
- ✅ **Export**: CSV export functionality
- ✅ **Selection**: Row selection with bulk actions
- ✅ **Column Visibility**: Toggle column visibility via dropdown
- ✅ **Loading States**: Animated skeleton loaders
- ✅ **Accessibility**: ARIA labels and keyboard navigation support
- ✅ **Responsive**: Fixed-height scrollable design with sticky headers

## Installation

The DataTable component is already included in this project. No additional installation required.

## Basic Usage

```vue
<template>
  <DataTable
    store-id="my-data"
    collection-name="users"
    :fields="fields"
    height="600px"
  />
</template>

<script setup lang="ts">
import DataTable from '@/components/datatable/DataTable.vue'
import type { FieldConfig } from '@/components/datatable/types'

const fields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    sortable: true,
    filterable: true,
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    sortable: true,
    filterable: true
  },
  {
    name: 'createdAt',
    label: 'Created',
    type: 'date',
    sortable: true,
    format: (value) => value?.toDate().toLocaleDateString()
  }
]
</script>
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `storeId` | `string` | Unique identifier for the Pinia store instance |
| `collectionName` | `string` | Firestore collection name |
| `fields` | `FieldConfig[]` | Column configuration array |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Table title displayed in toolbar |
| `subtitle` | `string` | - | Table subtitle/description |
| `height` | `string` | `'500px'` | Fixed height for scrollable area |
| `enableCreate` | `boolean` | `true` | Show create button |
| `enableEdit` | `boolean` | `true` | Show edit buttons |
| `enableDelete` | `boolean` | `true` | Show delete buttons |
| `enableFilter` | `boolean` | `true` | Enable column filtering |
| `enableSort` | `boolean` | `true` | Enable column sorting |
| `enableSelection` | `boolean` | `true` | Enable row selection |
| `enablePagination` | `boolean` | `true` | Enable pagination |
| `enableSearch` | `boolean` | `true` | Enable global search |
| `enableExport` | `boolean` | `true` | Enable CSV export |
| `enableRefresh` | `boolean` | `true` | Show refresh button |
| `defaultPageSize` | `number` | `10` | Default items per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Page size options |
| `striped` | `boolean` | `false` | Alternating row colors |
| `authenticated` | `boolean` | `false` | Require authentication |
| `userOwned` | `boolean` | `false` | Filter by current user |
| `realtime` | `boolean` | `false` | Enable realtime updates |

## FieldConfig Interface

```typescript
interface FieldConfig {
  // Required
  name: string                    // Field name in document
  label: string                   // Display label
  type: FieldType                 // Data type
  
  // Optional - Display
  visible?: boolean               // Show/hide column (default: true)
  width?: string                  // Fixed width (e.g., '200px')
  minWidth?: string              // Minimum width (default: '100px')
  align?: 'left' | 'center' | 'right'  // Text alignment
  
  // Optional - Behavior
  sortable?: boolean             // Enable sorting (default: false)
  filterable?: boolean           // Enable filtering (default: false)
  required?: boolean             // Required for create/edit (default: false)
  readonly?: boolean             // Read-only in forms (default: false)
  
  // Optional - Formatting
  format?: (value: any, item?: any) => string  // Custom formatter
  
  // Optional - Forms
  placeholder?: string           // Input placeholder
  defaultValue?: any            // Default value for create
  
  // Optional - Select fields
  options?: Array<{ label: string; value: any }>  // Options for select type
  
  // Optional - Custom
  headerClass?: string | ((field: FieldConfig) => string)
  cellClass?: string | ((value: any, item: any) => string)
  
  // Optional - Validation
  validate?: (value: any) => string | null  // Custom validator
  min?: number                   // Min value for number/date
  max?: number                   // Max value for number/date
  pattern?: string              // Regex pattern for text
}
```

## Field Types

```typescript
type FieldType = 
  | 'text'      // Plain text
  | 'number'    // Numeric values
  | 'boolean'   // True/false
  | 'date'      // Date/timestamp
  | 'email'     // Email address
  | 'url'       // URL
  | 'select'    // Dropdown selection
  | 'custom'    // Custom rendering
```

## Filter Operators

The following Firestore operators are supported:

- `==` - Equal to
- `!=` - Not equal to
- `<` - Less than
- `<=` - Less than or equal
- `>` - Greater than
- `>=` - Greater than or equal
- `array-contains` - Array contains value
- `array-contains-any` - Array contains any value
- `in` - In array
- `not-in` - Not in array
- `startsWith` - String starts with
- `endsWith` - String ends with
- `contains` - String contains

## Events

```typescript
// Emitted when an item is created
@create="handleCreate"

// Emitted when an item is edited
@edit="handleEdit"

// Emitted when an item is deleted
@delete="handleDelete"

// Emitted when a row is clicked
@row-click="handleRowClick"
```

## Custom Handlers

```vue
<DataTable
  :fields="fields"
  :on-create="customCreate"
  :on-update="customUpdate"
  :on-delete="customDelete"
/>

<script setup lang="ts">
const customCreate = async (data: any) => {
  // Custom create logic
  await myApi.create(data)
}

const customUpdate = async (id: string, data: any) => {
  // Custom update logic
  await myApi.update(id, data)
}

const customDelete = async (id: string) => {
  // Custom delete logic
  await myApi.delete(id)
}
</script>
```

## Advanced Examples

### Custom Formatters

```typescript
const fields: FieldConfig[] = [
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    format: (value) => `$${value?.toFixed(2) || '0.00'}`
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ]
  }
]
```

### Conditional Cell Styling

```typescript
const fields: FieldConfig[] = [
  {
    name: 'status',
    label: 'Status',
    type: 'text',
    cellClass: (value) => {
      if (value === 'active') return 'text-green-600 font-semibold'
      if (value === 'pending') return 'text-yellow-600'
      return 'text-gray-500'
    }
  }
]
```

### Custom Validation

```typescript
const fields: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    validate: (value) => {
      if (!value) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Invalid email format'
      }
      return null
    }
  }
]
```

## Styling

The DataTable uses TailwindCSS for styling. You can customize the appearance by:

1. **Props**: Use `striped` for alternating row colors
2. **Field Config**: Use `headerClass` and `cellClass` for custom styling
3. **CSS Classes**: Override the default classes in your global styles

## Accessibility

The component includes:

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Loading state announcements
- Focus management

## Performance

- **Lazy Loading**: Only visible rows are rendered
- **Virtual Scrolling**: Efficient handling of large datasets
- **Debounced Search**: Search input is debounced to reduce queries
- **Client-side Filtering**: Search filters data without additional Firestore queries

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## TypeScript

Full TypeScript support with complete type definitions in `types.ts`.

## License

MIT
