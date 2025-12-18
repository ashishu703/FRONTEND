import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus, Box, Eye, Edit, Trash2, Calendar, Star, Package, Image, CreditCard, Wrench, Calculator, ChevronDown, CheckCircle, Shield, FileText, Download, MoreVertical, User, Phone, Mail, MapPin, Building, ChevronRight, DollarSign, Settings, BarChart3, X, Globe, Folder } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../api/admin_api/api';

// Import the working component directly
import MobileProducts from '../../salesperson/MOBILE view/MobileProducts';

const MobileToolbox = () => {
  // Simply re-export the working component
  return <MobileProducts />;
};

export default MobileToolbox;
