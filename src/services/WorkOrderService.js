import apiClient from '../utils/apiClient';
import DateFormatter from '../utils/DateFormatter';

/**
 * WorkOrderService class for managing work order operations.
 * Follows OOP principles and DRY to centralize work order logic.
 */
class WorkOrderService {
  /**
   * Generates a work order number
   * @param {string} prefix - Prefix for work order (default: 'WO')
   * @returns {string} Generated work order number
   */
  generateWorkOrderNumber(prefix = 'WO') {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}-${random}`;
  }

  /**
   * Generates a BNA number
   * @param {string} workOrderNumber - Work order number
   * @returns {string} Generated BNA number
   */
  generateBNANumber(workOrderNumber) {
    return `BNA-${workOrderNumber}`;
  }

  /**
   * Builds work order data from payment data
   * @param {Object} paymentData - Payment data object
   * @returns {Object} Work order data object
   */
  buildWorkOrderFromPayment(paymentData) {
    const workOrderNumber = this.generateWorkOrderNumber();
    const today = DateFormatter.formatDateISO(new Date());
    const deliveryDate = paymentData.deliveryDate || paymentData.paymentData?.delivery_date;
    
    return {
      workOrderNumber,
      bnaNumber: this.generateBNANumber(workOrderNumber),
      date: today,
      deliveryDate: deliveryDate || DateFormatter.formatDateISO(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      contact: paymentData.customer?.phone || paymentData.paymentData?.lead_phone || '+91 98765 43210',
      from: {
        companyName: 'Your Company Name',
        address: '123 Business Street, City, State - 400001',
        email: 'info@company.com',
        gstin: '27AABCT1234A1ZO'
      },
      to: {
        companyName: paymentData.customer?.name || 'Customer Company Ltd.',
        address: paymentData.address || paymentData.paymentData?.address || '456 Client Avenue, City, State - 400002',
        email: paymentData.customer?.email || paymentData.paymentData?.lead_email || 'contact@customer.com'
      },
      orderDetails: {
        title: paymentData.productName || 'Custom Printed Boxes',
        description: 'High-quality customized packaging boxes',
        quantity: '5000',
        type: 'Carton Boxes',
        length: '30 x 20 x 10 cm',
        colour: '4-Color CMYK',
        print: 'Offset Printing',
        total: paymentData.totalAmount || paymentData.amount || 62500.00
      },
      unitRate: paymentData.totalAmount && paymentData.orderDetails?.quantity 
        ? (paymentData.totalAmount / parseFloat(paymentData.orderDetails.quantity)).toFixed(2)
        : '12.50',
      terms: [
        'Payment terms: 50% advance, 50% on delivery',
        'Delivery within agreed timeline',
        'Quality as per industry standards',
        'Cancellation only with written notice'
      ],
      preparedBy: '',
      receivedBy: ''
    };
  }

  /**
   * Saves work order to backend
   * @param {Object} workOrderData - Work order data
   * @param {Object} paymentData - Optional payment data for references
   * @returns {Promise<Object>} Saved work order
   */
  async saveWorkOrder(workOrderData, paymentData = null) {
    try {
      const payload = {
        ...workOrderData,
        paymentId: paymentData?.paymentData?.id || paymentData?.id || null,
        quotationId: paymentData?.quotationId || paymentData?.paymentData?.quotation_id || null,
        leadId: paymentData?.leadId || paymentData?.paymentData?.lead_id || null
      };
      const response = await apiClient.post('/api/work-orders', payload);
      return response.data;
    } catch (error) {
      console.error('Error saving work order:', error);
      throw error;
    }
  }

  /**
   * Formats currency in Indian format
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}

// Export singleton instance
const workOrderService = new WorkOrderService();
export default workOrderService;

