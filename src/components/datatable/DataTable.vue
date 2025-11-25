<template>
  <div 
    class="data-table-container flex flex-col" 
    :style="{ height: height }"
    role="region"
    :aria-label="title || 'Data table'"
    :aria-busy="isLoading"
  >
    <!-- Toolbar -->
    <div class="data-table-toolbar h-14 border-b bg-white px-4 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <!-- Title -->
        <div v-if="title || subtitle" class="flex flex-col">
          <h2 v-if="title" class="text-lg font-semibold text-gray-900">{{ title }}</h2>
          <p v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</p>
        </div>
        
        <!-- Selection info and bulk actions -->
        <div v-if="enableSelection && selectedCount > 0" class="flex items-center gap-3 ml-4">
          <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded">
            <span class="text-sm font-medium text-blue-900">
              {{ selectedCount }} selected
            </span>
            <button
              @click="clearSelection"
              class="text-blue-600 hover:text-blue-800"
              title="Clear selection"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Bulk actions -->
          <div class="flex items-center gap-2">
            <button
              v-if="enableDelete"
              @click="handleBulkDelete"
              class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Selected
            </button>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Search -->
        <div v-if="enableSearch" class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg 
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <!-- Refresh button -->
        <button
          v-if="enableRefresh"
          @click="handleRefresh"
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          title="Refresh"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <!-- Export button -->
        <button
          v-if="enableExport"
          @click="handleExport"
          class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          title="Export to CSV"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        
        <!-- Column visibility toggle -->
        <div v-if="fields.length > 0" class="relative column-selector-container">
          <button
            @click="showColumnSelector = !showColumnSelector"
            class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Column Visibility"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>
          
          <!-- Column selector dropdown -->
          <div
            v-if="showColumnSelector"
            class="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-20 p-3"
          >
            <div class="mb-2 pb-2 border-b">
              <h4 class="text-sm font-semibold text-gray-900">Show/Hide Columns</h4>
            </div>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <label
                v-for="field in fields"
                :key="field.name"
                class="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  :checked="field.visible !== false"
                  @change="toggleColumnVisibility(field.name)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">{{ field.label }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Divider -->
        <div class="h-6 w-px bg-gray-300"></div>
        
        <!-- Toolbar actions will be added here -->
        <button
          v-if="enableCreate"
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="data-table-content flex-1 overflow-auto relative">
      <!-- Sticky wrapper for headers and filter -->
      <div class="min-w-full">
        <!-- Headers Container (Sticky) -->
        <div class="data-table-headers sticky top-0 z-10 bg-gray-50 border-b">
          <!-- Caption Row -->
          <div class="data-table-header-row flex border-b bg-gray-100 min-w-max">
            <!-- Selection column if enabled -->
            <div 
              v-if="enableSelection" 
              class="data-table-header-cell w-12 flex-shrink-0 px-3 py-2 flex items-center justify-center"
            >
              <input
                ref="selectAllCheckbox"
                type="checkbox" 
                :checked="allItemsSelected"
                @change="toggleSelectAll"
                :aria-label="allItemsSelected ? 'Deselect all items' : 'Select all items'"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>            <!-- Field headers -->
            <div 
              v-for="field in visibleFields" 
              :key="field.name"
              class="data-table-header-cell px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              :class="[
                field.headerClass,
                field.sortable !== false && enableSort ? 'cursor-pointer hover:bg-gray-200 select-none' : '',
                `text-${field.align || 'left'}`
              ]"
              :style="{ 
                width: field.width || 'auto',
                minWidth: field.minWidth || '100px'
              }"
              @click="handleSort(field)"
            >
              <div class="flex items-center gap-2">
                <span>{{ field.label }}</span>
                <!-- Sort indicator -->
                <span 
                  v-if="field.sortable !== false && enableSort"
                  class="flex-shrink-0"
                >
                  <!-- No sort -->
                  <svg 
                    v-if="getSortIcon(field) === 'sort-none'"
                    class="w-4 h-4 text-gray-400"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <!-- Ascending -->
                  <svg 
                    v-else-if="getSortIcon(field) === 'sort-asc'"
                    class="w-4 h-4 text-blue-600"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <!-- Descending -->
                  <svg 
                    v-else
                    class="w-4 h-4 text-blue-600"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                  </svg>
                </span>
              </div>
            </div>
            
            <!-- Actions column -->
            <div 
              v-if="enableEdit || enableDelete"
              class="data-table-header-cell w-32 flex-shrink-0 px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase"
            >
              Actions
            </div>
          </div>

          <!-- Filter Row (if enabled) -->
          <div v-if="enableFilter" class="data-table-filter-row flex border-b bg-gray-50 min-w-max">
            <!-- Selection column spacer -->
            <div v-if="enableSelection" class="w-12 flex-shrink-0"></div>
            
            <!-- Filter cells -->
            <div 
              v-for="field in visibleFields" 
              :key="`filter-${field.name}`"
              class="data-table-filter-cell px-4 py-2 relative"
              :style="{ 
                width: field.width || 'auto',
                minWidth: field.minWidth || '100px'
              }"
            >
              <div v-if="field.filterable !== false" class="flex items-center gap-1">
                <!-- Active filter display -->
                <div 
                  v-if="hasFilter(field.name)"
                  class="flex-1 px-2 py-1 text-sm bg-blue-50 border border-blue-500 rounded flex items-center justify-between"
                >
                  <span class="text-blue-900 font-medium truncate">{{ getFilterDisplayValue(field.name) }}</span>
                  <button
                    @click="clearFilter(field.name)"
                    class="ml-1 text-blue-600 hover:text-blue-800"
                    title="Clear filter"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <!-- Filter input (when no filter is active) -->
                <input
                  v-else-if="field.type === 'text' || field.type === 'number'"
                  :type="field.type === 'number' ? 'number' : 'text'"
                  :value="getFilterValue(field.name)"
                  @input="(e) => applyFilter(field.name, getFilterOperator(field.name), (e.target as HTMLInputElement).value)"
                  :placeholder="`Filter ${field.label}...`"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                
                <!-- Boolean select (when no filter is active) -->
                <select
                  v-else-if="field.type === 'boolean'"
                  :value="getFilterValue(field.name)"
                  @change="(e) => applyFilter(field.name, '==', (e.target as HTMLSelectElement).value)"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                
                <!-- Date input (when no filter is active) -->
                <input
                  v-else-if="field.type === 'date'"
                  type="date"
                  :value="getFilterValue(field.name)"
                  @input="(e) => applyFilter(field.name, getFilterOperator(field.name), (e.target as HTMLInputElement).value)"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                
                <!-- Default text input (when no filter is active) -->
                <input
                  v-else
                  type="text"
                  :value="getFilterValue(field.name)"
                  @input="(e) => applyFilter(field.name, '==', (e.target as HTMLInputElement).value)"
                  :placeholder="`Filter ${field.label}...`"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                
                <!-- Filter menu button -->
                <button 
                  @click="toggleFilterMenu(field.name)"
                  class="p-1 rounded hover:bg-gray-200"
                  :class="hasFilter(field.name) ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'"
                  :title="hasFilter(field.name) ? 'Filter active' : 'Filter options'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </button>
                
                <!-- Filter dropdown menu -->
                <div 
                  v-if="showFilterMenu === field.name"
                  class="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 p-3 min-w-[250px]"
                >
                  <div class="mb-2">
                    <label class="block text-xs font-medium text-gray-700 mb-1">Operator</label>
                    <select
                      :value="getFilterOperator(field.name)"
                      @change="(e) => applyFilter(field.name, (e.target as HTMLSelectElement).value, getFilterValue(field.name))"
                      class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option 
                        v-for="op in getFilterOperatorsForType(field.type)"
                        :key="op.value"
                        :value="op.value"
                      >
                        {{ op.label }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="flex gap-2 mt-3">
                    <button
                      @click="clearFilter(field.name)"
                      class="flex-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                    >
                      Clear
                    </button>
                    <button
                      @click="showFilterMenu = null"
                      class="flex-1 px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions column spacer -->
            <div v-if="enableEdit || enableDelete" class="w-32 flex-shrink-0"></div>
          </div>
        </div>

        <!-- Table Body -->
        <div class="data-table-body bg-white">
          <!-- Loading State -->
          <div v-if="isLoading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-sm text-gray-500">Loading data...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-8 text-center">
            <div class="text-red-600 mb-2">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-sm text-gray-700">{{ error }}</p>
            <button 
              @click="handleRetry"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="items.length === 0" class="p-8 text-center">
            <div class="text-gray-400 mb-2">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p class="text-sm text-gray-500">{{ emptyMessage }}</p>
            <button 
              v-if="enableCreate"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create First Item
            </button>
          </div>

          <!-- Data Rows -->
          <div v-if="isLoading && items.length === 0" class="space-y-2 p-4">
            <!-- Loading skeleton -->
            <div 
              v-for="i in pageSize" 
              :key="i"
              class="animate-pulse flex gap-2 border-b border-gray-200 pb-2"
            >
              <div v-if="enableSelection" class="w-12 h-10 bg-gray-200 rounded"></div>
              <div 
                v-for="field in visibleFields" 
                :key="field.name"
                class="h-10 bg-gray-200 rounded"
                :style="{ width: field.width || 'auto', minWidth: field.minWidth || '100px' }"
              ></div>
              <div v-if="enableEdit || enableDelete" class="w-32 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>

          <!-- No data message -->
          <div 
            v-else-if="!isLoading && filteredItems.length === 0"
            class="text-center py-12 text-gray-500"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="text-lg font-medium">No data available</p>
            <p class="text-sm mt-1">{{ searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating a new item' }}</p>
          </div>

          <!-- Data rows with data -->
          <div v-else>
            <div
              v-for="(item, index) in filteredItems"
              :key="item.id || index"
              class="data-table-row flex hover:bg-gray-50 transition-colors border-b border-gray-200 min-w-max"
              :class="{ 'bg-gray-50': striped && index % 2 === 1 }"
            >
              <!-- Selection checkbox -->
              <div 
                v-if="enableSelection" 
                class="w-12 flex-shrink-0 px-3 py-3 flex items-center justify-center"
              >
                <input 
                  type="checkbox" 
                  :checked="!!(item.id && selectedItems.has(item.id))"
                  @change="item.id && toggleSelectItem(item.id)"
                  :aria-label="`Select ${(item as any).name || 'item'}`"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <!-- Data cells -->
              <div
                v-for="field in visibleFields"
                :key="`${item.id}-${field.name}`"
                class="data-table-cell px-4 py-3 text-sm text-gray-900"
                :class="[
                  typeof field.cellClass === 'function' ? field.cellClass((item as any)[field.name], item) : field.cellClass,
                  `text-${field.align || 'left'}`
                ]"
                :style="{ 
                  width: field.width || 'auto',
                  minWidth: field.minWidth || '100px'
                }"
              >
                {{ formatCellValue((item as any)[field.name], field) }}
              </div>
              
              <!-- Actions -->
              <div 
                v-if="enableEdit || enableDelete"
                class="w-32 flex-shrink-0 px-4 py-3 flex items-center justify-center gap-2"
              >
                <button
                  v-if="enableEdit"
                  @click="openEditModal(item)"
                  class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  v-if="enableDelete"
                  @click="item.id && openDeleteModal(item.id)"
                  class="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="data-table-footer h-14 border-t bg-white px-4 flex items-center justify-between flex-shrink-0">
      <!-- Items count -->
      <div class="text-sm text-gray-700">
        <template v-if="enablePagination && totalItems > 0">
          Showing <span class="font-medium">{{ displayedItemsRange.start }}-{{ displayedItemsRange.end }}</span> 
          of <span class="font-medium">{{ totalItems }}</span> results
        </template>
        <template v-else-if="items.length > 0">
          <span class="font-medium">{{ items.length }}</span> {{ items.length === 1 ? 'item' : 'items' }}
        </template>
        <template v-else>
          <span class="text-gray-500">No items</span>
        </template>
      </div>
      
      <!-- Pagination controls -->
      <div v-if="enablePagination && totalPages > 1" class="flex items-center gap-2">
        <!-- Page size selector -->
        <div class="flex items-center gap-2 mr-4">
          <span class="text-sm text-gray-600">Per page:</span>
          <select
            :value="pageSize"
            @change="(e) => changePageSize(parseInt((e.target as HTMLSelectElement).value))"
            class="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option 
              v-for="size in pageSizeOptions" 
              :key="size" 
              :value="size"
            >
              {{ size }}
            </option>
          </select>
        </div>
        
        <!-- Previous button -->
        <button
          @click="goToPreviousPage"
          :disabled="!canGoPrevious"
          class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="canGoPrevious ? 'text-gray-700' : 'text-gray-400'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <!-- Page numbers -->
        <div class="flex items-center gap-1">
          <template v-for="page in getPageNumbers()" :key="page">
            <button
              v-if="page !== '...'"
              @click="goToPage(page as number)"
              class="min-w-[32px] px-2 py-1 text-sm rounded"
              :class="page === currentPage 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-gray-700 hover:bg-gray-100'"
            >
              {{ page }}
            </button>
            <span v-else class="px-2 text-gray-500">...</span>
          </template>
        </div>
        
        <!-- Next button -->
        <button
          @click="goToNextPage"
          :disabled="!canGoNext"
          class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="canGoNext ? 'text-gray-700' : 'text-gray-400'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal || showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModals"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ showCreateModal ? 'Create New Item' : 'Edit Item' }}
            </h3>
            <button
              @click="closeModals"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="px-6 py-4">
            <div class="space-y-4">
              <div
                v-for="field in fields.filter(f => f.visible !== false)"
                :key="field.name"
                class="flex flex-col"
              >
                <label class="text-sm font-medium text-gray-700 mb-1">
                  {{ field.label }}
                  <span v-if="field.required" class="text-red-500">*</span>
                </label>
                
                <!-- Text input -->
                <input
                  v-if="field.type === 'text'"
                  v-model="formData[field.name]"
                  :type="field.type"
                  :required="field.required"
                  :placeholder="field.label"
                  class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <!-- Number input -->
                <input
                  v-else-if="field.type === 'number'"
                  v-model.number="formData[field.name]"
                  type="number"
                  :required="field.required"
                  :placeholder="field.label"
                  class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <!-- Boolean checkbox -->
                <label
                  v-else-if="field.type === 'boolean'"
                  class="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    v-model="formData[field.name]"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-600">{{ field.label }}</span>
                </label>
                
                <!-- Date input -->
                <input
                  v-else-if="field.type === 'date'"
                  v-model="formData[field.name]"
                  type="date"
                  :required="field.required"
                  class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <!-- Default text input -->
                <input
                  v-else
                  v-model="formData[field.name]"
                  type="text"
                  :required="field.required"
                  :placeholder="field.label"
                  class="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              @click="closeModals"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="showCreateModal ? handleCreate() : handleEdit()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              {{ showCreateModal ? 'Create' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModals"
      >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b">
            <h3 class="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            <button
              @click="closeModals"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="px-6 py-4">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-700">
                  Are you sure you want to delete this item? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              @click="closeModals"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { createCollectionStore } from '@/services/collections'
import type { DataTableProps, FieldConfig, SortState, Filter } from './types'
import type { BaseDocument, QueryOptions, WhereCondition } from '@/services/collections/types'
import { Timestamp } from 'firebase/firestore'

// Props with defaults
const props = withDefaults(defineProps<DataTableProps>(), {
  enableCreate: true,
  enableEdit: true,
  enableDelete: true,
  enableExport: true,
  enableSearch: true,
  enableFilter: true,
  enableSort: true,
  enablePagination: true,
  enableSelection: false,
  enableRefresh: true,
  authenticated: false,
  userOwned: false,
  realtime: false,
  defaultPageSize: 20,
  pageSizeOptions: () => [10, 20, 50, 100],
  emptyMessage: 'No data available',
  height: 'calc(100vh - 200px)',
  striped: true,
  bordered: true,
  hoverable: true
})

// Local state
const sortState = ref<SortState | null>(null)
const filters = ref<Map<string, Filter>>(new Map())
const showFilterMenu = ref<string | null>(null) // Track which field's filter menu is open
const currentPage = ref(1)
const pageSize = ref(props.defaultPageSize)
const totalItems = ref(0)

// Modal states
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingItem = ref<any>(null)
const deletingItemId = ref<string | null>(null)
const formData = ref<Record<string, any>>({})

// Toolbar states
const searchQuery = ref('')
const showColumnSelector = ref(false)

// Selection states
const selectedItems = ref<Set<string>>(new Set())
const showBulkActions = ref(false)

// Create collection store
const useStore = createCollectionStore<BaseDocument>(props.storeId, {
  collection: props.collectionName,
  authenticated: props.authenticated,
  userOwned: props.userOwned,
  realtime: props.realtime,
  cacheTTL: 300000, // 5 minutes
  autoLoad: false,
})

// Initialize store instance
const store = useStore()

// Get reactive state from store
const items = computed(() => store.items)
const isLoading = computed(() => store.loading)
const error = computed(() => store.error)

// Load data on mount
onMounted(async () => {
  console.log('DataTable mounted', {
    storeId: props.storeId,
    collectionName: props.collectionName,
    authenticated: props.authenticated,
    userOwned: props.userOwned
  })
  await loadData()
})

// Handle realtime subscriptions
watch(() => props.realtime, (newValue) => {
  if (newValue) {
    store.startRealtime()
  } else {
    store.stopRealtime()
  }
}, { immediate: true })

// Cleanup on unmount
onUnmounted(() => {
  if (props.realtime) {
    store.stopRealtime()
  }
})

// Close column selector when clicking outside
const closeColumnSelector = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.column-selector-container')) {
    showColumnSelector.value = false
  }
}

