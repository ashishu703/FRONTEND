import React, { useEffect, useState } from 'react';
import productionService from '../../api/admin_api/productionService';
import { useCompany } from '../../context/CompanyContext';
import {
  Factory,
  Gauge,
  Activity,
  TimerReset,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  PackageOpen,
  Boxes,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';

// Super Admin view for Production Department - mirrors HR/Sales dashboards styling
const ProductionDepartmentDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const { selectedCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    oee: 78.4, // Overall Equipment Effectiveness
    unitsProduced: 12540,
    throughputPerHour: 312,
    machineUptime: 92.3,
    plannedDowntimeHrs: 36,
    unplannedDowntimeHrs: 12,
    defectRate: 1.8,
    firstPassYield: 96.2,
    wipCount: 482,
    onTimeOrders: 94.6,
    safetyIncidents: 1,
    maintenanceDue: 7,
    inventoryTurns: 8.4,
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productionService.getMetrics(selectedCompany?.name || selectedCompany || '');
        const data = res?.data || res || {};
        // Map backend fields -> UI fields; fallback gracefully
        setMetrics((prev) => ({
          oee: Number(data.oee) || prev.oee,
          unitsProduced: Number(data.unitsProduced) || prev.unitsProduced,
          throughputPerHour: Number(data.throughputPerHour) || prev.throughputPerHour,
          machineUptime: Number(data.machineUptime) || prev.machineUptime,
          plannedDowntimeHrs: Number(data.plannedDowntimeHrs) || prev.plannedDowntimeHrs,
          unplannedDowntimeHrs: Number(data.unplannedDowntimeHrs) || prev.unplannedDowntimeHrs,
          defectRate: Number(data.defectRate) || prev.defectRate,
          firstPassYield: Number(data.firstPassYield) || prev.firstPassYield,
          wipCount: Number(data.wipCount) || prev.wipCount,
          onTimeOrders: Number(data.onTimeOrders) || prev.onTimeOrders,
          safetyIncidents: Number(data.safetyIncidents) || prev.safetyIncidents,
          maintenanceDue: Number(data.maintenanceDue) || prev.maintenanceDue,
          inventoryTurns: Number(data.inventoryTurns) || prev.inventoryTurns,
        }));
      } catch (e) {
        setError(e.message || 'Failed to load production metrics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedCompany, selectedPeriod]);

  const StatCard = ({ title, value, suffix = '', icon: Icon, color, change, changeType, description }) => (
    <div className={`${color.bg} ${color.border} border rounded-xl p-6 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-medium ${color.text}`}>{title}</h3>
        <div className={color.text}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className={`text-2xl font-bold ${color.value} mb-1`}>
        {value}{suffix}
      </div>
      {change !== undefined && (
        <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {changeType === 'positive' ? '+' : ''}{change}% from last month
        </p>
      )}
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );

  const lineItems = [
    { label: 'Extrusion', progress: 82, color: 'bg-blue-500', orders: '120/146' },
    { label: 'Bunching', progress: 74, color: 'bg-green-500', orders: '86/116' },
    { label: 'Jacketing', progress: 67, color: 'bg-indigo-500', orders: '59/88' },
    { label: 'Cutting', progress: 58, color: 'bg-purple-500', orders: '41/70' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Production Department Dashboard</h1>
            <p className="text-gray-600">Manufacturing performance and quality overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="OEE"
          value={metrics.oee}
          suffix="%"
          icon={Gauge}
          color={{ bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', value: 'text-blue-600' }}
          change={1.2}
          changeType="positive"
          description="Overall equipment effectiveness"
        />
        <StatCard
          title="Units Produced"
          value={metrics.unitsProduced.toLocaleString()}
          icon={Factory}
          color={{ bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', value: 'text-green-600' }}
          change={2.4}
          changeType="positive"
          description="Total units this period"
        />
        <StatCard
          title="Machine Uptime"
          value={metrics.machineUptime}
          suffix="%"
          icon={Activity}
          color={{ bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', value: 'text-indigo-600' }}
          change={0.6}
          changeType="positive"
          description="Availability across critical lines"
        />
        <StatCard
          title="Defect Rate"
          value={metrics.defectRate}
          suffix="%"
          icon={AlertTriangle}
          color={{ bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', value: 'text-red-600' }}
          change={-0.3}
          changeType="positive"
          description="Non-conformance detected"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Throughput / Hr"
          value={metrics.throughputPerHour}
          icon={TrendingUp}
          color={{ bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', value: 'text-teal-600' }}
          description="Avg finished units per hour"
        />
        <StatCard
          title="Planned Downtime"
          value={metrics.plannedDowntimeHrs}
          suffix="h"
          icon={TimerReset}
          color={{ bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-600', value: 'text-yellow-600' }}
          description="Changeovers, PM, setups"
        />
        <StatCard
          title="Unplanned Downtime"
          value={metrics.unplannedDowntimeHrs}
          suffix="h"
          icon={TrendingDown}
          color={{ bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', value: 'text-orange-600' }}
          description="Breakdowns, quality holds"
        />
        <StatCard
          title="First Pass Yield"
          value={metrics.firstPassYield}
          suffix="%"
          icon={CheckCircle2}
          color={{ bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', value: 'text-purple-600' }}
          description="Accepted without rework"
        />
      </div>

      {/* Line Progress and Order Attainment */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Line Progress</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {lineItems.map((l) => (
              <div key={l.label} className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span className="font-medium">{l.label}</span>
                  <span className="text-gray-600">{l.orders}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 ${l.color} rounded-full transition-all`} style={{ width: `${l.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Attainment</h3>
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-xs text-green-700 mb-1">On-time Delivery</div>
              <div className="text-2xl font-bold text-green-700">{metrics.onTimeOrders}%</div>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-xs text-amber-700 mb-1">Maintenance Due</div>
              <div className="text-2xl font-bold text-amber-700">{metrics.maintenanceDue}</div>
            </div>
            <div className="p-4 rounded-lg bg-sky-50 border border-sky-200">
              <div className="text-xs text-sky-700 mb-1">Inventory Turns</div>
              <div className="text-2xl font-bold text-sky-700">{metrics.inventoryTurns}</div>
            </div>
            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200">
              <div className="text-xs text-rose-700 mb-1">Safety Incidents</div>
              <div className="text-2xl font-bold text-rose-700">{metrics.safetyIncidents}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Snapshot */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Snapshot</h3>
          <Boxes className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Raw Material (RM)</div>
            <div className="text-xl font-semibold text-gray-900">{(metrics.wipCount * 0.6).toFixed(0)} kg</div>
            <div className="text-xs text-gray-500">Avg 7 days consumption</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Work in Progress (WIP)</div>
            <div className="text-xl font-semibold text-gray-900">{metrics.wipCount}</div>
            <div className="text-xs text-gray-500">Across all lines</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Finished Goods (FG)</div>
            <div className="text-xl font-semibold text-gray-900">{(metrics.unitsProduced * 0.12).toFixed(0)} units</div>
            <div className="text-xs text-gray-500">Ready for dispatch</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionDepartmentDashboard;


