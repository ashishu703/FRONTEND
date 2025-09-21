import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the shared context
const SharedDataContext = createContext();

// Provider component
export const SharedDataProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load customers data (this would typically come from an API)
  useEffect(() => {
    // Complete demo data structure with ALL 15 customers from salespersonleads.jsx
    const demoCustomersData = [
      {
        id: 1,
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        email: "rajesh.kumar@email.com",
        business: "Rajesh Electricals",
        address: "123 MG Road, Near City Mall, Bangalore",
        gstNo: "29ABCDE1234F1Z5",
        productName: "XLPE Cable 1.5mm",
        productType: "Cable",
        state: "Karnataka",
        enquiryBy: "Phone",
        customerType: "Business",
        date: "2024-01-15",
        connectedStatus: "Connected",
        connectedStatusRemark: "Customer was very interested in our cable products. Discussed pricing and delivery timeline.",
        connectedStatusDate: "2024-01-15",
        finalStatus: "interested",
        finalStatusRemark: "Waiting for customer's budget confirmation. Follow up scheduled for next week.",
        finalStatusDate: "2024-01-15",
        quotationsSent: 2,
        latestQuotationUrl: "latest",
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: true
      },
      {
        id: 2,
        name: "Priya Sharma",
        phone: "+91 87654 32109",
        whatsapp: "+91 87654 32109",
        email: "priya.sharma@company.com",
        business: "Sharma Industries",
        address: "456 Industrial Area, Phase 2, Gurgaon",
        gstNo: "06FGHIJ5678K2L6",
        productName: "ACSR Conductor 50mm²",
        productType: "Conductor",
        state: "Haryana",
        enquiryBy: "Marketing",
        customerType: "Corporate",
        date: "2024-01-16",
        connectedStatus: "Follow Up",
        connectedStatusRemark: "Initial call completed. Customer requested detailed product specifications.",
        connectedStatusDate: "2024-01-16",
        finalStatus: "next scheduled meeting",
        finalStatusRemark: "Meeting scheduled for next Tuesday to discuss project requirements.",
        finalStatusDate: "2024-01-16",
        quotationsSent: 1,
        transferredLeads: 1,
        transferredFrom: "Marketing Team",
        transferredTo: "Sales Team",
        quotationVerified: false
      },
      {
        id: 3,
        name: "Amit Patel",
        phone: "+91 76543 21098",
        whatsapp: "+91 76543 21098",
        email: "amit.patel@email.com",
        business: "Patel Electrical Works",
        address: "789 Commercial Street, Ahmedabad",
        gstNo: "24KLMNO9012P3M7",
        productName: "AAAC Conductor 70mm²",
        productType: "AAAC",
        state: "Gujarat",
        enquiryBy: "Referral",
        customerType: "Business",
        date: "2024-01-17",
        connectedStatus: "Not Connected",
        connectedStatusRemark: "Customer did not answer the call. Left voicemail with contact details.",
        connectedStatusDate: "2024-01-17",
        finalStatus: "interested",
        finalStatusRemark: "Pending customer response. Will try calling again tomorrow.",
        finalStatusDate: "2024-01-17",
        quotationsSent: 0,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: null
      },
      {
        id: 4,
        name: "Sunita Reddy",
        phone: "+91 65432 10987",
        whatsapp: "+91 65432 10987",
        email: "sunita.reddy@email.com",
        business: "Reddy Power Solutions",
        address: "321 Tech Park, Hyderabad",
        gstNo: "36PQRST3456U4N8",
        productName: "Aluminium Wire 2.5mm",
        productType: "Aluminium",
        state: "Telangana",
        enquiryBy: "Google Ads",
        customerType: "Corporate",
        date: "2024-01-18",
        connectedStatus: "Connected",
        connectedStatusRemark: "Excellent conversation. Customer is ready to place order for aluminium conductors.",
        connectedStatusDate: "2024-01-18",
        finalStatus: "closed",
        finalStatusRemark: "Deal closed successfully. Order placed for 500 units.",
        finalStatusDate: "2024-01-18",
        quotationsSent: 3,
        latestQuotationUrl: "latest",
        transferredLeads: 2,
        transferredFrom: "Tele Sales",
        transferredTo: "Field Sales",
        quotationVerified: true
      },
      {
        id: 5,
        name: "Vikram Singh",
        phone: "+91 54321 09876",
        whatsapp: "+91 54321 09876",
        email: "vikram.singh@email.com",
        business: "Singh Electricals",
        address: "654 Main Road, Jaipur",
        gstNo: "08UVWXY7890V5O9",
        productName: "Copper Wire 4mm",
        productType: "Copper",
        state: "Rajasthan",
        enquiryBy: "Website",
        customerType: "Individual",
        date: "2024-01-19",
        connectedStatus: "Follow Up",
        connectedStatusRemark: "Customer showed interest in copper products. Discussed pricing options.",
        connectedStatusDate: "2024-01-19",
        finalStatus: "interested",
        finalStatusRemark: "Customer is comparing prices with other suppliers. Follow up in 3 days.",
        finalStatusDate: "2024-01-19",
        quotationsSent: 1,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: false
      },
      {
        id: 6,
        name: "Meera Joshi",
        phone: "+91 43210 98765",
        whatsapp: "+91 43210 98765",
        email: "meera.joshi@email.com",
        business: "Joshi Industries",
        address: "987 Business District, Pune",
        gstNo: "27ZABCD1234W6P0",
        productName: "PVC Insulated Wire 6mm",
        productType: "PVC",
        state: "Maharashtra",
        enquiryBy: "FB Ads",
        customerType: "Business",
        date: "2024-01-20",
        connectedStatus: "Connected",
        connectedStatusRemark: "Good discussion about PVC products. Customer needs samples for testing.",
        connectedStatusDate: "2024-01-20",
        finalStatus: "next scheduled meeting",
        finalStatusRemark: "Meeting scheduled to provide product samples and discuss bulk pricing.",
        finalStatusDate: "2024-01-20",
        quotationsSent: 2,
        transferredLeads: 1,
        transferredFrom: "Online Team",
        transferredTo: "Regional Sales",
        quotationVerified: true
      },
      {
        id: 7,
        name: "Arjun Gupta",
        phone: "+91 32109 87654",
        whatsapp: "+91 32109 87654",
        email: "arjun.gupta@email.com",
        business: "Gupta Power Systems",
        address: "147 Industrial Estate, Chennai",
        gstNo: "33EFGHI5678X7Q1",
        productName: "Bare Copper Wire 10mm",
        productType: "Wire",
        state: "Tamil Nadu",
        enquiryBy: "Email",
        customerType: "Corporate",
        date: "2024-01-21",
        connectedStatus: "Not Connected",
        connectedStatusRemark: "Email sent but no response yet. Will try calling tomorrow.",
        connectedStatusDate: "2024-01-21",
        finalStatus: "interested",
        finalStatusRemark: "Waiting for customer response to email inquiry.",
        finalStatusDate: "2024-01-21",
        quotationsSent: 0,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: null
      },
      {
        id: 8,
        name: "Kavita Nair",
        phone: "+91 21098 76543",
        whatsapp: "+91 21098 76543",
        email: "kavita.nair@email.com",
        business: "Nair Electricals",
        address: "258 Commercial Complex, Kochi",
        gstNo: "32JKLMN9012Y8R2",
        productName: "Armored Cable 16mm",
        productType: "Cable",
        state: "Kerala",
        enquiryBy: "Webinar",
        customerType: "Reseller",
        date: "2024-01-22",
        connectedStatus: "Connected",
        connectedStatusRemark: "Met through webinar. Customer is interested in becoming a reseller.",
        connectedStatusDate: "2024-01-22",
        finalStatus: "next scheduled meeting",
        finalStatusRemark: "Meeting scheduled to discuss reseller agreement and terms.",
        finalStatusDate: "2024-01-22",
        quotationsSent: 1,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: false
      },
      {
        id: 9,
        name: "Rohit Agarwal",
        phone: "+91 10987 65432",
        whatsapp: "+91 10987 65432",
        email: "rohit.agarwal@email.com",
        business: "Agarwal Industries",
        address: "369 Tech Hub, Noida",
        gstNo: "09OPQRS3456Z9S3",
        productName: "ACSR Conductor 95mm²",
        productType: "Conductor",
        state: "Uttar Pradesh",
        enquiryBy: "Phone",
        customerType: "Government",
        date: "2024-01-23",
        connectedStatus: "Follow Up",
        connectedStatusRemark: "Government tender inquiry. Need to submit detailed proposal.",
        connectedStatusDate: "2024-01-23",
        finalStatus: "interested",
        finalStatusRemark: "Preparing tender documents. Follow up in 2 days.",
        finalStatusDate: "2024-01-23",
        quotationsSent: 0,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: null
      },
      {
        id: 10,
        name: "Deepika Iyer",
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        email: "deepika.iyer@email.com",
        business: "Iyer Power Solutions",
        address: "741 Business Park, Mumbai",
        gstNo: "27TUVWX7890A0T4",
        productName: "AAAC Conductor 120mm²",
        productType: "AAAC",
        state: "Maharashtra",
        enquiryBy: "Referral",
        customerType: "Business",
        date: "2024-01-24",
        connectedStatus: "Connected",
        connectedStatusRemark: "Referred by existing customer. Very interested in AAAC conductors.",
        connectedStatusDate: "2024-01-24",
        finalStatus: "next scheduled meeting",
        finalStatusRemark: "Meeting scheduled to discuss technical specifications and pricing.",
        finalStatusDate: "2024-01-24",
        quotationsSent: 1,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: true
      },
      {
        id: 11,
        name: "Suresh Kumar",
        phone: "+91 87654 32109",
        whatsapp: "+91 87654 32109",
        email: "suresh.kumar@email.com",
        business: "Kumar Electrical Works",
        address: "852 Industrial Zone, Delhi",
        gstNo: "07BCDEF1234B1U5",
        productName: "Aluminium Wire 6mm",
        productType: "Aluminium",
        state: "Delhi",
        enquiryBy: "Marketing",
        customerType: "Individual",
        date: "2024-01-25",
        connectedStatus: "Not Connected",
        connectedStatusRemark: "Customer's phone was switched off. Will try again in the evening.",
        connectedStatusDate: "2024-01-25",
        finalStatus: "interested",
        finalStatusRemark: "Phone not reachable. Will try alternative contact methods.",
        finalStatusDate: "2024-01-25",
        quotationsSent: 0,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: null
      },
      {
        id: 12,
        name: "Anita Desai",
        phone: "+91 76543 21098",
        whatsapp: "+91 76543 21098",
        email: "anita.desai@email.com",
        business: "Desai Industries",
        address: "963 Commercial Area, Kolkata",
        gstNo: "19GHIJK5678C2V6",
        productName: "Copper Wire 8mm",
        productType: "Copper",
        state: "West Bengal",
        enquiryBy: "Google Ads",
        customerType: "Corporate",
        date: "2024-01-26",
        connectedStatus: "Connected",
        connectedStatusRemark: "Found us through Google Ads. Interested in copper wire for industrial use.",
        connectedStatusDate: "2024-01-26",
        finalStatus: "next scheduled meeting",
        finalStatusRemark: "Meeting scheduled to discuss industrial requirements and bulk pricing.",
        finalStatusDate: "2024-01-26",
        quotationsSent: 1,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: false
      },
      {
        id: 13,
        name: "Manoj Tiwari",
        phone: "+91 65432 10987",
        whatsapp: "+91 65432 10987",
        email: "manoj.tiwari@email.com",
        business: "Tiwari Power Systems",
        address: "147 Business Center, Lucknow",
        gstNo: "09LMNOP9012D3W7",
        productName: "PVC Insulated Wire 10mm",
        productType: "PVC",
        state: "Uttar Pradesh",
        enquiryBy: "Website",
        customerType: "Business",
        date: "2024-01-27",
        connectedStatus: "Follow Up",
        connectedStatusRemark: "Customer filled contact form on website. Initial call completed.",
        connectedStatusDate: "2024-01-27",
        finalStatus: "interested",
        finalStatusRemark: "Customer needs detailed technical specifications. Follow up in 2 days.",
        finalStatusDate: "2024-01-27",
        quotationsSent: 0,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: null
      },
      {
        id: 14,
        name: "Pooja Mehta",
        phone: "+91 54321 09876",
        whatsapp: "+91 54321 09876",
        email: "pooja.mehta@email.com",
        business: "Mehta Electricals",
        address: "258 Industrial Park, Chandigarh",
        gstNo: "04QRSTU3456E4X8",
        productName: "Bare Copper Wire 16mm",
        productType: "Wire",
        state: "Punjab",
        enquiryBy: "FB Ads",
        customerType: "Reseller",
        date: "2024-01-28",
        connectedStatus: "Connected",
        connectedStatusRemark: "Saw our Facebook ad. Interested in wire products for reselling.",
        connectedStatusDate: "2024-01-28",
        finalStatus: "next scheduled meeting",
        finalStatusRemark: "Meeting scheduled to discuss reseller terms and product catalog.",
        finalStatusDate: "2024-01-28",
        quotationsSent: 1,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: true
      },
      {
        id: 15,
        name: "Ravi Verma",
        phone: "+91 43210 98765",
        whatsapp: "+91 43210 98765",
        email: "ravi.verma@email.com",
        business: "Verma Industries",
        address: "369 Tech City, Indore",
        gstNo: "23VWXYZ7890F5Y9",
        productName: "XLPE Cable 25mm",
        productType: "Cable",
        state: "Madhya Pradesh",
        enquiryBy: "Email",
        customerType: "Corporate",
        date: "2024-01-29",
        connectedStatus: "Not Connected",
        connectedStatusRemark: "Email bounced back. Need to verify correct email address.",
        connectedStatusDate: "2024-01-29",
        finalStatus: "interested",
        finalStatusRemark: "Email verification needed. Will try phone contact.",
        finalStatusDate: "2024-01-29",
        quotationsSent: 0,
        transferredLeads: 0,
        transferredFrom: null,
        transferredTo: null,
        quotationVerified: null
      }
    ];

    // Set data immediately
    console.log('SharedDataContext - Setting demo data:', demoCustomersData.length, 'customers');
    setCustomers(demoCustomersData);
    setLoading(false);
    console.log('SharedDataContext - Data set, loading set to false');
  }, []);

  // Filter customers by connection status for follow-up components
  const getCustomersByStatus = (status) => {
    console.log(`SharedDataContext - getCustomersByStatus('${status}') called with ${customers.length} customers`);
    const result = customers.filter(customer => {
      switch (status) {
        case 'connected':
          return customer.connectedStatus === 'Connected';
        case 'not-connected':
          return customer.connectedStatus === 'Not Connected';
        case 'next-meeting':
          return customer.finalStatus === 'next scheduled meeting';
        case 'closed':
          return customer.finalStatus === 'closed';
        default:
          return false;
      }
    });
    console.log(`SharedDataContext - getCustomersByStatus('${status}') returning ${result.length} customers`);
    return result;
  };

  // Get status counts for debugging
  const getStatusCounts = () => {
    const counts = {
      total: customers.length,
      connected: customers.filter(customer => customer.connectedStatus === 'Connected').length,
      notConnected: customers.filter(customer => customer.connectedStatus === 'Not Connected').length,
      followUp: customers.filter(customer => customer.connectedStatus === 'Follow Up').length,
      nextMeeting: customers.filter(customer => customer.finalStatus === 'next scheduled meeting').length,
      closed: customers.filter(customer => customer.finalStatus === 'closed').length
    };
    console.log('Shared Data Status Counts:', counts);
    return counts;
  };

  // Update customer data (for leads interface)
  const updateCustomer = (customerId, updatedData) => {
    setCustomers(prevCustomers => 
      prevCustomers.map(customer => 
        customer.id === customerId 
          ? { ...customer, ...updatedData }
          : customer
      )
    );
  };

  // Add new customer (for leads interface)
  const addCustomer = (newCustomer) => {
    const customerWithId = {
      ...newCustomer,
      id: Math.max(...customers.map(c => c.id)) + 1
    };
    setCustomers(prevCustomers => [...prevCustomers, customerWithId]);
  };

  // Delete customer (for leads interface)
  const deleteCustomer = (customerId) => {
    setCustomers(prevCustomers => 
      prevCustomers.filter(customer => customer.id !== customerId)
    );
  };

  const value = {
    customers,
    loading,
    setCustomers,
    getCustomersByStatus,
    getStatusCounts,
    updateCustomer,
    addCustomer,
    deleteCustomer
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};

// Custom hook to use the context
export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};

export default SharedDataContext;