watch(showColumnSelector, (isOpen) => {
  if (isOpen) {
    setTimeout(() => {
      document.addEventListener('click', closeColumnSelector)
    }, 0)
  } else {
    document.removeEventListener('click', closeColumnSelector)
  }
})

// Computed
const visibleFields = computed(() => {
  return props.fields.filter(field => field.visible !== false)
})

const filteredItems = computed(() => {
  if (!searchQuery.value || !props.enableSearch) {
    return items.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return items.value.filter(item => {
    return props.fields.some(field => {
      const value = (item as any)[field.name]
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(query)
    })
  })
})

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize.value)
})

const displayedItemsRange = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value + 1
  const end = Math.min(currentPage.value * pageSize.value, totalItems.value)
  return { start, end }
})

const canGoPrevious = computed(() => currentPage.value > 1)
const canGoNext = computed(() => currentPage.value < totalPages.value)

const allItemsSelected = computed(() => {
  if (filteredItems.value.length === 0) return false
  return filteredItems.value.every(item => item.id && selectedItems.value.has(item.id))
})

const someItemsSelected = computed(() => {
  return selectedItems.value.size > 0 && !allItemsSelected.value
})

const selectedCount = computed(() => selectedItems.value.size)

// Reference for the select-all checkbox to set indeterminate state
const selectAllCheckbox = ref<HTMLInputElement | null>(null)

