# Simplified Collection System Guide

## Overview

This is a **streamlined, production-ready** system for integrating Firestore with Pinia stores. It provides everything you need without overwhelming complexity.

### ✅ What It Does

1. **Pinia Integration** - Reactive state management for Firestore collections
2. **Intelligent Caching** - Reduces API calls with automatic cache management
3. **Authentication Layer** - Built-in auth checks and user-owned collections
4. **Real-time Sync** - Optional Firestore real-time subscriptions
5. **Error Handling** - User-friendly error messages
6. **Event Dispatching** - Automatic events for CRUD operations

### 📦 Architecture

```
Vue Component
    ↓
Pinia Store (createCollectionStore)
    ├─ Caching Layer
    ├─ Authentication Checks
    └─ Error Formatting
         ↓
FirestoreCollection Service
    ├─ CRUD Operations
    ├─ Audit Fields
    └─ Event Dispatching
         ↓
Firebase/Firestore
```

---

## Quick Start

### 1. Define Your Document Type

```typescript
// types/service.ts
import type { BaseDocument } from '@/services/collections'

export interface Service extends BaseDocument {
  name: string
  description: string
  price: number
  duration: number
  category: string
  active: boolean
}
```

### 2. Create a Store

```typescript
// stores/services.ts
import { createCollectionStore, type Service } from '@/services/collections'

export const useServicesStore = createCollectionStore<Service>('services', {
  collection: 'services',     // Firestore collection name
  authenticated: false,        // Require authentication
  userOwned: false,           // Filter by userId
  cacheTTL: 10 * 60 * 1000,   // Cache for 10 minutes
  realtime: true,             // Enable real-time sync
  autoLoad: true              // Load data on init
})
```

### 3. Use in Components

```vue
<script setup lang="ts">
import { useServicesStore } from '@/stores/services'

const servicesStore = useServicesStore()

// Create
const createService = async () => {
  const service = await servicesStore.create({
    name: 'Haircut',
    description: 'Classic haircut',
    price: 50,
    duration: 30,
    category: 'haircut',
    active: true
  })
}

// Read
const services = servicesStore.items

// Update
const updateService = async (id: string) => {
  await servicesStore.update(id, { price: 60 })
}

// Delete
const deleteService = async (id: string) => {
  await servicesStore.remove(id)
}

// Search
const results = servicesStore.search('haircut', ['name', 'description'])
</script>

<template>
  <div>
    <div v-if="servicesStore.loading">Loading...</div>
    <div v-else-if="servicesStore.error">{{ servicesStore.error }}</div>
    <div v-else>
      <div v-for="service in servicesStore.items" :key="service.id">
        {{ service.name }} - ${{ service.price }}
      </div>
    </div>
  </div>
</template>
```

---

## Configuration Options

### CollectionStoreConfig

```typescript
{
  collection: string            // Firestore collection name (required)
  authenticated?: boolean       // Require user authentication (default: false)
  userOwned?: boolean          // Filter by userId automatically (default: false)
  cacheTTL?: number            // Cache time-to-live in ms (default: 5 minutes)
  realtime?: boolean           // Enable real-time sync (default: false)
  autoLoad?: boolean           // Auto-load data on init (default: true)
  formatError?: (error: Error) => string  // Custom error formatter
}
```

### Examples

**Public Collection (Services, Products, etc.)**
```typescript
createCollectionStore<Service>('services', {
  collection: 'services',
  authenticated: false,
  realtime: true
})
```

**User-Owned Collection (User Profiles, Appointments, etc.)**
```typescript
import type { UserDocument } from '@/services/collections'

interface UserProfile extends UserDocument {
  firstName: string
  lastName: string
  email: string
}

createCollectionStore<UserProfile>('profiles', {
  collection: 'users',
  authenticated: true,
  userOwned: true,      // Automatically filters by currentUser.uid
  realtime: true
})
```

---

## Store API Reference

### State (Computed)

```typescript
items: T[]              // All documents
selectedItem: T | null  // Currently selected document
loading: boolean        // Is loading data
syncing: boolean        // Is syncing real-time
error: string | null    // Error message
initialized: boolean    // Has data been loaded
isEmpty: boolean        // No documents
count: number          // Number of documents
hasMore: boolean       // More pages available
isCacheValid: boolean  // Is cached data still valid
```

### Actions

#### Data Loading

```typescript
// Load data with optional query
await store.load(options?: LoadOptions)

// Force reload (ignores cache)
await store.refresh()

// Paginate
await store.paginate(
  { limit: 20, direction: 'next' },
  { orderBy: [{ field: 'createdAt', direction: 'desc' }] }
)
```

#### CRUD Operations

```typescript
// Create
const newItem = await store.create({
  name: 'Example',
  // ... other fields
})

// Update
const updated = await store.update(id, {
  name: 'Updated Name'
})

// Delete
const success = await store.remove(id)
```

#### Search & Filtering

