import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const CompanyContext = createContext({ selectedCompany: 'Anode Electric Pvt.', setSelectedCompany: () => {} });

export const CompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(() => {
    try {
      return localStorage.getItem('selectedCompany') || 'Anode Electric Pvt.';
    } catch (_) {
      return 'Anode Electric Pvt.';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('selectedCompany', selectedCompany);
    } catch (_) {}
  }, [selectedCompany]);

  const value = useMemo(() => ({ selectedCompany, setSelectedCompany }), [selectedCompany]);

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);