// Watch for changes to update indeterminate state
watch([allItemsSelected, someItemsSelected], () => {
  if (selectAllCheckbox.value) {
    selectAllCheckbox.value.indeterminate = someItemsSelected.value
  }
})

// Clear selection when filters, sorts, or pagination changes
watch([() => currentPage.value, () => pageSize.value], () => {
  if (selectedItems.value.size > 0) {
    selectedItems.value.clear()
  }
})

// Methods
const loadData = async (resetPage = false) => {
  try {
    if (resetPage) {
      currentPage.value = 1
    }
    
    const queryOptions: QueryOptions = {}
    
    // Apply sorting
    if (sortState.value && sortState.value.field) {
      queryOptions.orderBy = [{
        field: sortState.value.field,
        direction: sortState.value.direction
      }]
    }
    
    // Apply filters
    const whereConditions: WhereCondition[] = []
    filters.value.forEach((filter, fieldName) => {
      if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
        // Handle special date equals case
        if (typeof filter.value === 'object' && filter.value.__isDateEquals) {
          // For date equals, we need to query for the whole day
          // Create two conditions: >= start of day AND < start of next day
          const startOfDay = filter.value.date
          const nextDay = new Date(filter.value.date.toDate())
          nextDay.setDate(nextDay.getDate() + 1)
          const startOfNextDay = Timestamp.fromDate(nextDay)
          
          whereConditions.push({
            field: fieldName,
            operator: '>=',
            value: startOfDay
          })
          whereConditions.push({
            field: fieldName,
            operator: '<',
            value: startOfNextDay
          })
        } else {
          whereConditions.push({
            field: fieldName,
            operator: filter.operator as any,
            value: filter.value
          })
        }
      }
    })
    
    if (whereConditions.length > 0) {
      queryOptions.where = whereConditions
    }
    
    // Apply pagination
    if (props.enablePagination) {
      queryOptions.limit = pageSize.value
      
      // For Firestore pagination, we'll use the paginate method
      if (currentPage.value > 1) {
        // Use paginate for next/previous page
        await store.paginate(
          {
            limit: pageSize.value,
            direction: 'next'
          },
          queryOptions
        )
      } else {
        // First page - use regular load with limit
        await store.load(queryOptions)
      }
      
      // Update total items (approximation for now)
      totalItems.value = store.items.length
    } else {
      await store.load(queryOptions)
      totalItems.value = store.items.length
    }
    
    console.log('Data loaded:', store.items.length, 'items')
  } catch (err) {
    console.error('Failed to load data:', err)
  }
}

