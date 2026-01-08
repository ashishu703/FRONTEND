import { useState, useEffect, useMemo, useCallback } from 'react'
import { apiClient, API_ENDPOINTS } from '../utils/globalImports'
import Toast from '../utils/Toast'
import { StatusConverter } from '../utils/StatusConverter'

export function useSalespersonLeads(initialCustomers = []) {
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    tag: '', followUpStatus: '', salesStatus: '', state: '', leadSource: '', productType: '', dateFrom: '', dateTo: ''
  })
  const [enabledFilters, setEnabledFilters] = useState({
    tag: false, followUpStatus: false, salesStatus: false, state: false, leadSource: false, productType: false, dateRange: false
  })
  const [filters, setFilters] = useState({ salesStatus: '' })
  const [sortBy, setSortBy] = useState('none')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    // Only auto-fetch if initialCustomers is empty (not provided)
    // This allows components like LastCall/ScheduledCall to pass their own data
    if (initialCustomers.length > 0) {
      console.log('[Hook Debug] Using initialCustomers, skipping auto-fetch. Count:', initialCustomers.length)
      return
    }
    
    const fetchAssigned = async () => {
      try {
        console.log('[Hook Debug] Auto-fetching leads from API...')
        const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME())
        const rows = res?.data || []
        
        // Debug: Check first few rows for product data
        if (rows.length > 0) {
          console.log('[API Debug] Sample API response row:', {
            id: rows[0]?.id,
            product_type: rows[0]?.product_type,
            productType: rows[0]?.productType,
            product_name: rows[0]?.product_name,
            productName: rows[0]?.productName,
            allKeys: Object.keys(rows[0] || {})
          })
        }
        
        const mapped = rows.map((r) => {
          // Better product type handling - check multiple fields and preserve original value
          const productType = r.product_type || r.productType || r.product_name || r.productName || ''
          const productNameValue = productType && productType.trim() !== '' ? productType.trim() : 'N/A'
          
          return {
          id: r.id, name: r.name, phone: r.phone, email: r.email || 'N/A', business: r.business || 'N/A',
          address: r.address || 'N/A', gstNo: r.gst_no || 'N/A', 
          productName: productNameValue,
          product_type: productNameValue, // Store both for compatibility
          state: r.state || 'N/A', enquiryBy: r.lead_source || 'N/A', customerType: r.customer_type || 'N/A',
          date: r.date ? new Date(r.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          salesStatus: r.sales_status || 'pending', salesStatusRemark: r.sales_status_remark || null,
          salesStatusDate: new Date(r.updated_at || r.created_at || Date.now()).toLocaleString(),
          whatsapp: r.whatsapp ? `+91${String(r.whatsapp).replace(/\D/g, '').slice(-10)}` : null,
          transferredTo: r.transferred_to || null, callDurationSeconds: r.call_duration_seconds || null,
          quotationUrl: r.quotation_url || null, proformaInvoiceUrl: r.proforma_invoice_url || null,
          paymentReceiptUrl: r.payment_receipt_url || null, quotationCount: typeof r.quotation_count === 'number' ? r.quotation_count : (parseInt(r.quotation_count) || 0),
          paymentStatusDb: r.payment_status || null, paymentModeDb: r.payment_mode || null,
          followUpStatus: r.follow_up_status || null, followUpRemark: r.follow_up_remark || null,
          followUpDate: r.follow_up_date ? new Date(r.follow_up_date).toISOString().split('T')[0] : null,
          followUpTime: r.follow_up_time || null,
          }
        })
        
        // Debug: Check mapped data
        const productsInMapped = mapped.filter(c => c.productName && c.productName !== 'N/A' && c.productName.toLowerCase() !== 'n/a')
        console.log('[API Debug] Mapped customers:', mapped.length)
        console.log('[API Debug] Customers with valid products:', productsInMapped.length)
        if (productsInMapped.length > 0) {
          console.log('[API Debug] Sample products:', productsInMapped.slice(0, 5).map(c => c.productName))
        } else {
          console.warn('[API Debug] ⚠️ No valid products found in API response!')
        }
        
        setCustomers(mapped)
      } catch (err) {
        console.error('[API Debug] Error fetching leads:', err)
        Toast.error('Failed to load assigned leads')
      }
    }
    fetchAssigned()
  }, []) // Only run once on mount

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const tags = useMemo(() => {
    const uniqueTypes = [...new Set(customers.map(c => {
      const type = c.customerType
      return type && type !== 'N/A' ? type.toLowerCase() : null
    }).filter(Boolean))]
    return uniqueTypes.sort()
  }, [customers])

  const getUniqueFilterOptions = useMemo(() => {
    // Helper function to clean and validate values
    const cleanValue = (value) => {
      if (!value) return null
      const trimmed = String(value).trim()
      return trimmed && trimmed !== 'N/A' && trimmed !== 'null' && trimmed !== '' && trimmed.toLowerCase() !== 'n/a' ? trimmed : null
    }

    // Extract products with comprehensive handling
    const allProductValues = []
    
    customers.forEach((c, index) => {
      // Try multiple possible product fields in order of priority
      let product = c.productName || c.product_type || c.productType || c.product_name || ''
      
      // Handle array or comma-separated strings
      if (Array.isArray(product)) {
        product = product.filter(p => p && String(p).trim() !== '').join(', ')
      } else if (typeof product === 'string' && product.includes(',')) {
        // Already comma-separated, will be handled below
      }
      
      // Split by comma if it's a comma-separated string
      if (typeof product === 'string' && product.includes(',')) {
        const splitProducts = product.split(',').map(p => cleanValue(p)).filter(Boolean)
        allProductValues.push(...splitProducts)
      } else {
        const cleaned = cleanValue(product)
        if (cleaned) {
          allProductValues.push(cleaned)
        }
      }
    })

    // Get unique products and sort
    const uniqueProducts = [...new Set(allProductValues)].sort()

    // Debug: Log products for troubleshooting
    if (customers.length > 0) {
      const sampleCustomer = customers[0]
      const sampleProduct = sampleCustomer?.productName || sampleCustomer?.product_type || sampleCustomer?.productType || sampleCustomer?.product_name || 'N/A'
      
      console.log('[Filter Debug] ========== PRODUCT EXTRACTION ==========')
      console.log('[Filter Debug] Total customers:', customers.length)
      console.log('[Filter Debug] Unique products found:', uniqueProducts.length)
      console.log('[Filter Debug] Sample customer product fields:', {
        productName: sampleCustomer?.productName,
        product_type: sampleCustomer?.product_type,
        productType: sampleCustomer?.productType,
        product_name: sampleCustomer?.product_name,
        sampleProduct: sampleProduct
      })
      console.log('[Filter Debug] All extracted products:', allProductValues)
      console.log('[Filter Debug] Unique products list:', uniqueProducts)
      
      // Check if all products are 'N/A'
      const validProducts = customers.filter(c => {
        const p = c.productName || c.product_type || c.productType || c.product_name || ''
        return p && p.trim() !== '' && p !== 'N/A' && p.toLowerCase() !== 'n/a'
      })
      console.log('[Filter Debug] Customers with valid products:', validProducts.length)
      
      if (validProducts.length === 0 && customers.length > 0) {
        console.warn('[Filter Debug] ⚠️ WARNING: No valid products found! All products are N/A or empty.')
        console.warn('[Filter Debug] This might indicate a data issue in the database.')
      }
      console.log('[Filter Debug] =========================================')
    }

    return {
      tags: [...new Set(customers.map(c => {
        const type = c.customerType
        return type && type !== 'N/A' ? type.toLowerCase() : null
      }).filter(Boolean))].sort(),
      followUpStatuses: [...new Set(customers.map(c => cleanValue(c.followUpStatus)).filter(Boolean))].sort(),
      salesStatuses: [...new Set(customers.map(c => cleanValue(c.salesStatus)).filter(Boolean))].sort(),
      states: [...new Set(customers.map(c => cleanValue(c.state)).filter(Boolean))].sort(),
      leadSources: [...new Set(customers.map(c => cleanValue(c.enquiryBy)).filter(Boolean))].sort(),
      products: uniqueProducts
    }
  }, [customers])

  // OPTIMIZED: useMemo with debounced search and chunk processing for large arrays
  const filteredCustomers = useMemo(() => {
    let filtered = customers

    // Use debounced search query - search in name, phone, business, email, and address
    if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim()
      filtered = filtered.filter(c => {
        const name = (c.name || '').toLowerCase()
        const phone = String(c.phone || '')
        const business = (c.business || '').toLowerCase()
        const email = (c.email || '').toLowerCase()
        const address = (c.address || '').toLowerCase()
        
        return name.includes(query) || 
               phone.includes(query) || 
               business.includes(query) || 
               email.includes(query) ||
               address.includes(query)
      })
    }

    if (selectedTag && selectedTag !== 'all') {
      filtered = filtered.filter(c => {
        const customerType = c.customerType ? c.customerType.toLowerCase() : ''
        return customerType === selectedTag.toLowerCase()
      })
    }

    if (filters.salesStatus) {
      filtered = filtered.filter(c => c.salesStatus === filters.salesStatus)
    }

    Object.entries(advancedFilters).forEach(([key, value]) => {
      if (enabledFilters[key] && value) {
        if (key === 'dateRange') {
          if (advancedFilters.dateFrom) filtered = filtered.filter(c => c.date >= advancedFilters.dateFrom)
          if (advancedFilters.dateTo) filtered = filtered.filter(c => c.date <= advancedFilters.dateTo)
        } else {
          const fieldMap = { tag: 'customerType', followUpStatus: 'followUpStatus', salesStatus: 'salesStatus', 
            state: 'state', leadSource: 'enquiryBy', productType: 'productName' }
          if (fieldMap[key]) filtered = filtered.filter(c => c[fieldMap[key]] === value)
        }
      }
    })

    // Apply sorting
    if (sortBy && sortBy !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortBy]
        let bVal = b[sortBy]
        
        // Handle different data types
        if (sortBy === 'date') {
          aVal = aVal ? new Date(aVal).getTime() : 0
          bVal = bVal ? new Date(bVal).getTime() : 0
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = (bVal || '').toLowerCase()
        }
        
        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [customers, debouncedSearchQuery, selectedTag, filters, advancedFilters, enabledFilters, sortBy, sortOrder])

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredCustomers.slice(start, start + itemsPerPage)
  }, [filteredCustomers, currentPage, itemsPerPage])

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setCurrentPage(1)
    }
  }, [debouncedSearchQuery])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAdvancedFilterChange = (filterKey, value) => {
    setAdvancedFilters(prev => ({ ...prev, [filterKey]: value }))
    setCurrentPage(1)
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    setCurrentPage(1)
  }

  const handleSortOrderChange = (newSortOrder) => {
    setSortOrder(newSortOrder)
    setCurrentPage(1)
  }

  const clearAdvancedFilters = () => {
    setAdvancedFilters({ tag: '', followUpStatus: '', salesStatus: '', state: '', leadSource: '', productType: '', dateFrom: '', dateTo: '' })
    setEnabledFilters({ tag: false, followUpStatus: false, salesStatus: false, state: false, leadSource: false, productType: false, dateRange: false })
  }

  const toggleFilterSection = (filterKey) => {
    setEnabledFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }))
    if (enabledFilters[filterKey]) {
      if (filterKey === 'dateRange') {
        setAdvancedFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }))
      } else {
        setAdvancedFilters(prev => ({ ...prev, [filterKey]: '' }))
      }
    }
  }

  return {
    customers, setCustomers, searchQuery, setSearchQuery, selectedTag, setSelectedTag,
    showFilterPanel, setShowFilterPanel, advancedFilters, setAdvancedFilters, enabledFilters, setEnabledFilters, filters,
    tags, getUniqueFilterOptions, filteredCustomers, paginatedCustomers,
    currentPage, setCurrentPage, itemsPerPage, setItemsPerPage,
    handleFilterChange, handleAdvancedFilterChange, clearAdvancedFilters, toggleFilterSection,
    sortBy, setSortBy, sortOrder, setSortOrder, handleSortChange, handleSortOrderChange
  }
}
