// Global PDF Download Utility Class
import html2pdf from 'html2pdf.js'

export class PDFDownloader {
  static defaultOptions = {
    margin: [0.4, 0.4, 0.4, 0.4],
    image: { type: 'jpeg', quality: 0.8 },
    html2canvas: {
      scale: 1.1,
      useCORS: true,
      letterRendering: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    },
    jsPDF: {
      unit: 'in',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
      putOnlyUsedFonts: true
    }
  }

  static async download(elementId, filename, options = {}) {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    const opt = {
      ...this.defaultOptions,
      filename,
      ...options
    }

    await html2pdf().set(opt).from(element).save()
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