const handleSort = async (field: FieldConfig) => {
  if (!props.enableSort || field.sortable === false) return
  
  // Toggle sort direction
  if (sortState.value?.field === field.name) {
    // Same field - toggle direction or clear
    if (sortState.value.direction === 'asc') {
      sortState.value.direction = 'desc'
    } else {
      sortState.value = null // Clear sort
    }
  } else {
    // New field - start with ascending
    sortState.value = {
      field: field.name,
      direction: 'asc'
    }
  }
  
  // Reload data with new sort
  await loadData()
}

const getSortIcon = (field: FieldConfig): string => {
  if (!sortState.value || sortState.value.field !== field.name) {
    return 'sort-none'
  }
  return sortState.value.direction === 'asc' ? 'sort-asc' : 'sort-desc'
}

const getFilterOperatorsForType = (type: string) => {
  switch (type) {
    case 'text':
      return [
        { value: '==', label: 'Equals' },
        { value: '!=', label: 'Not equals' }
      ]
    case 'number':
      return [
        { value: '==', label: 'Equals' },
        { value: '!=', label: 'Not equals' },
        { value: '<', label: 'Less than' },
        { value: '<=', label: 'Less or equal' },
        { value: '>', label: 'Greater than' },
        { value: '>=', label: 'Greater or equal' }
      ]
    case 'boolean':
      return [
        { value: '==', label: 'Equals' }
      ]
    case 'date':
      return [
        { value: '==', label: 'On date' },
        { value: '<', label: 'Before' },
        { value: '<=', label: 'On or before' },
        { value: '>', label: 'After' },
        { value: '>=', label: 'On or after' }
      ]
    default:
      return [
        { value: '==', label: 'Equals' },
        { value: '!=', label: 'Not equals' }
      ]
  }
}

