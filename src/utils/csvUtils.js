import toastManager from './ToastManager';

export const downloadCSVTemplate = () => {
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
    'Date (YYYY-MM-DD)'
  ];
  
  const csvContent = headers.join(',') + '\n' + 
    'Sample Customer,9876543210,9876543210,sample@email.com,123 Main St,22ABCDE1234F1Z5,Sample Business,dealer,instagram,ACSR AAAC,John Doe,Jane Smith,Delhi,2024-01-15\n' +
    'Another Customer,9876543211,9876543211,another@email.com,456 Main St,22ABCDE1234F1Z6,Another Business,contractor,facebook,AB CABLE AAAC,Jane Doe,John Smith,Mumbai,2024-01-16';
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'leads_template.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toastManager.success('CSV template downloaded successfully');
};

export const parseCSV = (csvText) => {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return [];
  
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = i < line.length - 1 ? line[i + 1] : null;
      
      if (char === '"') {
        if (inQuotes) {
          if (nextChar === '"') {
            current += '"';
            i++;
          } else if (nextChar === ',' || nextChar === null || nextChar === '\r' || nextChar === '\n') {
            inQuotes = false;
          } else {
            current += char;
          }
        } else {
          inQuotes = true;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    
    return result.map(field => {
      let cleaned = field.trim();
      if (cleaned.length >= 2 && cleaned.startsWith('"') && cleaned.endsWith('"')) {
        cleaned = cleaned.slice(1, -1);
      }
      cleaned = cleaned.replace(/""/g, '"');
      return cleaned;
    });
  };
  
  const headerLine = parseCSVLine(lines[0]);
  const headers = headerLine.map(h => h.trim());
  
  const headerMap = {
    'customer name': 'Customer Name',
    'mobile number': 'Mobile Number',
    'whatsapp number': 'WhatsApp Number',
    'email': 'Email',
    'address': 'Address',
    'gst number': 'GST Number',
    'business name': 'Business Name',
    'lead source': 'Lead Source',
    'business category': 'Business Category',
    'category': 'Category',
    'state': 'State',
    'date (yyyy-mm-dd)': 'Date (YYYY-MM-DD)',
    'date': 'Date',
    'assigned salesperson': 'Assigned Salesperson',
    'assigned telecaller': 'Assigned Telecaller',
    'product names (comma separated)': 'Product Names (comma separated)',
    'product names': 'Product Names'
  };
  
  const normalizedHeaders = headers.map(h => {
    const lower = h.toLowerCase().trim();
    return headerMap[lower] || h;
  });
  
  const data = [];
  const isBlank = (v) => {
    const s = (v || '').toString().trim().toLowerCase();
    return s === '' || s === 'n/a' || /^-+$/.test(s);
  };
  
  const expectedColumnCount = normalizedHeaders.length;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length !== expectedColumnCount) {
        console.warn(`Row ${i + 1}: Expected ${expectedColumnCount} columns, found ${values.length}. Data may be misaligned.`);
        while (values.length < expectedColumnCount) {
          values.push('');
        }
        if (values.length > expectedColumnCount) {
          values.splice(expectedColumnCount);
        }
      }
      
      const row = {};
      normalizedHeaders.forEach((header, index) => {
        const value = (values[index] || '').trim();
        row[header] = value;
      });
      
      const name = row['Customer Name'] || '';
      const mobile = row['Mobile Number'] || '';
      if (!(isBlank(name) && isBlank(mobile))) {
        data.push(row);
      }
    }
  }
  return data;
};

export const formatDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  if (dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 2 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      if (parts[0].length === 4 && parts[1].length === 2 && parts[2].length === 2) {
        return dateString;
      }
    }
  }
  
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    console.warn('Invalid date format:', dateString);
  }
  
  return new Date().toISOString().split('T')[0];
};

