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
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    const fetchAssigned = async () => {
      try {
        const res = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME())
        const rows = res?.data || []
        const mapped = rows.map((r) => ({
          id: r.id, name: r.name, phone: r.phone, email: r.email || 'N/A', business: r.business || 'N/A',
          address: r.address || 'N/A', gstNo: r.gst_no || 'N/A', productName: r.product_type || 'N/A',
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
        }))
        setCustomers(mapped)
      } catch (err) {
        Toast.error('Failed to load assigned leads')
      }
    }
    fetchAssigned()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const tags = useMemo(() => {
    const uniqueTypes = [...new Set(customers.map(c => c.customerType).filter(t => t && t !== 'N/A'))]
    return uniqueTypes.sort()
  }, [customers])

  const getUniqueFilterOptions = useMemo(() => {
    return {
      tags: [...new Set(customers.map(c => c.customerType).filter(Boolean))].sort(),
      followUpStatuses: [...new Set(customers.map(c => c.followUpStatus).filter(Boolean))].sort(),
      salesStatuses: [...new Set(customers.map(c => c.salesStatus).filter(Boolean))].sort(),
      states: [...new Set(customers.map(c => c.state).filter(s => s && s !== 'N/A'))].sort(),
      leadSources: [...new Set(customers.map(c => c.enquiryBy).filter(s => s && s !== 'N/A'))].sort(),
      products: [...new Set(customers.map(c => c.productName).filter(s => s && s !== 'N/A'))].sort()
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
      filtered = filtered.filter(c => c.customerType === selectedTag)
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

    return filtered
  }, [customers, debouncedSearchQuery, selectedTag, filters, advancedFilters, enabledFilters])

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
    handleFilterChange, handleAdvancedFilterChange, clearAdvancedFilters, toggleFilterSection
  }
}