const applyFilter = async (fieldName: string, operator: string, value: any) => {
  const field = props.fields.find(f => f.name === fieldName)
  if (!field) return
  
  // Store the raw input value for display purposes
  let rawValue = value
  
  // Convert value based on field type
  let processedValue = value
  if (field.type === 'number' && value !== '') {
    processedValue = parseFloat(value)
    if (isNaN(processedValue)) return
  } else if (field.type === 'boolean') {
    processedValue = value === 'true' || value === true
  } else if (field.type === 'date' && value !== '') {
    // Convert date string to Firestore Timestamp
    // The input is in YYYY-MM-DD format
    const dateObj = new Date(value)
    if (isNaN(dateObj.getTime())) return // Invalid date
    
    // For "==" operator, we need to match the whole day
    // So we'll use >= start of day and < start of next day
    if (operator === '==') {
      // Store the date string and handle it specially in the query building
      processedValue = {
        __isDateEquals: true,
        date: Timestamp.fromDate(dateObj),
        rawValue: value // Keep the YYYY-MM-DD string for input
      }
    } else {
      // For other operators, convert to Timestamp at start of day
      processedValue = Timestamp.fromDate(dateObj)
    }
  }
  
  filters.value.set(fieldName, {
    field: fieldName,
    operator: operator as any,
    value: processedValue,
    rawValue: rawValue // Store original input value
  })
  
  showFilterMenu.value = null
  await loadData(true) // Reset to page 1 when filtering
}

