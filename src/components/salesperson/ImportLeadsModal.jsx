import React from 'react'
import { X, Upload, Download, Info } from 'lucide-react'
import { apiClient, API_ENDPOINTS } from '../../utils/globalImports'
import Toast from '../../utils/Toast'

export default function ImportLeadsModal({ show, onClose, onImportSuccess }) {
  const [importFile, setImportFile] = React.useState(null)
  const [importing, setImporting] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const [showInfoTooltip, setShowInfoTooltip] = React.useState(false)
  const fileInputRef = React.useRef(null)

  const parseCSVLine = (line) => {
    const result = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []
    const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim())
    const data = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i])
        const row = {}
        headers.forEach((header, idx) => {
          row[header] = values[idx] ? values[idx].replace(/"/g, '').trim() : ''
        })
        if (row[headers[0]] || row[headers[1]]) {
          data.push(row)
        }
      }
    }
    return data
  }

  const handleFileSelect = (file) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setImportFile(file)
    } else {
      Toast.error('Please select a valid CSV file')
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDownloadTemplate = () => {
    const headers = [
      'Customer Name',
      'Mobile Number', 
      'WhatsApp Number',
      'Email',
      'Address',
      'GST Number',
      'Business Name',
      'Business Category',
      'Lead Source',
      'Product Names (comma separated)',
      'Assigned Salesperson',
      'Assigned Telecaller',
      'State',
      'Division',
      'Date (DD/MM/YYYY or YYYY-MM-DD)'
    ]
    
    // Demo data as provided by user for Marketing Department Head
    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      '"saurabh jhariya","9876549874","9876547564","jhariya@gmail.com","right town jabalpur","23FDGT546GF54","samriddhi","business","social media","acsr","NA","NA","MP","jabalpur","06/12/2025"'
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'leads_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    Toast.success('Template downloaded')
  }

  const handleImportLeads = async () => {
    if (!importFile) {
      Toast.warning('Please select a CSV file first')
      return
    }
    setImporting(true)
    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const csvText = e.target.result
          const parsedData = parseCSV(csvText)
          const leadsPayload = parsedData.map((row, index) => ({
            name: row['Customer Name'] || row['customer name'] || row.name || '',
            phone: row['Mobile Number'] || row['mobile number'] || row.Phone || row.phone || '',
            whatsapp: row['WhatsApp Number'] || row['whatsapp number'] || row.WhatsApp || row.whatsapp || row['Mobile Number'] || row['mobile number'] || row.Phone || row.phone || '',
            email: row.Email || row.email || '',
            address: row.Address || row.address || '',
            state: row.State || row.state || '',
            division: row.Division || row.division || '',
            gst_no: row['GST Number'] || row['gst number'] || row['GST No'] || row.gst_no || '',
            business: row['Business Name'] || row['business name'] || row.business || '',
            business_category: row['Business Category'] || row['business category'] || row.category || '',
            product_type: row['Product Names (comma separated)'] || row['product names (comma separated)'] || row['Product Name'] || row.product_type || '',
            lead_source: row['Lead Source'] || row['lead source'] || row.lead_source || '',
            assigned_salesperson: row['Assigned Salesperson'] || row['assigned salesperson'] || row.assignedSalesperson || (row['Assigned Salesperson'] === 'NA' ? null : null) || null,
            assigned_telecaller: row['Assigned Telecaller'] || row['assigned telecaller'] || row.assignedTelecaller || (row['Assigned Telecaller'] === 'NA' ? null : null) || null,
            date: row['Date (DD/MM/YYYY or YYYY-MM-DD)'] || row['date (dd/mm/yyyy or yyyy-mm-dd)'] || row.Date || row.date || new Date().toISOString().split('T')[0]
          })).filter(lead => lead.name || lead.phone)
          
          const response = await apiClient.post(API_ENDPOINTS.SALESPERSON_IMPORT_LEADS(), { leads: leadsPayload })
          if (response?.success) {
            Toast.success(`Successfully imported ${response.data?.importedCount || leadsPayload.length} leads`)
            onImportSuccess?.()
            onClose()
            setImportFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
          } else {
            Toast.error('Failed to import leads')
          }
        } catch (error) {
          Toast.error('Failed to process CSV file')
        } finally {
          setImporting(false)
        }
      }
      reader.readAsText(importFile)
    } catch (error) {
      Toast.error('Failed to import leads')
      setImporting(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg">
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Import Leads</h2>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-white/50 rounded-lg transition-colors text-gray-500 hover:text-gray-700" disabled={importing}>
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <button 
                onClick={handleDownloadTemplate} 
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 shadow-md disabled:opacity-50" 
                disabled={importing}
              >
                <Download className="h-4 w-4" /> Download Template
              </button>
            </div>
            <div className="relative">
              <Info 
                className="h-5 w-5 text-blue-500 cursor-help hover:text-blue-600 transition-colors" 
                onMouseEnter={() => setShowInfoTooltip(true)}
                onMouseLeave={() => setShowInfoTooltip(false)}
              />
              {showInfoTooltip && (
                <div className="absolute right-0 top-8 z-10 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl">
                  Upload a CSV file with lead data. Make sure the format matches the template.
                </div>
              )}
            </div>
          </div>

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-10 text-center transition-all duration-200 ${
              isDragging 
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100' 
                : importFile 
                  ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' 
                  : 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-blue-400 hover:from-blue-50 hover:to-purple-50'
            }`}
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="hidden" 
              id="csv-upload" 
              disabled={importing} 
            />
            <label htmlFor="csv-upload" className="cursor-pointer block" style={{ pointerEvents: importing ? 'none' : 'auto' }}>
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isDragging 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 scale-110' 
                    : importFile 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                } shadow-xl`}>
                  <Upload className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                {importFile ? (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 break-words px-2">{importFile.name}</p>
                    <p className="text-xs text-gray-500">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">Click to upload CSV file</p>
                    <p className="text-xs text-gray-500">or drag and drop</p>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
        <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button onClick={onClose} disabled={importing} className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Cancel
          </button>
          <button onClick={handleImportLeads} disabled={!importFile || importing} className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-200 shadow-md">
            {importing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Import Leads
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
