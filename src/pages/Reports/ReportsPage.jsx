import React from 'react';
import ReportCard from '../../components/reports/ReportCard';
import { getAllReports } from '../../config/reportsConfig';

const ReportsPage = ({ setActiveView }) => {
  console.log('📊 ReportsPage: Component rendered');

  const handleReportSelect = (reportId) => {
    console.log('ReportsPage: Report selected:', reportId);
    if (setActiveView) {
      setActiveView(`detailed-report-${reportId}`);
    }
  };

  const reports = getAllReports();

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">View and analyze your sales performance, leads, activities, and more</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                id={report.id}
                title={report.title}
                description={report.description}
                icon={report.icon}
                color={report.color}
                category={report.category}
                reportCount={report.reportCount}
                onClick={handleReportSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