const clearFilter = async (fieldName: string) => {
  filters.value.delete(fieldName)
  showFilterMenu.value = null
  await loadData(true) // Reset to page 1 when clearing filter
}

const hasFilter = (fieldName: string): boolean => {
  return filters.value.has(fieldName)
}

const getFilterValue = (fieldName: string): any => {
  return filters.value.get(fieldName)?.value || ''
}

const getFilterOperator = (fieldName: string): string => {
  return filters.value.get(fieldName)?.operator || '=='
}

const getOperatorSymbol = (operator: string): string => {
  const symbols: Record<string, string> = {
    '==': '=',
    '!=': '≠',
    '<': '<',
    '<=': '≤',
    '>': '>',
    '>=': '≥',
    'array-contains': '∋',
    'array-contains-any': '∋*',
    'in': '∈',
    'not-in': '∉',
    'startsWith': '^',
    'endsWith': '$',
    'contains': '⊃'
  }
  return symbols[operator] || operator
}

const getFilterDisplayValue = (fieldName: string): string => {
  const filter = filters.value.get(fieldName)
  if (!filter || !filter.value) return ''
  
  const field = props.fields.find(f => f.name === fieldName)
  if (!field) return String(filter.value)
  
  let displayValue = filter.value
  
  // Handle special date equals case
  if (typeof filter.value === 'object' && filter.value.__isDateEquals) {
    // Use the raw value if available, otherwise format the date
    displayValue = filter.value.rawValue || filter.value.date.toDate().toLocaleDateString()
  } else if (field.type === 'date' && filter.value?.toDate) {
    // Regular date Timestamp - use raw value if available
    displayValue = filter.rawValue || filter.value.toDate().toLocaleDateString()
  } else if (field.type === 'boolean') {
    displayValue = filter.value ? 'Yes' : 'No'
  } else if (field.type === 'number') {
    displayValue = String(filter.value)
  } else {
    displayValue = String(filter.value)
  }
  
  return `${getOperatorSymbol(filter.operator)} ${displayValue}`
}

