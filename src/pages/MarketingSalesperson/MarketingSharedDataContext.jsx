import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const MarketingSharedDataContext = createContext();

// Provider component
export const MarketingSharedDataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for marketing salesperson
  const dummyCustomers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      business: "Kumar Industries",
      phone: "9876543210",
      email: "rajesh@kumarindustries.com",
      address: "123 Industrial Area, Mumbai, Maharashtra",
      state: "Maharashtra",
      productType: "Cable",
      customerType: "Corporate",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "connected",
      connectedStatusRemark: "Initial contact made, interested in bulk cable order",
      connectedStatusDate: "2024-01-15",
      finalStatus: "pending",
      finalStatusRemark: "Waiting for quotation approval",
      finalStatusDate: "2024-01-20",
      productName: "XLPE Cable 1.5mm",
      quantity: 1000,
      expectedValue: 150000,
      followUpDate: "2024-01-25",
      notes: "High priority customer, potential for long-term partnership"
    },
    {
      id: 2,
      name: "Priya Sharma",
      business: "Sharma Electricals",
      phone: "8765432109",
      email: "priya@sharmaelectricals.com",
      address: "456 Commercial Street, Delhi, Delhi",
      state: "Delhi",
      productType: "Wire",
      customerType: "Business",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "not-connected",
      connectedStatusRemark: "No response to calls and emails",
      connectedStatusDate: "2024-01-10",
      finalStatus: "pending",
      finalStatusRemark: "Need to try different approach",
      finalStatusDate: "2024-01-12",
      productName: "Copper Wire 2.5mm",
      quantity: 500,
      expectedValue: 75000,
      followUpDate: "2024-01-28",
      notes: "Try WhatsApp or visit in person"
    },
    {
      id: 3,
      name: "Amit Patel",
      business: "Patel Enterprises",
      phone: "7654321098",
      email: "amit@patelenterprises.com",
      address: "789 Business Park, Ahmedabad, Gujarat",
      state: "Gujarat",
      productType: "Conductor",
      customerType: "Corporate",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "next-meeting",
      connectedStatusRemark: "Meeting scheduled for product demonstration",
      connectedStatusDate: "2024-01-18",
      finalStatus: "pending",
      finalStatusRemark: "Preparing for demo",
      finalStatusDate: "2024-01-19",
      productName: "AAAC Conductor",
      quantity: 2000,
      expectedValue: 300000,
      followUpDate: "2024-01-30",
      notes: "Important meeting, prepare detailed presentation"
    },
    {
      id: 4,
      name: "Sunita Singh",
      business: "Singh Electrical Works",
      phone: "6543210987",
      email: "sunita@singhelectrical.com",
      address: "321 Industrial Zone, Pune, Maharashtra",
      state: "Maharashtra",
      productType: "Cable",
      customerType: "Business",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "connected",
      connectedStatusRemark: "Very interested, asking for samples",
      connectedStatusDate: "2024-01-22",
      finalStatus: "pending",
      finalStatusRemark: "Samples sent, waiting for feedback",
      finalStatusDate: "2024-01-23",
      productName: "PVC Cable 4mm",
      quantity: 800,
      expectedValue: 120000,
      followUpDate: "2024-02-01",
      notes: "Follow up on sample feedback"
    },
    {
      id: 5,
      name: "Vikram Jain",
      business: "Jain Power Solutions",
      phone: "5432109876",
      email: "vikram@jainpower.com",
      address: "654 Power Sector, Bangalore, Karnataka",
      state: "Karnataka",
      productType: "Wire",
      customerType: "Corporate",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "closed",
      connectedStatusRemark: "Deal closed successfully",
      connectedStatusDate: "2024-01-25",
      finalStatus: "closed",
      finalStatusRemark: "Order placed for 1500 units",
      finalStatusDate: "2024-01-26",
      productName: "Aluminium Wire 6mm",
      quantity: 1500,
      expectedValue: 225000,
      followUpDate: "2024-02-05",
      notes: "Successful deal, maintain relationship for future orders"
    },
    {
      id: 6,
      name: "Meera Gupta",
      business: "Gupta Electricals",
      phone: "4321098765",
      email: "meera@guptaelectricals.com",
      address: "987 Electronics Hub, Chennai, Tamil Nadu",
      state: "Tamil Nadu",
      productType: "Cable",
      customerType: "Business",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "not-connected",
      connectedStatusRemark: "Busy schedule, will call back",
      connectedStatusDate: "2024-01-12",
      finalStatus: "pending",
      finalStatusRemark: "Waiting for callback",
      finalStatusDate: "2024-01-13",
      productName: "XLPE Cable 2.5mm",
      quantity: 600,
      expectedValue: 90000,
      followUpDate: "2024-01-29",
      notes: "Try calling during evening hours"
    },
    {
      id: 7,
      name: "Ravi Kumar",
      business: "Kumar Power Systems",
      phone: "3210987654",
      email: "ravi@kumarpower.com",
      address: "147 Energy Park, Hyderabad, Telangana",
      state: "Telangana",
      productType: "Conductor",
      customerType: "Corporate",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "next-meeting",
      connectedStatusRemark: "Technical discussion scheduled",
      connectedStatusDate: "2024-01-20",
      finalStatus: "pending",
      finalStatusRemark: "Preparing technical specifications",
      finalStatusDate: "2024-01-21",
      productName: "AAAC Conductor 150mm",
      quantity: 3000,
      expectedValue: 450000,
      followUpDate: "2024-02-02",
      notes: "Important technical meeting, bring samples"
    },
    {
      id: 8,
      name: "Anita Desai",
      business: "Desai Industries",
      phone: "2109876543",
      email: "anita@desaiindustries.com",
      address: "258 Manufacturing Unit, Surat, Gujarat",
      state: "Gujarat",
      productType: "Wire",
      customerType: "Business",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "connected",
      connectedStatusRemark: "Interested in bulk order, negotiating price",
      connectedStatusDate: "2024-01-24",
      finalStatus: "pending",
      finalStatusRemark: "Price negotiation in progress",
      finalStatusDate: "2024-01-25",
      productName: "Copper Wire 4mm",
      quantity: 1200,
      expectedValue: 180000,
      followUpDate: "2024-02-03",
      notes: "Focus on competitive pricing"
    },
    {
      id: 9,
      name: "Suresh Reddy",
      business: "Reddy Electricals",
      phone: "1098765432",
      email: "suresh@reddyelectricals.com",
      address: "369 Industrial Area, Coimbatore, Tamil Nadu",
      state: "Tamil Nadu",
      productType: "Cable",
      customerType: "Corporate",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "not-connected",
      connectedStatusRemark: "Number not reachable",
      connectedStatusDate: "2024-01-14",
      finalStatus: "pending",
      finalStatusRemark: "Try alternative contact methods",
      finalStatusDate: "2024-01-15",
      productName: "PVC Cable 6mm",
      quantity: 900,
      expectedValue: 135000,
      followUpDate: "2024-01-31",
      notes: "Try email or visit office"
    },
    {
      id: 10,
      name: "Kavita Joshi",
      business: "Joshi Power Works",
      phone: "0987654321",
      email: "kavita@joshipower.com",
      address: "741 Power Zone, Indore, Madhya Pradesh",
      state: "Madhya Pradesh",
      productType: "Wire",
      customerType: "Business",
      leadSource: "Marketing",
      enquiryBy: "Marketing",
      connectedStatus: "closed",
      connectedStatusRemark: "Deal completed successfully",
      connectedStatusDate: "2024-01-28",
      finalStatus: "closed",
      finalStatusRemark: "Payment received, order dispatched",
      finalStatusDate: "2024-01-29",
      productName: "Aluminium Wire 8mm",
      quantity: 1800,
      expectedValue: 270000,
      followUpDate: "2024-02-10",
      notes: "Successful deal, plan for repeat orders"
    }
  ];

  // Initialize with dummy data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCustomers(dummyCustomers);
      setLoading(false);
    }, 1000);
  }, []);

  // Get customers by status
  const getCustomersByStatus = (status) => {
    return customers.filter(customer => customer.connectedStatus === status);
  };

  // Get status counts
  const getStatusCounts = () => {
    const counts = {
      connected: customers.filter(c => c.connectedStatus === 'connected').length,
      'not-connected': customers.filter(c => c.connectedStatus === 'not-connected').length,
      'next-meeting': customers.filter(c => c.connectedStatus === 'next-meeting').length,
      closed: customers.filter(c => c.connectedStatus === 'closed').length,
      total: customers.length
    };
    console.log('Marketing Status Counts:', counts);
    return counts;
  };

  // Update customer
  const updateCustomer = (customerId, updates) => {
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === customerId 
          ? { ...customer, ...updates }
          : customer
      )
    );
  };

  const value = {
    customers,
    loading,
    getCustomersByStatus,
    getStatusCounts,
    updateCustomer
  };

  return (
    <MarketingSharedDataContext.Provider value={value}>
      {children}
    </MarketingSharedDataContext.Provider>
  );
};

// Custom hook to use the context
export const useMarketingSharedData = () => {
  const context = useContext(MarketingSharedDataContext);
  if (!context) {
    throw new Error('useMarketingSharedData must be used within a MarketingSharedDataProvider');
  }
  return context;
};

export default MarketingSharedDataContext;
