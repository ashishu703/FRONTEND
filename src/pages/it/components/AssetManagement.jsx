import React, { useState } from 'react';
import { HardDrive, Laptop, Smartphone, Printer, Plus, Search, Calendar } from 'lucide-react';

const AssetManagement = () => {
  const [assets] = useState([
    {
      id: 'AST-001',
      name: 'Dell Laptop XPS 15',
      type: 'Laptop',
      serial: '9YH7K2M1',
      assignedTo: 'Rahul Sharma',
      status: 'In Use',
      purchaseDate: '2024-01-15',
      nextAMC: '2025-12-15',
      vendor: 'Dell Technologies'
    },
    {
      id: 'AST-002',
      name: 'HP LaserJet Printer',
      type: 'Printer',
      serial: 'HP789456',
      assignedTo: 'Office Floor 1',
      status: 'In Use',
      purchaseDate: '2023-06-20',
      nextAMC: '2025-06-20',
      vendor: 'HP Inc.'
    },
    {
      id: 'AST-003',
      name: 'Cisco Router 2900',
      type: 'Network Device',
      serial: 'CS2900X123',
      assignedTo: 'IT Department',
      status: 'In Use',
      purchaseDate: '2023-03-10',
      nextAMC: '2025-03-10',
      vendor: 'Cisco Systems'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Inventory</p>
          <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
          <p className="text-sm text-slate-500">Track company hardware and software assets</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500">
          <Plus className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Asset ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Next AMC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{asset.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{asset.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold bg-cyan-100 text-cyan-700 rounded">
                      {asset.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{asset.serial}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{asset.assignedTo}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{asset.nextAMC}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetManagement;