const toggleFilterMenu = (fieldName: string) => {
  if (showFilterMenu.value === fieldName) {
    showFilterMenu.value = null
  } else {
    showFilterMenu.value = fieldName
  }
}

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  await loadData()
}

const goToPreviousPage = async () => {
  if (canGoPrevious.value) {
    await goToPage(currentPage.value - 1)
  }
}

const goToNextPage = async () => {
  if (canGoNext.value) {
    await goToPage(currentPage.value + 1)
  }
}

const changePageSize = async (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
  await loadData()
}

const getPageNumbers = (): (number | string)[] => {
  const pages: (number | string)[] = []
  const maxVisible = 5 // Maximum number of page buttons to show
  
  if (totalPages.value <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)
    
    // Calculate range around current page
    let start = Math.max(2, currentPage.value - 1)
    let end = Math.min(totalPages.value - 1, currentPage.value + 1)
    
    // Adjust if we're near the beginning
    if (currentPage.value <= 3) {
      end = 4
    }
    
    // Adjust if we're near the end
    if (currentPage.value >= totalPages.value - 2) {
      start = totalPages.value - 3
    }
    
    // Add ellipsis before middle pages if needed
    if (start > 2) {
      pages.push('...')
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    // Add ellipsis after middle pages if needed
    if (end < totalPages.value - 1) {
      pages.push('...')
    }
    
    // Always show last page
    pages.push(totalPages.value)
  }
  
  return pages
}

const initFormData = () => {
  const data: Record<string, any> = {}
  props.fields.forEach(field => {
    if (field.type === 'boolean') {
      data[field.name] = false
    } else if (field.type === 'number') {
      data[field.name] = 0
    } else {
      data[field.name] = ''
    }
  })
  return data
}

const openCreateModal = () => {
  formData.value = initFormData()
  showCreateModal.value = true
}

const openEditModal = (item: any) => {
  editingItem.value = item
  formData.value = { ...item }
  showEditModal.value = true
}

const openDeleteModal = (itemId: string) => {
  deletingItemId.value = itemId
  showDeleteModal.value = true
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  editingItem.value = null
  deletingItemId.value = null
  formData.value = {}
}

const handleCreate = async () => {
  try {
    // Validate required fields
    for (const field of props.fields) {
      if (field.required && !formData.value[field.name]) {
        alert(`${field.label} is required`)
        return
      }
    }
    
    // Call custom onCreate if provided
    if (props.onCreate) {
      await props.onCreate(formData.value)
    } else {
      // Default: use store's create method
      await store.create(formData.value)
    }
    
    closeModals()
    await loadData()
  } catch (err) {
    console.error('Failed to create item:', err)
    alert('Failed to create item: ' + (err as Error).message)
  }
}

