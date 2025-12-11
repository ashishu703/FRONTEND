import React from 'react';
import ColorfulPieChart from './ColorfulPieChart';

const BusinessMetrics = ({ quotations, proformaInvoices, payments }) => {
  
  const quotationChartDataAll = [
    { label: 'Approved', value: quotations?.approved ?? 0, color: '#10b981' },
    { label: 'Pending', value: quotations?.pending ?? 0, color: '#f59e0b' },
    { label: 'Rejected', value: quotations?.rejected ?? 0, color: '#ef4444' }
  ];
  const quotationChartData = quotationChartDataAll.filter(item => item.value > 0);

 
  const piChartDataAll = [
    { label: 'Approved', value: proformaInvoices?.approved ?? 0, color: '#10b981' },
    { label: 'Pending', value: proformaInvoices?.pending ?? 0, color: '#f59e0b' },
    { label: 'Rejected', value: proformaInvoices?.rejected ?? 0, color: '#ef4444' }
  ];
  const piChartData = piChartDataAll.filter(item => item.value > 0);


  const totalReceived = payments?.totalReceived ?? 0;
  const totalAdvance = payments?.totalAdvance ?? 0;
  const duePayment = payments?.duePayment ?? 0;
  
  const paymentChartData = [
    { label: 'Total Received', value: totalReceived, color: '#10b981' },
    { label: 'Due Payment', value: duePayment, color: '#ef4444' }
  ].filter(item => item.value > 0);
  
  const paymentChartDataAll = [
    { label: 'Total Received', value: totalReceived, color: '#10b981' },
    { label: 'Advance Payment', value: totalAdvance, color: '#3b82f6' },
    { label: 'Due Payment', value: duePayment, color: '#ef4444' }
  ];

  const quotationTotal = quotations?.total ?? 0;
  const piTotal = proformaInvoices?.total ?? 0;
  const paymentTotal = totalReceived + duePayment;
  
  const quotationChartTotal = quotationChartData.length > 0 
    ? quotationChartData.reduce((sum, item) => sum + item.value, 0)
    : quotationTotal;
  const piChartTotal = piChartData.length > 0
    ? piChartData.reduce((sum, item) => sum + item.value, 0)
    : piTotal;
  const paymentChartTotal = paymentChartData.length > 0
    ? paymentChartData.reduce((sum, item) => sum + item.value, 0)
    : paymentTotal;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Metrics</h3>
      <p className="text-sm text-gray-600 mb-4">Track your quotations, PIs, payments, and orders</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ColorfulPieChart
          title="Quotations"
          data={quotationChartData}
          allData={quotationChartDataAll}
          total={quotationChartTotal || quotationTotal}
        />
        <ColorfulPieChart
          title="Proforma Invoices"
          data={piChartData}
          allData={piChartDataAll}
          total={piChartTotal || piTotal}
        />
        <ColorfulPieChart
          title="Payments Overview"
          data={paymentChartData}
          allData={paymentChartDataAll}
          total={paymentChartTotal || paymentTotal}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-sm font-medium text-blue-600 mb-1">Total Quotation</div>
          <div className="text-2xl font-bold text-blue-600">{quotations?.total ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">All quotations created</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="text-sm font-medium text-blue-600 mb-1">Total PI</div>
          <div className="text-2xl font-bold text-blue-600">{proformaInvoices?.total ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">All proforma invoices</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-sm font-medium text-green-600 mb-1">Total Sale Order</div>
          <div className="text-2xl font-bold text-green-600">{payments?.totalSaleOrder ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">Leads with advance payment</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="text-sm font-medium text-purple-600 mb-1">Total Received Payment</div>
          <div className="text-2xl font-bold text-purple-600">₹{(payments?.totalReceived ?? 0).toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-500 mt-1">Total payments received</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-sm font-medium text-red-600 mb-1">Due Payment</div>
          <div className="text-2xl font-bold text-red-600">₹{(payments?.duePayment ?? 0).toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-500 mt-1">Pending payment amount</div>
        </div>
      </div>
    </div>
  );
};

export default BusinessMetrics;

