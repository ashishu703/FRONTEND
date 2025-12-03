import React from 'react';
import { X, RefreshCw, FileText } from 'lucide-react';

const ImportPreviewModal = ({ isOpen, onClose, importPreview, importing, onImport }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Import Leads from CSV</h2>
            <p className="text-sm text-gray-600">Review the data before importing</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Found {importPreview.length} records to import. Please review the data below:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Customer Name</th>
                  <th className="px-3 py-2 text-left">Mobile</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Address</th>
                  <th className="px-3 py-2 text-left">Business</th>
                  <th className="px-3 py-2 text-left">Lead Source</th>
                  <th className="px-3 py-2 text-left">Category</th>
                </tr>
              </thead>
              <tbody>
                {importPreview.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-3 py-2">{row['Customer Name'] || '-'}</td>
                    <td className="px-3 py-2">{row['Mobile Number'] || '-'}</td>
                    <td className="px-3 py-2">{row['Email'] || '-'}</td>
                    <td className="px-3 py-2">{row['Address'] || '-'}</td>
                    <td className="px-3 py-2">{row['Business Name'] || '-'}</td>
                    <td className="px-3 py-2">{row['Lead Source'] || '-'}</td>
                    <td className="px-3 py-2">{row['Business Category'] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {importPreview.length > 10 && (
              <p className="text-sm text-gray-500 mt-2">
                ... and {importPreview.length - 10} more records
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={onImport}
              disabled={importing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {importing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Import {importPreview.length} Leads</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPreviewModal;