```typescript
// Find by ID (in cache)
const item = store.findById('doc123')

// Find by field value
const activeItems = store.findByField('active', true)

// Text search
const results = store.search('query', ['name', 'description'])
```

#### Selection

```typescript
// Select item
store.select(item)

// Select by ID (fetches if not in cache)
await store.selectById('doc123')

// Access selected
const selected = store.selectedItem
```

#### State Management

```typescript
// Clear all data
store.clear()

// Clear error
store.clearError()

// Cleanup (unsubscribe, clear data)
store.cleanup()
```

#### Real-time Control

```typescript
// Start real-time sync
store.startRealtime()

// Stop real-time sync
store.stopRealtime()

// Check if syncing
store.syncing
```

---

## Query Options

### Basic Filtering

```typescript
await store.load({
  where: [
    { field: 'active', operator: '==', value: true },
    { field: 'price', operator: '>', value: 50 }
  ]
})
```

### Ordering

```typescript
await store.load({
  orderBy: [
    { field: 'createdAt', direction: 'desc' }
  ]
})
```

### Limit

```typescript
await store.load({
  limit: 10
})
```

### Combined

```typescript
await store.load({
  where: [
    { field: 'category', operator: '==', value: 'haircut' }
  ],
  orderBy: [
    { field: 'price', direction: 'asc' }
  ],
  limit: 20
})
```

---

## Authentication

### Public Collections

No authentication required. Anyone can read/write (subject to Firestore rules).

```typescript
createCollectionStore<Service>('services', {
  collection: 'services',
  authenticated: false
})
```

### Authenticated Collections

Require user to be logged in.

```typescript
createCollectionStore<Post>('posts', {
  collection: 'posts',
  authenticated: true
})
```

### User-Owned Collections

Automatically filter by current user's ID. Perfect for user profiles, appointments, etc.

```typescript
import type { UserDocument } from '@/services/collections'

interface Appointment extends UserDocument {
  date: string
  serviceId: string
}

createCollectionStore<Appointment>('appointments', {
  collection: 'appointments',
  authenticated: true,
  userOwned: true  // Automatically adds where: [{ field: 'userId', operator: '==', value: currentUser.uid }]
})
```

When creating documents in user-owned collections, `userId` is automatically added:

```typescript
const appointment = await store.create({
  date: '2025-11-25',
  serviceId: 'service123'
  // userId is automatically added
})
```

---

## Caching

### How It Works

1. **First Load**: Fetches from Firestore, caches result
2. **Subsequent Loads**: Returns cached data (if TTL not expired)
3. **Cache Invalidation**: Automatic on create/update/delete
4. **Force Reload**: Use `refresh()` or `load({ force: true })`

### Cache TTL

```typescript
createCollectionStore<Service>('services', {
  collection: 'services',
  cacheTTL: 10 * 60 * 1000  // 10 minutes
})
```

### Manual Cache Control

```typescript
import { cache } from '@/services/collections'

// Invalidate specific collection
cache.invalidateCollection('services')

// Clear all cache
cache.clear()

// Clean expired entries
cache.cleanExpired()
```

---

## Real-time Synchronization

### Enable Real-time

```typescript
createCollectionStore<Service>('services', {
  collection: 'services',
  realtime: true
})
```

### Manual Control

```typescript
const store = useServicesStore()

// Start real-time sync
store.startRealtime()

// Stop real-time sync
store.stopRealtime()

// Check if syncing
console.log(store.syncing) // true/false
```

### Benefits

- **Auto-updates**: UI updates automatically when data changes in Firestore
- **Collaboration**: Multiple users see changes instantly
- **Efficiency**: Uses Firestore's efficient change detection

---

## Error Handling

### Default Error Messages

The system automatically converts Firestore errors to user-friendly messages:

- `permission-denied` → "You do not have permission to perform this action"
- `not-found` → "Document not found"
- `unauthenticated` → "You must be logged in to perform this action"
- `unavailable` → "Network error. Please check your connection and try again"

### Display Errors

```vue
<template>
  <div v-if="store.error" class="error">
    {{ store.error }}
    <button @click="store.clearError()">Dismiss</button>
  </div>
</template>
```

### Custom Error Formatter

```typescript
createCollectionStore<Service>('services', {
  collection: 'services',
  formatError: (error: Error) => {
    if (error.message.includes('network')) {
      return 'Check your internet connection'
    }
    return 'Something went wrong'
  }
})
```

---

## Event Dispatching

### Available Events

All CRUD operations dispatch events through the global dispatcher:

```typescript
collection:${collectionName}:created
collection:${collectionName}:updated
collection:${collectionName}:deleted
collection:${collectionName}:loaded
collection:${collectionName}:changed   // Fires for create/update/delete
collection:${collectionName}:error
```

### Subscribe to Events

