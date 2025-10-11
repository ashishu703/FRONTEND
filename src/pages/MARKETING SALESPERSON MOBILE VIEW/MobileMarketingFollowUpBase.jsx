import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  MapPin,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const MobileMarketingFollowUpBase = ({ status, customData }) => {
  const [leads, setLeads] = useState(customData || [
    {
      id: 1,
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@example.com',
      address: '123 Main Street, Mumbai',
      area: 'Andheri',
      productType: 'Industrial Motor',
      leadSource: 'Website',
      customerType: 'Business',
      date: '2025-01-15',
      status: 'Connected',
      lastContact: '2025-01-18',
      nextFollowUp: '2025-01-25',
      notes: 'Interested in 5HP motor, waiting for quotation',
      priority: 'High'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      email: 'priya@example.com',
      address: '456 Park Avenue, Delhi',
      area: 'Connaught Place',
      productType: 'LED Street Light',
      leadSource: 'Social Media',
      customerType: 'Government',
      date: '2025-01-14',
      status: 'Not Connected',
      lastContact: '2025-01-16',
      nextFollowUp: '2025-01-22',
      notes: 'No response to calls, try email',
      priority: 'Medium'
    },
    {
      id: 3,
      name: 'Amit Patel',
      phone: '+91 76543 21098',
      email: 'amit@example.com',
      address: '789 Business District, Bangalore',
      area: 'Electronic City',
      productType: 'Power Distribution Panel',
      leadSource: 'Email Campaign',
      customerType: 'Business',
      date: '2025-01-13',
      status: 'Next Meeting',
      lastContact: '2025-01-17',
      nextFollowUp: '2025-01-20',
      notes: 'Meeting scheduled for product demo',
      priority: 'High'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedLead, setExpandedLead] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Connected': return 'bg-green-100 text-green-800';
      case 'Not Connected': return 'bg-red-100 text-red-800';
      case 'Next Meeting': return 'bg-blue-100 text-blue-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm) ||
                         lead.productType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || lead.priority.toLowerCase() === filterPriority;
    const matchesStatus = status === 'all' || lead.status.toLowerCase() === status;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const toggleLeadExpansion = (leadId) => {
    setExpandedLead(expandedLead === leadId ? null : leadId);
  };

  const handleStatusChange = (leadId, newStatus) => {
    setLeads(leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const handleDeleteLead = (leadId) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'connected': return 'Connected Leads';
      case 'not-connected': return 'Not Connected Leads';
      case 'next-meeting': return 'Next Meeting Leads';
      case 'closed': return 'Closed Leads';
      default: return 'All Follow-up Leads';
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">{getStatusTitle()}</h1>
        
        {/* Mobile Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Leads List */}
      <div className="space-y-3">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Lead Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-600">{lead.phone}</p>
                  <p className="text-xs text-gray-500">{lead.productType}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                    {lead.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{lead.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Next: {lead.nextFollowUp}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{lead.leadSource}</span>
                <button
                  onClick={() => toggleLeadExpansion(lead.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {expandedLead === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded Lead Details */}
            {expandedLead === lead.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="text-gray-900">{lead.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Area:</span>
                      <p className="text-gray-900">{lead.area}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Customer Type:</span>
                      <p className="text-gray-900">{lead.customerType}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Contact:</span>
                      <p className="text-gray-900">{lead.lastContact}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Address:</span>
                      <p className="text-gray-900">{lead.address}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Notes:</span>
                      <p className="text-gray-900">{lead.notes}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3">
                    <button
                      onClick={() => handleStatusChange(lead.id, 'Connected')}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Connected</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(lead.id, 'Not Connected')}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Not Connected</span>
                    </button>
                    <button
                      onClick={() => setEditingLead(lead)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Add New Lead</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-center py-8">Add Lead Form - Implementation needed</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">Edit Lead</h2>
              <button 
                onClick={() => setEditingLead(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 text-center py-8">Edit Lead Form - Implementation needed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMarketingFollowUpBase;
