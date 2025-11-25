<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">DataTable Demo</h1>
      <p class="mt-2 text-sm text-gray-600">Testing the new DataTable component with Firestore collection</p>
    </div>

    <DataTable
      store-id="demo-services"
      collection-name="services"
      title="Services"
      subtitle="Manage your services collection"
      :fields="fields"
      :enable-create="true"
      :enable-edit="true"
      :enable-delete="true"
      :enable-filter="true"
      :enable-sort="true"
      :enable-selection="true"
      :authenticated="true"
      :user-owned="false"
      :realtime="false"
      height="600px"
      style="height: 600px;"
    />
  </div>
</template>

<script setup lang="ts">
import DataTable from '@/components/datatable/DataTable.vue'
import type { FieldConfig } from '@/components/datatable/types'

const fields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Service Name',
    type: 'text',
    sortable: true,
    filterable: true,
    width: '250px',
    required: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    sortable: false,
    filterable: true,
    width: '300px'
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    sortable: true,
    filterable: true,
    width: '120px',
    align: 'right',
    format: (value) => `$${value?.toFixed(2) || '0.00'}`
  },
  {
    name: 'active',
    label: 'Active',
    type: 'boolean',
    sortable: true,
    filterable: true,
    width: '100px',
    align: 'center'
  },
  {
    name: 'createdAt',
    label: 'Created',
    type: 'date',
    sortable: true,
    filterable: true,
    width: '150px',
    format: (value) => {
      if (!value) return ''
      const date = value?.toDate ? value.toDate() : new Date(value)
      return date.toLocaleDateString()
    }
  }
]
</script>
