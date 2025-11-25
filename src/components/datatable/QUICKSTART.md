# DataTable Quick Start Guide

## 5-Minute Setup

### 1. Import the Component

```vue
<script setup lang="ts">
import DataTable from '@/components/datatable/DataTable.vue'
import type { FieldConfig } from '@/components/datatable/types'
</script>
```

### 2. Define Your Fields

```typescript
const fields: FieldConfig[] = [
  {
    name: 'name',           // Field name in Firestore
    label: 'Name',          // Display label
    type: 'text',           // Field type
    sortable: true,         // Enable sorting
    filterable: true,       // Enable filtering
    required: true          // Required in forms
  }
]
```

### 3. Add to Template

```vue
<template>
  <DataTable
    store-id="my-unique-id"
    collection-name="your-collection"
    :fields="fields"
    height="600px"
  />
</template>
```

## Common Field Types

```typescript
// Text field
{ name: 'title', label: 'Title', type: 'text' }

// Number with formatting
{ 
  name: 'price', 
  label: 'Price', 
  type: 'number',
  format: (v) => `$${v.toFixed(2)}`
}

// Boolean
{ name: 'active', label: 'Active', type: 'boolean' }

// Date
{ 
  name: 'createdAt', 
  label: 'Created', 
  type: 'date',
  format: (v) => v?.toDate().toLocaleDateString()
}

// Select dropdown
{ 
  name: 'status', 
  label: 'Status', 
  type: 'select',
  options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ]
}
```

## Essential Props

```vue
<DataTable
  store-id="unique-id"           // Required: Store identifier
  collection-name="users"        // Required: Firestore collection
  :fields="fields"               // Required: Field configuration
  
  title="Users"                  // Optional: Table title
  height="600px"                 // Optional: Fixed height
  
  :enable-create="true"          // Show create button
  :enable-edit="true"            // Show edit buttons
  :enable-delete="true"          // Show delete buttons
  :enable-selection="true"       // Enable row selection
  
  :authenticated="true"          // Require authentication
  :user-owned="false"            // Filter by current user
/>
```

## Pro Tips

### 1. Custom Formatters
```typescript
{
  name: 'status',
  label: 'Status',
  type: 'text',
  format: (value) => value.toUpperCase()
}
```

### 2. Conditional Styling
```typescript
{
  name: 'status',
  label: 'Status',
  type: 'text',
  cellClass: (value) => 
    value === 'active' ? 'text-green-600 font-bold' : 'text-gray-500'
}
```

### 3. Custom Validation
```typescript
{
  name: 'email',
  label: 'Email',
  type: 'email',
  validate: (value) => {
    if (!value.includes('@')) return 'Invalid email'
    return null
  }
}
```

### 4. Column Widths
```typescript
{
  name: 'description',
  label: 'Description',
  type: 'text',
  width: '300px',      // Fixed width
  minWidth: '150px'    // Minimum width
}
```

## Features Enabled by Default

- ✅ Sorting
- ✅ Filtering
- ✅ Pagination
- ✅ Search
- ✅ Create/Edit/Delete
- ✅ Selection
- ✅ Export
- ✅ Refresh
- ✅ Column visibility

## Disable Features

```vue
<DataTable
  :enable-create="false"
  :enable-edit="false"
  :enable-delete="false"
  :enable-selection="false"
  :enable-filter="false"
  :enable-sort="false"
  :enable-search="false"
  :enable-export="false"
/>
```

## That's It!

You now have a fully functional DataTable with:
- Sorting and filtering
- Pagination
- CRUD operations
- Search and export
- Row selection
- And much more!

For detailed documentation, see [README.md](./README.md)