const handleEdit = async () => {
  try {
    if (!editingItem.value?.id) return
    
    // Validate required fields
    for (const field of props.fields) {
      if (field.required && !formData.value[field.name]) {
        alert(`${field.label} is required`)
        return
      }
    }
    
    // Use store's update method
    await store.update(editingItem.value.id, formData.value)
    
    closeModals()
    await loadData()
  } catch (err) {
    console.error('Failed to update item:', err)
    alert('Failed to update item: ' + (err as Error).message)
  }
}

const handleDelete = async () => {
  try {
    if (!deletingItemId.value) return
    
    // Call custom onDelete if provided
    if (props.onDelete) {
      await props.onDelete(deletingItemId.value)
    } else {
      // Default: use store's remove method
      await store.remove(deletingItemId.value)
    }
    
    closeModals()
    await loadData()
  } catch (err) {
    console.error('Failed to delete item:', err)
    alert('Failed to delete item: ' + (err as Error).message)
  }
}

const handleRefresh = async () => {
  await store.refresh()
}

const handleExport = () => {
  // Export visible data to CSV
  const visibleFieldsList = visibleFields.value
  const exportData = filteredItems.value
  
  if (exportData.length === 0) {
    alert('No data to export')
    return
  }
  
  // Create CSV header
  const headers = visibleFieldsList.map(f => f.label).join(',')
  
  // Create CSV rows
  const rows = exportData.map(item => {
    return visibleFieldsList.map(field => {
      const value = (item as any)[field.name]
      const formatted = formatCellValue(value, field)
      // Escape quotes and wrap in quotes if contains comma
      return formatted.includes(',') ? `"${formatted.replace(/"/g, '""')}"` : formatted
    }).join(',')
  })
  
  // Combine and create blob
  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  
  // Download
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${props.collectionName}_export_${Date.now()}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const toggleColumnVisibility = (fieldName: string) => {
  const field = props.fields.find(f => f.name === fieldName)
  if (field) {
    field.visible = field.visible === false ? true : false
  }
}

const toggleSelectAll = () => {
  if (allItemsSelected.value) {
    // Deselect all
    selectedItems.value.clear()
  } else {
    // Select all visible items
    filteredItems.value.forEach(item => {
      if (item.id) {
        selectedItems.value.add(item.id)
      }
    })
  }
}

const toggleSelectItem = (itemId: string) => {
  if (selectedItems.value.has(itemId)) {
    selectedItems.value.delete(itemId)
  } else {
    selectedItems.value.add(itemId)
  }
}

const handleBulkDelete = async () => {
  if (selectedItems.value.size === 0) return
  
  const confirmed = confirm(`Are you sure you want to delete ${selectedItems.value.size} item(s)?`)
  if (!confirmed) return
  
  try {
    // Delete all selected items
    const deletePromises = Array.from(selectedItems.value).map(id => store.remove(id))
    await Promise.all(deletePromises)
    
    // Clear selection
    selectedItems.value.clear()
    showBulkActions.value = false
    
    // Reload data
    await loadData()
  } catch (err) {
    console.error('Failed to delete items:', err)
    alert('Failed to delete some items: ' + (err as Error).message)
  }
}

const clearSelection = () => {
  selectedItems.value.clear()
  showBulkActions.value = false
}

const formatCellValue = (value: any, field: FieldConfig): string => {
  if (value === null || value === undefined) return ''
  
  if (field.format) {
    return field.format(value)
  }
  
  // Default formatting based on type
  switch (field.type) {
    case 'date':
      return value instanceof Date ? value.toLocaleDateString() : String(value)
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : String(value)
    default:
      return String(value)
  }
}

const handleRetry = async () => {
  try {
    await store.refresh()
  } catch (err) {
    console.error('Retry failed:', err)
  }
}
</script>

<style scoped>
.data-table-container {
  @apply bg-white shadow-sm rounded-lg overflow-hidden;
}

.data-table-header-cell,
.data-table-filter-cell,
.data-table-cell {
  @apply flex-shrink-0;
}

.data-table-row:hover {
  @apply relative;
}
</style>
