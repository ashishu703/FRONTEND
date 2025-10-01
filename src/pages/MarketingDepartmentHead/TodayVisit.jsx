import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, User, CheckCircle, XCircle, AlertCircle, TrendingUp, Target, Users, BarChart3, RefreshCw, Filter, Search, Megaphone } from 'lucide-react';

const MarketingTodayVisit = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMarketingPerson, setSelectedMarketingPerson] = useState('All Marketing Personnel');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sample data for marketing personnel visits from Monday to Sunday
  const marketingPersonnelData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@anocab.com',
      phone: '+1 (555) 123-4567',
      department: 'Marketing Department',
      role: 'Marketing Specialist',
      status: 'Active',
      visits: {
        monday: [
          { id: 1, customer: 'Tech Solutions Inc', time: '09:00', address: '123 Business St, City', status: 'Completed', notes: 'Campaign strategy discussion completed', campaign: 'Digital Marketing' },
          { id: 2, customer: 'Marketing Agency', time: '14:00', address: '456 Corporate Ave, City', status: 'Pending', notes: 'Brand awareness campaign planning', campaign: 'Brand Campaign' }
        ],
        tuesday: [
          { id: 3, customer: 'Manufacturing Co', time: '10:30', address: '789 Industrial Blvd, City', status: 'Completed', notes: 'Content marketing strategy finalized', campaign: 'Content Marketing' },
          { id: 4, customer: 'Startup Ventures', time: '15:30', address: '321 Innovation Dr, City', status: 'In Progress', notes: 'Social media campaign consultation', campaign: 'Social Media' }
        ],
        wednesday: [
          { id: 5, customer: 'Enterprise Solutions', time: '11:00', address: '654 Enterprise Way, City', status: 'Completed', notes: 'Email marketing campaign launched', campaign: 'Email Marketing' },
          { id: 6, customer: 'Small Business LLC', time: '16:00', address: '987 Main St, City', status: 'Pending', notes: 'SEO strategy development', campaign: 'SEO Campaign' }
        ],
        thursday: [
          { id: 7, customer: 'Global Corp', time: '09:30', address: '147 Global Plaza, City', status: 'Completed', notes: 'Marketing automation setup', campaign: 'Marketing Automation' },
          { id: 8, customer: 'Local Business', time: '14:30', address: '258 Local Rd, City', status: 'In Progress', notes: 'Lead generation campaign', campaign: 'Lead Generation' }
        ],
        friday: [
          { id: 9, customer: 'Tech Startup', time: '10:00', address: '369 Tech Park, City', status: 'Completed', notes: 'Influencer marketing strategy', campaign: 'Influencer Marketing' },
          { id: 10, customer: 'Retail Chain', time: '15:00', address: '741 Retail Center, City', status: 'Pending', notes: 'Customer retention campaign', campaign: 'Retention Campaign' }
        ],
        saturday: [
          { id: 11, customer: 'Service Company', time: '11:30', address: '852 Service Ave, City', status: 'Completed', notes: 'Weekend marketing consultation', campaign: 'Consultation' }
        ],
        sunday: []
      }
    },
    {
      id: 2,
      name: 'Mike Wilson',
      email: 'mike.wilson@anocab.com',
      phone: '+1 (555) 234-5678',
      department: 'Marketing Department',
      role: 'Digital Marketing Specialist',
      status: 'Active',
      visits: {
        monday: [
          { id: 12, customer: 'Construction Ltd', time: '08:30', address: '159 Build St, City', status: 'Completed', notes: 'PPC campaign optimization', campaign: 'PPC Campaign' },
          { id: 13, customer: 'Architecture Firm', time: '13:30', address: '357 Design Blvd, City', status: 'In Progress', notes: 'Google Ads setup', campaign: 'Google Ads' }
        ],
        tuesday: [
          { id: 14, customer: 'Real Estate Co', time: '09:00', address: '468 Property Dr, City', status: 'Completed', notes: 'Social media advertising', campaign: 'Social Ads' },
          { id: 15, customer: 'Hospitality Group', time: '14:00', address: '579 Hotel Ave, City', status: 'Pending', notes: 'Display advertising campaign', campaign: 'Display Ads' }
        ],
        wednesday: [
          { id: 16, customer: 'Healthcare Center', time: '10:00', address: '680 Medical Way, City', status: 'Completed', notes: 'Video marketing strategy', campaign: 'Video Marketing' },
          { id: 17, customer: 'Educational Institute', time: '15:00', address: '791 School St, City', status: 'In Progress', notes: 'Online course promotion', campaign: 'Course Marketing' }
        ],
        thursday: [
          { id: 18, customer: 'Financial Services', time: '08:00', address: '802 Finance Plaza, City', status: 'Completed', notes: 'LinkedIn advertising setup', campaign: 'LinkedIn Ads' },
          { id: 19, customer: 'Legal Firm', time: '13:00', address: '913 Law Center, City', status: 'Pending', notes: 'Content syndication strategy', campaign: 'Content Syndication' }
        ],
        friday: [
          { id: 20, customer: 'Consulting Group', time: '09:30', address: '024 Consult Blvd, City', status: 'Completed', notes: 'Marketing analytics setup', campaign: 'Analytics' },
          { id: 21, customer: 'Non-Profit Org', time: '14:30', address: '135 Charity Way, City', status: 'In Progress', notes: 'Donation campaign planning', campaign: 'Donation Campaign' }
        ],
        saturday: [],
        sunday: []
      }
    },
    {
      id: 3,
      name: 'Lisa Chen',
      email: 'lisa.chen@anocab.com',
      phone: '+1 (555) 345-6789',
      department: 'Marketing Department',
      role: 'Content Marketing Manager',
      status: 'Active',
      visits: {
        monday: [
          { id: 22, customer: 'Restaurant Chain', time: '10:30', address: '246 Food Court, City', status: 'Completed', notes: 'Menu marketing content', campaign: 'Menu Marketing' },
          { id: 23, customer: 'Cafe Network', time: '15:30', address: '357 Coffee St, City', status: 'Pending', notes: 'Blog content strategy', campaign: 'Blog Strategy' }
        ],
        tuesday: [
          { id: 24, customer: 'Retail Store', time: '11:00', address: '468 Shop Ave, City', status: 'Completed', notes: 'Product description optimization', campaign: 'Product Content' },
          { id: 25, customer: 'Fashion Boutique', time: '16:00', address: '579 Style Blvd, City', status: 'In Progress', notes: 'Fashion blog content', campaign: 'Fashion Content' }
        ],
        wednesday: [
          { id: 26, customer: 'Gym & Fitness', time: '09:00', address: '680 Fitness Dr, City', status: 'Completed', notes: 'Fitness content calendar', campaign: 'Fitness Content' },
          { id: 27, customer: 'Spa & Wellness', time: '14:00', address: '791 Wellness Way, City', status: 'Pending', notes: 'Wellness blog planning', campaign: 'Wellness Content' }
        ],
        thursday: [
          { id: 28, customer: 'Beauty Salon', time: '10:00', address: '802 Beauty Plaza, City', status: 'Completed', notes: 'Beauty tutorial content', campaign: 'Tutorial Content' },
          { id: 29, customer: 'Barber Shop', time: '15:00', address: '913 Grooming St, City', status: 'In Progress', notes: 'Grooming tips content', campaign: 'Grooming Content' }
        ],
        friday: [
          { id: 30, customer: 'Pet Store', time: '08:30', address: '024 Pet Ave, City', status: 'Completed', notes: 'Pet care content creation', campaign: 'Pet Content' },
          { id: 31, customer: 'Bookstore', time: '13:30', address: '135 Books Blvd, City', status: 'Pending', notes: 'Book review content', campaign: 'Book Reviews' }
        ],
        saturday: [
          { id: 32, customer: 'Art Gallery', time: '12:00', address: '246 Gallery Way, City', status: 'Completed', notes: 'Art exhibition content', campaign: 'Art Content' }
        ],
        sunday: []
      }
    }
  ];

  const marketingPersonnel = ['All Marketing Personnel', ...marketingPersonnelData.map(mp => mp.name)];

  const getDayName = (day) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return days[day] || day;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const filteredMarketingPersonnel = marketingPersonnelData.filter(marketingPerson => {
    const matchesSearch = !searchTerm || 
      marketingPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marketingPerson.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSelection = selectedMarketingPerson === 'All Marketing Personnel' || 
      marketingPerson.name === selectedMarketingPerson;
    
    return matchesSearch && matchesSelection;
  });

  const getCurrentWeekVisits = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + 1);
    
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentDay = weekDays[dayOfWeek - 1] || 'monday';
    
    return { weekDays, currentDay };
  };

  const { weekDays, currentDay } = getCurrentWeekVisits();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Marketing Team Visits</h1>
        </div>
        <p className="text-gray-600">Track and manage marketing personnel client visits from Monday to Sunday</p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-gray-500" />
              <select
                value={selectedMarketingPerson}
                onChange={(e) => setSelectedMarketingPerson(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {marketingPersonnel.map(mp => (
                  <option key={mp} value={mp}>{mp}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search marketing personnel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {weekDays.map((day, index) => {
          const dayVisits = filteredMarketingPersonnel.reduce((total, mp) => {
            return total + (mp.visits[day]?.length || 0);
          }, 0);
          
          const completedVisits = filteredMarketingPersonnel.reduce((total, mp) => {
            return total + (mp.visits[day]?.filter(v => v.status === 'Completed').length || 0);
          }, 0);

          return (
            <div key={day} className={`bg-white rounded-lg border p-4 ${currentDay === day ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{getDayName(day)}</h3>
                {currentDay === day && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900">{dayVisits}</div>
              <div className="text-sm text-gray-600">
                {completedVisits} completed
              </div>
            </div>
          );
        })}
      </div>

      {/* Marketing Personnel Details */}
      <div className="space-y-6">
        {filteredMarketingPersonnel.map((marketingPerson) => (
          <div key={marketingPerson.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Marketing Person Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{marketingPerson.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {marketingPerson.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {marketingPerson.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-purple-600 font-medium">{marketingPerson.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    marketingPerson.status === 'Active' 
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {marketingPerson.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Visits - Day-wise Columns */}
            <div className="p-6">
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {weekDays.map((day) => (
                      <div key={day} className={`text-center font-semibold text-sm py-3 rounded-lg border-2 ${
                        currentDay === day 
                          ? 'bg-purple-100 text-purple-800 border-purple-300' 
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {getDayName(day)}
                        </div>
                        <div className="text-xs mt-1 opacity-75">
                          {marketingPerson.visits[day]?.length || 0} visits
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Table Body */}
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => (
                      <div key={day} className="min-h-[400px] space-y-2">
                        {marketingPerson.visits[day]?.length > 0 ? (
                          marketingPerson.visits[day].map((visit) => (
                            <div key={visit.id} className={`rounded-lg p-3 border-2 ${
                              currentDay === day 
                                ? 'bg-purple-50 border-purple-200' 
                                : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(visit.status)}
                                  <span className="text-sm font-medium text-gray-900 truncate">{visit.customer}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(visit.status)}`}>
                                  {visit.status}
                                </div>
                                {visit.campaign && (
                                  <div className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                    {visit.campaign}
                                  </div>
                                )}
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span className="font-medium">{visit.time}</span>
                                  </div>
                                  <div className="flex items-start gap-1">
                                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs leading-tight">{visit.address}</span>
                                  </div>
                                  {visit.notes && (
                                    <div className="text-xs text-gray-500 mt-2 p-2 bg-white rounded border-l-2 border-purple-200 italic">
                                      "{visit.notes}"
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className={`text-center text-gray-400 text-sm py-8 rounded-lg border-2 border-dashed ${
                            currentDay === day 
                              ? 'border-purple-300 bg-purple-50' 
                              : 'border-gray-300 bg-gray-50'
                          }`}>
                            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <div>No visits</div>
                            <div className="text-xs mt-1">scheduled</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Completed Visits</h3>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {filteredMarketingPersonnel.reduce((total, mp) => {
              return total + Object.values(mp.visits).flat().filter(v => v.status === 'Completed').length;
            }, 0)}
          </div>
          <p className="text-sm text-gray-600 mt-1">This week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">In Progress</h3>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {filteredMarketingPersonnel.reduce((total, mp) => {
              return total + Object.values(mp.visits).flat().filter(v => v.status === 'In Progress').length;
            }, 0)}
          </div>
          <p className="text-sm text-gray-600 mt-1">This week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pending Visits</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-600">
            {filteredMarketingPersonnel.reduce((total, mp) => {
              return total + Object.values(mp.visits).flat().filter(v => v.status === 'Pending').length;
            }, 0)}
          </div>
          <p className="text-sm text-gray-600 mt-1">This week</p>
        </div>
      </div>

      {/* Empty State */}
      {filteredMarketingPersonnel.length === 0 && (
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 text-lg">No marketing personnel found</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</div>
        </div>
      )}
    </div>
  );
};

export default MarketingTodayVisit;
