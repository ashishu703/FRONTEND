import React from 'react'
import { X, Upload, Download, FileText, CheckCircle, XCircle } from 'lucide-react'
import { apiClient, API_ENDPOINTS } from '../../utils/globalImports'
import Toast from '../../utils/Toast'

export default function ImportLeadsModal({ show, onClose, onImportSuccess }) {
  const [importFile, setImportFile] = React.useState(null)
  const [importPreview, setImportPreview] = React.useState([])
  const [importing, setImporting] = React.useState(false)
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      setImportFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const csvText = e.target.result
          const parsedData = parseCSV(csvText)
          setImportPreview(parsedData.slice(0, 10))
          Toast.info(`Preview: ${parsedData.length} rows found`)
        } catch (error) {
          Toast.error('Failed to parse CSV file')
        }
      }
      reader.readAsText(file)
    } else {
      Toast.error('Please select a valid CSV file')
    }
  }

  const handleDownloadTemplate = () => {
    const headers = ['Name', 'Phone', 'WhatsApp', 'Email', 'Address', 'State', 'GST No', 'Product Name', 'Lead Source', 'Customer Type', 'Date']
    const sampleData = ['John Doe', '9876543210', '9876543210', 'john@example.com', '123 Street', 'Maharashtra', '27ABCDE1234F1Z5', 'Product A', 'Website', 'Dealer', new Date().toISOString().split('T')[0]]
    const csvContent = [headers, sampleData].map(row => row.map(field => `"${field}"`).join(',')).join('\n')
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
            name: row.Name || row.name || '',
            phone: row.Phone || row.phone || '',
            whatsapp: row.WhatsApp || row.whatsapp || row.Phone || row.phone || '',
            email: row.Email || row.email || '',
            address: row.Address || row.address || '',
            state: row.State || row.state || '',
            gst_no: row['GST No'] || row.gst_no || row['GST No'] || '',
            product_type: row['Product Name'] || row.product_type || row['Product Name'] || '',
            lead_source: row['Lead Source'] || row.lead_source || row['Lead Source'] || '',
            customer_type: row['Customer Type'] || row.customer_type || row['Customer Type'] || '',
            date: row.Date || row.date || new Date().toISOString().split('T')[0]
          })).filter(lead => lead.name || lead.phone)
          
          const response = await apiClient.post(API_ENDPOINTS.SALESPERSON_IMPORT_LEADS(), { leads: leadsPayload })
          if (response?.success) {
            Toast.success(`Successfully imported ${response.data?.importedCount || leadsPayload.length} leads`)
            onImportSuccess?.()
            onClose()
            setImportFile(null)
            setImportPreview([])
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
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Import Leads from CSV</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1" disabled={importing}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
            <div className="space-y-2">
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" disabled={importing} />
              <label htmlFor="csv-upload" className="block w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer text-center text-sm disabled:opacity-50" style={{ pointerEvents: importing ? 'none' : 'auto' }}>
                <Upload className="h-4 w-4 inline mr-2" /> Choose File
              </label>
              {importFile && <p className="text-xs text-gray-600 truncate">{importFile.name}</p>}
              <button onClick={handleDownloadTemplate} className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center justify-center gap-2 text-sm" disabled={importing}>
                <Download className="h-4 w-4" /> Download Template
              </button>
            </div>
          </div>
          {importPreview.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-medium text-gray-700 mb-2">Preview ({importPreview.length} rows)</h3>
              <div className="border border-gray-200 rounded overflow-auto max-h-48">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(importPreview[0] || {}).slice(0, 5).map(key => (
                        <th key={key} className="px-2 py-1 text-left font-medium text-gray-500">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {importPreview.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).slice(0, 5).map((val, vIdx) => (
                          <td key={vIdx} className="px-2 py-1 text-gray-700 truncate max-w-[100px]">{String(val).substring(0, 20)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button onClick={onClose} disabled={importing} className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50">
            Cancel
          </button>
          <button onClick={handleImportLeads} disabled={!importFile || importing} className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {importing ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-3 w-3" />
                Import Leads
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
