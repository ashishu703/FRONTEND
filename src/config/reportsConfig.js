import {
  TrendingUp,
  Users,
  Phone,
  DollarSign,
  Target,
  BarChart3,
  Building2,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

export const REPORT_TYPES = {
  SALES_PERFORMANCE: {
    id: 'sales-performance',
    title: 'Sales Performance Reports',
    description: 'Sales funnel, revenue and performance tracking. View sales by lead source, won vs lost deals, sales by product/region/salesperson, revenue forecast, and conversion rates.',
    icon: TrendingUp,
    color: 'blue',
    category: 'Sales',
    reportCount: 12,
    examples: [
      'Sales by Lead Source',
      'Won vs Lost Deals',
      'Sales by Product / Region / Salesperson',
      'Revenue Forecast Report',
      'Conversion Rate Report'
    ]
  },
  LEADS_PIPELINE: {
    id: 'leads-pipeline',
    title: 'Leads & Pipeline Reports',
    description: 'Track lead process and pipeline status. Identify new leads, conversion rates, pipeline stages, and aging pipeline reports.',
    icon: Users,
    color: 'green',
    category: 'Leads',
    reportCount: 8,
    examples: [
      'New Leads This Month',
      'Lead Conversion Rate',
      'Pipeline by Stage',
      'Aging Pipeline Report'
    ]
  },
  ACTIVITY: {
    id: 'activity',
    title: 'Activity Reports',
    description: 'Monitor sales team daily and weekly activities. Track calls made, emails sent, meetings scheduled vs completed, and tasks completed per user.',
    icon: Activity,
    color: 'purple',
    category: 'Activity',
    reportCount: 6,
    examples: [
      'Calls Made / Emails Sent',
      'Meetings Scheduled vs Completed',
      'Tasks Completed per User'
    ]
  },
  REVENUE_FINANCIAL: {
    id: 'revenue-financial',
    title: 'Revenue & Financial Reports',
    description: 'Analyze sales financial metrics. View monthly revenue trends, profit margins, discount analysis, and invoice status reports.',
    icon: DollarSign,
    color: 'orange',
    category: 'Finance',
    reportCount: 9,
    examples: [
      'Monthly Revenue Trend',
      'Profit Margin Report',
      'Discount Analysis',
      'Invoices by Status'
    ]
  },
  FORECASTING: {
    id: 'forecasting',
    title: 'Forecasting Reports',
    description: 'Predict future revenue and sales targets. Compare forecast vs actual sales, upcoming quarter forecasts, and sales rep target achievements.',
    icon: Target,
    color: 'red',
    category: 'Forecast',
    reportCount: 5,
    examples: [
      'Forecast vs Actual Sales',
      'Upcoming Quarter Forecast',
      'Sales Rep Target Achievement'
    ]
  },
  CUSTOM_ANALYTICAL: {
    id: 'custom-analytical',
    title: 'Custom / Analytical Reports',
    description: 'Advanced analytics for data-driven decisions. Cross-module reports, sales cycle duration analysis, customer lifetime value, and retention rates.',
    icon: PieChart,
    color: 'pink',
    category: 'Analytics',
    reportCount: 15,
    examples: [
      'Cross-module Reports',
      'Sales Cycle Duration Analysis',
      'Customer Lifetime Value (CLV)',
      'Retention Rate Report'
    ]
  },
  DASHBOARD: {
    id: 'dashboard',
    title: 'Dashboard Reports',
    description: 'Graphical view with charts, KPIs, and summaries. View KPI dashboards, regional sales dashboards, and marketing & sales funnel visualizations.',
    icon: BarChart3,
    color: 'teal',
    category: 'Dashboard',
    reportCount: 7,
    examples: [
      'KPI Dashboard',
      'Regional Sales Dashboard',
      'Marketing & Sales Funnel Visualization'
    ]
  },
  ORGANISATION: {
    id: 'organisation',
    title: 'Organisation Wise Report',
    description: 'View comprehensive reports organized by organisation. Track performance, revenue, and metrics across different organizations.',
    icon: Building2,
    color: 'pink',
    category: 'Organisation',
    reportCount: 10,
    examples: [
      'Organisation Performance',
      'Organisation Revenue',
      'Organisation Metrics'
    ]
  },
  CALL: {
    id: 'call',
    title: 'Call Report',
    description: 'Track and analyze call activities. View call statistics, call duration, call outcomes, and call performance metrics.',
    icon: Phone,
    color: 'yellow',
    category: 'Calls',
    reportCount: 4,
    examples: [
      'Call Statistics',
      'Call Duration Analysis',
      'Call Outcomes',
      'Call Performance Metrics'
    ]
  }
};

export const getReportsByCategory = (category) => {
  return Object.values(REPORT_TYPES).filter(report => report.category === category);
};

export const getAllReports = () => {
  return Object.values(REPORT_TYPES);
};

export const getReportById = (id) => {
  const report = Object.values(REPORT_TYPES).find(report => report.id === id);
  return report || null;
};

