/**
 * DataTable Component Types
 * Type definitions for the comprehensive data table component
 */

import type { VNode } from 'vue'

/**
 * Field types supported by the data table
 */
export type FieldType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'email' | 'url' | 'custom'

/**
 * Filter operators matching Firestore capabilities
 */
export type FilterOperator = 
  | '=='              // Equal
  | '!='              // Not equal
  | '<'               // Less than
  | '<='              // Less than or equal
  | '>'               // Greater than
  | '>='              // Greater than or equal
  | 'contains'        // String contains (client-side)
  | 'startsWith'      // String starts with (client-side)
  | 'endsWith'        // String ends with (client-side)
  | 'in'              // In array
  | 'not-in'          // Not in array
  | 'array-contains'  // Array contains value
  | 'array-contains-any' // Array contains any of values

/**
 * Configuration for a single table column/field
 */
export interface FieldConfig {
  // Basic Configuration
  name: string                      // Field key in document
  label: string                     // Display caption/header
  
  // Type & Display
  type: FieldType                   // Data type
  width?: string                    // Column width (e.g., '200px', '20%')
  minWidth?: string                 // Minimum column width
  align?: 'left' | 'center' | 'right'  // Text alignment (default: 'left')
  
  // Visibility
  visible?: boolean                 // Show/hide column (default: true)
  hideOnMobile?: boolean           // Hide on mobile screens (default: false)
  
  // Editing
  editable?: boolean               // Allow inline editing (default: true)
  required?: boolean               // Required field (default: false)
  placeholder?: string             // Placeholder text for inputs
  
  // Validation
  min?: number                     // Minimum value (numbers/dates)
  max?: number                     // Maximum value (numbers/dates)
  pattern?: RegExp                 // Regex pattern for validation
  validator?: (value: any, row: any) => string | null  // Custom validation function
  
  // Filtering
  filterable?: boolean             // Allow filtering (default: true)
  filterOperators?: FilterOperator[]  // Available operators (default: all applicable)
  filterType?: 'input' | 'select' | 'date' | 'range' | 'boolean'  // Filter input type
  filterPlaceholder?: string       // Placeholder for filter input
  
  // Sorting
  sortable?: boolean               // Allow sorting (default: true)
  sortField?: string               // Custom field for sorting (if different from name)
  
  // Select Options (for type: 'select')
  options?: Array<{ value: any; label: string; disabled?: boolean }>
  
  // Custom Rendering
  render?: (value: any, row: any) => string | VNode  // Custom cell display
  renderEdit?: (value: any, row: any, onChange: (value: any) => void) => VNode  // Custom edit input
  
  // Formatting
  format?: (value: any) => string  // Format value for display
  parse?: (value: string) => any   // Parse input back to value
  
  // Styling
  cellClass?: string | ((value: any, row: any) => string)  // Custom cell classes
  headerClass?: string             // Custom header classes
}

/**
 * Individual filter condition
 */
export interface Filter {
  field: string                    // Field to filter on
  operator: FilterOperator         // Comparison operator
  value: any                       // Filter value (processed for Firestore)
  rawValue?: any                   // Original raw input value for display
}

/**
 * Complete filter state
 */
export interface FilterState {
  filters: Filter[]                           // Advanced filters
  quickFilters: Record<string, string>        // Quick text filters by field
  activeField: string | null                  // Currently editing filter field
}

/**
 * Sort configuration
 */
export interface SortState {
  field: string | null             // Field to sort by
  direction: 'asc' | 'desc'        // Sort direction
}

/**
 * Pagination configuration
 */
export interface PaginationState {
  currentPage: number              // Current page (1-indexed)
  pageSize: number                 // Items per page
  totalItems: number               // Total number of items
  totalPages: number               // Total number of pages
}

/**
 * Main DataTable component props
 */
export interface DataTableProps {
  // Collection Configuration
  collectionName: string              // Firestore collection name
  storeId: string                     // Unique store identifier
  
  // Column Definitions
  fields: FieldConfig[]               // Field configurations
  
  // Feature Flags
  enableCreate?: boolean              // Show create button (default: true)
  enableEdit?: boolean                // Allow row editing (default: true)
  enableDelete?: boolean              // Allow row deletion (default: true)
  enableExport?: boolean              // Show export button (default: true)
  enableSearch?: boolean              // Show search bar (default: true)
  enableFilter?: boolean              // Allow column filtering (default: true)
  enableSort?: boolean                // Allow column sorting (default: true)
  enablePagination?: boolean          // Show pagination (default: true)
  enableSelection?: boolean           // Show row checkboxes (default: false)
  enableRefresh?: boolean             // Show refresh button (default: true)
  
  // Collection Store Config
  authenticated?: boolean             // Require authentication (default: false)
  userOwned?: boolean                // Filter by userId (default: false)
  realtime?: boolean                 // Enable real-time sync (default: false)
  cacheTTL?: number                  // Cache duration in ms
  
  // Pagination Settings
  defaultPageSize?: number           // Default items per page (default: 20)
  pageSizeOptions?: number[]         // Page size options (default: [10, 20, 50, 100])
  
  // Display Settings
  title?: string                     // Table title
  subtitle?: string                  // Table subtitle
  emptyMessage?: string              // Message when no data (default: "No data available")
  height?: string                    // Table height (default: "calc(100vh - 200px)")
  striped?: boolean                  // Zebra striping (default: true)
  bordered?: boolean                 // Show borders (default: true)
  hoverable?: boolean                // Highlight on hover (default: true)
  
  // Callbacks
  onRowClick?: (row: any) => void
  onRowDoubleClick?: (row: any) => void
  onSelectionChange?: (rows: any[]) => void
  onCreate?: (data: any) => Promise<void> | void
  onUpdate?: (id: string, data: any) => Promise<void> | void
  onDelete?: (id: string) => Promise<void> | void
}

/**
 * Internal component state
 */
export interface DataTableState {
  // Data
  items: any[]
  selectedItems: any[]
  editingRow: any | null
  
  // UI State
  loading: boolean
  error: string | null
  
  // Pagination
  pagination: PaginationState
  
  // Filtering
  filterState: FilterState
  
  // Sorting
  sortState: SortState
  
  // Modals
  showCreateModal: boolean
  showEditModal: boolean
  showDeleteModal: boolean
  showAdvancedFilterModal: boolean
  deleteTargetId: string | null
  
  // Search
  searchQuery: string
}

/**
 * Row action definitions
 */
export interface RowAction {
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  onClick: (row: any) => void | Promise<void>
  visible?: (row: any) => boolean
  disabled?: (row: any) => boolean
}

/**
 * Bulk action definitions
 */
export interface BulkAction {
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  onClick: (rows: any[]) => void | Promise<void>
  confirmMessage?: string
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'csv' | 'json' | 'excel'
  filename?: string
  includeHeaders?: boolean
  selectedOnly?: boolean
}

/**
 * Table event emits
 */
export interface DataTableEmits {
  'row-click': [row: any]
  'row-double-click': [row: any]
  'selection-change': [rows: any[]]
  'create': [data: any]
  'update': [id: string, data: any]
  'delete': [id: string]
  'refresh': []
  'export': [options: ExportOptions]
  'filter-change': [filters: Filter[]]
  'sort-change': [sort: SortState]
  'page-change': [page: number]
}
