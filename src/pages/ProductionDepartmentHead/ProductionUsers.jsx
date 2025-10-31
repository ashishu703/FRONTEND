import React from 'react';
import { Users, Plus, Edit, Trash2, Mail } from 'lucide-react';

const ProductionUsers = () => {
  const productionStaff = [
    { id: 1, name: 'John Smith', email: 'john@anocab.com', phone: '+91 98765 43210', role: 'Production Supervisor', department: 'Assembly', status: 'Active' },
    { id: 2, name: 'Jane Doe', email: 'jane@anocab.com', phone: '+91 98765 43211', role: 'Quality Inspector', department: 'Quality Control', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@anocab.com', phone: '+91 98765 43212', role: 'Machine Operator', department: 'Packaging', status: 'Active' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@anocab.com', phone: '+91 98765 43213', role: 'Maintenance Technician', department: 'Maintenance', status: 'Inactive' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-orange-600" />
          Production Staff
        </h1>
        <p className="text-gray-600 mt-1">Manage production department staff and their roles</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Staff Members</h2>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productionStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    staff.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {staff.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="text-orange-600 hover:text-orange-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Operator Performance */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Operator Performance</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quality Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                { name: 'John Smith', shift: 'Day', efficiency: 92, quality: 98, status: 'Active' },
                { name: 'Jane Doe', shift: 'Day', efficiency: 88, quality: 95, status: 'Active' },
                { name: 'Mike Johnson', shift: 'Night', efficiency: 85, quality: 97, status: 'Active' },
                { name: 'Sarah Wilson', shift: 'Night', efficiency: 90, quality: 96, status: 'Break' }
              ].map((operator, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{operator.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operator.shift}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operator.efficiency}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operator.quality}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      operator.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {operator.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionUsers;
