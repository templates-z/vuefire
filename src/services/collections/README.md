# Collection System Documentation

This document explains how to use the new optimized Firestore collection system with Pinia integration.

## Overview

The collection system provides:
- **Minimal Firestore requests** through intelligent caching
- **Pinia store integration** for reactive state management
- **Authentication-aware collections** with security rules
- **Real-time synchronization** capabilities
- **Batch operations** for efficient writes
- **TypeScript support** with full type safety

## Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌────────────────────┐
│   Vue Components    │◄──►│   Pinia Stores       │◄──►│  Collection System │
│                     │    │                      │    │                    │
│  - Reactive UI      │    │  - State Management  │    │  - Firestore API   │
│  - User Interactions│    │  - Caching           │    │  - Authentication  │
│  - Data Display     │    │  - Real-time Updates │    │  - Batch Operations│
└─────────────────────┘    └──────────────────────┘    └────────────────────┘
                                                                    │
                                                        ┌────────────────────┐
                                                        │     Firebase       │
                                                        │                    │
                                                        │  - Firestore DB    │
                                                        │  - Authentication  │
                                                        │  - Real-time       │
                                                        └────────────────────┘
```

## Quick Start

### 1. Define Your Document Type

```typescript
import type { BaseDocument } from '@/services/collections'

interface Service extends BaseDocument {
  name: string
  description: string
  price: number
  duration: number
  category: string
  active: boolean
}
```

### 2. Create a Pinia Store

```typescript
// stores/services.ts
import { createCollectionPiniaStore } from '@/services/collections'
import type { Service } from '@/types/service'

export const useServicesStore = createCollectionPiniaStore<Service>('services', {
  collection: 'services',
  authenticated: false,  // Public collection
  realtime: true,       // Enable real-time updates
  preload: true,        // Load data on store creation
  cacheTTL: 10 * 60 * 1000 // 10 minutes cache
})
```

### 3. Use in Vue Components

```vue
<template>
  <div>
    <!-- Loading State -->
    <div v-if="servicesStore.loading" class="loading-indicator">
      Loading services...
    </div>

    <!-- Error State -->
    <div v-else-if="servicesStore.error" class="error-message">
      {{ servicesStore.error }}
      <button @click="servicesStore.refresh()">Retry</button>
    </div>

    <!-- Services List -->
    <div v-else>
      <div v-for="service in servicesStore.items" :key="service.id" class="service-card">
        <h3>{{ service.name }}</h3>
        <p>{{ service.description }}</p>
        <span>${{ service.price }}</span>
        <button @click="servicesStore.select(service)">View Details</button>
      </div>
    </div>

    <!-- Selected Service Details -->
    <div v-if="servicesStore.selectedItem" class="service-details">
      <h2>{{ servicesStore.selectedItem.name }}</h2>
      <button @click="editService(servicesStore.selectedItem)">Edit</button>
      <button @click="deleteService(servicesStore.selectedItem.id!)">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useServicesStore } from '@/stores/services'

const servicesStore = useServicesStore()

const editService = async (service: Service) => {
  const updatedService = await servicesStore.update(service.id!, {
    price: service.price + 10
  })
  console.log('Updated:', updatedService)
}

const deleteService = async (id: string) => {
  const success = await servicesStore.remove(id)
  if (success) {
    console.log('Service deleted')
  }
}

const addService = async () => {
  const newService = await servicesStore.create({
    name: 'New Service',
    description: 'Service description',
    price: 50,
    duration: 60,
    category: 'haircut',
    active: true
  })
  console.log('Created:', newService)
}
</script>
```

## Collection Types

### 1. Public Collections (Services, etc.)

```typescript
export const useServicesStore = createCollectionPiniaStore<Service>('services', {
  collection: 'services',
  authenticated: false,
  realtime: true,
  preload: true
})
```

### 2. User-Owned Collections (User Profiles, Appointments, etc.)

```typescript
import type { UserOwnedDocument } from '@/services/collections'

