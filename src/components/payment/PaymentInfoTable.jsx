import React from 'react';
import { 
  Search, Filter, Download, User, DollarSign, Clock, Calendar, Link, Copy, Eye, 
  MoreHorizontal, CreditCard, AlertCircle, CheckCircle, XCircle, ChevronDown, 
  Edit, Package, FileText, RotateCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';

/**
 * Reusable PaymentInfoTable Component
 * Uses DRY principle and OOP concepts
 */
class PaymentInfoTable {
  static formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static getStatusColor(status) {
    const statusMap = {
      'Paid': 'bg-green-100 text-green-800 border-green-200',
      'Advance': 'bg-purple-100 text-purple-800 border-purple-200',
      'Due': 'bg-red-100 text-red-800 border-red-200',
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Rejected': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  static getStatusIcon(status) {
    const iconMap = {
      'Paid': CheckCircle,
      'Advance': Clock,
      'Due': XCircle,
      'Pending': Clock,
      'Rejected': XCircle
    };
    return iconMap[status] || AlertCircle;
  }

  static calculateStats(payments) {
    return {
      allPayments: payments.length,
      totalValue: payments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0),
      paid: payments.filter(p => p.status === 'Paid').length,
      advance: payments.filter(p => p.status === 'Advance').length,
      due: payments.filter(p => p.status === 'Due').length,
      rejected: payments.filter(p => p.status === 'Rejected').length
    };
  }
}

export default PaymentInfoTable;

