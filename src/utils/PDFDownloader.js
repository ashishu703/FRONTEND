// Global PDF Download Utility Class
import html2pdf from 'html2pdf.js'

export class PDFDownloader {
  static defaultOptions = {
    margin: [0.3, 0.3, 0.3, 0.3],
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: {
      scale: 2, // Higher scale for better quality and font rendering
      useCORS: true,
      letterRendering: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        // Ensure fonts are loaded and applied
        const style = clonedDoc.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * {
            font-family: 'Inter', 'Arial', 'Helvetica', sans-serif !important;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          table, .table {
            page-break-inside: avoid !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
        `;
        clonedDoc.head.appendChild(style);
        
        // Ensure all images are loaded
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          if (!img.complete) {
            img.style.display = 'none';
          }
        });
      }
    },
    jsPDF: {
      unit: 'in',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
      putOnlyUsedFonts: false, // Include all fonts
      precision: 16
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: ['table', 'tr', '.no-break']
    } // Prevent page breaks in middle of content
  }

  static async download(elementId, filename, options = {}) {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    // OPTIMIZED: Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Ensure element is visible for proper rendering
    const originalDisplay = element.style.display
    const originalVisibility = element.style.visibility
    element.style.display = 'block'
    element.style.visibility = 'visible'
    
    // Calculate proper dimensions
    const elementHeight = element.scrollHeight
    const elementWidth = element.scrollWidth
    
    const opt = {
      ...this.defaultOptions,
      filename,
      html2canvas: {
        ...this.defaultOptions.html2canvas,
        width: elementWidth,
        height: elementHeight,
        windowWidth: elementWidth,
        windowHeight: elementHeight,
        scrollX: 0,
        scrollY: 0
      },
      ...options
    }

    try {
      await html2pdf().set(opt).from(element).save()
    } finally {
      // Restore original styles
      element.style.display = originalDisplay
      element.style.visibility = originalVisibility
    }
  }

  static async downloadQuotation(quotationNumber, customerName = 'Customer') {
    const elementId = 'quotation-preview-content'
    const filename = `Quotation-${quotationNumber}-${customerName.replace(/\s+/g, '-')}.pdf`
    return this.download(elementId, filename)
  }

  static async downloadPI(piNumber, customerName = 'Customer') {
    const elementId = 'pi-preview-content'
    const filename = `PI-${piNumber}-${customerName.replace(/\s+/g, '-')}.pdf`
    return this.download(elementId, filename)
  }

  static async downloadAsBlob(elementId, options = {}) {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    const opt = {
      ...this.defaultOptions,
      ...options
    }

    return await html2pdf().set(opt).from(element).outputPdf('blob')
  }
}
