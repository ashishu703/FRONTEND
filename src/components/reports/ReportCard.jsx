import React from 'react';

class ReportCard {
  constructor({ id, title, description, icon: Icon, color, category, reportCount, onClick }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.Icon = Icon;
    this.color = color;
    this.category = category;
    this.reportCount = reportCount;
    this.onClick = onClick;
  }

  render() {
    const { id, title, description, Icon, color, category, reportCount, onClick } = this;
    const colorClasses = this.getColorClasses(color);

    return (
      <div
        onClick={() => onClick && onClick(id)}
        className={`${colorClasses.card} cursor-pointer transition-all duration-300 hover:shadow-lg rounded-xl p-6 relative border border-gray-200`}
      >
        <div className="absolute top-4 right-4">
          <span className="bg-white text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {reportCount || 0} reports
          </span>
        </div>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-start space-x-4">
            <div className={`${colorClasses.iconBg} p-3 rounded-lg flex-shrink-0 w-12 h-12 flex items-center justify-center`}>
              {Icon && <Icon className={`${colorClasses.icon} w-6 h-6`} />}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="mb-2">
                <span className={`${colorClasses.categoryTag} text-xs font-medium px-2.5 py-1 rounded-full`}>
                  {category}
                </span>
              </div>
              <h3 className={`${colorClasses.title} text-lg font-bold mb-2 leading-tight`}>
                {title}
              </h3>
            </div>
          </div>
          <p className={`${colorClasses.description} text-sm leading-relaxed`}>
            {description}
          </p>
        </div>
      </div>
    );
  }

  getColorClasses(color) {
    const colorMap = {
      blue: {
        card: 'bg-blue-50/50 hover:bg-blue-50',
        iconBg: 'bg-blue-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      },
      green: {
        card: 'bg-green-50/50 hover:bg-green-50',
        iconBg: 'bg-green-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      },
      purple: {
        card: 'bg-purple-50/50 hover:bg-purple-50',
        iconBg: 'bg-purple-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      },
      orange: {
        card: 'bg-orange-50/50 hover:bg-orange-50',
        iconBg: 'bg-orange-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      },
      red: {
        card: 'bg-red-50/50 hover:bg-red-50',
        iconBg: 'bg-red-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      },
      indigo: {
        card: 'bg-indigo-50/50 hover:bg-indigo-50',
        iconBg: 'bg-indigo-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      },
      teal: {
        card: 'bg-teal-50/50 hover:bg-teal-50',
        iconBg: 'bg-teal-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      },
      pink: {
        card: 'bg-pink-50/50 hover:bg-pink-50',
        iconBg: 'bg-pink-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      },
      yellow: {
        card: 'bg-yellow-50/50 hover:bg-yellow-50',
        iconBg: 'bg-yellow-500',
        icon: 'text-white',
        title: 'text-gray-900',
        description: 'text-gray-600',
        categoryTag: 'bg-gray-200 text-gray-700'
      }
    };

    return colorMap[color] || colorMap.blue;
  }
}

const ReportCardComponent = ({ id, title, description, icon: Icon, color, category, reportCount, onClick }) => {
  const card = new ReportCard({ id, title, description, icon: Icon, color, category, reportCount, onClick });
  return card.render();
};

export default ReportCardComponent;