interface UserProfile extends UserOwnedDocument {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export const useProfileStore = createCollectionPiniaStore<UserProfile>('profiles', {
  collection: 'users',
  authenticated: true,
  userOwned: true,
  realtime: true,
  preload: true
})
```

### 3. Shared Collections (Teams, Projects, etc.)

```typescript
import type { AuthenticatedDocument } from '@/services/collections'

interface Team extends AuthenticatedDocument {
  name: string
  description: string
  members: string[]
}

export const useTeamsStore = createCollectionPiniaStore<Team>('teams', {
  collection: 'teams',
  authenticated: true,
  userOwned: false,
  realtime: true,
  preload: false
})
```

## Advanced Features

### Real-time Synchronization

```typescript
const store = useServicesStore()

// Start real-time sync
store.startRealtime()

// Stop real-time sync
store.stopRealtime()

// Check sync status
console.log('Syncing:', store.syncing)
```

### Search and Filtering

```typescript
const store = useServicesStore()

// Search by text
const searchResults = store.search('haircut', ['name', 'description'])

// Find by field value
const activeServices = store.findByField('active', true)

// Find by ID
const service = store.findById('service123')
```

### Batch Operations

```typescript
import { collectionManager } from '@/services/collections'

// Batch multiple operations
await collectionManager.batchOperations([
  {
    collection: 'services',
    operation: 'create',
    data: { name: 'Service 1', price: 50 }
  },
  {
    collection: 'services',
    operation: 'update',
    id: 'service123',
    data: { price: 60 }
  },
  {
    collection: 'services',
    operation: 'delete',
    id: 'service456'
  }
])
```

### Cache Management

```typescript
import { invalidateCollectionCache, getCollectionMetrics, optimizeCollections } from '@/services/collections'

// Invalidate specific collection cache
invalidateCollectionCache('services')

// Get cache metrics
const metrics = getCollectionMetrics()
console.log('Cache hits:', metrics.value.cacheHits)
console.log('Memory usage:', metrics.value.memoryUsage)

// Optimize collections (remove expired cache entries)
optimizeCollections()
```

## Security Features

### Authentication-Aware Collections

```typescript
// Only authenticated users can access
export const useAppointmentsStore = createCollectionPiniaStore<Appointment>('appointments', {
  collection: 'appointments',
  authenticated: true,
  userOwned: true, // Users can only see their own appointments
  realtime: true
})
```

### Document Sharing

```typescript
import { createUserOwnedCollection } from '@/services/collections'

const collection = createUserOwnedCollection<Document>('documents')

// Share document with other users
await collection.shareDocument('doc123', ['user456', 'user789'])

// Unshare document
await collection.unshareDocument('doc123', ['user456'])

// Change visibility
await collection.changeVisibility('doc123', 'public')
```

## Performance Optimizations

### 1. Caching Strategy
- **Memory caching** with configurable TTL
- **LRU eviction** for memory management
- **Intelligent cache invalidation**

### 2. Minimal Firestore Requests
- **Query result caching**
- **Real-time updates** instead of polling
- **Batch operations** for multiple writes

### 3. Lazy Loading
- **On-demand data loading**
- **Pagination support**
- **Progressive data loading**

## Best Practices

### 1. Store Organization

```typescript
// stores/index.ts
export { useServicesStore } from './services'
export { useAppointmentsStore } from './appointments'
export { useClientsStore } from './clients'
export { useProfileStore } from './profile'
```

### 2. Error Handling

```typescript
const store = useServicesStore()

// Always check for errors
if (store.error) {
  // Handle error
  console.error('Store error:', store.error)
  
  // Retry operation
  await store.refresh()
}
```

### 3. Cleanup

```typescript
// In component onUnmounted
onUnmounted(() => {
  store.cleanup()
})
```

### 4. Type Safety

```typescript
// Always define proper interfaces
interface Service extends BaseDocument {
  name: string
  price: number
  // ... other fields
}

// Use proper generic types
const store = useServicesStore<Service>()
```

## Migration Guide

### From Direct Firestore Usage

**Before:**
```typescript
import { collection, getDocs, addDoc } from 'firebase/firestore'

const querySnapshot = await getDocs(collection(db, 'services'))
const services = []
querySnapshot.forEach((doc) => {
  services.push({ id: doc.id, ...doc.data() })
})
```

**After:**
```typescript
const servicesStore = useServicesStore()
await servicesStore.load()
const services = servicesStore.items
```

### From Basic Pinia Stores

**Before:**
```typescript
export const useServicesStore = defineStore('services', () => {
  const services = ref([])
  
  const loadServices = async () => {
    // Manual Firestore code
  }
  
  return { services, loadServices }
})
```

**After:**
```typescript
export const useServicesStore = createCollectionPiniaStore<Service>('services', {
  collection: 'services',
  authenticated: false,
  realtime: true,
  preload: true
})
```

## Cost Optimization

This system reduces Firestore costs through:

1. **Intelligent Caching**: Reduces redundant reads
2. **Real-time Subscriptions**: More efficient than polling
3. **Batch Operations**: Reduces write operations count
4. **Query Optimization**: Optimized query patterns
5. **Memory Management**: Prevents memory leaks

## Troubleshooting

### Common Issues

1. **"Collection not found" error**
   - Ensure collection is registered before use

2. **Authentication errors**
   - Check if user is authenticated for protected collections

3. **Real-time updates not working**
   - Verify Firestore security rules allow reads
   - Check if real-time is enabled in store config

4. **Memory issues**
   - Use cache optimization features
   - Clean up stores when components unmount

### Debug Mode

```typescript
// Enable debug logging
console.log('Store state:', store.$state)
console.log('Collection metrics:', getCollectionMetrics())
```

This collection system provides a robust, scalable, and cost-effective way to manage Firestore data in your Vue.js application with Pinia.