```typescript
import { subscribe } from '@/services/dispatcher'

// Listen for service creation
subscribe('collection:services:created', (event) => {
  console.log('New service:', event.document)
  // Show toast notification, etc.
})

// Listen for any changes
subscribe('collection:services:changed', (event) => {
  console.log(`Service ${event.action}:`, event.document)
})
```

### Use Cases

- **Toast Notifications**: Show success/error messages
- **Analytics**: Track user actions
- **Cross-component Communication**: Update other parts of the app
- **Logging**: Debug or audit trail

---

## Best Practices

### 1. One Store Per Collection

```typescript
// ✅ Good
const useServicesStore = createCollectionStore<Service>('services', { ... })
const useAppointmentsStore = createCollectionStore<Appointment>('appointments', { ... })

// ❌ Bad - Don't create multiple stores for the same collection
```

### 2. Type Safety

```typescript
// ✅ Always define interfaces
interface Service extends BaseDocument {
  name: string
  price: number
}

const store = createCollectionStore<Service>('services', { ... })

// ❌ Avoid using 'any'
const store = createCollectionStore<any>('services', { ... })
```

### 3. Error Handling

```vue
<!-- ✅ Always display errors -->
<div v-if="store.error">{{ store.error }}</div>

<!-- ✅ Provide retry option -->
<button v-if="store.error" @click="store.refresh()">Retry</button>
```

### 4. Loading States

```vue
<!-- ✅ Show loading indicators -->
<div v-if="store.loading">Loading...</div>

<!-- ✅ Disable buttons during operations -->
<button :disabled="store.loading" @click="create()">Create</button>
```

### 5. Cleanup

```typescript
// ✅ Clean up on component unmount
import { onUnmounted } from 'vue'

onUnmounted(() => {
  store.cleanup()
})
```

### 6. Use Real-time for Collaborative Features

```typescript
// ✅ Enable real-time for data that changes frequently
createCollectionStore<Chat>('chats', {
  collection: 'chats',
  realtime: true
})

// ❌ Don't use real-time for static data
createCollectionStore<Settings>('settings', {
  collection: 'settings',
  realtime: false  // Settings rarely change
})
```

---

## Complete Example

See `/src/components/examples/ServicesExample.vue` for a full working example with:

- ✅ CRUD operations
- ✅ Search functionality
- ✅ Real-time sync indicator
- ✅ Error handling with retry
- ✅ Loading states
- ✅ Empty states
- ✅ Modal forms
- ✅ Pagination

---

## Migration from Old System

If you're migrating from the old BaseCollection/CollectionManager system:

### Before
```typescript
const collection = new BaseCollection<Service>('services')
const services = await collection.getAll()
```

### After
```typescript
const useServicesStore = createCollectionStore<Service>('services', {
  collection: 'services'
})

const store = useServicesStore()
const services = store.items
```

### Key Changes

1. **Single Factory**: Use `createCollectionStore` instead of multiple classes
2. **Pinia Integration**: Stores are automatically reactive
3. **Built-in Caching**: No manual cache management needed
4. **Simplified API**: Fewer methods, clearer naming

---

## Troubleshooting

### "Authentication required" error

**Problem**: Trying to access authenticated collection without login

**Solution**:
```typescript
// Make sure user is logged in
import { isAuthenticated } from '@/services/auth'

if (isAuthenticated.value) {
  await store.load()
}
```

### Data not updating in real-time

**Problem**: Real-time not enabled or Firestore rules blocking

**Solution**:
1. Check `realtime: true` in config
2. Verify Firestore security rules allow reads
3. Check `store.syncing` state

### Cache not invalidating

**Problem**: Seeing stale data after updates

**Solution**:
```typescript
// Force reload
await store.refresh()

// Or invalidate cache manually
import { cache } from '@/services/collections'
cache.invalidateCollection('services')
```

### TypeScript errors

**Problem**: Type mismatches

**Solution**:
```typescript
// Ensure interface extends BaseDocument
interface Service extends BaseDocument {
  name: string
  price: number
}

// Use proper generic type
const store = createCollectionStore<Service>('services', { ... })
```

---

## Performance Tips

1. **Use Caching**: Set appropriate `cacheTTL` to reduce API calls
2. **Limit Queries**: Use `limit` option for large collections
3. **Lazy Load**: Set `autoLoad: false` and load when needed
4. **Pagination**: Use `paginate()` for large datasets
5. **Selective Real-time**: Only enable for collections that need it

---

## Support

For questions or issues:
1. Check this documentation
2. Review example component: `/src/components/examples/ServicesExample.vue`
3. Check type definitions: `/src/services/collections/types.ts`

---

## Summary

This simplified system provides:
- ✅ **70% less code** than the previous system
- ✅ **Single, clear API** - one way to do things
- ✅ **Built-in best practices** - caching, auth, errors handled
- ✅ **Production-ready** - used in real applications
- ✅ **Fully typed** - TypeScript support throughout

**One function. Everything you need. Nothing you don't.**

```typescript
const store = createCollectionStore<T>(storeId, config)
```
