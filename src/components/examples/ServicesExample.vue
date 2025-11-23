<template>
  <div class="services-page">
    <div class="header">
      <h1>Services Management</h1>
      <button @click="showCreateForm = true" class="btn-primary">
        Add Service
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="servicesStore.loading && !servicesStore.initialized" class="loading">
      <div class="spinner"></div>
      <p>Loading services...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="servicesStore.error" class="error-banner">
      <p>{{ servicesStore.error }}</p>
      <button @click="servicesStore.refresh()" class="btn-secondary">
        Retry
      </button>
      <button @click="servicesStore.clearError()" class="btn-text">
        Dismiss
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="servicesStore.isEmpty" class="empty-state">
      <p>No services found</p>
      <button @click="showCreateForm = true" class="btn-primary">
        Create First Service
      </button>
    </div>

    <!-- Services List -->
    <div v-else class="services-list">
      <!-- Search Bar -->
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search services..."
          @input="handleSearch"
        />
      </div>

      <!-- Real-time Sync Indicator -->
      <div v-if="servicesStore.syncing" class="sync-indicator">
        Syncing...
      </div>

      <!-- Service Cards -->
      <div class="grid">
        <div
          v-for="service in displayedServices"
          :key="service.id"
          class="service-card"
          :class="{ selected: servicesStore.selectedItem?.id === service.id }"
          @click="servicesStore.select(service)"
        >
          <h3>{{ service.name }}</h3>
          <p>{{ service.description }}</p>
          <div class="service-meta">
            <span class="price">${{ service.price }}</span>
            <span class="duration">{{ service.duration }}min</span>
          </div>
          <div class="actions">
            <button @click.stop="editService(service)" class="btn-small">
              Edit
            </button>
            <button @click.stop="deleteService(service)" class="btn-small btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="servicesStore.hasMore" class="pagination">
        <button @click="loadMore" :disabled="servicesStore.loading" class="btn-secondary">
          {{ servicesStore.loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateForm || editingService" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h2>{{ editingService ? 'Edit Service' : 'Create Service' }}</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Name</label>
            <input v-model="formData.name" type="text" required />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="formData.description" required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Price ($)</label>
              <input v-model.number="formData.price" type="number" min="0" step="0.01" required />
            </div>

            <div class="form-group">
              <label>Duration (min)</label>
              <input v-model.number="formData.duration" type="number" min="1" required />
            </div>
          </div>

          <div class="form-group">
            <label>Category</label>
            <select v-model="formData.category" required>
              <option value="">Select category</option>
              <option value="haircut">Haircut</option>
              <option value="coloring">Coloring</option>
              <option value="styling">Styling</option>
              <option value="treatment">Treatment</option>
            </select>
          </div>

          <div class="form-group">
            <label>
              <input v-model="formData.active" type="checkbox" />
              Active
            </label>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="servicesStore.loading" class="btn-primary">
              {{ servicesStore.loading ? 'Saving...' : (editingService ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { createCollectionStore, type BaseDocument } from '@/services/collections'

// Define Service interface
interface Service extends BaseDocument {
  name: string
  description: string
  price: number
  duration: number
  category: string
  active: boolean
}

// Create the Pinia store for services
const useServicesStore = createCollectionStore<Service>('services', {
  collection: 'services',
  authenticated: false,  // Public collection
  userOwned: false,      // Not user-specific
  cacheTTL: 10 * 60 * 1000, // 10 minutes cache
  realtime: true,        // Enable real-time updates
  autoLoad: true         // Load data automatically
})

// Initialize store
const servicesStore = useServicesStore()

// Component state
const showCreateForm = ref(false)
const editingService = ref<Service | null>(null)
const searchQuery = ref('')
const searchResults = ref<Service[]>([])

// Form data
const formData = ref({
  name: '',
  description: '',
  price: 0,
  duration: 60,
  category: '',
  active: true
})

// Computed
const displayedServices = computed(() => {
  if (searchQuery.value) {
    return searchResults.value
  }
  return servicesStore.items
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    searchResults.value = servicesStore.search(searchQuery.value, ['name', 'description', 'category'])
  } else {
    searchResults.value = []
  }
}

const editService = (service: Service) => {
  editingService.value = service
  formData.value = {
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    category: service.category,
    active: service.active
  }
}

const deleteService = async (service: Service) => {
  if (!service.id) return

  if (confirm(`Are you sure you want to delete "${service.name}"?`)) {
    const success = await servicesStore.remove(service.id)
    if (success) {
      console.log('Service deleted successfully')
    }
  }
}

const handleSubmit = async () => {
  if (editingService.value?.id) {
    // Update existing service
    const updated = await servicesStore.update(editingService.value.id, formData.value)
    if (updated) {
      console.log('Service updated successfully')
      closeModal()
    }
  } else {
    // Create new service
    const created = await servicesStore.create(formData.value)
    if (created) {
      console.log('Service created successfully')
      closeModal()
    }
  }
}

const closeModal = () => {
  showCreateForm.value = false
  editingService.value = null
  formData.value = {
    name: '',
    description: '',
    price: 0,
    duration: 60,
    category: '',
    active: true
  }
}

const loadMore = async () => {
  await servicesStore.paginate(
    { limit: 20, direction: 'next' },
    { orderBy: [{ field: 'createdAt', direction: 'desc' }] }
  )
}

// Listen to collection events via dispatcher (optional)
import { subscribe } from '@/services/dispatcher'

subscribe('collection:services:created', (event: any) => {
  console.log('New service created:', event.document)
  // You could show a toast notification here
})

subscribe('collection:services:updated', (event: any) => {
  console.log('Service updated:', event.document)
})

subscribe('collection:services:deleted', (event: any) => {
  console.log('Service deleted:', event.document)
})
</script>

<style scoped>
.services-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-banner {
  background: #fee;
  border: 1px solid #fcc;
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.error-banner p {
  flex: 1;
  color: #c33;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 4rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.sync-indicator {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.service-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.service-card:hover {
  border-color: #3498db;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.service-card.selected {
  border-color: #3498db;
  background: #f0f8ff;
}

.service-card h3 {
  margin: 0 0 0.5rem;
}

.service-card p {
  color: #666;
  margin: 0 0 1rem;
}

.service-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price {
  font-weight: bold;
  color: #2ecc71;
}

.duration {
  color: #666;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.pagination {
  text-align: center;
}

/* Buttons */
.btn-primary, .btn-secondary, .btn-small, .btn-text {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-text {
  background: none;
  color: #666;
}

.btn-text:hover {
  color: #333;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}
</style>
