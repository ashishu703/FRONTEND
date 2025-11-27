import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus, Box, Eye, Edit, Trash2, Calendar, Star, Package, Image, CreditCard, Wrench, Calculator, ChevronDown, CheckCircle, Shield, FileText, Download, MoreVertical, User, Phone, Mail, MapPin, Building, ChevronRight, DollarSign, Settings, BarChart3, X, Globe, Folder } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import apiClient from '../../../utils/apiClient';
import { API_ENDPOINTS } from '../../../api/admin_api/api';

const MobileProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDataUpcoming, setShowDataUpcoming] = useState(false);
  
  // List of products that have full data
  const productsWithData = [
    'aerial bunch cable',
    'aluminium conductor galvanized steel reinforced',
    'all aluminium alloy conductor',
    'pvc insulated submersible cable',
    'multi core xlpe insulated aluminium unarmoured cable',
    'multistrand single core copper cable',
    'multi core copper cable',
    'pvc insulated single core aluminium cable',
    'pvc insulated multicore aluminium cable',
    'submersible winding wire',
    'twin twisted copper wire',
    'speaker cable',
    'cctv cable',
    'lan cable',
    'automobile cable',
    'pv solar cable',
    'co axial cable',
    'uni-tube unarmoured optical fibre cable',
    'armoured unarmoured pvc insulated copper control cable',
    'telecom switch board cables',
    'multi core pvc insulated aluminium unarmoured cable',
    'multi core xlpe insulated aluminium armoured cable',
    'multi core pvc insulated aluminium armoured cable',
    'single core xlpe insulated aluminium/copper armoured/unarmoured cable',
    'single core pvc insulated aluminium/copper armoured/unarmoured cable',
    'paper cover aluminium conductor'
  ];
  
  // Check if product has data
  const hasProductData = (productName) => {
    const nameLower = productName.toLowerCase();
    return productsWithData.some(allowed => nameLower.includes(allowed));
  };
  // Image upload state for Price List - database-backed
  const [productImages, setProductImages] = useState({}); // { [productName]: { [rowIndex]: [fileUrl1, ...] } }
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewingImageRowIndex, setViewingImageRowIndex] = useState(null); // Track which row index is being viewed in modal
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false); // File viewer modal state
  const imageUploadInputRef = useRef(null); // Ref for file input
  // Approvals: BIS doc preview (uses desktop mapping)
  const [bisDocUrl, setBisDocUrl] = useState(() => {
    // Desktop mapping for BIS PDFs
    const pdfMappings = {
      'Aerial Bunch Cable': 'aerial bunch cable, bis liscence .pdf',
      'All Aluminium Alloy Conductor': 'all aluminium alloy conductor,bis liscence.pdf',
      'Aluminium Conductor Galvanized Steel Reinforced': 'aluminium conductor galvanised steel reinforced, bis liscence.pdf',
      'Multi Core XLPE Insulated Aluminium Unarmoured Cable': 'multicore xlpe insulated aluminium unrmoured cable,bis liscence.pdf'
    };
    const file = pdfMappings['Aerial Bunch Cable'];
    return file ? `${window.location.origin}/pdf/${file}` : '';
  });
  const [bisPreviewOpen, setBisPreviewOpen] = useState(false);

  // Right Sidebar state
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("IT Park, Jabalpur");
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [showHelpingCalculators, setShowHelpingCalculators] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [isBusinessCardModalOpen, setIsBusinessCardModalOpen] = useState(false);
  const [isSamriddhiBusinessCardModalOpen, setIsSamriddhiBusinessCardModalOpen] = useState(false);
  const [isCompanyEmailsModalOpen, setIsCompanyEmailsModalOpen] = useState(false);
  const [isGstDetailsOpen, setIsGstDetailsOpen] = useState(false);
  const [isApprovalsModalOpen, setIsApprovalsModalOpen] = useState(false);
  const [isBisFolderOpen, setIsBisFolderOpen] = useState(false);
  const businessCardRef = useRef(null);
  const samriddhiBusinessCardRef = useRef(null);

  // BIS Component PDF opener function
  const openBisComponentPdf = (componentCode) => {
    const pdfMappings = {
      '14255': 'aerial bunch cable, bis liscence .pdf',
      '389 - P2': 'aluminium conductor galvanised steel reinforced, bis liscence.pdf',
      '398 - P4': 'all aluminium alloy conductor,bis liscence.pdf',
      '7098': 'multicore xlpe insulated aluminium unrmoured cable,bis liscence.pdf',
      '7098 - P1': 'single core xlpe insulated aluminium:copper armoured:unarmoured cable bis liscence.pdf'
    };

    const pdfFileName = pdfMappings[componentCode];
    
    if (pdfFileName) {
      const pdfUrl = `${window.location.origin}/pdf/${pdfFileName}`;
      const newWindow = window.open(pdfUrl, '_blank');
      if (!newWindow) {
        alert('Please allow pop-ups for this site to view the license');
      }
    } else {
      alert('BIS License not available for this component');
    }
  };

  const openBisFolder = () => {
    setIsBisFolderOpen(true);
  };

  const closeBisFolder = () => {
    setIsBisFolderOpen(false);
  };
  
  // Helping Calculators Modal state
  const [isHelpingCalcOpen, setIsHelpingCalcOpen] = useState(false);
  const [helpingCalcType, setHelpingCalcType] = useState(null); // 'technical' | 'conversional' | 'wire-gauge' | 'temperature-correction'
  const closeHelpingCalc = () => { setIsHelpingCalcOpen(false); setHelpingCalcType(null); };

  // Wire Gauge Chart Data
  const wireGaugeData = [
    ["7/0", "0.5000", "12.7000", "-", "-"],
    ["6/0", "0.4640", "11.7860", "0.5800", "14.7320"],
    ["5/0", "0.4320", "10.9730", "0.5165", "13.1190"],
    ["4/0", "0.4000", "10.1600", "0.4600", "11.6840"],
    ["3/0", "0.3720", "9.4490", "0.4096", "10.4040"],
    ["2/0", "0.3480", "8.8390", "0.3648", "9.2660"],
    ["1/0", "0.3240", "8.2300", "0.3249", "8.2515"],
    ["1", "0.3000", "7.6200", "0.2893", "7.3481"],
    ["2", "0.2760", "7.0100", "0.2576", "6.5430"],
    ["3", "0.2520", "6.4000", "0.2294", "5.8270"],
    ["4", "0.2320", "5.8930", "0.2043", "5.1890"],
    ["5", "0.2120", "5.3850", "0.1819", "4.6210"],
    ["6", "0.1920", "4.8770", "0.1620", "4.1150"],
    ["7", "0.1760", "4.4700", "0.1443", "3.6650"],
    ["8", "0.1600", "4.0640", "0.1285", "3.2640"],
    ["9", "0.1440", "3.6580", "0.1144", "2.9060"],
    ["10", "0.1280", "3.2510", "0.1019", "2.5880"],
    ["11", "0.1160", "2.9460", "0.0907", "2.3040"],
    ["12", "0.1040", "2.6420", "0.0808", "2.0530"],
    ["13", "0.0920", "2.3370", "0.0720", "1.8280"],
    ["14", "0.0800", "2.0320", "0.0641", "1.6280"],
    ["15", "0.0720", "1.8290", "0.0571", "1.4503"],
    ["16", "0.0640", "1.6260", "0.0508", "1.2903"],
    ["17", "0.0560", "1.4220", "0.0453", "1.1506"],
    ["18", "0.0480", "1.2190", "0.0403", "1.0236"],
    ["19", "0.0400", "1.0160", "0.0359", "0.9119"],
    ["20", "0.0360", "0.9140", "0.0320", "0.8128"],
    ["21", "0.0320", "0.8130", "0.0285", "0.7239"],
    ["22", "0.0280", "0.7110", "0.0253", "0.6426"],
    ["23", "0.0240", "0.6100", "0.0226", "0.5740"],
    ["24", "0.0220", "0.5990", "0.0201", "0.5105"],
    ["25", "0.0200", "0.5080", "0.0179", "0.4947"],
    ["26", "0.0180", "0.4570", "0.0159", "0.4039"],
    ["27", "0.0164", "0.4170", "0.0142", "0.3607"],
    ["28", "0.0148", "0.3760", "0.0126", "0.3200"],
    ["29", "0.0136", "0.3450", "0.0113", "0.2870"],
    ["30", "0.0124", "0.3150", "0.0100", "0.2540"],
    ["31", "0.0116", "0.2950", "0.0089", "0.2261"],
    ["32", "0.0108", "0.2740", "0.0080", "0.2032"],
    ["33", "0.0100", "0.2540", "0.0071", "0.1803"],
    ["34", "0.0092", "0.2340", "0.0063", "0.1600"],
    ["35", "0.0084", "0.2130", "0.0056", "0.1422"],
    ["36", "0.0076", "0.1930", "0.0050", "0.1270"],
    ["37", "0.0068", "0.1730", "0.0045", "0.1143"],
    ["38", "0.0060", "0.1520", "0.0040", "0.1016"],
    ["39", "0.0052", "0.1320", "0.0035", "0.0889"],
    ["40", "0.0048", "0.1220", "0.0031", "0.0787"],
    ["41", "0.0044", "0.1120", "0.0038", "0.0711"],
    ["42", "0.0040", "0.1020", "0.0025", "0.0635"],
    ["43", "0.0036", "0.0910", "0.0022", "0.0559"],
    ["44", "0.0032", "0.0810", "0.0020", "0.0508"],
    ["45", "0.0028", "0.0710", "0.0018", "0.0457"],
    ["46", "0.0024", "0.0610", "0.0016", "0.0406"],
    ["47", "0.0020", "0.0510", "0.0014", "0.0356"],
    ["48", "0.0016", "0.0410", "0.0012", "0.0305"],
    ["49", "0.0012", "0.0310", "0.0011", "0.0279"],
    ["50", "0.0010", "0.0260", "0.0010", "0.0254"],
    ["51", "-", "-", "0.0009", "0.0224"],
    ["52", "-", "-", "0.0008", "0.0198"],
    ["53", "-", "-", "0.0007", "0.0178"],
    ["54", "-", "-", "0.0006", "0.0157"],
    ["55", "-", "-", "0.0006", "0.0140"],
    ["56", "-", "-", "0.0004", "0.0125"]
  ];

  // Temperature Correction Factors Data
  const temperatureCorrectionData = [
    ["5", "1.064", "28", "0.969"],
    ["6", "1.059", "29", "0.965"],
    ["7", "1.055", "30", "0.962"],
    ["8", "1.05", "31", "0.958"],
    ["9", "1.046", "32", "0.954"],
    ["10", "1.042", "33", "0.951"],
    ["11", "1.037", "34", "0.947"],
    ["12", "1.033", "35", "0.943"],
    ["13", "1.029", "36", "0.94"],
    ["14", "1.025", "37", "0.936"],
    ["15", "1.02", "38", "0.933"],
    ["16", "1.016", "39", "0.929"],
    ["17", "1.012", "40", "0.926"],
    ["18", "1.008", "41", "0.923"],
    ["19", "1.004", "42", "0.919"],
    ["20", "1", "43", "0.916"],
    ["21", "0.996", "44", "0.912"],
    ["22", "0.992", "45", "0.909"],
    ["23", "0.988", "46", "0.906"],
    ["24", "0.984", "47", "0.899"],
    ["25", "0.98", "48", "0.896"],
    ["26", "0.977", "49", "0.893"]
  ];

  // Conversional Calculations - state (defaults per screenshots)
  // Length conversion
  const [convLenValL, setConvLenValL] = useState(1.00);
  const [convLenUnitL, setConvLenUnitL] = useState('km');
  const [convLenValR, setConvLenValR] = useState(1000.00);
  const [convLenUnitR, setConvLenUnitR] = useState('m');

  // Length conversion function (equivalent to Google Sheets CONVERT)
  const convertLength = (value, fromUnit, toUnit) => {
    if (!value || value === 0) return 0;
    if (fromUnit === toUnit) return value;

    // Convert to meters first (base unit)
    let valueInMeters = 0;
    switch (fromUnit) {
      case 'km': valueInMeters = value * 1000; break;
      case 'm': valueInMeters = value; break;
      case 'dm': valueInMeters = value * 0.1; break;
      case 'cm': valueInMeters = value * 0.01; break;
      case 'mm': valueInMeters = value * 0.001; break;
      case 'yd': valueInMeters = value * 0.9144; break;
      case 'ft': valueInMeters = value * 0.3048; break;
      case 'in': valueInMeters = value * 0.0254; break;
      default: valueInMeters = value;
    }

    // Convert from meters to target unit
    switch (toUnit) {
      case 'km': return valueInMeters / 1000;
      case 'm': return valueInMeters;
      case 'dm': return valueInMeters / 0.1;
      case 'cm': return valueInMeters / 0.01;
      case 'mm': return valueInMeters / 0.001;
      case 'yd': return valueInMeters / 0.9144;
      case 'ft': return valueInMeters / 0.3048;
      case 'in': return valueInMeters / 0.0254;
      default: return valueInMeters;
    }
  };

  // Calculate length conversion result
  useEffect(() => {
    const result = convertLength(convLenValL, convLenUnitL, convLenUnitR);
    setConvLenValR(result);
  }, [convLenValL, convLenUnitL, convLenUnitR]);

  // Temperature convertor
  const [ktFactor, setKtFactor] = useState(0.980);
  const [ktTemp, setKtTemp] = useState(30);
  const [ktTo20, setKtTo20] = useState(0.943);
  const getTempTo20Factor = (t) => {
    const temp = Number(t);
    const map = {
      5: 1.064, 6: 1.059, 7: 1.055, 8: 1.05, 9: 1.046,
      10: 1.042, 11: 1.037, 12: 1.033, 13: 1.029, 14: 1.025,
      15: 1.02, 16: 1.016, 17: 1.012, 18: 1.008, 19: 1.004,
      20: 1, 21: 0.996, 22: 0.992, 23: 0.988, 24: 0.984,
      25: 0.98, 26: 0.977, 27: 0.973, 28: 0.969, 29: 0.965,
      30: 0.962, 31: 0.958, 32: 0.954, 33: 0.951, 34: 0.947,
      35: 0.943, 36: 0.94, 37: 0.936, 38: 0.933, 39: 0.929,
      40: 0.926, 41: 0.923, 42: 0.919, 43: 0.916, 44: 0.912,
      45: 0.909, 46: 0.906, 47: 0.903, 48: 0.899, 49: 0.896,
      50: 0.893,
    };
    return map.hasOwnProperty(temp) ? map[temp] : 1;
  };
  useEffect(() => {
    const factor = getTempTo20Factor(ktTemp);
    const result = (Number(ktFactor) || 0) * factor;
    setKtTo20(Number.isFinite(result) ? Number(result.toFixed(3)) : 0);
  }, [ktFactor, ktTemp]);

  // Submersible motor selection
  const [subMotorRating, setSubMotorRating] = useState(5.00);
  const [subMotorUnit, setSubMotorUnit] = useState('HP');
  const [subMotorLen, setSubMotorLen] = useState(800);
  const [subMotorLenUnit, setSubMotorLenUnit] = useState('MTR');
  const [subVoltDrop, setSubVoltDrop] = useState(21.50);
  const [subCurrent, setSubCurrent] = useState(7.27);
  const [subActualGauge, setSubActualGauge] = useState(8.08);
  const [subCableSize, setSubCableSize] = useState('10 SQMM');

  // Wire Selection Calculator state (for AB Cable)
  const [wsPhase, setWsPhase] = useState(3);
  const [wsPower, setWsPower] = useState(20.0);
  const [wsPowerUnit, setWsPowerUnit] = useState('HP');
  const [wsLength, setWsLength] = useState(500);
  const [wsLengthUnit, setWsLengthUnit] = useState('MTR');
  
  // Wire Selection Calculator calculations
  const wsCurrent = (() => {
    const power = Number(wsPower) || 0;
    const unit = wsPowerUnit;
    const phase = Number(wsPhase) || 1;
    let powerKw;
    if (unit === 'HP') powerKw = power * 0.746;
    else if (unit === 'WATT') powerKw = power * 0.001;
    else powerKw = power; // KW
    const numerator = powerKw * 1000;
    const phaseFactor = phase === 3 ? 1.732 : 1;
    const denominator = phaseFactor * 0.83 * 0.83 * 430;
    const amps = denominator > 0 ? numerator / denominator : 0;
    return Number.isFinite(amps) ? amps : 0;
  })();
  
  const wsActualGauge = (() => {
    const current = Number(wsCurrent) || 0;
    const phase = Number(wsPhase) || 1;
    const lengthVal = Number(wsLength) || 0;
    const lengthMetersSel = wsLengthUnit === 'FT' ? lengthVal * 0.3048 : lengthVal;
    const phaseFactor = phase === 3 ? 1.732 : 1;
    const option1 = current / 5;
    const option2 = (phaseFactor * current * 17.25 * lengthMetersSel) / ((0.05 * 430) * 1000);
    const result = Math.max(option1, option2);
    return Number.isFinite(result) ? result : 0;
  })();
  
  const wsWireSize = (() => {
    const h = Number(wsActualGauge) || 0;
    if (h <= 0.5) return '0.50 SQMM';
    if (h <= 0.75) return '0.75 SQMM';
    if (h <= 1.5) return '1.5 SQMM';
    if (h <= 2.5) return '2.5 SQMM';
    if (h <= 4) return '4 SQMM';
    if (h <= 6) return '6 SQMM';
    if (h <= 10) return '10 SQMM';
    if (h <= 16) return '16 SQMM';
    if (h <= 25) return '25 SQMM';
    if (h <= 35) return '35 SQMM';
    if (h <= 50) return '50 SQMM';
    if (h <= 70) return '70 SQMM';
    if (h <= 95) return '95 SQMM';
    return 'Above Standard';
  })();

  // Voltage Drop: = 0.05 * (430)
  useEffect(() => {
    setSubVoltDrop(0.05 * 430);
  }, []);

  // Current calculation
  // = ((IF(unit="HP", (0.746*power), IF(unit="WATT", (0.001*power), (1*power))))*1000) / (((1.732))*0.83*0.83*(430))
  useEffect(() => {
    const power = Number(subMotorRating) || 0;
    const unit = String(subMotorUnit || '').toUpperCase();
    let kw = power; // default assume KW
    if (unit === 'HP') kw = 0.746 * power;
    else if (unit === 'WATT') kw = 0.001 * power;
    // total apparent current denominator
    const denom = (1.732) * 0.83 * 0.83 * 430;
    const current = denom !== 0 ? (kw * 1000) / denom : 0;
    setSubCurrent(Number.isFinite(current) ? current : 0);
  }, [subMotorRating, subMotorUnit]);

  // Actual Gauge:
  // IF((S27/5) > ((1.732*S27*17.25*P27)/(R27*1000)), (S27/5), ((1.732*S27*17.25*P27)/(R27*1000)))
  useEffect(() => {
    const S = Number(subCurrent) || 0; // current
    const Praw = Number(subMotorLen) || 0; // length value
    const P = subMotorLenUnit === 'FT' ? Praw * 0.3048 : Praw; // convert to meters if FT
    const R = Number(subVoltDrop) || 0; // voltage drop
    const left = S / 5;
    const rightDen = (R * 1000);
    const right = rightDen !== 0 ? ((1.732) * S * 17.25 * P) / rightDen : 0;
    const result = left > right ? left : right;
    setSubActualGauge(Number.isFinite(result) ? result : 0);
  }, [subCurrent, subMotorLen, subMotorLenUnit, subVoltDrop]);

  // Cable Size:
  // IFS(T27<=0.5, "0.50 SQMM", T27<=0.75, "0.75 SQMM", T27<=1.5, "1.5 SQMM", T27<=2.5, "2.5 SQMM", T27<=4, "4 SQMM", T27<=6, "6 SQMM", T27<=10, "10 SQMM", T27<=16, "16 SQMM", T27<=25, "25 SQMM", T27<=35, "35 SQMM", T27<=50, "50 SQMM", T27<=70, "70 SQMM", T27<=95, "95 SQMM", TRUE, "Above Standard")
  useEffect(() => {
    const T = Number(subActualGauge) || 0;
    let size = "Above Standard";
    if (T <= 0.5) size = "0.50 SQMM";
    else if (T <= 0.75) size = "0.75 SQMM";
    else if (T <= 1.5) size = "1.5 SQMM";
    else if (T <= 2.5) size = "2.5 SQMM";
    else if (T <= 4) size = "4 SQMM";
    else if (T <= 6) size = "6 SQMM";
    else if (T <= 10) size = "10 SQMM";
    else if (T <= 16) size = "16 SQMM";
    else if (T <= 25) size = "25 SQMM";
    else if (T <= 35) size = "35 SQMM";
    else if (T <= 50) size = "50 SQMM";
    else if (T <= 70) size = "70 SQMM";
    else if (T <= 95) size = "95 SQMM";
    setSubCableSize(size);
  }, [subActualGauge]);

  // Armouring covering
  const [armOd, setArmOd] = useState(16.00);
  const [armWireStripOd, setArmWireStripOd] = useState(4.00);
  const [armWidth, setArmWidth] = useState(25.12);
  const [armLay, setArmLay] = useState(256.00);
  const [armCosPhi, setArmCosPhi] = useState(0.9999);
  const [armInnerOd, setArmInnerOd] = useState(8.00);
  const [armCoveringPct, setArmCoveringPct] = useState(100.00);
  const [armNoWires, setArmNoWires] = useState(6);
  // Armoured OD = S36 + O36 + O36 -> inner OD + wire/strip OD + wire/strip OD
  useEffect(() => {
    const od = (Number(armInnerOd) || 0) + (Number(armWireStripOd) || 0) * 2;
    setArmOd(Number.isFinite(od) ? Number(od.toFixed(2)) : 0);
  }, [armInnerOd, armWireStripOd]);
  // Width = COS(RADIANS(COS(R36))) * S36 * 3.14
  useEffect(() => {
    const cosPhiVal = Number(armCosPhi) || 0; // assume this stores COS(Φ)
    const innerOd = Number(armInnerOd) || 0; // S36
    const width = Math.cos((cosPhiVal * Math.PI) / 180) * innerOd * 3.14;
    setArmWidth(Number.isFinite(width) ? Number(width.toFixed(2)) : 0);
  }, [armCosPhi, armInnerOd]);
  // Lay = N36 * 16 -> assume N36 corresponds to Wire/Strip OD
  useEffect(() => {
    const lay = (Number(armWireStripOd) || 0) * 16;
    setArmLay(Number.isFinite(lay) ? Number(lay.toFixed(2)) : 0);
  }, [armWireStripOd]);
  // COS(Φ) = COS(RADIANS(COS(DEGREES(ATAN(ATAN(3.14*S36/Q36))))))
  useEffect(() => {
    const S = Number(armInnerOd) || 0; // S36 -> INNER OD
    const Q = Number(armCoveringPct) || 0; // Q36 -> COVERING % (assumed)
    const base = 3.14 * S / (Q === 0 ? 1 : Q);
    const atan1 = Math.atan(base); // radians
    const atan2 = Math.atan(atan1); // radians
    const degrees = atan2 * (180 / Math.PI); // DEGREES(atan(atan(...)))
    const cosOfDegrees = Math.cos(degrees * (Math.PI / 180)); // COS(DEGREES(...))
    const radiansOfCos = cosOfDegrees * (Math.PI / 180); // RADIANS(COS(...))
    const result = Math.cos(radiansOfCos); // COS(RADIANS(...))
    setArmCosPhi(Number.isFinite(result) ? Number(result.toFixed(4)) : 0);
  }, [armInnerOd, armCoveringPct]);
  // N/O WIRES = P36 * (T36%) / O36 -> width * (covering%/100) / wireStripOd
  useEffect(() => {
    const width = Number(armWidth) || 0;
    const cover = (Number(armCoveringPct) || 0) / 100;
    const od = Number(armWireStripOd) || 1; // avoid div by 0
    const wires = (width * cover) / od;
    const rounded = Math.max(0, Math.round(wires));
    setArmNoWires(Number.isFinite(rounded) ? rounded : 0);
  }, [armWidth, armCoveringPct, armWireStripOd]);

  // Energy conversion
  const [energyValL, setEnergyValL] = useState(1.00);
  const [energyUnitL, setEnergyUnitL] = useState('J');
  const [energyValR, setEnergyValR] = useState(0.0010);
  const [energyUnitR, setEnergyUnitR] = useState('kJ');

  // Energy conversion function (equivalent to Google Sheets CONVERT)
  const convertEnergy = (value, fromUnit, toUnit) => {
    if (!value || value === 0) return 0;
    if (fromUnit === toUnit) return value;

    // Convert to Joules first (base unit)
    let valueInJoules = 0;
    switch (fromUnit) {
      case 'J': valueInJoules = value; break;
      case 'kJ': valueInJoules = value * 1000; break;
      case 'Wh': valueInJoules = value * 3600; break;
      case 'kWh': valueInJoules = value * 3600000; break;
      case 'cal': valueInJoules = value * 4.184; break;
      case 'kcal': valueInJoules = value * 4184; break;
      case 'BTU': valueInJoules = value * 1055.06; break;
      case 'eV': valueInJoules = value * 1.602176634e-19; break;
      case 'MJ': valueInJoules = value * 1000000; break;
      default: valueInJoules = value;
    }

    // Convert from Joules to target unit
    switch (toUnit) {
      case 'J': return valueInJoules;
      case 'kJ': return valueInJoules / 1000;
      case 'Wh': return valueInJoules / 3600;
      case 'kWh': return valueInJoules / 3600000;
      case 'cal': return valueInJoules / 4.184;
      case 'kcal': return valueInJoules / 4184;
      case 'BTU': return valueInJoules / 1055.06;
      case 'eV': return valueInJoules / 1.602176634e-19;
      case 'MJ': return valueInJoules / 1000000;
      default: return valueInJoules;
    }
  };

  // Calculate energy conversion result
  useEffect(() => {
    const result = convertEnergy(energyValL, energyUnitL, energyUnitR);
    setEnergyValR(result);
  }, [energyValL, energyUnitL, energyUnitR]);

  // Power conversion
  const [powerValL, setPowerValL] = useState(1.00);
  const [powerUnitL, setPowerUnitL] = useState('J');
  const [powerValR, setPowerValR] = useState(0.0010);
  const [powerUnitR, setPowerUnitR] = useState('kJ');

  // Power conversion function (equivalent to Google Sheets CONVERT)
  // Note: Power units are the same as energy units (J, kJ, Wh, kWh, cal, kcal, BTU, eV, MJ)
  const convertPower = (value, fromUnit, toUnit) => {
    if (!value || value === 0) return 0;
    if (fromUnit === toUnit) return value;

    // Convert to Joules first (base unit)
    let valueInJoules = 0;
    switch (fromUnit) {
      case 'J': valueInJoules = value; break;
      case 'kJ': valueInJoules = value * 1000; break;
      case 'Wh': valueInJoules = value * 3600; break;
      case 'kWh': valueInJoules = value * 3600000; break;
      case 'cal': valueInJoules = value * 4.184; break;
      case 'kcal': valueInJoules = value * 4184; break;
      case 'BTU': valueInJoules = value * 1055.06; break;
      case 'eV': valueInJoules = value * 1.602176634e-19; break;
      case 'MJ': valueInJoules = value * 1000000; break;
      default: valueInJoules = value;
    }

    // Convert from Joules to target unit
    switch (toUnit) {
      case 'J': return valueInJoules;
      case 'kJ': return valueInJoules / 1000;
      case 'Wh': return valueInJoules / 3600;
      case 'kWh': return valueInJoules / 3600000;
      case 'cal': return valueInJoules / 4.184;
      case 'kcal': return valueInJoules / 4184;
      case 'BTU': return valueInJoules / 1055.06;
      case 'eV': return valueInJoules / 1.602176634e-19;
      case 'MJ': return valueInJoules / 1000000;
      default: return valueInJoules;
    }
  };

  // Calculate power conversion result
  useEffect(() => {
    const result = convertPower(powerValL, powerUnitL, powerUnitR);
    setPowerValR(result);
  }, [powerValL, powerUnitL, powerUnitR]);

  // Copper House Wires calculator state
  const [chwPhase, setChwPhase] = useState(1);
  const [chwPowerVal, setChwPowerVal] = useState(20);
  const [chwPowerUnit, setChwPowerUnit] = useState('HP');
  const [chwLengthVal, setChwLengthVal] = useState(500);
  const [chwLengthUnit, setChwLengthUnit] = useState('MTR');
  const [chwCurrent, setChwCurrent] = useState(50.37);
  const [chwActualGauge, setChwActualGauge] = useState(20.21);
  const [chwWireSize, setChwWireSize] = useState('25 SQMM');

  // CURRENT (Ω) for Copper House Wires:
  // ((IF(unit="HP", 0.746*power, IF(unit="WATT", 0.001*power, 1*power)))*1000) / (((IF(phase=3,1.732,1))*0.83*0.83*(430)))
  useEffect(() => {
    const power = Number(chwPowerVal) || 0;
    const unit = String(chwPowerUnit || '').toUpperCase();
    let kw = power; // assume KW by default
    if (unit === 'HP') kw = 0.746 * power;
    else if (unit === 'WATT') kw = 0.001 * power;
    const phaseFactor = Number(chwPhase) === 3 ? 1.732 : 1;
    const denom = phaseFactor * 0.83 * 0.83 * 430;
    const current = denom !== 0 ? (kw * 1000) / denom : 0;
    setChwCurrent(Number.isFinite(current) ? current : 0);
  }, [chwPowerVal, chwPowerUnit, chwPhase]);

  // ACTUAL GAUGE for Copper House Wires:
  // IF(((S57/5))>(((IF(N57=3,(1.732),1))*S57*17.25*Q57)/((0.05*(430))*1000)),((S57/5)),((((IF(N57=3,(1.732),1))*S57*17.25*Q57)/((0.05*(430))*1000))))
  useEffect(() => {
    const S = Number(chwCurrent) || 0; // current
    const phaseFactor = Number(chwPhase) === 3 ? 1.732 : 1; // IF(N57=3,1.732,1)
    const Qraw = Number(chwLengthVal) || 0; // length value
    const Q = chwLengthUnit === 'FT' ? Qraw * 0.3048 : Qraw; // convert feet to meters
    const denom = (0.05 * 430) * 1000;
    const left = S / 5;
    const right = denom !== 0 ? (phaseFactor * S * 17.25 * Q) / denom : 0;
    const result = left > right ? left : right;
    setChwActualGauge(Number.isFinite(result) ? result : 0);
  }, [chwCurrent, chwPhase, chwLengthVal, chwLengthUnit]);

  // WIRE SIZE mapping based on Actual Gauge (T57)
  useEffect(() => {
    const T = Number(chwActualGauge) || 0;
    let size = "Above Standard";
    if (T <= 0.5) size = "0.50 SQMM";
    else if (T <= 0.75) size = "0.75 SQMM";
    else if (T <= 1.5) size = "1.5 SQMM";
    else if (T <= 2.5) size = "2.5 SQMM";
    else if (T <= 4) size = "4 SQMM";
    else if (T <= 6) size = "6 SQMM";
    else if (T <= 10) size = "10 SQMM";
    else if (T <= 16) size = "16 SQMM";
    else if (T <= 25) size = "25 SQMM";
    else if (T <= 35) size = "35 SQMM";
    else if (T <= 50) size = "50 SQMM";
    else if (T <= 70) size = "70 SQMM";
    else if (T <= 95) size = "95 SQMM";
    setChwWireSize(size);
  }, [chwActualGauge]);

  // Technical Calculations (Helping Calculator) - initial display data
  const [tcReductionPercent, setTcReductionPercent] = useState(20);
  const [tcAerialParams, setTcAerialParams] = useState([
    {
      core: 'PHASE',
      xSelectionArea: '95 SQMM',
      strands: '19',
      wireSize: '2.26 MM',
      selectionalArea: '76 SQMM',
      insulationThickness: '1.60 MM',
      odOfCable: '14.49 MM'
    },
    {
      core: 'ST LIGHT',
      xSelectionArea: '16 SQMM',
      strands: '7',
      wireSize: '1.53 MM',
      selectionalArea: '13 SQMM',
      insulationThickness: '1.30 MM',
      odOfCable: '7.18 MM'
    },
    {
      core: 'MESSENGER',
      xSelectionArea: '70 SQMM',
      strands: '7',
      wireSize: '3.19 MM',
      selectionalArea: '56 SQMM',
      insulationThickness: '1.60 MM',
      odOfCable: '12.78 MM'
    }
  ]);

  const [tcConductorType, setTcConductorType] = useState('AAAC Conductor');
  const [tcStandard, setTcStandard] = useState('IS 398 P-IV');
  const [tcSelectionArea, setTcSelectionArea] = useState('95.00 mm²');
  const [tcCCCAmpsKm, setTcCCCAmpsKm] = useState('');
  const [tcAtCAmp1, setTcAtCAmp1] = useState('');
  const [tcACResistance, setTcACResistance] = useState('');
  const [tcAtCAmp2, setTcAtCAmp2] = useState('');

  // Update Standard (IS code) based on Conductor Type selection
  useEffect(() => {
    const type = String(tcConductorType || '').toLowerCase();
    let standard = tcStandard;
    if (type === 'ab cable' || type === 'aerial bunched cable') {
      standard = 'IS 14255:1995';
    } else if (type === 'aaac conductor' || type === 'aaac') {
      standard = 'IS 398 P-IV';
    } else if (type === 'acsr conductor' || type === 'acsr') {
      standard = 'IS 398 P-II';
    } else if (type === 'copper house wire') {
      standard = 'IS 698:2010';
    } else if (type === 'agricultural wire' || type === 'agricultere wire') {
      standard = 'NA';
    } else if (type === 'submersible flat cable') {
      standard = 'NA';
    }
    setTcStandard(standard);
  }, [tcConductorType]);

  // Helpers for Technical Calculations
  const parseAreaNumber = (val) => {
    const n = Number(String(val || '').replace(/[^\d.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  };
  const computeWireSize = (areaVal, reductionPercent, strandsVal) => {
    const area = parseAreaNumber(areaVal);
    const red = Number(reductionPercent) || 0;
    const strands = Number(String(strandsVal || '').replace(/[^\d.]/g, '')) || 0;
    if (area <= 0 || strands <= 0) return 0;
    const effectiveArea = area - (area * red / 100);
    const value = effectiveArea / strands / 0.785;
    const wire = Math.sqrt(Math.max(value, 0));
    return Number.isFinite(wire) ? wire : 0;
  };

  const computeSelectionalArea = (strandsVal, wireSizeVal) => {
    const strands = Number(String(strandsVal || '').replace(/[^\d.]/g, '')) || 0;
    const wire = Number(wireSizeVal) || 0;
    if (strands <= 0 || wire <= 0) return 0;
    const area = strands * wire * wire * 0.785;
    return Number.isFinite(area) ? area : 0;
  };

  const computeInsulationThickness = (reductionPercent, areaVal) => {
    const d = Number(reductionPercent) || 0; // reduction %
    const c = parseAreaNumber(areaVal); // x-selection area
    let addByReduction = 0;
    if (d >= 10 && d <= 20) addByReduction = 0.1;
    else if (d >= 21 && d <= 30) addByReduction = 0.2;
    else if (d >= 31 && d <= 50) addByReduction = 0.3;
    else if (d === 0) addByReduction = 0;
    let baseByArea = 0;
    if (c >= 0 && c <= 40) baseByArea = 1.2;
    else if (c >= 41 && c <= 95) baseByArea = 1.5;
    else if (c >= 96 && c <= 200) baseByArea = 1.8;
    const total = addByReduction + baseByArea;
    return Number.isFinite(total) ? total : 0;
  };

  // Variant for Street Light row (different area buckets)
  const computeInsulationThicknessStreet = (reductionPercent, areaVal) => {
    const d = Number(reductionPercent) || 0;
    const c = parseAreaNumber(areaVal);
    let addByReduction = 0;
    if (d >= 10 && d <= 20) addByReduction = 0.1;
    else if (d >= 21 && d <= 30) addByReduction = 0.2;
    else if (d >= 31 && d <= 50) addByReduction = 0.3;
    else if (d === 0) addByReduction = 0;
    let baseByArea = 0;
    if (c <= 49) baseByArea = 1.2;
    else if (c <= 120) baseByArea = 1.5;
    const total = addByReduction + baseByArea;
    return Number.isFinite(total) ? total : 0;
  };
  // AB Cable Parameters: NO OF STRANDS - Row 1 (PHASE)
  const phaseNoOfStrands = (() => {
    const areaNum = parseAreaNumber(tcAerialParams?.[0]?.xSelectionArea);
    if (areaNum === 0) return '0';
    if (areaNum < 51) return '7';
    if (areaNum > 51) return '19';
    return '7'; // default when exactly 51
  })();

  // Row 2 (ST LIGHT): IFS(D7=0, "0", D7>10, "7")
  const streetNoOfStrands = (() => {
    const areaNum = parseAreaNumber(tcAerialParams?.[1]?.xSelectionArea);
    if (areaNum === 0) return '0';
    if (areaNum > 10) return '7';
    return '0';
  })();

  // Row 3 (MESSENGER): IFS(D8=0, "0", D8>10, "7")
  const messengerNoOfStrands = (() => {
    const areaNum = parseAreaNumber(tcAerialParams?.[2]?.xSelectionArea);
    if (areaNum === 0) return '0';
    if (areaNum > 10) return '7';
    return '0';
  })();

  // Wire Size of Gauge - Row 1 (PHASE)
  const phaseWireSize = (() => {
    return computeWireSize(tcAerialParams?.[0]?.xSelectionArea, tcReductionPercent, phaseNoOfStrands);
  })();

  // Wire Size of Gauge - Row 2 (ST LIGHT)
  const streetWireSize = (() => {
    return computeWireSize(tcAerialParams?.[1]?.xSelectionArea, tcReductionPercent, streetNoOfStrands);
  })();

  // Wire Size of Gauge - Row 3 (MESSENGER)
  const messengerWireSize = (() => {
    return computeWireSize(tcAerialParams?.[2]?.xSelectionArea, tcReductionPercent, messengerNoOfStrands);
  })();

  // Selectional Area - Rows 1 and 2
  const phaseSelectionalArea = (() => computeSelectionalArea(phaseNoOfStrands, phaseWireSize))();
  const streetSelectionalArea = (() => computeSelectionalArea(streetNoOfStrands, streetWireSize))();
  const messengerSelectionalArea = (() => computeSelectionalArea(messengerNoOfStrands, messengerWireSize))();

  // Insulation Thickness - Row 1 (PHASE)
  const phaseInsulationThickness = (() => computeInsulationThickness(tcReductionPercent, tcAerialParams?.[0]?.xSelectionArea))();
  const streetInsulationThickness = (() => computeInsulationThicknessStreet(tcReductionPercent, tcAerialParams?.[1]?.xSelectionArea))();
  const messengerInsulationThickness = (() => computeInsulationThicknessStreet(tcReductionPercent, tcAerialParams?.[2]?.xSelectionArea))();

  // OD of Cable helper
  const computeOdOfCable = (strandsVal, wireSizeVal, insulationThicknessVal) => {
    const strands = String(strandsVal || '').trim();
    const wire = Number(wireSizeVal) || 0;
    const ins = Number(insulationThicknessVal) || 0;
    let multiplier = 0;
    if (strands === '19') multiplier = 5;
    else if (strands === '7') multiplier = 3;
    const od = multiplier * wire + ins * 2;
    return Number.isFinite(od) ? od : 0;
  };

  // Row 1 OD of Cable
  const phaseOdOfCable = (() => computeOdOfCable(phaseNoOfStrands, phaseWireSize, phaseInsulationThickness))();
  // Row 2 OD of Cable
  const streetOdOfCable = (() => computeOdOfCable(streetNoOfStrands, streetWireSize, streetInsulationThickness))();
  // Row 3 OD of Cable
  const messengerOdOfCable = (() => computeOdOfCable(messengerNoOfStrands, messengerWireSize, messengerInsulationThickness))();

  // Technical Calculations - AAAC & ACSR parameter blocks
  const aaacOptions = [
    { name: 'Mole', code: 'Mole', area: '15 mm²', strandDia: '3/2.50', dcResistance: '(N) 2.2286' },
    { name: 'Squirrel', code: 'Squirrel', area: '20 mm²', strandDia: '7/2.00', dcResistance: '(N) 1.4969' },
    { name: 'Weasel', code: 'Weasel', area: '34 mm²', strandDia: '7/2.50', dcResistance: '(N) 0.9580' },
    { name: 'Rabbit', code: 'Rabbit', area: '55 mm²', strandDia: '7/3.15', dcResistance: '(N) 0.6034' },
    { name: 'Raccoon', code: 'Raccoon', area: '80 mm²', strandDia: '7/3.81', dcResistance: '(N) 0.4125' },
    { name: 'Dog', code: 'Dog', area: '100 mm²', strandDia: '7/4.26', dcResistance: '(N) 0.3299' },
    { name: 'Dog(UP)', code: 'Dog(UP)', area: '125 mm²', strandDia: '19/2.89', dcResistance: '(N) 0.2654' },
    { name: 'Coyote', code: 'Coyote', area: '150 mm²', strandDia: '19/3.15', dcResistance: '(N) 0.2234' },
    { name: 'Wolf', code: 'Wolf', area: '175 mm²', strandDia: '19/3.40', dcResistance: '(N) 0.1918' },
    { name: 'Wolf(UP)', code: 'Wolf(UP)', area: '200 mm²', strandDia: '19/3.66', dcResistance: '(N) 0.1655' },
    { name: 'Panther', code: 'Panther', area: '232 mm²', strandDia: '19/3.94', dcResistance: '(N) 0.1428' },
    { name: 'Panther(UP)', code: 'Panther(UP)', area: '290 mm²', strandDia: '37/3.15', dcResistance: '(N) 0.11500' },
    { name: 'Kundah', code: 'Kundah', area: '400 mm²', strandDia: '37/3.71', dcResistance: '(N) 0.08289' },
    { name: 'Zebra', code: 'Zebra', area: '465 mm²', strandDia: '37/4.00', dcResistance: '(N) 0.07130' },
    { name: 'Zebra(UP)', code: 'Zebra(UP)', area: '525 mm²', strandDia: '61/3.31', dcResistance: '(N) 0.06330' },
    { name: 'Moose', code: 'Moose', area: '570 mm²', strandDia: '61/3.45', dcResistance: '(N) 0.05827' }
  ];
  const [aaacSelected, setAaacSelected] = useState('Mole');
  const aaacCurrent = aaacOptions.find(o => o.name === aaacSelected) || aaacOptions[0];

  const acsrOptions = [
    { name: 'Mole', code: 'Mole', area: '10 mm²', alStrandDia: '6/1.50', steelStrandDia: '1/1.50', dcResistance20: '2.780' },
    { name: 'Squirrel', code: 'Squirrel', area: '20 mm²', alStrandDia: '6/1.96', steelStrandDia: '1/1.96', dcResistance20: '1.394' },
    { name: 'Weasel', code: 'Weasel', area: '30 mm²', alStrandDia: '6/2.59', steelStrandDia: '1/2.59', dcResistance20: '0.929' },
    { name: 'Rabbit', code: 'Rabbit', area: '50 mm²', alStrandDia: '6/3.35', steelStrandDia: '1/3.35', dcResistance20: '0.552' },
    { name: 'Raccoon', code: 'Raccoon', area: '80 mm²', alStrandDia: '6/4.09', steelStrandDia: '1/4.09', dcResistance20: '0.371' },
    { name: 'Dog', code: 'Dog', area: '100 mm²', alStrandDia: '6/4.72', steelStrandDia: '7/1.57', dcResistance20: '0.279' },
    { name: 'Coyote', code: 'Coyote', area: '130 mm²', alStrandDia: '26/2.54', steelStrandDia: '7/1.91', dcResistance20: '0.225' },
    { name: 'Wolf', code: 'Wolf', area: '150 mm²', alStrandDia: '30/2.59', steelStrandDia: '7/2.59', dcResistance20: '0.187' },
    { name: 'Lynx', code: 'Lynx', area: '180 mm²', alStrandDia: '30/2.79', steelStrandDia: '7/2.79', dcResistance20: '0.161' },
    { name: 'Panther', code: 'Panther', area: '200 mm²', alStrandDia: '30/3.00', steelStrandDia: '7/3.00', dcResistance20: '0.139' },
    { name: 'Goat', code: 'Goat', area: '320 mm²', alStrandDia: '30/3.71', steelStrandDia: '7/3.71', dcResistance20: '0.091' },
    { name: 'Kundah', code: 'Kundah', area: '400 mm²', alStrandDia: '42/3.50', steelStrandDia: '7/1.96', dcResistance20: '0.073' },
    { name: 'Zebra', code: 'Zebra', area: '420 mm²', alStrandDia: '54/3.18', steelStrandDia: '7/3.18', dcResistance20: '0.069' },
    { name: 'Moose', code: 'Moose', area: '520 mm²', alStrandDia: '54/3.53', steelStrandDia: '7/3.53', dcResistance20: '0.056' },
    { name: 'Morkulla', code: 'Morkulla', area: '560 mm²', alStrandDia: '42/4.13', steelStrandDia: '7/2.30', dcResistance20: '0.052' },
    { name: 'Bersimis', code: 'Bersimis', area: '690 mm²', alStrandDia: '42/4.57', steelStrandDia: '7/2.54', dcResistance20: '0.042' }
  ];
  const [acsrSelected, setAcsrSelected] = useState('Rabbit');
  const acsrCurrent = acsrOptions.find(o => o.name === acsrSelected) || acsrOptions[0];

  // Handler functions for sidebar
  const openBusinessCard = () => {
    setIsBusinessCardModalOpen(true);
  };

  const openBrochure = () => {
    const pdfUrl = `${window.location.origin}/pdf/Anocab brochure.pdf`;
    const newWindow = window.open(pdfUrl, '_blank');
    if (!newWindow) {
      alert('Please allow pop-ups for this site to view the brochure');
    }
  };

  const openCompanyEmails = () => {
    setIsCompanyEmailsModalOpen(true);
  };

  const openApprovals = () => {
    setIsApprovalsModalOpen(true);
  };

  const closeApprovals = () => {
    setIsApprovalsModalOpen(false);
  };

  const openApprovalPdf = (stateName) => {
    const pdfMappings = {
      'CHHATTISGARH': 'CHHATTISGARH approval.pdf',
      'MADHYA PRADESH': 'MP approval.pdf',
      'MAHARASHTRA': 'MAHARASHTRA approval.pdf'
    };
    const pdfUrl = `${window.location.origin}/pdf/${pdfMappings[stateName]}`;
    const newWindow = window.open(pdfUrl, '_blank');
    if (!newWindow) {
      alert('Please allow pop-ups for this site to view the approval');
    }
  };

  const openLicense = () => {
    setShowDataUpcoming(true);
  };

  const openSamriddhiBusinessCard = () => {
    setIsSamriddhiBusinessCardModalOpen(true);
  };

  const closeSamriddhiBusinessCard = () => {
    setIsSamriddhiBusinessCardModalOpen(false);
  };

  const downloadSamriddhiBusinessCard = async (format = 'pdf') => {
    if (!samriddhiBusinessCardRef.current) return;
    // Same download logic as Anocab business card
    try {
      const cardElement = samriddhiBusinessCardRef.current;
      await new Promise(resolve => setTimeout(resolve, 100));
      if (format === 'pdf') {
        const opt = {
          margin: [0, 0, 0, 0],
          filename: 'samriddhi-business-card.pdf',
          image: { type: 'jpeg', quality: 1.0 },
          html2canvas: { 
            scale: 3,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            letterRendering: true,
            width: cardElement.offsetWidth,
            height: cardElement.offsetHeight,
            scrollX: 0,
            scrollY: 0
          },
          jsPDF: { 
            unit: 'px', 
            format: [cardElement.offsetWidth, cardElement.offsetHeight],
            orientation: cardElement.offsetWidth > cardElement.offsetHeight ? 'landscape' : 'portrait',
            compress: false
          }
        };
        await html2pdf().set(opt).from(cardElement).save();
      } else if (format === 'image') {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(cardElement, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          letterRendering: true,
          width: cardElement.offsetWidth,
          height: cardElement.offsetHeight
        });
        const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.download = 'samriddhi-business-card.jpg';
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading Samriddhi business card:', error);
      alert('Failed to download business card. Please try again.');
    }
  };

  const downloadBusinessCard = async (format = 'pdf') => {
    if (!businessCardRef.current) return;

    try {
      const cardElement = businessCardRef.current;
      
      // Wait a bit to ensure all images are loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (format === 'pdf') {
        // Download as PDF - capture card exactly as displayed
        const opt = {
          margin: [0, 0, 0, 0],
          filename: 'business-card.pdf',
          image: { type: 'jpeg', quality: 1.0 },
          html2canvas: { 
            scale: 3,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            letterRendering: true,
            width: cardElement.offsetWidth,
            height: cardElement.offsetHeight,
            scrollX: 0,
            scrollY: 0
          },
          jsPDF: { 
            unit: 'px', 
            format: [cardElement.offsetWidth, cardElement.offsetHeight],
            orientation: cardElement.offsetWidth > cardElement.offsetHeight ? 'landscape' : 'portrait',
            compress: false
          }
        };
        
        await html2pdf().set(opt).from(cardElement).save();
      } else if (format === 'image') {
        // Download as image - use html2canvas directly for better quality
        try {
          // Dynamically import html2canvas
          const html2canvas = (await import('html2canvas')).default;
          
          const canvas = await html2canvas(cardElement, {
            scale: 3,
            useCORS: true,
            allowTaint: false,
            backgroundColor: '#ffffff',
            logging: false,
            letterRendering: true,
            width: cardElement.offsetWidth,
            height: cardElement.offsetHeight,
            scrollX: 0,
            scrollY: 0,
            windowWidth: cardElement.offsetWidth,
            windowHeight: cardElement.offsetHeight
          });
          
          // Convert canvas to image
          const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
          
          // Create download link
          const link = document.createElement('a');
          link.download = 'business-card.jpg';
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error('Image download error:', error);
          // Fallback: use html2pdf to generate canvas
          const opt = {
            margin: [0, 0, 0, 0],
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
              scale: 3,
              useCORS: true,
              backgroundColor: '#ffffff',
              logging: false,
              width: cardElement.offsetWidth,
              height: cardElement.offsetHeight
            },
            jsPDF: { 
              unit: 'px', 
              format: [cardElement.offsetWidth, cardElement.offsetHeight]
            }
          };
          
          html2pdf().set(opt).from(cardElement).outputImg('dataurlstring').then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'business-card.jpg';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }).catch((err) => {
            console.error('Fallback image download failed:', err);
            alert('Failed to download image. Please try again.');
          });
        }
      }
    } catch (error) {
      console.error('Error downloading business card:', error);
      alert('Failed to download business card. Please try again.');
    }
  };

  const locations = [
    {
      name: "IT Park, Jabalpur",
      address: "Plot No 10, IT Park, Bargi Hills, Jabalpur, M.P."
    },
    {
      name: "Dadda Nagar",
      address: "Ward no. 73 in front of Dadda Nagar, Karmeta Road, Jabalpur, M.P."
    }
  ];

  // Product data matching the desktop toolbox interface
  const products = [
    { name: "Aerial Bunch Cable", description: "Overhead power distribution cable", imageUrl: "/images/products/aerial bunch cable.jpeg" },
    { name: "Aluminium Conductor Galvanized Steel Reinforced", description: "ACSR conductor for transmission lines", imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
    { name: "All Aluminium Alloy Conductor", description: "AAAC conductor for overhead lines", imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
    { name: "PVC Insulated Submersible Cable", description: "Water-resistant submersible cable", imageUrl: "/images/products/pvc insulated submersible cable.jpeg" },
    { name: "Paper Cover Aluminium Conductor", description: "Traditional paper insulated conductor", imageUrl: "/images/products/paper covered aluminium conductor.jpeg" },
    { name: "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable", description: "Single core power cable with PVC insulation", imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg" },
    { name: "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable", description: "Single core power cable with XLPE insulation", imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg" },
    { name: "Multi Core PVC Insulated Aluminium Armoured Cable", description: "Multi-core power cable with aluminium armour", imageUrl: "/images/products/multi core pvc isulated aluminium armoured cable.jpeg" },
    { name: "Multi Core XLPE Insulated Aluminium Armoured Cable", description: "Multi-core XLPE cable with aluminium armour", imageUrl: "/images/products/multi core xlpe insulated aluminium armoured cable.jpeg" },
    { name: "Multi Core PVC Insulated Aluminium Unarmoured Cable", description: "Multi-core PVC cable without armour", imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg" },
    { name: "Multi Core XLPE Insulated Aluminium Unarmoured Cable", description: "Multi-core XLPE cable without armour", imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg" },
    { name: "Multistrand Single Core Copper Cable", description: "Flexible single core copper cable", imageUrl: "/images/products/multistrand single core copper cable.jpeg" },
    { name: "Multi Core Copper Cable", description: "Multi-core copper power cable", imageUrl: "/images/products/multi core copper cable.jpeg" },
    { name: "PVC Insulated Single Core Aluminium Cable", description: "Single core aluminium cable with PVC insulation", imageUrl: "/images/products/pvc insulated single core aluminium cables.jpeg" },
    { name: "PVC Insulated Multicore Aluminium Cable", description: "Multi-core aluminium cable with PVC insulation", imageUrl: "/images/products/pvc insulated multicore aluminium cable.jpeg" },
    { name: "Submersible Winding Wire", description: "Specialized winding wire for submersible applications", imageUrl: "/images/products/submersible winding wire.jpeg" },
    { name: "Twin Twisted Copper Wire", description: "Twisted pair copper wire", imageUrl: "/images/products/twin twisted copper wire.jpeg" },
    { name: "Speaker Cable", description: "Audio speaker connection cable", imageUrl: "/images/products/speaker cable.jpeg" },
    { name: "CCTV Cable", description: "Closed-circuit television cable", imageUrl: "/images/products/cctv cable.jpeg" },
    { name: "LAN Cable", description: "Local area network cable", imageUrl: "/images/products/telecom switch board cables.jpeg" },
    { name: "Automobile Cable", description: "Automotive electrical cable", imageUrl: "/images/products/automobile wire.jpeg" },
    { name: "PV Solar Cable", description: "Photovoltaic solar panel cable", imageUrl: "/images/products/pv solar cable.jpeg" },
    { name: "Co Axial Cable", description: "Coaxial transmission cable", imageUrl: "/images/products/co axial cable.jpeg" },
    { name: "Uni-tube Unarmoured Optical Fibre Cable", description: "Single tube optical fibre cable", imageUrl: "/images/products/unitube unarmoured optical fibre cable.jpeg" },
    { name: "Armoured Unarmoured PVC Insulated Copper Control Cable", description: "Control cable for industrial applications", imageUrl: "/images/products/armoured unarmoured pvc insulated copper control cable.jpeg" },
    { name: "Telecom Switch Board Cables", description: "Telecommunications switchboard cable", imageUrl: "/images/products/telecom switch board cables.jpeg" }
  ];

  const categories = [
    { id: 'all', label: 'All Products', count: products.length },
    { id: 'cables', label: 'Cables', count: products.filter(p => p.name.toLowerCase().includes('cable')).length },
    { id: 'conductors', label: 'Conductors', count: products.filter(p => p.name.toLowerCase().includes('conductor')).length },
    { id: 'wires', label: 'Wires', count: products.filter(p => p.name.toLowerCase().includes('wire')).length }
  ];

  // Price list for Aerial Bunch Cable (mobile view)
  const abPriceList = [
    { size: 'AB CABLE 3CX16+1CX16+1CX25 SQMM', price: '', stock: '', image: '' },
    { size: 'AB CABLE 3CX25+1CX16+1CX25 SQMM', price: '', stock: '', image: '' },
    { size: 'AB CABLE 3CX35+1CX16+1CX25 SQMM', price: '', stock: '', image: '' },
    { size: 'AB CABLE 3CX50+1CX16+1CX35 SQMM', price: '', stock: '', image: '' },
    { size: 'AB CABLE 3CX70+1CX16+1CX50 SQMM', price: '', stock: '', image: '' },
    { size: 'AB CABLE 3CX95+1CX16+1CX70 SQMM', price: '', stock: '', image: '' },
    { size: 'AB CABLE 3CX120+1CX16+1CX95 SQMM', price: '', stock: '', image: '' },
  ];

  // Price list for ACSR Conductor (mobile view)
  const acsrPriceList = [
    { size: '10 SQMM', price: '', stock: '', image: '' },
    { size: '18 SQMM', price: '', stock: '', image: '' },
    { size: '20 SQMM', price: '', stock: '', image: '' },
    { size: '30 SQMM', price: '', stock: '', image: '' },
    { size: '50 SQMM', price: '', stock: '', image: '' },
    { size: '80 SQMM', price: '', stock: '', image: '' },
    { size: '100 SQMM', price: '', stock: '', image: '' },
  ];

  // Technical Tables data for Aerial Bunch Cable
  const abTechnicalTables = {
    note: "THE SIZE OF THE STREET LIGHT CONDUCTOR SHALL BE 16 SQMM UPTO 95 SQMM",
    tables: [
      {
        title: "PHASE Φ",
        columns: [
          "CROSS SECTIONAL AREA OF PHASE CONDUCTOR (SQMM)",
          "STRANDS/WIRE (nos/mm)",
          "CONDUCTOR DIA (mm)",
          "INSULATION THICKNESS (mm)",
          "INSULATED CORE DIA (mm)",
          "MAXIMUM RESISTANCE (Ohm/Km) @20°C"
        ],
        rows: [
          { sqmm: "16", strands: "7/1.70", conductorDia: "5.10", insulationThickness: "1.20", insulatedCoreDia: "7.50", maxResistance: "1.910" },
          { sqmm: "25", strands: "7/2.12", conductorDia: "6.36", insulationThickness: "1.20", insulatedCoreDia: "8.76", maxResistance: "1.200" },
          { sqmm: "35", strands: "7/2.52", conductorDia: "7.56", insulationThickness: "1.20", insulatedCoreDia: "9.96", maxResistance: "0.868" },
          { sqmm: "50", strands: "7/3.02", conductorDia: "9.06", insulationThickness: "1.50", insulatedCoreDia: "12.06", maxResistance: "0.641" },
          { sqmm: "70", strands: "19/2.17", conductorDia: "10.85", insulationThickness: "1.50", insulatedCoreDia: "13.85", maxResistance: "0.443" },
          { sqmm: "95", strands: "19/2.52", conductorDia: "12.60", insulationThickness: "1.50", insulatedCoreDia: "15.60", maxResistance: "0.320" }
        ]
      },
      {
        title: "MESSENGER Φ",
        columns: [
          "CROSS SECTIONAL AREA OF MESSENGER (SQMM)",
          "STRANDS/WIRE (nos/mm)",
          "CONDUCTOR DIA (mm)",
          "INSULATION THICKNESS (mm)",
          "MAXIMUM RESISTANCE (Ohm/Km) @20°C",
          "MAXIMUM BREAKING LOAD (kN)"
        ],
        rows: [
          { sqmm: "25", strands: "7/2.12", conductorDia: "6.36", insulationThickness: "1.20", maxResistance: "1.380", maxBreakingLoad: "7.560" },
          { sqmm: "35", strands: "7/2.52", conductorDia: "7.56", insulationThickness: "1.20", maxResistance: "0.986", maxBreakingLoad: "8.760" },
          { sqmm: "50", strands: "7/3.02", conductorDia: "9.06", insulationThickness: "1.50", maxResistance: "0.689", maxBreakingLoad: "10.560" },
          { sqmm: "70", strands: "7/3.57", conductorDia: "10.71", insulationThickness: "1.50", maxResistance: "0.492", maxBreakingLoad: "12.210" }
        ]
      }
    ]
  };

  // Price list for AAAC Conductor (mobile view)
  const aaacPriceList = [
    { conductorCode: 'Mole', size: '15 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Squirrel', size: '20 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Weasel', size: '34 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Rabbit', size: '55 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Raccoon', size: '80 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Dog', size: '100 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Dog(up)', size: '125 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Coyote', size: '150 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Wolf', size: '175 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Wolf(up)', size: '200 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Panther', size: '232 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Panther (up)', size: '290 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Panther (up)', size: '345 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Kundah', size: '400 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Zebra', size: '465 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Zebra (up)', size: '525 SQMM', price: '', stock: '', image: '' },
    { conductorCode: 'Moose', size: '570 SQMM', price: '', stock: '', image: '' },
  ];

  // Price list for PVC Insulated Submersible Cable (mobile view)
  const pvcSubmersiblePriceList = [
    { size: '1.5 SQMM', price: '', stock: '', image: '' },
    { size: '2.5 SQMM', price: '', stock: '', image: '' },
    { size: '4 SQMM', price: '', stock: '', image: '' },
    { size: '6 SQMM', price: '', stock: '', image: '' },
    { size: '10 SQMM', price: '', stock: '', image: '' },
    { size: '16 SQMM', price: '', stock: '', image: '' },
    { size: '25 SQMM', price: '', stock: '', image: '' },
    { size: '35 SQMM', price: '', stock: '', image: '' },
    { size: '50 SQMM', price: '', stock: '', image: '' },
    { size: '70 SQMM', price: '', stock: '', image: '' },
    { size: '95 SQMM', price: '', stock: '', image: '' },
  ];

  // Price list for Multistrand Single Core Copper Cable (mobile view)
  const multistrandSingleCorePriceList = [
    { size: '0.5 SQMM (16/0.20 | 16/0.00788)', price: '', stock: '', image: '' },
    { size: '0.75 SQMM (24/0.20 | 24/0.00788)', price: '', stock: '', image: '' },
    { size: '1 SQMM (32/0.20 | 32/0.00788)', price: '', stock: '', image: '' },
    { size: '1.5 SQMM (30/0.25 | 30/0.00985)', price: '', stock: '', image: '' },
    { size: '2.5 SQMM (50/0.25 | 50/0.00985)', price: '', stock: '', image: '' },
    { size: '4 SQMM (56/0.30 | 56/0.01181)', price: '', stock: '', image: '' },
    { size: '6 SQMM (84/0.30 | 84/0.01181)', price: '', stock: '', image: '' },
  ];

  // Price list for Multi Core Copper Cable (mobile view)
  const multiCoreCopperPriceList = [
    { size: '0.5 SQMM (16/0.20 | 16/0.00788)', price: '', stock: '', image: '' },
    { size: '0.75 SQMM (24/0.20 | 24/0.00788)', price: '', stock: '', image: '' },
    { size: '1 SQMM (32/0.20 | 32/0.00788)', price: '', stock: '', image: '' },
    { size: '1.5 SQMM (30/0.25 | 30/0.00985)', price: '', stock: '', image: '' },
    { size: '2.5 SQMM (50/0.25 | 50/0.00985)', price: '', stock: '', image: '' },
    { size: '4 SQMM (56/0.30 | 56/0.01181)', price: '', stock: '', image: '' },
    { size: '6 SQMM (84/0.30 | 84/0.01181)', price: '', stock: '', image: '' },
    { size: '10 SQMM (80/0.40 | 80/0.01575)', price: '', stock: '', image: '' },
  ];

  // Price list for PVC Insulated Single Core Aluminium Cable (mobile view)
  const pvcSingleAlPriceList = [
    { size: '4 SQMM (Ø 2.25 mm | 13 SWG | 0.088 in)', price: '', stock: '', image: '' },
    { size: '6 SQMM (Ø 2.76 mm | 11 SWG | 0.108 in)', price: '', stock: '', image: '' },
    { size: '> 8 SQMM (Ø 3.02 mm | 10 SWG | 0.12 in)', price: '', stock: '', image: '' },
    { size: '10 SQMM (Ø 3.56 mm | 9 SWG | 0.14 in)', price: '', stock: '', image: '' },
    { size: '4 SQMM (7/0.85 | 7/20 | 7/0.034)', price: '', stock: '', image: '' },
    { size: '6 SQMM (7/1.05 | 7/18 | 7/0.042)', price: '', stock: '', image: '' },
    { size: '10 SQMM (7/1.35 | 7/16 | 7/0.054)', price: '', stock: '', image: '' },
  ];

  // Price list for PVC Insulated Multicore Aluminium Cable (mobile view)
  const pvcMulticoreAlPriceList = [
    { size: '2.5 SQMM (Ø 1.78 mm | 0.070 in)', price: '', stock: '', image: '' },
    { size: '4 SQMM (Ø 2.25 mm | 0.088 in)', price: '', stock: '', image: '' },
    { size: '6 SQMM (Ø 2.76 mm | 0.108 in)', price: '', stock: '', image: '' },
    { size: '10 SQMM (Ø 3.56 mm | 0.140 in)', price: '', stock: '', image: '' },
    { size: '16 SQMM (Ø 4.51 mm | 0.177 in)', price: '', stock: '', image: '' },
  ];

  // Price list for Twin Twisted Copper Wire (mobile view)
  const twinTwistedPriceList = [
    { size: '0.5 SQMM (16/0.20 | 16/0.00788)', price: '', stock: '', image: '' },
    { size: '0.75 SQMM (24/0.20 | 24/0.00788)', price: '', stock: '', image: '' },
    { size: '1 SQMM (32/0.20 | 32/0.00788)', price: '', stock: '', image: '' },
    { size: '1.5 SQMM (30/0.25 | 30/0.00985)', price: '', stock: '', image: '' },
    { size: '2.5 SQMM (50/0.25 | 50/0.00985)', price: '', stock: '', image: '' },
    { size: '4 SQMM (56/0.30 | 56/0.01181)', price: '', stock: '', image: '' },
    { size: '6 SQMM (84/0.30 | 84/0.01181)', price: '', stock: '', image: '' },
  ];

  // Price list for Speaker Cable (mobile view)
  const speakerPriceList = [
    { size: '0.5 SQMM (16/0.20 | 16/0.00788)', price: '', stock: '', image: '' },
    { size: '0.75 SQMM (24/0.20 | 24/0.00788)', price: '', stock: '', image: '' },
    { size: '1 SQMM (32/0.20 | 32/0.00788)', price: '', stock: '', image: '' },
    { size: '1.5 SQMM (30/0.25 | 30/0.00985)', price: '', stock: '', image: '' },
  ];

  // Price list for CCTV Cable (mobile view)
  const cctvPriceList = [
    { size: 'CCTV 3+1 | Co-ax RG-59 | 84/0.01181 | CR@20°C 3.550 Ω/km', price: '', stock: '', image: '' },
    { size: 'CCTV 4+1 | Co-ax RG-59 | 84/0.01181 | CR@20°C 3.550 Ω/km', price: '', stock: '', image: '' },
  ];

  // Price list for LAN Cable (mobile view)
  const lanPriceList = [
    { size: 'CAT-5 4 Pair (1/0.574 mm)', price: '', stock: '', image: '' },
    { size: 'CAT-6 4 Pair (1/0.574 mm)', price: '', stock: '', image: '' },
  ];

  // Price list for Automobile Cable (mobile view)
  const automobilePriceList = [
    { size: '0.35 SQMM (12/0.20)', price: '', stock: '', image: '' },
    { size: '0.5 SQMM (16/0.20)', price: '', stock: '', image: '' },
    { size: '0.75 SQMM (24/0.20)', price: '', stock: '', image: '' },
    { size: '1 SQMM (32/0.20)', price: '', stock: '', image: '' },
    { size: '1.5 SQMM (30/0.25)', price: '', stock: '', image: '' },
    { size: '2.5 SQMM (50/0.25)', price: '', stock: '', image: '' },
    { size: '4 SQMM (56/0.30)', price: '', stock: '', image: '' },
    { size: '6 SQMM (84/0.30)', price: '', stock: '', image: '' },
  ];

  // Price list for PV Solar Cable (mobile view)
  const pvSolarPriceList = [
    { size: '1.5 SQMM (30/0.25)', price: '', stock: '', image: '' },
    { size: '2.5 SQMM (50/0.25)', price: '', stock: '', image: '' },
    { size: '4 SQMM (56/0.30)', price: '', stock: '', image: '' },
    { size: '6 SQMM (84/0.30)', price: '', stock: '', image: '' },
    { size: '10 SQMM (80/0.40)', price: '', stock: '', image: '' },
    { size: '16 SQMM (126/0.40)', price: '', stock: '', image: '' },
    { size: '25 SQMM (196/0.40)', price: '', stock: '', image: '' },
    { size: '35 SQMM (276/0.40)', price: '', stock: '', image: '' },
    { size: '50 SQMM (396/0.40)', price: '', stock: '', image: '' },
  ];

  // Price list for Co Axial Cable (mobile view)
  const coAxialPriceList = [
    { size: 'RG59 (1/0.80 mm)', price: '', stock: '', image: '' },
    { size: 'RG6 (1/1.02 mm)', price: '', stock: '', image: '' },
    { size: 'RG11 (1/1.63 mm)', price: '', stock: '', image: '' },
  ];

  // Price list for Uni-tube Unarmoured Optical Fibre Cable (mobile view)
  const unitubeOpticalPriceList = [
    { size: '2 Fibre (FRP Ø 0.8 mm)', price: '', stock: '', image: '' },
    { size: '4 Fibre (FRP Ø 0.8 mm)', price: '', stock: '', image: '' },
    { size: '6 Fibre (FRP Ø 0.8 mm)', price: '', stock: '', image: '' },
    { size: '12 Fibre (FRP Ø 0.8 mm)', price: '', stock: '', image: '' },
  ];

  // Price list for Armoured Unarmoured PVC Insulated Copper Control Cable (mobile view)
  const controlCopperPriceList = [
    { size: '2C×1.5 (Ground 26A | Air 24A)', price: '', stock: '', image: '' },
    { size: '3C×1.5 (Ground 24A | Air 20A)', price: '', stock: '', image: '' },
    { size: '4C×1.5 (Ground 24A | Air 20A)', price: '', stock: '', image: '' },
    { size: '5C×1.5 (Ground 18A | Air 17A)', price: '', stock: '', image: '' },
    { size: '6C×1.5 (Ground 17A | Air 16A)', price: '', stock: '', image: '' },
    { size: '7C×1.5 (Ground 16A | Air 16A)', price: '', stock: '', image: '' },
    { size: '8C×1.5 (Ground 16A | Air 14A)', price: '', stock: '', image: '' },
    { size: '9C×1.5 (Ground 15A | Air 14A)', price: '', stock: '', image: '' },
    { size: '10C×1.5 (Ground 15A | Air 13A)', price: '', stock: '', image: '' },
    { size: '12C×1.5 (Ground 14A | Air 12A)', price: '', stock: '', image: '' },
    { size: '14C×1.5 (Ground 13A | Air 12A)', price: '', stock: '', image: '' },
    { size: '16C×1.5 (Ground 13A | Air 11A)', price: '', stock: '', image: '' },
    { size: '19C×1.5 (Ground 11A | Air 11A)', price: '', stock: '', image: '' },
    { size: '21C×1.5 (Ground 11A | Air 10A)', price: '', stock: '', image: '' },
    { size: '24C×1.5 (Ground 10A | Air 10A)', price: '', stock: '', image: '' },
    { size: '2C×2.5 (Ground 36A | Air 32A)', price: '', stock: '', image: '' },
    { size: '3C×2.5 (Ground 31A | Air 29A)', price: '', stock: '', image: '' },
    { size: '4C×2.5 (Ground 31A | Air 29A)', price: '', stock: '', image: '' },
    { size: '5C×2.5 (Ground 26A | Air 23A)', price: '', stock: '', image: '' },
    { size: '6C×2.5 (Ground 24A | Air 22A)', price: '', stock: '', image: '' },
    { size: '7C×2.5 (Ground 23A | Air 20A)', price: '', stock: '', image: '' },
    { size: '8C×2.5 (Ground 22A | Air 19A)', price: '', stock: '', image: '' },
    { size: '9C×2.5 (Ground 21A | Air 18A)', price: '', stock: '', image: '' },
    { size: '10C×2.5 (Ground 21A | Air 18A)', price: '', stock: '', image: '' },
    { size: '12C×2.5 (Ground 19A | Air 17A)', price: '', stock: '', image: '' },
    { size: '14C×2.5 (Ground 18A | Air 17A)', price: '', stock: '', image: '' },
    { size: '16C×2.5 (Ground 17A | Air 16A)', price: '', stock: '', image: '' },
    { size: '19C×2.5 (Ground 16A | Air 14A)', price: '', stock: '', image: '' },
    { size: '21C×2.5 (Ground 15A | Air 13A)', price: '', stock: '', image: '' },
    { size: '24C×2.5 (Ground 15A | Air 13A)', price: '', stock: '', image: '' },
  ];

  // Price list for Multi Core PVC Insulated Aluminium Unarmoured Cable (mobile view)
  const multiCorePvcUnarmouredPriceList = [
    { size: '2.5 sq.mm (Ø 1.78 mm | 0.070 in)', price: '', stock: '', image: '' },
    { size: '4 sq.mm (Ø 2.25 mm | 0.088 in)', price: '', stock: '', image: '' },
    { size: '6 sq.mm (Ø 2.76 mm | 0.108 in)', price: '', stock: '', image: '' },
    { size: '10 sq.mm (Ø 3.56 mm | 0.140 in)', price: '', stock: '', image: '' },
    { size: '16 sq.mm (7/1.71 mm | 7/0.067 in)', price: '', stock: '', image: '' },
    { size: '25 sq.mm (7/2.13 mm | 7/0.084 in)', price: '', stock: '', image: '' },
    { size: '35 sq.mm (7/2.52 mm | 7/0.099 in)', price: '', stock: '', image: '' },
    { size: '50 sq.mm (7/3.02 mm | 7/0.119 in)', price: '', stock: '', image: '' },
    { size: '70 sq.mm (19/2.16 mm | 19/0.085 in)', price: '', stock: '', image: '' },
    { size: '95 sq.mm (19/2.52 mm | 19/0.099 in)', price: '', stock: '', image: '' },
  ];

  // Price list for Multi Core PVC Insulated Aluminium Armoured Cable (mobile view)
  const multiCorePvcArmouredPriceList = [
    { size: '2.5 sq.mm (Ø 1.78 mm | 0.070 in)', price: '', stock: '', image: '' },
    { size: '4 sq.mm (Ø 2.25 mm | 0.088 in)', price: '', stock: '', image: '' },
    { size: '6 sq.mm (Ø 2.76 mm | 0.108 in)', price: '', stock: '', image: '' },
    { size: '10 sq.mm (Ø 3.56 mm | 0.140 in)', price: '', stock: '', image: '' },
    { size: '16 sq.mm (7/1.71 mm | 7/0.067 in)', price: '', stock: '', image: '' },
    { size: '25 sq.mm (7/2.13 mm | 7/0.084 in)', price: '', stock: '', image: '' },
    { size: '35 sq.mm (7/2.52 mm | 7/0.099 in)', price: '', stock: '', image: '' },
    { size: '50 sq.mm (7/3.02 mm | 7/0.119 in)', price: '', stock: '', image: '' },
    { size: '70 sq.mm (19/2.16 mm | 19/0.085 in)', price: '', stock: '', image: '' },
    { size: '95 sq.mm (19/2.52 mm | 19/0.099 in)', price: '', stock: '', image: '' },
  ];

  // Price list for Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable (mobile view)
  const singleCoreXlpeArmouredPriceList = [
    { size: '4 sq.mm (Ø 2.25 mm | 0.088 in)', price: '', stock: '', image: '' },
    { size: '6 sq.mm (Ø 2.76 mm | 0.108 in)', price: '', stock: '', image: '' },
    { size: '10 sq.mm (Ø 3.56 mm | 0.140 in)', price: '', stock: '', image: '' },
    { size: '16 sq.mm (7/1.71 mm | 7/0.067 in)', price: '', stock: '', image: '' },
    { size: '25 sq.mm (7/2.13 mm | 7/0.084 in)', price: '', stock: '', image: '' },
    { size: '35 sq.mm (7/2.52 mm | 7/0.099 in)', price: '', stock: '', image: '' },
    { size: '50 sq.mm (7/3.02 mm | 7/0.119 in)', price: '', stock: '', image: '' },
    { size: '70 sq.mm (19/2.16 mm | 19/0.085 in)', price: '', stock: '', image: '' },
    { size: '95 sq.mm (19/2.52 mm | 19/0.099 in)', price: '', stock: '', image: '' },
  ];

  // Price list for Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable (mobile view)
  const singleCorePvcArmouredPriceList = [
    { size: '4 sq.mm (Ø 2.25 mm | 0.088 in)', price: '', stock: '', image: '' },
    { size: '6 sq.mm (Ø 2.76 mm | 0.108 in)', price: '', stock: '', image: '' },
    { size: '10 sq.mm (Ø 3.56 mm | 0.140 in)', price: '', stock: '', image: '' },
    { size: '16 sq.mm (7/1.71 mm | 7/0.067 in)', price: '', stock: '', image: '' },
    { size: '25 sq.mm (7/2.13 mm | 7/0.084 in)', price: '', stock: '', image: '' },
    { size: '35 sq.mm (7/2.52 mm | 7/0.099 in)', price: '', stock: '', image: '' },
    { size: '50 sq.mm (7/3.02 mm | 7/0.119 in)', price: '', stock: '', image: '' },
    { size: '70 sq.mm (19/2.16 mm | 19/0.085 in)', price: '', stock: '', image: '' },
    { size: '95 sq.mm (19/2.52 mm | 19/0.099 in)', price: '', stock: '', image: '' },
  ];

  // Price list for Paper Cover Aluminium Conductor (mobile view)
  const paperCoverAluminiumPriceList = [
    { size: '0.80 mm (covered Dia 1.085 mm)', price: '', stock: '', image: '' },
    { size: '1.06 mm (covered Dia 1.345 mm)', price: '', stock: '', image: '' },
    { size: '1.25 mm (covered Dia 1.540 mm)', price: '', stock: '', image: '' },
    { size: '1.32 mm (covered Dia 1.610 mm)', price: '', stock: '', image: '' },
    { size: '1.40 mm (covered Dia 1.715 mm)', price: '', stock: '', image: '' },
    { size: '1.50 mm (covered Dia 1.815 mm)', price: '', stock: '', image: '' },
    { size: '1.60 mm (covered Dia 1.915 mm)', price: '', stock: '', image: '' },
    { size: '1.70 mm (covered Dia 2.015 mm)', price: '', stock: '', image: '' },
    { size: '1.80 mm (covered Dia 2.120 mm)', price: '', stock: '', image: '' },
    { size: '1.90 mm (covered Dia 2.220 mm)', price: '', stock: '', image: '' },
  ];

  // Price list for Telecom Switch Board Cables (mobile view)
  const telecomSwitchPriceList = [
    { size: '2 Pair — 0.4 mm (286 Ω)', price: '', stock: '', image: '' },
    { size: '2 Pair — 0.5 mm (184 Ω)', price: '', stock: '', image: '' },
    { size: '2 Pair — 0.63 mm (128 Ω)', price: '', stock: '', image: '' },
    { size: '2 Pair — 0.7 mm (90 Ω)', price: '', stock: '', image: '' },
    { size: '5 Pair — 0.4 mm (286 Ω)', price: '', stock: '', image: '' },
    { size: '5 Pair — 0.5 mm (184 Ω)', price: '', stock: '', image: '' },
    { size: '5 Pair — 0.63 mm (128 Ω)', price: '', stock: '', image: '' },
    { size: '5 Pair — 0.7 mm (90 Ω)', price: '', stock: '', image: '' },
    { size: '10 Pair — 0.4 mm (286 Ω)', price: '', stock: '', image: '' },
    { size: '10 Pair — 0.5 mm (184 Ω)', price: '', stock: '', image: '' },
    { size: '10 Pair — 0.63 mm (128 Ω)', price: '', stock: '', image: '' },
    { size: '10 Pair — 0.7 mm (90 Ω)', price: '', stock: '', image: '' },
    { size: '20 Pair — 0.4 mm (286 Ω)', price: '', stock: '', image: '' },
    { size: '20 Pair — 0.5 mm (184 Ω)', price: '', stock: '', image: '' },
    { size: '20 Pair — 0.63 mm (128 Ω)', price: '', stock: '', image: '' },
    { size: '20 Pair — 0.7 mm (90 Ω)', price: '', stock: '', image: '' },
    { size: '25 Pair — 0.4 mm (286 Ω)', price: '', stock: '', image: '' },
    { size: '25 Pair — 0.5 mm (184 Ω)', price: '', stock: '', image: '' },
    { size: '25 Pair — 0.63 mm (128 Ω)', price: '', stock: '', image: '' },
    { size: '25 Pair — 0.7 mm (90 Ω)', price: '', stock: '', image: '' },
    { size: '30 Pair — 0.4 mm (286 Ω)', price: '', stock: '', image: '' },
    { size: '30 Pair — 0.5 mm (184 Ω)', price: '', stock: '', image: '' },
    { size: '30 Pair — 0.63 mm (128 Ω)', price: '', stock: '', image: '' },
    { size: '30 Pair — 0.7 mm (90 Ω)', price: '', stock: '', image: '' },
    { size: '50 Pair — 0.4 mm (286 Ω)', price: '', stock: '', image: '' },
    { size: '50 Pair — 0.5 mm (184 Ω)', price: '', stock: '', image: '' },
    { size: '50 Pair — 0.63 mm (128 Ω)', price: '', stock: '', image: '' },
    { size: '50 Pair — 0.7 mm (90 Ω)', price: '', stock: '', image: '' },
  ];

  // Technical Tables data for ACSR Conductor
  const acsrTechnicalTables = {
    note: "ALUMINIUM CONDUCTOR GALVANISED STEEL REINFORCED IS 398 PT-II : 1996",
    tables: [
      {
        title: "ACSR CONDUCTOR SPECIFICATIONS",
        columns: [
          "ACSR Code",
          "Nom. Aluminium Area (mm²)",
          "Stranding and Wire Diameter - Aluminium (nos/mm)",
          "Stranding and Wire Diameter - Steel (nos/mm)",
          "DC Resistance at 20°C (Ω/km)",
          "AC Resistance at 65°C (Ω/km)",
          "AC Resistance at 75°C (Ω/km)",
          "Current Capacity at 65°C (Amps)",
          "Current Capacity at 75°C (Amps)"
        ],
        rows: [
          { code: "Mole", alArea: "10", alStrand: "6/1.50", steelStrand: "1/1.50", dcResistance: "2.780", acResistance65: "3.777", acResistance75: "3.905", current65: "58", current75: "70" },
          { code: "Squirrel", alArea: "20", alStrand: "6/1.96", steelStrand: "1/1.96", dcResistance: "1.394", acResistance65: "1.894", acResistance75: "1.958", current65: "89", current75: "107" },
          { code: "Weasel", alArea: "30", alStrand: "6/2.59", steelStrand: "1/2.59", dcResistance: "0.929", acResistance65: "1.262", acResistance75: "1.308", current65: "114", current75: "138" },
          { code: "Rabbit", alArea: "50", alStrand: "6/3.35", steelStrand: "1/3.35", dcResistance: "0.552", acResistance65: "0.705", acResistance75: "0.776", current65: "157", current75: "190" },
          { code: "Raccoon", alArea: "80", alStrand: "6/4.09", steelStrand: "1/4.09", dcResistance: "0.371", acResistance65: "0.504", acResistance75: "0.522", current65: "200", current75: "244" },
          { code: "Dog", alArea: "100", alStrand: "6/4.72", steelStrand: "7/1.57", dcResistance: "0.279", acResistance65: "0.379", acResistance75: "0.392", current65: "239", current75: "291" },
          { code: "Coyote", alArea: "130", alStrand: "26/2.54", steelStrand: "7/1.91", dcResistance: "0.225", acResistance65: "0.266", acResistance75: "0.275", current65: "292", current75: "358" },
          { code: "Wolf", alArea: "150", alStrand: "30/2.59", steelStrand: "7/2.59", dcResistance: "0.187", acResistance65: "0.222", acResistance75: "0.230", current65: "329", current75: "405" },
          { code: "Lynx", alArea: "180", alStrand: "30/2.79", steelStrand: "7/2.79", dcResistance: "0.161", acResistance65: "0.191", acResistance75: "0.197", current65: "361", current75: "445" },
          { code: "Panther", alArea: "200", alStrand: "30/3.00", steelStrand: "7/3.00", dcResistance: "0.139", acResistance65: "0.165", acResistance75: "0.171", current65: "395", current75: "487" },
          { code: "Goat", alArea: "320", alStrand: "30/3.71", steelStrand: "7/3.71", dcResistance: "0.091", acResistance65: "0.108", acResistance75: "0.112", current65: "510", current75: "634" },
          { code: "Kundah", alArea: "400", alStrand: "42/3.50", steelStrand: "7/1.96", dcResistance: "0.073", acResistance65: "0.089", acResistance75: "0.092", current65: "566", current75: "705" },
          { code: "Zebra", alArea: "420", alStrand: "54/3.18", steelStrand: "7/3.18", dcResistance: "0.069", acResistance65: "0.084", acResistance75: "0.087", current65: "590", current75: "737" },
          { code: "Moose", alArea: "520", alStrand: "54/3.53", steelStrand: "7/3.53", dcResistance: "0.056", acResistance65: "0.069", acResistance75: "0.071", current65: "667", current75: "836" },
          { code: "Morkulla", alArea: "560", alStrand: "42/4.13", steelStrand: "7/2.30", dcResistance: "0.052", acResistance65: "0.065", acResistance75: "0.067", current65: "688", current75: "862" },
          { code: "Bersimis", alArea: "690", alStrand: "42/4.57", steelStrand: "7/2.54", dcResistance: "0.042", acResistance65: "0.051", acResistance75: "0.052", current65: "791", current75: "998" }
        ]
      }
    ]
  };

  // Technical Tables data for AAAC Conductor
  const aaacTechnicalTables = {
    tables: [
      {
        title: "AAAC CONDUCTOR SPECIFICATIONS",
        columns: [
          "AAAC Code",
          "Nom Alloy Area (mm²)",
          "Stranding And Wire Dia. (nos/mm)",
          "DC Resistance (N) Nom (Ω/km)",
          "DC Resistance (M) Max (Ω/km)",
          "AC Resistance 65°C (Ω/km)",
          "AC Resistance 75°C (Ω/km)",
          "AC Resistance 90°C (Ω/km)",
          "Current 65°C (A/km)",
          "Current 75°C (A/km)",
          "Current 90°C (A/km)"
        ],
        rows: [
          { code: "Mole", area: "15", strand: "3/2.50", dcn: "2.2286", dcm: "2.3040", ac65: "2.590", ac75: "2.670", ac90: "2.790", i65: "72", i75: "87", i90: "104" },
          { code: "Squirrel", area: "20", strand: "7/2.00", dcn: "1.4969", dcm: "1.5410", ac65: "1.740", ac75: "1.793", ac90: "1.874", i65: "90", i75: "109", i90: "130" },
          { code: "Weasel", area: "34", strand: "7/2.50", dcn: "0.9580", dcm: "0.9900", ac65: "1.113", ac75: "1.148", ac90: "1.195", i65: "121", i75: "146", i90: "175" },
          { code: "Rabbit", area: "55", strand: "7/3.15", dcn: "0.6034", dcm: "0.6210", ac65: "0.701", ac75: "0.723", ac90: "0.756", i65: "160", i75: "194", i90: "234" },
          { code: "Raccoon", area: "80", strand: "7/3.81", dcn: "0.4125", dcm: "0.4250", ac65: "0.494", ac75: "0.510", ac90: "0.533", i65: "202", i75: "246", i90: "297" },
          { code: "Dog", area: "100", strand: "7/4.26", dcn: "0.3299", dcm: "0.3390", ac65: "0.384", ac75: "0.396", ac90: "0.413", i65: "232", i75: "283", i90: "343" },
          { code: "Dog(up)", area: "125", strand: "19/2.89", dcn: "0.2654", dcm: "0.2735", ac65: "0.309", ac75: "0.318", ac90: "0.333", i65: "266", i75: "325", i90: "394" },
          { code: "Coyote", area: "150", strand: "19/3.15", dcn: "0.2234", dcm: "0.2290", ac65: "0.260", ac75: "0.268", ac90: "0.280", i65: "395", i75: "362", i90: "440" },
          { code: "Wolf", area: "175", strand: "19/3.40", dcn: "0.1918", dcm: "0.1969", ac65: "0.223", ac75: "0.230", ac90: "0.240", i65: "392", i75: "398", i90: "485" },
          { code: "Wolf(up)", area: "200", strand: "19/3.66", dcn: "0.1655", dcm: "0.1710", ac65: "0.193", ac75: "0.199", ac90: "0.208", i65: "354", i75: "436", i90: "532" },
          { code: "Panther", area: "232", strand: "19/3.94", dcn: "0.1428", dcm: "0.1471", ac65: "0.166", ac75: "0.172", ac90: "0.179", i65: "387", i75: "478", i90: "584" },
          { code: "Panther (up)", area: "290", strand: "37/3.15", dcn: "0.11500", dcm: "0.11820", ac65: "0.134", ac75: "0.138", ac90: "0.145", i65: "442", i75: "548", i90: "670" },
          { code: "Panther (up)", area: "345", strand: "37/3.45", dcn: "0.09585", dcm: "0.09840", ac65: "0.112", ac75: "0.116", ac90: "0.121", i65: "493", i75: "613", i90: "752" },
          { code: "Kundah", area: "400", strand: "37/3.71", dcn: "0.08289", dcm: "0.08550", ac65: "0.097", ac75: "0.100", ac90: "0.105", i65: "538", i75: "670", i90: "824" },
          { code: "Zebra", area: "465", strand: "37/4.00", dcn: "0.07130", dcm: "0.07340", ac65: "0.084", ac75: "0.086", ac90: "0.090", i65: "589", i75: "736", i90: "905" },
          { code: "Zebra (up)", area: "525", strand: "61/3.31", dcn: "0.06330", dcm: "0.06510", ac65: "0.075", ac75: "0.077", ac90: "0.082", i65: "632", i75: "792", i90: "976" },
          { code: "Moose", area: "570", strand: "61/3.45", dcn: "0.05827", dcm: "0.05980", ac65: "0.069", ac75: "0.071", ac90: "0.074", i65: "663", i75: "833", i90: "1028" }
        ]
      }
    ]
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'cables' && product.name.toLowerCase().includes('cable')) ||
                           (selectedCategory === 'conductors' && product.name.toLowerCase().includes('conductor')) ||
                           (selectedCategory === 'wires' && product.name.toLowerCase().includes('wire'));
    return matchesSearch && matchesCategory;
  });

  // Load product images from database when selectedProduct changes
  useEffect(() => {
    const loadProductImages = async () => {
      if (selectedProduct) {
        try {
          const response = await apiClient.get(API_ENDPOINTS.PRODUCT_IMAGES_GET(selectedProduct));
          if (response?.success && response?.data) {
            // Convert the response data to the format expected by the component
            const imagesBySize = response.data;
            setProductImages(prev => ({
              ...prev,
              [selectedProduct]: imagesBySize
            }));
          }
        } catch (error) {
          console.error('Error loading product images:', error);
          // If product has no images, that's okay - just set empty object
          setProductImages(prev => ({
            ...prev,
            [selectedProduct]: {}
          }));
        }
      }
    };
    
    loadProductImages();
  }, [selectedProduct]);

  // Handle image upload for price list - database-backed
  const handleImageUpload = (index) => {
    setSelectedImageIndex(index);
    setIsImageUploadOpen(true);
  };

  const handleFileSelect = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files?.[0];
    if (!file || selectedImageIndex === null || !selectedProduct) {
      if (imageUploadInputRef.current) {
        imageUploadInputRef.current.value = '';
      }
      return;
    }

    const currentProduct = selectedProduct;
    const currentImageIndex = selectedImageIndex;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('product_name', currentProduct);
      formData.append('size_index', currentImageIndex.toString());

      const response = await apiClient.postFormData(API_ENDPOINTS.PRODUCT_IMAGES_UPLOAD(), formData);
      
      if (response?.success && response?.data?.url) {
        const fileUrl = response.data.url;
        const productKey = currentProduct;
        
        setProductImages(prev => {
          const productMap = prev[productKey] ? { ...prev[productKey] } : {};
          const list = productMap[currentImageIndex] ? [...productMap[currentImageIndex]] : [];
          list.push(fileUrl);
          productMap[currentImageIndex] = list;
          return { ...prev, [productKey]: productMap };
        });
        
        setTimeout(() => {
          alert('File uploaded successfully!');
        }, 100);
      } else {
        setTimeout(() => {
          alert(response?.message || 'Failed to upload file. Please try again.');
        }, 100);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error?.response?.data?.message || error?.data?.message || error?.message || 'Failed to upload file. Please try again.';
      setTimeout(() => {
        alert(errorMessage);
      }, 100);
    } finally {
      if (imageUploadInputRef.current) {
        imageUploadInputRef.current.value = '';
      }
      setIsImageUploadOpen(false);
      setSelectedImageIndex(null);
    }
  };

  // Handle image click to view/preview
  const handleImageClick = (index) => {
    if (!selectedProduct) return;
    const list = (productImages[selectedProduct?.name]?.[index]) || [];
    if (list.length > 0) {
      setViewingImageRowIndex(index);
      setCurrentSlide(list.length - 1);
      setIsFileViewerOpen(true);
    }
  };

  const handleImageDeleteFromModal = async () => {
    if (viewingImageRowIndex === null || !selectedProduct) return;
    
    const productKey = selectedProduct;
    const rowIndex = viewingImageRowIndex;
    const imageList = productImages[productKey]?.[rowIndex] || [];
    
    if (imageList.length === 0 || currentSlide >= imageList.length) return;
    
    const fileToDelete = imageList[currentSlide];
    const fileUrl = typeof fileToDelete === 'string' ? fileToDelete : (fileToDelete?.file_url || fileToDelete?.url || String(fileToDelete || ''));
    
    if (!fileUrl) {
      alert('No file to delete.');
      return;
    }
    
    if (fileUrl && typeof fileUrl === 'string' && !fileUrl.startsWith('data:')) {
      try {
        await apiClient.delete(API_ENDPOINTS.PRODUCT_IMAGES_DELETE(), {
          file_url: fileUrl
        });
        alert('File deleted successfully!');
      } catch (error) {
        console.error('Error deleting file from database:', error);
        alert('Failed to delete file from database. Please try again.');
        return;
      }
    }
    
    const newImageList = imageList.filter((_, idx) => idx !== currentSlide);
    
    setProductImages(prev => {
      const productMap = prev[productKey] ? { ...prev[productKey] } : {};
      if (newImageList.length > 0) {
        productMap[rowIndex] = newImageList;
      } else {
        delete productMap[rowIndex];
      }
      return { ...prev, [productKey]: productMap };
    });
    
    if (newImageList.length > 0) {
      setCurrentSlide(Math.min(currentSlide, newImageList.length - 1));
    } else {
      setIsFileViewerOpen(false);
      setViewingImageRowIndex(null);
      setCurrentSlide(0);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Product Toolbar</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsRightSidebarOpen(true)}
            className="group p-2 bg-gray-200 hover:bg-blue-500 rounded-lg transition-all duration-300 ease-in-out hover:shadow-md hover:scale-110 active:scale-95"
          >
            <MoreVertical className="h-5 w-5 text-gray-700 transition-colors duration-300 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-300 hover:shadow-sm"
        />
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white shadow-md scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md hover:scale-105 active:scale-95'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Products Grid - 3 Columns */}
      <div className="grid grid-cols-3 gap-3">
        {filteredProducts.map((product, index) => (
          <div
            key={index}
            role="button"
            tabIndex={0}
            className="group cursor-pointer bg-white rounded-xl p-3 shadow-sm border border-gray-100 transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.05] hover:-translate-y-1 hover:border-blue-300 hover:ring-2 hover:ring-blue-200/50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              if (hasProductData(product.name)) {
                setSelectedProduct(product);
              } else {
                setShowDataUpcoming(true);
              }
            }}
          >
            {/* Product Image */}
            <div className="relative h-24 bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-105"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="hidden absolute inset-0 items-center justify-center bg-gray-200">
                <Image className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* Product Info */}
            <div className="text-center">
              <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2 transition-colors duration-300 group-hover:text-blue-600">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 transition-colors duration-300 group-hover:text-gray-700">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Detail Modal for Aerial Bunch Cable and ACSR */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedProduct.name.toLowerCase().includes('aerial bunch cable') ? 'ab cable' : 
                   selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ? 'acsr conductor' : 
                   selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor') ? 'aaac conductor' :
                   selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') ? 'pvc insulated submersible cable' :
                   selectedProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto flex-grow">
              {/* Technical Specification */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Technical Specification</h2>
                    </div>
                <div className="p-4">
                  {selectedProduct.name.toLowerCase().includes('aerial bunch cable') ? (
                    <div className="space-y-6">
                      {/* Front and Side View Images */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-full h-32 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <img 
                              src="/images/products/Aerial Bunch Cable (2).jpg"
                              alt="Aerial Bunch Cable Front View"
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="hidden w-full h-full items-center justify-center text-gray-400">
                              <div className="text-center p-2">
                                <p className="text-xs">Front View</p>
                    </div>
                    </div>
                        </div>
                          <p className="text-xs text-gray-500 mt-1 text-center">Front View</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full h-32 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <img 
                              src="/images/products/aerial bunch cable.jpeg"
                              alt="Aerial Bunch Cable Side View"
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="hidden w-full h-full items-center justify-center text-gray-400">
                              <div className="text-center p-2">
                                <p className="text-xs">Side View</p>
                        </div>
                        </div>
                      </div>
                          <p className="text-xs text-gray-500 mt-1 text-center">Side View</p>
                        </div>
                      </div>

                      {/* Construction Details */}
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3">1. Construction Details</h4>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                          <table className="min-w-full bg-white">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Part</th>
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Material Used</th>
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Conductor</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Aluminium / Aluminium Alloy Conductor (Class 2 as per IS 8130)</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">High conductivity, corrosion-resistant conductor ensuring minimal power loss.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Insulation</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Cross-linked Polyethylene (XLPE)</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Heat and UV resistant insulation providing enhanced dielectric strength and mechanical durability.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Messenger Wire</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Aluminium Alloy Conductor (as per IS 398 Pt-4)</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Provides mechanical support and tensile strength to the aerial bundle.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Core Identification</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Phase cores: Black with number marking; Neutral: Black with blue marking; Street lighting: Black with white marking</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Easy identification and installation.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Sheath (if applicable)</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">UV stabilized XLPE</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Offers superior resistance against environmental degradation and sunlight.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Layout Type</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">2 to 4 Core + Messenger</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Configured for overhead LT distribution systems.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Standards Followed */}
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3">2. Standards Followed</h4>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                          <table className="min-w-full bg-white">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Standard Code</th>
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">IS 14255:1995</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Specification for Aerial Bunched Cables for working voltage up to and including 1100 V.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">IS 8130:2023</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Conductors for insulated electric cables and flexible cords.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">IS 398 (Part 4):1994</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Aluminium Alloy Conductors.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">IEC 60502-1</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Power cables with extruded insulation and their accessories for rated voltages up to 1 kV (optional).</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">RoHS Compliance</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Environmentally friendly and lead-free materials.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Technical Properties */}
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3">3. Technical Properties</h4>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                          <table className="min-w-full bg-white">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Parameter</th>
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Value / Range</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Rated Voltage</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">1100 V (1.1 kV)</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Operating Temperature Range</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-30°C to +90°C</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Insulation Resistance</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{'>'} 1 MΩ/km at 27°C</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Dielectric Strength</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">3.5 kV for 5 minutes</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Conductor Resistance (Max.)</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">As per IS 8130:2023 for Aluminium / Aluminium Alloy</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">UV Resistance</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Excellent – tested for prolonged sunlight exposure</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Tensile Strength (Messenger)</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">As per IS 398 Pt-4</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Current Carrying Capacity</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Higher compared to conventional bare conductor systems</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Short Circuit Rating</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">As per IS 14255:1995</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Applications */}
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3">4. Applications</h4>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                          <table className="min-w-full bg-white">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Use Area</th>
                                <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Overhead LT Power Distribution</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Widely used in power distribution lines for reliable power delivery.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Urban & Rural Electrification</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Ideal for areas where safety, reliability, and reduced theft risk are required.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Industrial & Street Lighting Systems</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Suitable for power supply in industrial complexes and municipal lighting.</td>
                              </tr>
                              <tr className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-semibold">Hilly / Forested / Coastal Areas</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">Performs efficiently under harsh weather, moisture, and UV exposure.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Key Features / Advantages */}
                      <div>
                        <h4 className="text-base font-semibold text-gray-900 mb-3">5. Key Features / Advantages</h4>
                        <ul className="list-disc list-inside space-y-2 text-xs text-gray-800">
                          <li>UV radiation protected for long outdoor life.</li>
                          <li>High current carrying capacity with low power loss.</li>
                          <li>Operates efficiently within a temperature range of -30°C to +90°C.</li>
                          <li>Resistant to mechanical stress, corrosion, and atmospheric pollution.</li>
                          <li>Reduced line faults and power theft due to insulated design.</li>
                          <li>Maintenance-free and safe for overhead installations.</li>
                          <li>Lightweight and easy to install on existing pole structures.</li>
                      </ul>
                    </div>
                  </div>
                  ) : selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-gray-800">REFERENCE</span>
                        <p className="text-sm text-gray-800">IS 398 (PART:-2) 1996</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-gray-800">APPLICATION</span>
                        <p className="text-sm text-gray-800">Overhead power transmission purposes</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-gray-800">CONDUCTOR</span>
                        <p className="text-sm text-gray-800">Conductor containing aluminium and galvanised steel wires built in concentric layers</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-gray-800">RESISTIVITY</span>
                        <p className="text-sm text-gray-800">Max 0.032 ohm·mm²/m at 20°C</p>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-semibold text-gray-800">INSULATION</span>
                        <p className="text-sm text-gray-800">Not insulated (bare conductor)</p>
                      </div>
                      <div className="space-y-2 mt-4 md:col-span-2">
                        <span className="text-sm font-semibold text-gray-800">FEATURES</span>
                        <div className="text-sm text-gray-800">
                          <ul className="list-disc list-inside space-y-1">
                            <li>100% pure EC grade aluminium</li>
                            <li>Heavy duty cable suitable for outdoor installation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor') ? (
                    <>
                      <div className="space-y-4">
                    <div>
                          <h4 className="text-base font-semibold text-gray-800 mb-2">Application</h4>
                          <p className="text-sm text-gray-800">Over Head Power Transmission Purposes</p>
                    </div>
                    <div>
                          <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                            <li>100% Pure EC Grade Aluminium.</li>
                          </ul>
                    </div>
                    <div>
                          <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-sm font-semibold text-gray-800">Reference</span>
                              <p className="text-sm text-gray-800">IS-398 (PT-4):1994</p>
                    </div>
                            <div className="space-y-1">
                              <span className="text-sm font-semibold text-gray-800">Conductor</span>
                              <p className="text-sm text-gray-800">Conductor Containing All Aluminium Alloy wire in Concentric Layer.</p>
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <span className="text-sm font-semibold text-gray-800">Resistivity</span>
                              <p className="text-sm text-gray-800">Resistivity of Material MAX. 0.0328 Ohm mm²/m at 20°C</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Application</h4>
                        <p className="text-sm text-gray-800">Submersible pump connections and wet environments</p>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Key Features / Advantages</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                          <li>100% Pure Electrolytic Grade Annealed Copper — Ensures maximum conductivity and efficiency</li>
                          <li>High Quality Multilayer PVC Insulation — Provides excellent insulation resistance and moisture protection</li>
                          <li>Water-Tight Construction — Specially designed for submersible pump applications and wet environments</li>
                          <li>Flame Retardant & UV Resistant — Offers enhanced fire safety and weather protection</li>
                          <li>Anti-Rodent & Anti-Termite — Prolongs cable durability in harsh environments</li>
                          <li>REACH & RoHS Compliant — Environmentally safe and non-toxic</li>
                          <li>Available in Flat and Round Construction — Flexible design for various installation requirements</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">ISO & BIS License</span>
                            <p className="text-sm text-gray-800">Certified Company</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Conductor</span>
                            <p className="text-sm text-gray-800">Electrolytic grade annealed copper, Class 2/5 as per IS 8130</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Insulation</span>
                            <p className="text-sm text-gray-800">PVC Type A as per IS 5831</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Colour of Core</span>
                            <p className="text-sm text-gray-800">Red, Yellow, Blue</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Sheath</span>
                            <p className="text-sm text-gray-800">PVC Type ST-1 / ST-2 as per IS 5831</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Colour of Sheath</span>
                            <p className="text-sm text-gray-800">Black and other colours as per customer demand</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                            <p className="text-sm text-gray-800">Up to and including 1100V</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                            <p className="text-sm text-gray-800">Standard packing of 300/500 mtr coil; other lengths on request. Cables printed with 'ANOCAB' marking.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('multistrand single core copper cable') ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                          <li>High quality multilayer PVC having greater IR Value</li>
                          <li>REACH and RoHS Compliant Cable</li>
                          <li>Flame Retardant Cable with higher Oxygen Index</li>
                          <li>Anti-Rodent, Anti-Termite</li>
                          <li>100% Pure Electrolytic grade Copper</li>
                          <li>Super flexible conductor</li>
                          <li>100% Conductivity</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Reference</span>
                            <p className="text-sm text-gray-800">IS 694:2010</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Voltage Grade</span>
                            <p className="text-sm text-gray-800">Up to and including 1100V</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Conductor</span>
                            <p className="text-sm text-gray-800">Electrolytic Grade Copper class - 2, 5, as per IS: 8130:2013</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Insulation</span>
                            <p className="text-sm text-gray-800">PVC confirming to IS-5831 and formulated with FR properties and heat resistance up to 85°C. FRLSH & ZHFR insulation Type A/C 70/85°C.</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Colours</span>
                            <p className="text-sm text-gray-800">Red, yellow, blue, black & other colours on customer demand</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Marking</span>
                            <p className="text-sm text-gray-800">The cables are printed with marking of 'ANOCAB'</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Packing</span>
                            <p className="text-sm text-gray-800">90 mtr. coil is packed in protective plastic bag; longer length available on customer demand</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('multi core pvc insulated aluminium unarmoured cable') ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                          <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                          <li>100% Pure EC Grade Aluminium</li>
                          <li>Heavy duty Cable suitable for outdoor installation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Reference</span>
                            <p className="text-sm text-gray-800">IS 1554 PT-1</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Conductor</span>
                            <p className="text-sm text-gray-800">EC Grade Aluminium Class 1 & 2 as per IS 8130</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Insulation</span>
                            <p className="text-sm text-gray-800">PVC Type - A, as per IS 5831</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Sheath</span>
                            <p className="text-sm text-gray-800">PVC Type ST-1, PVC Type - ST 2 as per IS 5831</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Colours</span>
                            <p className="text-sm text-gray-800">Red & black for 2 core cable, red, yellow, blue for 3 core cable, red, yellow, blue & black for 4 core cable</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Colour of sheath</span>
                            <p className="text-sm text-gray-800">Black and Other Colour as per requirement</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                            <p className="text-sm text-gray-800">Up to and including 1100 Volt</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Marking & Packing</span>
                            <p className="text-sm text-gray-800">Standard packing of 500 mtr. in coil. & Other length available on request, cables are printed with marking of 'ANOCAB'</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('multi core xlpe insulated aluminium armoured cable') ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                          <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                          <li>100% Pure EC Grade Aluminium</li>
                          <li>Galvanized Iron Armoured Protected</li>
                          <li>Heavy duty Cable suitable for outdoor installation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Reference</span>
                            <p className="text-sm text-gray-800">IS 7098 PT-1</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Conductor</span>
                            <p className="text-sm text-gray-800">EC Grade Aluminium Class 1 & 2 as per IS 8130</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Insulation</span>
                            <p className="text-sm text-gray-800">XLPE insulated</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Colour of core</span>
                            <p className="text-sm text-gray-800">Red & black for 2 core cable, red, yellow, blue for 3 core cable, red, yellow, blue & black for 4 core cable</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Sheath</span>
                            <p className="text-sm text-gray-800">PVC Type ST-1, PVC Type - ST 2 as per IS 5831</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Colour of sheath</span>
                            <p className="text-sm text-gray-800">Black and Other Colour as per requirement</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                            <p className="text-sm text-gray-800">Up to and including 1100 Volt</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                            <p className="text-sm text-gray-800">Standard packing of 500 mtr. in coil. & Other length available on request, cables are printed with marking of 'ANOCAB'</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('single core pvc insulated aluminium/copper armoured/unarmoured cable') ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                          <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                          <li>100% Pure EC Grade Aluminium/Copper</li>
                          <li>Galvanized Iron Armoured Protected</li>
                          <li>Heavy duty Cable suitable for outdoor installation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Reference</span>
                            <p className="text-sm text-gray-800">IS 1554 PT-1</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Conductor</span>
                            <p className="text-sm text-gray-800">EC Grade Aluminium/Copper Class 1 & 2 as per IS 8130</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Insulation</span>
                            <p className="text-sm text-gray-800">PVC Type - A, as per IS 5831</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Colour of core</span>
                            <p className="text-sm text-gray-800">Red & black for 2 core cable, red, yellow, blue for 3 core cable, red, yellow, blue & black for 4 core cable</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Sheath</span>
                            <p className="text-sm text-gray-800">PVC Type ST-1, PVC Type - ST 2 as per IS 5831</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Colour of sheath</span>
                            <p className="text-sm text-gray-800">Black and Other Colour as per requirement</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                            <p className="text-sm text-gray-800">Up to and including 1100 Volt</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                            <p className="text-sm text-gray-800">Standard packing of 500 mtr. in coil. & Other length available on request, cables are printed with marking of 'ANOCAB'</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('paper cover aluminium conductor') ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                          <li>100% Pure EC Grade Aluminium</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Reference</span>
                            <p className="text-sm text-gray-800">IS-6162 (Part-1):1971</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Conductor</span>
                            <p className="text-sm text-gray-800">Round Aluminium Conductor Pure EC grade Confirming to IS 4026-1969</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Insulation</span>
                            <p className="text-sm text-gray-800">Double Layer of Paper Covered with O, F & S Grade as per Customer Requirement</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Resistivity</span>
                            <p className="text-sm text-gray-800">0.028264 Ohm mm²/m at 20°C</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Test</span>
                            <p className="text-sm text-gray-800">Tested at 5.5 KV to 10 KV</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('single core xlpe insulated aluminium/copper armoured/unarmoured cable') ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                          <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                          <li>100% Pure EC Grade Aluminium</li>
                          <li>Galvanized Iron Armoured Protected</li>
                          <li>Heavy duty Cable suitable for outdoor installation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Reference</span>
                            <p className="text-sm text-gray-800">IS - 7098 PT-1</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Conductor</span>
                            <p className="text-sm text-gray-800">EC Grade Aluminium/Copper Class 1 & 2 as per IS 8130</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Insulation</span>
                            <p className="text-sm text-gray-800">XLPE Insulation As per IS 7098 Pt-1</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Colour of core</span>
                            <p className="text-sm text-gray-800">Red, yellow, blue & black</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Sheath</span>
                            <p className="text-sm text-gray-800">PVC Type ST-1, PVC Type - ST 2 as per IS 5831</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Colour of sheath</span>
                            <p className="text-sm text-gray-800">Black and Other Colour as per requirement</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                            <p className="text-sm text-gray-800">Up to and including 1100 Volt</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                            <p className="text-sm text-gray-800">Standard packing of 500 mtr. in coil. & Other length available on request, cables are printed with marking of 'ANOCAB'</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('multi core pvc insulated aluminium armoured cable') ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                          <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                          <li>100% Pure EC Grade Aluminium</li>
                          <li>Galvanized Iron Armoured Protected</li>
                          <li>Heavy duty Cable suitable for outdoor installation</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Reference</span>
                            <p className="text-sm text-gray-800">IS 1554 PT-1</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Conductor</span>
                            <p className="text-sm text-gray-800">EC Grade Aluminium Class 1 & 2 as per IS 8130</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Insulation</span>
                            <p className="text-sm text-gray-800">PVC Type - A, as per IS 5831</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Colour of core</span>
                            <p className="text-sm text-gray-800">Red & black for 2 core cable, red, yellow, blue for 3 core cable, red, yellow, blue & black for 4 core cable</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Sheath</span>
                            <p className="text-sm text-gray-800">PVC Type ST-1, PVC Type - ST 2 as per IS 5831</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Colour of sheath</span>
                            <p className="text-sm text-gray-800">Black and Other Colour as per requirement</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                            <p className="text-sm text-gray-800">Up to and including 1100 Volt</p>
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                            <p className="text-sm text-gray-800">Standard packing of 500 mtr. in coil. & Other length available on request, cables are printed with marking of 'ANOCAB'</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  </div>
                </div>

              {/* Price List */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Price List
                  </h2>
                  </div>
                <div className="p-2">
                  <table className="w-full border-collapse border border-gray-200 text-[10px]">
                    <thead className="bg-gray-50">
                      <tr>
                        {(selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') || selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor')) && (
                          <th className="px-1 py-1.5 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">CODE</th>
                        )}
                        <th className="px-1 py-1.5 text-left font-semibold text-gray-700 border border-gray-200">Size</th>
                        <th className="px-1 py-1.5 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">Price/M</th>
                        <th className="px-1 py-1.5 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">Stock</th>
                        <th className="px-1 py-1.5 text-center font-semibold text-gray-700 border border-gray-200 w-10">Img</th>
                        <th className="px-1 py-1.5 text-center font-semibold text-gray-700 border border-gray-200 w-10">Add</th>
                        </tr>
                      </thead>
                      <tbody>
                      {(selectedProduct.name.toLowerCase().includes('aerial bunch cable') ? abPriceList : 
                        selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ? acsrPriceList :
                        selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor') ? aaacPriceList :
                        selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') ? pvcSubmersiblePriceList :
                        selectedProduct.name.toLowerCase().includes('multistrand single core copper cable') ? multistrandSingleCorePriceList :
                        selectedProduct.name.toLowerCase().includes('multi core copper cable') ? multiCoreCopperPriceList :
                        selectedProduct.name.toLowerCase().includes('pvc insulated single core aluminium cable') ? pvcSingleAlPriceList :
                        selectedProduct.name.toLowerCase().includes('pvc insulated multicore aluminium cable') ? pvcMulticoreAlPriceList :
                        selectedProduct.name.toLowerCase().includes('twin twisted copper wire') ? twinTwistedPriceList :
                        selectedProduct.name.toLowerCase().includes('speaker cable') ? speakerPriceList :
                        selectedProduct.name.toLowerCase().includes('automobile cable') ? automobilePriceList :
                        selectedProduct.name.toLowerCase().includes('pv solar cable') ? pvSolarPriceList :
                        selectedProduct.name.toLowerCase().includes('co axial cable') ? coAxialPriceList :
                        selectedProduct.name.toLowerCase().includes('uni-tube unarmoured optical fibre cable') ? unitubeOpticalPriceList :
                        selectedProduct.name.toLowerCase().includes('telecom switch board cables') ? telecomSwitchPriceList :
                        selectedProduct.name.toLowerCase().includes('multi core pvc insulated aluminium unarmoured cable') ? multiCorePvcUnarmouredPriceList :
                        selectedProduct.name.toLowerCase().includes('multi core pvc insulated aluminium armoured cable') ? multiCorePvcArmouredPriceList :
                        selectedProduct.name.toLowerCase().includes('single core xlpe insulated aluminium/copper armoured/unarmoured cable') ? singleCoreXlpeArmouredPriceList :
                        selectedProduct.name.toLowerCase().includes('single core pvc insulated aluminium/copper armoured/unarmoured cable') ? singleCorePvcArmouredPriceList :
                        selectedProduct.name.toLowerCase().includes('paper cover aluminium conductor') ? paperCoverAluminiumPriceList : []).map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {(selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') || selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor')) && (
                            <td className="px-1 py-1.5 border border-gray-200 font-medium whitespace-nowrap">{item.conductorCode || '-'}</td>
                          )}
                          <td className="px-1 py-1.5 border border-gray-200 font-medium break-words">{item.size}</td>
                          <td className="px-1 py-1.5 border border-gray-200 text-blue-600 font-semibold whitespace-nowrap">{item.price || '-'}</td>
                          <td className="px-1 py-1.5 border border-gray-200">
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                              item.stock === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.stock || '-'}
                              </span>
                            </td>
                          <td className="px-1 py-1.5 border border-gray-200">
                            <div 
                              className={`w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mx-auto ${(productImages[selectedProduct?.name]?.[index]?.length || 0) > 0 ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''}`}
                              onClick={() => handleImageClick(index)}
                              title={(productImages[selectedProduct?.name]?.[index]?.length || 0) > 0 ? "Click to view image" : "No image uploaded"}
                            >
                              {((productImages[selectedProduct?.name]?.[index]?.length || 0) > 0) ? (
                                <img 
                                  src={productImages[selectedProduct?.name]?.[index]?.[productImages[selectedProduct?.name]?.[index].length - 1]} 
                                  alt={`${item.size} image`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <Image className="h-2.5 w-2.5 text-gray-400" />
                                )}
                              </div>
                            </td>
                            <td className="px-1 py-1.5 border border-gray-200">
                              <button
                                className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors mx-auto" 
                                title="Add image"
                                onClick={() => handleImageUpload(index)}
                              >
                                <Plus className="h-2.5 w-2.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Technical Data */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Technical Data
                  </h2>
                </div>
                <div className="space-y-4 p-4">
                  {selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') ? (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Nominal Area (mm²)</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">No./Dia of Strands (mm)</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Insulation Thickness (mm)</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Sheath Thickness (mm)</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Width (mm)</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Height (mm)</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Max Conductor Resistance 20°C (Ω/km)</th>
                            <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Current Capacity at 40°C (Amps)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { area: "1.5", strands: "22/0.3", ins: "0.60", sheath: "0.90", width: "10.10", height: "4.70", res: "12.10", amps: "13" },
                            { area: "2.5", strands: "36/0.3", ins: "0.70", sheath: "1.00", width: "12.20", height: "5.50", res: "7.41", amps: "18" },
                            { area: "4", strands: "56/0.3", ins: "0.80", sheath: "1.10", width: "16.20", height: "6.30", res: "4.95", amps: "24" },
                            { area: "6", strands: "84/0.3", ins: "0.80", sheath: "1.10", width: "16.20", height: "7.20", res: "3.30", amps: "31" },
                            { area: "10", strands: "140/0.3", ins: "1.00", sheath: "1.20", width: "22.00", height: "8.30", res: "1.91", amps: "42" },
                            { area: "16", strands: "126/0.4", ins: "1.00", sheath: "1.30", width: "23.50", height: "9.70", res: "1.21", amps: "57" },
                            { area: "25", strands: "196/0.4", ins: "1.20", sheath: "1.60", width: "28.40", height: "11.10", res: "0.78", amps: "72" },
                            { area: "35", strands: "276/0.4", ins: "1.20", sheath: "1.70", width: "32.10", height: "13.10", res: "0.554", amps: "90" },
                            { area: "50", strands: "396/0.4", ins: "1.20", sheath: "1.80", width: "35.00", height: "15.00", res: "0.386", amps: "115" },
                            { area: "70", strands: "360/0.5", ins: "1.40", sheath: "2.20", width: "43.40", height: "17.00", res: "0.272", amps: "143" },
                            { area: "95", strands: "475/0.5", ins: "1.60", sheath: "2.40", width: "49.60", height: "19.10", res: "0.206", amps: "165" }
                          ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.area}</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 whitespace-nowrap">{row.strands}</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.ins}</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.sheath}</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.width}</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.height}</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.res}</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.amps}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') ? null : (
                    (selectedProduct.name.toLowerCase().includes('aerial bunch cable') ? abTechnicalTables : 
                    selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ? acsrTechnicalTables :
                    selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor') ? aaacTechnicalTables :
                    { tables: [] }).tables.map((tbl, idx) => {
                    const tableKeyOrders = {
                      'PHASE Φ': ['sqmm', 'strands', 'conductorDia', 'insulationThickness', 'insulatedCoreDia', 'maxResistance'],
                      'MESSENGER Φ': ['sqmm', 'strands', 'conductorDia', 'insulationThickness', 'maxResistance', 'maxBreakingLoad'],
                      'ACSR CONDUCTOR SPECIFICATIONS': ['code', 'alArea', 'alStrand', 'steelStrand', 'dcResistance', 'acResistance65', 'acResistance75', 'current65', 'current75'],
                      'AAAC CONDUCTOR SPECIFICATIONS': ['code', 'area', 'strand', 'dcn', 'dcm', 'ac65', 'ac75', 'ac90', 'i65', 'i75', 'i90']
                    };
                    const order = tableKeyOrders[tbl.title] || Object.keys(tbl.rows[0] || {});
                    
                    // Shorten column headers for mobile
                    const getShortHeader = (originalHeader) => {
                      const headerMap = {
                        'CROSS SECTIONAL AREA OF PHASE CONDUCTOR (SQMM)': 'Area (SQMM)',
                        'STRANDS/WIRE (nos/mm)': 'Strands',
                        'CONDUCTOR DIA (mm)': 'Cond Dia',
                        'INSULATION THICKNESS (mm)': 'Ins Thick',
                        'INSULATED CORE DIA (mm)': 'Core Dia',
                        'MAXIMUM RESISTANCE (Ohm/Km) @20°C': 'Res (Ω/km)',
                        'CROSS SECTIONAL AREA OF MESSENGER (SQMM)': 'Area (SQMM)',
                        'MAXIMUM BREAKING LOAD (kN)': 'Break Load',
                        'ACSR Code': 'Code',
                        'Nom. Aluminium Area (mm²)': 'Al Area',
                        'Stranding and Wire Diameter - Aluminium (nos/mm)': 'Al Strand',
                        'Stranding and Wire Diameter - Steel (nos/mm)': 'Steel Strand',
                        'DC Resistance at 20°C (Ω/km)': 'DC R @20°C',
                        'AC Resistance at 65°C (Ω/km)': 'AC R @65°C',
                        'AC Resistance at 75°C (Ω/km)': 'AC R @75°C',
                        'Current Capacity at 65°C (Amps)': 'Current @65°C',
                        'Current Capacity at 75°C (Amps)': 'Current @75°C',
                        'AAAC Code': 'Code',
                        'Nom Alloy Area (mm²)': 'Area',
                        'Stranding And Wire Dia. (nos/mm)': 'Strand',
                        'DC Resistance (N) Nom (Ω/km)': 'DC R (N)',
                        'DC Resistance (M) Max (Ω/km)': 'DC R (M)',
                        'AC Resistance 65°C (Ω/km)': 'AC R 65°C',
                        'AC Resistance 75°C (Ω/km)': 'AC R 75°C',
                        'AC Resistance 90°C (Ω/km)': 'AC R 90°C',
                        'Current 65°C (A/km)': 'I 65°C',
                        'Current 75°C (A/km)': 'I 75°C',
                        'Current 90°C (A/km)': 'I 90°C'
                      };
                      return headerMap[originalHeader] || originalHeader;
                    };
                    
                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="px-2 py-1.5 bg-gray-50 border-b border-gray-200 font-semibold text-xs text-gray-800">{tbl.title}</div>
                        <div className="p-1">
                          <table className="w-full border-collapse border border-gray-200 text-[10px]">
                    <thead>
                              <tr>
                                {tbl.columns.map((col, cIdx) => (
                                  <th key={cIdx} className="px-1 py-1 text-left font-semibold text-gray-600 border border-gray-200 whitespace-nowrap">{getShortHeader(col)}</th>
                                ))}
                      </tr>
                    </thead>
                    <tbody>
                              {tbl.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-gray-50">
                                  {order.map((key, kIdx) => (
                                    <td key={kIdx} className="px-1 py-1 text-gray-800 border border-gray-200 whitespace-nowrap">{row[key] || '-'}</td>
                                  ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                          </div>
                          </div>
                    );
                  }))}
                  {((selectedProduct.name.toLowerCase().includes('aerial bunch cable') ? abTechnicalTables : 
                     selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ? acsrTechnicalTables :
                     selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor') ? aaacTechnicalTables :
                     { note: null }).note) && (
                    <div className="text-xs text-gray-600 mt-2">NOTE: {(selectedProduct.name.toLowerCase().includes('aerial bunch cable') ? abTechnicalTables : 
                      selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ? acsrTechnicalTables :
                      aaacTechnicalTables).note}</div>
                  )}
                  </div>
                </div>

                {/* Cable Selection for Submersible Motor Calculator (PVC Submersible) */}
                {selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-blue-600" />
                        Cable Selection for Submersible Motor Calculator
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">3 PHASE, 220-240 V, 50Hz | Direct on line Starter</p>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Motor Rating</label>
                          <div className="space-y-2">
                            <input 
                              type="number" 
                              value={subMotorRating}
                              onChange={(e) => setSubMotorRating(Number(e.target.value) || 0)}
                              className="w-full px-2 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            />
                            <select 
                              value={subMotorUnit}
                              onChange={(e) => setSubMotorUnit(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option>HP</option>
                              <option>KW</option>
                              <option>WATT</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Length</label>
                          <div className="space-y-2">
                            <input 
                              type="number" 
                              value={subMotorLen}
                              onChange={(e) => setSubMotorLen(Number(e.target.value) || 0)}
                              className="w-full px-2 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            />
                            <select 
                              value={subMotorLenUnit}
                              onChange={(e) => setSubMotorLenUnit(e.target.value)}
                              className="w-full px-2 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option>MTR</option>
                              <option>FT</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Voltage Drop</label>
                          <div className="px-2 py-2 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subVoltDrop).toFixed(2)}</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Current (Ω)</label>
                          <div className="px-2 py-2 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subCurrent).toFixed(2)}</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Actual Gauge</label>
                          <div className="px-2 py-2 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subActualGauge).toFixed(2)}</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Cable Size</label>
                          <div className="px-2 py-2 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{subCableSize}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cable Size vs Max Length Table (PVC Submersible) */}
                {selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-blue-600" />
                        CABLE SIZE IN SQ. MM. (Max Length in Meters)
                      </h2>
                    </div>
                    <div className="p-4">
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full bg-white">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">V</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">kW</th>
                              <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">HP</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">1.5</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">2.5</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">4</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">6</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">10</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">16</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">25</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">35</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">50</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">70</th>
                              <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 border border-gray-200">95</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { v: "220-240", kw: "0.37", hp: "0.50", s15: "120", s25: "200", s4: "320", s6: "480", s10: "810", s16: "1260", s25mm: "1900", s35: "2590", s50: "3580", s70: "4770", s95: "5920" },
                              { v: "220-240", kw: "0.55", hp: "0.75", s15: "80", s25: "130", s4: "250", s6: "320", s10: "550", s16: "850", s25mm: "1290", s35: "1760", s50: "2430", s70: "3230", s95: "4000" },
                              { v: "220-240", kw: "0.75", hp: "1.00", s15: "60", s25: "100", s4: "170", s6: "250", s10: "430", s16: "670", s25mm: "1010", s35: "1380", s50: "1910", s70: "2550", s95: "3160" },
                              { v: "220-240", kw: "1.10", hp: "1.50", s15: "40", s25: "70", s4: "120", s6: "180", s10: "300", s16: "470", s25mm: "710", s35: "980", s50: "1360", s70: "1850", s95: "2320" },
                              { v: "220-240", kw: "1.50", hp: "2.00", s15: "30", s25: "60", s4: "90", s6: "130", s10: "230", s16: "360", s25mm: "550", s35: "760", s50: "1060", s70: "1440", s95: "1820" },
                              { v: "220-240", kw: "2.20", hp: "3.00", s15: "-", s25: "40", s4: "60", s6: "100", s10: "170", s16: "280", s25mm: "430", s35: "600", s50: "820", s70: "1080", s95: "1310" }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.v}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.kw}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row.hp}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s15}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s25}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s4}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s6}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s10}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s16}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s25mm}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s35}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s50}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s70}</td>
                                <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">{row.s95}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="px-2 py-2 text-xs text-gray-600 italic">Note: Values are in meters (MTR) for 220-240V, 50Hz systems</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* HP Vs Current Table (PVC Submersible) */}
                {selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') && (
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-blue-600" />
                        HP Vs Current - Full Load Current for Submersible Pump Motors
                      </h2>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* First Table */}
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full bg-white">
                          <tbody>
                            <tr className="hover:bg-gray-50">
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium bg-gray-50">HP</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">5</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">7.5</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">10</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">12.5</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">15.5</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">17.5</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">20</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">25</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium bg-gray-50">Amp</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">7.50</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">11.00</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">14.90</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">18.90</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">25.20</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">25.20</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">28.40</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">35.60</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* Second Table */}
                      <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="min-w-full bg-white">
                          <tbody>
                            <tr className="hover:bg-gray-50">
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium bg-gray-50">HP</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">30</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">35</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">40</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">45</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">50</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">55</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">60</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium">65</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center font-medium bg-gray-50">Amp</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">42.30</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">50.40</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">58.10</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">62.10</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">67.50</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">73.80</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">81.00</td>
                              <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 text-center">87.30</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="text-xs text-gray-600 italic">Note: For 3 Phase, 50 Cycles, 415-425 V submersible pump motors</p>
                    </div>
                  </div>
                )}

                {/* Costing Calculator - Show for ACSR, AAAC (exclude AB Cable and PVC Submersible) */}
                {(selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ||
                  selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor')) && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Costing Calculator
                  </h2>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700" onClick={() => {/* TODO: compute Costing */}}>
                    Calculate
                  </button>
                  </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">DISC.</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">CORE Φ</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">N/O STRAND</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">STAND SIZE</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">CALCUS</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">GAUGE</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">KG/MTR</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                      {/* PHASE Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">PHASE</td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" defaultValue="3" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" defaultValue="7" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" step="0.01" defaultValue="2.12" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">7.091</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">25 SQMM</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">203/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">54775</td>
                      </tr>
                      {/* PH INN INS Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">PH INN INS</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" step="0.01" defaultValue="1.20" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">6.36 mm</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">OD 8.76</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">80/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">9640</td>
                      </tr>
                      {/* PH OUT INS Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">PH OUT INS</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">8.76 mm</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">OD 8.76</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">0/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">0</td>
                      </tr>
                      {/* STREET LIGHT Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">STREET LIGHT</td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" defaultValue="1" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" defaultValue="7" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" step="0.01" defaultValue="1.70" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">7.091</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">16 SQMM</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">43/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">11740</td>
                      </tr>
                      {/* STL INN INS Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">STL INN INS</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" step="0.01" defaultValue="1.20" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">5.10 mm</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">OD 7.50</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">22/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">2678</td>
                      </tr>
                      {/* STL OUT INS Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">STL OUT INS</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">7.50 mm</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">OD 7.50</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">0/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">0</td>
                      </tr>
                      {/* MESSENGER Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">MESSENGER</td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" defaultValue="1" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" defaultValue="7" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" step="0.01" defaultValue="2.12" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">7.091</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">25 SQMM</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">68/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">18258</td>
                      </tr>
                      {/* MSN INN INS Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">MSN INN INS</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">6.36 mm</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">OD 6.36</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">0/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">0</td>
                      </tr>
                      {/* MSN OUT INS Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">MSN OUT INS</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">6.36 mm</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">OD 6.36</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">0/KG</td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">0</td>
                      </tr>
                    </tbody>
                  </table>
              </div>

                {/* Bottom Summary Tables */}
                <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50">
                  {/* Material Inputs */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Material Inputs</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">ALUMINIUM:</span>
                        <input type="number" step="0.01" defaultValue="270.00" className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">ALLOY:</span>
                        <input type="number" step="0.01" defaultValue="270.00" className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                  </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">INNER INSU:</span>
                        <input type="number" step="0.01" defaultValue="120.00" className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">OUTER INSU:</span>
                        <input type="number" step="0.01" defaultValue="0.00" className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                  </div>
                </div>
              </div>

                  {/* Cable Weights */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Cable Weights</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">CABLE WT:</span>
                        <span className="text-xs text-gray-800 font-semibold">417 KG</span>
                  </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">ALUMINUM WT:</span>
                        <span className="text-xs text-gray-800 font-semibold">246 KG</span>
                          </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">ALLOY WT:</span>
                        <span className="text-xs text-gray-800 font-semibold">68 KG</span>
                            </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">INN XLPE WT:</span>
                        <span className="text-xs text-gray-800 font-semibold">103 KG</span>
                        </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">OUT XLPE WT:</span>
                        <span className="text-xs text-gray-800 font-semibold">0 KG</span>
                      </div>
                  </div>
                </div>
                  {/* Pricing and Drum Details */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Pricing & Details</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">DRUM 2X:</span>
                        <div className="flex items-center">
                          <input type="number" defaultValue="5000" className="w-16 text-xs text-blue-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                          <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
                  </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">FREIGHT:</span>
                        <input type="number" step="0.01" defaultValue="0" className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                  </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">LENGTH:</span>
                        <div className="flex items-center">
                          <input type="number" defaultValue="1000" className="w-16 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                          <span className="text-xs text-red-600 font-semibold ml-1">MTR</span>
                </div>
                  </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">SALE PRICE:</span>
                        <span className="text-xs text-green-600 font-semibold">₹ 122.51</span>
                        </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">PROFIT:</span>
                        <span className="text-xs text-blue-600 font-semibold">₹ 0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                )}

              {/* Reduction Gauge Calculator */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Reduction Gauge Calculator
                  </h2>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700" onClick={() => {/* TODO: compute Reduction Gauge */}}>
                    Calculate
                  </button>
                  </div>
                <div className="p-2">
                  <table className="w-full border-collapse border border-gray-200 text-[10px]">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-1 py-1 text-left font-semibold text-gray-600 border border-gray-200">AREA</th>
                        <th className="px-1 py-1 text-left font-semibold text-gray-600 border border-gray-200">AREA</th>
                        <th className="px-1 py-1 text-left font-semibold text-gray-600 border border-gray-200">REDUCTION %</th>
                        <th className="px-1 py-1 text-left font-semibold text-gray-600 border border-gray-200">STRAND</th>
                        <th className="px-1 py-1 text-left font-semibold text-gray-600 border border-gray-200">WIRE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* PHASE Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-1 py-1 text-gray-800 border border-gray-200 font-medium">PHASE</td>
                        <td className="px-1 py-1 border border-gray-200">
                          <input type="text" defaultValue="25 SQMM" className="w-full text-[10px] text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td rowSpan={3} className="px-1 py-1 align-middle border border-gray-200">
                          <input type="number" defaultValue="10" className="w-full text-[10px] text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none text-center" />
                        </td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">7</td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">2.02 MM</td>
                      </tr>
                      {/* STREET LIGHT Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-1 py-1 text-gray-800 border border-gray-200 font-medium">STREET LIGHT</td>
                        <td className="px-1 py-1 border border-gray-200">
                          <input type="text" defaultValue="16 SQMM" className="w-full text-[10px] text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">7</td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">1.62 MM</td>
                      </tr>
                      {/* MESSENGER Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-1 py-1 text-gray-800 border border-gray-200 font-medium">MESSENGER</td>
                        <td className="px-1 py-1 border border-gray-200">
                          <input type="text" defaultValue="25 SQMM" className="w-full text-[10px] text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">7</td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">2.02 MM</td>
                      </tr>
                    </tbody>
                  </table>
                        </div>
                <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600">
                  NOTE: UP TO & INCLUDED 150 SQMM.
                  </div>
                </div>

              {/* Wire Selection Calculator */}
              {selectedProduct.name.toLowerCase().includes('aerial bunch cable') && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Wire Selection Calculator
                  </h2>
                </div>
                <div className="p-2">
                  <table className="w-full border-collapse border border-gray-200 text-[10px]">
                    <thead>
                      <tr className="bg-black">
                        <th className="px-1 py-1 text-left font-semibold text-white border border-gray-200">PHASE Φ</th>
                        <th className="px-1 py-1 text-left font-semibold text-white border border-gray-200">POWER</th>
                        <th className="px-1 py-1 text-left font-semibold text-white border border-gray-200">LENGTH</th>
                        <th className="px-1 py-1 text-left font-semibold text-white border border-gray-200">CURRENT</th>
                        <th className="px-1 py-1 text-left font-semibold text-white border border-gray-200">GAUGE</th>
                        <th className="px-1 py-1 text-left font-semibold text-white border border-gray-200">WIRE SIZE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="px-1 py-1 border border-gray-200">
                          <input 
                            type="number" 
                            value={wsPhase}
                            onChange={(e) => setWsPhase(Number(e.target.value) || 1)}
                            className="w-full text-[10px] text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" 
                          />
                        </td>
                        <td className="px-1 py-1 border border-gray-200">
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              step="0.01" 
                              value={wsPower}
                              onChange={(e) => setWsPower(Number(e.target.value) || 0)}
                              className="flex-1 text-[10px] text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" 
                            />
                            <select 
                              value={wsPowerUnit}
                              onChange={(e) => setWsPowerUnit(e.target.value)}
                              className="text-[10px] text-red-600 border-0 focus:ring-0 focus:outline-none bg-transparent font-semibold"
                            >
                              <option>HP</option>
                              <option>KW</option>
                              <option>WATT</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-1 py-1 border border-gray-200">
                          <div className="flex items-center gap-1">
                            <input 
                              type="number" 
                              value={wsLength}
                              onChange={(e) => setWsLength(Number(e.target.value) || 0)}
                              className="flex-1 text-[10px] text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" 
                            />
                            <select 
                              value={wsLengthUnit}
                              onChange={(e) => setWsLengthUnit(e.target.value)}
                              className="text-[10px] text-red-600 border-0 focus:ring-0 focus:outline-none bg-transparent font-semibold"
                            >
                              <option>MTR</option>
                              <option>FT</option>
                            </select>
                  </div>
                        </td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">{wsCurrent.toFixed(2)}</td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">{wsActualGauge.toFixed(2)}</td>
                        <td className="px-1 py-1 text-blue-600 border border-gray-200 font-semibold">{wsWireSize}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              )}

              {/* Identification - Only for AB Cable */}
              {selectedProduct.name.toLowerCase().includes('aerial bunch cable') && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Identification
                  </h2>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-gray-800 mb-2">CORE IDENTIFICATION:</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The phase conductors shall be provided with one, two or three 'ridges' and Outer neutral insulated conductors,
                    if provided, shall have four 'ridges' as shown in Fig. I for quick identification. The street lighting conductor
                    and messenger conductor (if insulated) shall not have any identification mark.
                  </p>
                </div>

                  <div className="mt-4">
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src="/images/core-identification.png"
                      alt="Core Identification"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="absolute inset-0 items-center justify-center text-gray-400 hidden">
                        <div className="text-center p-8">
                          <Image className="h-10 w-10 mx-auto mb-2" />
                          <p className="text-xs">Core identification image</p>
                  </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h6 className="font-semibold text-blue-800 mb-2 text-sm">Key Points:</h6>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• PHASE CONDUCTORS: 1, 2, OR 3 RIDGES FOR IDENTIFICATION</li>
                      <li>• STREET LIGHTING CONDUCTOR: NO IDENTIFICATION MARKS</li>
                      <li>• NEUTRAL CONDUCTOR HAS NO IDENTIFIFCATION MARK AS PER IS14255 OR 4 RIDGES AS ON DEMAND (if insulated)</li>
                    </ul>
                  </div>
                </div>
              </div>
              )}

              {/* Technical Documents - BIS Folder Buttons (like desktop) */}
              {(selectedProduct.name.toLowerCase().includes('aerial bunch cable') || 
                selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ||
                selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor') ||
                selectedProduct.name.toLowerCase().includes('multi core xlpe insulated aluminium unarmoured cable') ||
                selectedProduct.name.toLowerCase().includes('single core xlpe insulated aluminium/copper armoured/unarmoured cable')) && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Technical Documents</h2>
                  </div>
                  <div className="p-4">
                    {!isBisFolderOpen ? (
                      <button
                        onClick={openBisFolder}
                        className="w-full p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <Folder className="h-6 w-6 text-yellow-500" />
                          <h4 className="text-base font-semibold text-gray-900">BIS</h4>
                          </div>
                      </button>
                    ) : (
                      <div className="space-y-3">
                        {/* Back Button */}
                        <button
                          onClick={closeBisFolder}
                          className="w-full p-2 mb-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 rotate-180 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Back</span>
                          </div>
                        </button>

                        {/* BIS Components */}
                    <div className="space-y-2">
                          {['14255', '694', '389 - P2', '398 - P4', '1554 - P1', '7098 - P1'].map((component, index) => {
                        const pdfMappings = {
                              '14255': 'aerial bunch cable, bis liscence .pdf',
                              '389 - P2': 'aluminium conductor galvanised steel reinforced, bis liscence.pdf',
                              '398 - P4': 'all aluminium alloy conductor,bis liscence.pdf',
                              '7098': 'multicore xlpe insulated aluminium unrmoured cable,bis liscence.pdf',
                              '7098 - P1': 'single core xlpe insulated aluminium:copper armoured:unarmoured cable bis liscence.pdf'
                            };
                            const hasPdf = pdfMappings[component] !== undefined;
                            
                            return (
                              <button
                                key={index}
                                onClick={() => {
                                  if (hasPdf) {
                                    openBisComponentPdf(component);
                                  }
                                }}
                                disabled={!hasPdf}
                                className={`w-full p-3 rounded-lg border transition-all duration-200 ${
                                  hasPdf
                                    ? 'border-gray-200 bg-white hover:bg-gray-50 cursor-pointer' 
                                    : 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className={`h-5 w-5 ${
                                    hasPdf ? 'text-gray-600' : 'text-gray-400'
                                  }`} />
                                  <h4 className={`text-sm font-semibold ${
                                    hasPdf ? 'text-gray-900' : 'text-gray-500'
                                  }`}>{component}</h4>
                                </div>
                    </button>
                            );
                          })}
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {bisPreviewOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setBisPreviewOpen(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] overflow-hidden" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-2 border-b">
              <div className="text-sm font-semibold">BIS License - Aerial Bunch Cable</div>
              <div className="flex items-center gap-2">
                {bisDocUrl && (
                  <a href={bisDocUrl} download className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Download</a>
                )}
                <button className="px-2 py-1 text-xs bg-gray-200 rounded" onClick={()=>setBisPreviewOpen(false)}>Close</button>
                  </div>
                </div>
            <div className="w-full h-full">
              {bisDocUrl ? (
                <iframe title="BIS Document" src={bisDocUrl} className="w-full h-full" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">No document uploaded yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Upcoming Modal */}
      {showDataUpcoming && (
        <div className="fixed inset-0 z-[70] bg-black/50 flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>
              <button
                onClick={() => setShowDataUpcoming(false)}
                className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Close
              </button>
            </div>

            {/* Content */}
            <div className="p-8 flex items-center justify-center flex-grow">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Upcoming</h3>
                <p className="text-gray-600">Product data will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => {
          setPreviewUrl("");
          setViewingImageRowIndex(null);
          setViewingImageIndex(null);
        }}>
          <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] overflow-hidden relative" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-2 border-b">
              <div className="text-sm font-semibold">Image Preview</div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleImageDeleteFromModal}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  title="Delete this image"
                >
                  Delete
                </button>
                <button 
                  className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300" 
                  onClick={() => {
                    setPreviewUrl("");
                    setViewingImageRowIndex(null);
                    setViewingImageIndex(null);
                  }}
                >
                  Close
                </button>
              </div>
                </div>
            <div className="w-full h-full flex items-center justify-center p-4">
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar */}
      {isRightSidebarOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsRightSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed right-0 top-[64px] h-[calc(100vh-64px)] w-[85vw] max-w-sm bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto">
            <div className="p-4 pt-12 relative">
              {/* Close Button */}
              <button
                onClick={() => setIsRightSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
              
              {/* Business Cards & Brochure */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Business Card - Anocab */}
                  <div className="flex-1">
                    <div 
                      className="p-3 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                      onClick={openBusinessCard}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="w-full">
                          <h3 className="font-semibold text-xs text-gray-900">Anocab Business Card</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Samriddhi Industries Business Card */}
                  <div className="flex-1">
                    <div 
                      className="p-3 rounded-xl border border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                      onClick={openSamriddhiBusinessCard}
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="w-full">
                          <h3 className="font-semibold text-xs text-gray-900">Samriddhi Business Card</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Brochure */}
                <div className="w-full">
                  <div 
                    className="p-3 rounded-xl border border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                    onClick={openBrochure}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-full">
                        <h3 className="font-semibold text-xs text-gray-900">Brochure</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approvals */}
              <div className="mb-4">
                <div 
                  className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={openApprovals}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Approvals</h3>
                      <p className="text-xs text-gray-600">Product approvals and certifications</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* License */}
              <div className="mb-4">
                <div 
                  className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={openLicense}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">License</h3>
                      <p className="text-xs text-gray-600">Company licenses and certifications</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* GST Details */}
              <div className="mb-4">
                <div 
                  className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => setIsGstDetailsOpen(!isGstDetailsOpen)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm">
                      <CreditCard className="h-5 w-5 text-white" />
                  </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">GST Details</h3>
                      <p className="text-xs text-gray-600">Tax registration information</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isGstDetailsOpen ? 'rotate-90' : ''}`} />
                  </div>
                </div>
                
                {isGstDetailsOpen && (
                  <div className="mt-3 space-y-3">
                    {/* ANODE ELECTRIC PVT LTD */}
                    <div className="p-3 rounded-lg border bg-white border-gray-200">
                      <div className="font-semibold text-xs mb-1 text-purple-700">ANODE ELECTRIC PVT LTD.</div>
                      <div className="font-mono text-xs text-gray-700">23AANCA7455R1ZX</div>
                    </div>
                    
                    {/* SAMRIDDHI CABLE INDUSTRIES PVT LTD */}
                    <div className="p-3 rounded-lg border bg-white border-gray-200">
                      <div className="font-semibold text-xs mb-1 text-purple-700">SAMRIDDHI CABLE INDUSTRIES PVT LTD.</div>
                      <div className="font-mono text-xs text-gray-700">23ABPCS7684F1ZT</div>
                    </div>
                    
                    {/* SAMRIDDHI INDUSTRIES */}
                    <div className="p-3 rounded-lg border bg-white border-gray-200">
                      <div className="font-semibold text-xs mb-1 text-purple-700">SAMRIDDHI INDUSTRIES</div>
                      <div className="font-mono text-xs text-gray-700">23ABWFS1117M1ZT</div>
                    </div>
                  </div>
                )}
                    </div>

              {/* Company Emails */}
              <div className="mb-4">
                <div 
                  className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={openCompanyEmails}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-sm">
                      <Mail className="h-5 w-5 text-white" />
                      </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Company Emails</h3>
                      <p className="text-xs text-gray-600">All company email addresses</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                      </div>

              {/* Location Dropdown */}
              <div className="mb-4">
                <div 
                  className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => setShowLocations(!showLocations)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 shadow-sm">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Location</h3>
                      <p className="text-xs text-gray-600">Company locations</p>
                  </div>
                    <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showLocations ? 'rotate-90' : ''}`} />
                </div>
              </div>
                
                {showLocations && (
                  <div className="mt-3 space-y-2">
                    {locations.map((location, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                          selectedLocation === location.name 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedLocation(location.name)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedLocation === location.name ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <MapPin className={`h-4 w-4 ${
                              selectedLocation === location.name ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-semibold mb-1 ${
                              selectedLocation === location.name ? 'text-blue-900' : 'text-gray-900'
                            }`}>{location.name}</div>
                            <div className={`text-xs ${
                              selectedLocation === location.name ? 'text-blue-700' : 'text-gray-600'
                            }`}>{location.address}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Helping Calculators */}
              <div className="mb-4">
                <div 
                  className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => setShowHelpingCalculators(!showHelpingCalculators)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-sm">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Helping Calculators</h3>
                      <p className="text-xs text-gray-600">Advanced calculation tools</p>
                    </div>
                    <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showHelpingCalculators ? 'rotate-90' : ''}`} />
                  </div>
                </div>
                
                {showHelpingCalculators && (
                  <div className="mt-3 space-y-2">
                    {[
                      { name: "TECHNICAL CALCULATIONS", description: "Advanced technical calculation tools", icon: Calculator },
                      { name: "CONVERSIONAL CALCULATIONS", description: "Unit conversion and calculation utilities", icon: Settings },
                      { name: "WIRE GAUGE CHART", description: "Wire gauge reference and calculations", icon: BarChart3 },
                      { name: "TEMPERATURE CORRECTION FACTORS kt FOR CONDUCTOR RESISTANCE TO CORRECT THE MEASURED RESISTANCE AT t°C TO 20°C", description: "Temperature correction factor calculations", icon: Wrench },
                    ].map((calculator, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-teal-50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => {
                          if (calculator.name === 'TECHNICAL CALCULATIONS') {
                            setHelpingCalcType('technical');
                            setIsHelpingCalcOpen(true);
                          } else if (calculator.name === 'CONVERSIONAL CALCULATIONS') {
                            setHelpingCalcType('conversional');
                            setIsHelpingCalcOpen(true);
                          } else if (calculator.name === 'WIRE GAUGE CHART') {
                            setHelpingCalcType('wire-gauge');
                            setIsHelpingCalcOpen(true);
                          } else if (calculator.name === 'TEMPERATURE CORRECTION FACTORS kt FOR CONDUCTOR RESISTANCE TO CORRECT THE MEASURED RESISTANCE AT t°C TO 20°C') {
                            setHelpingCalcType('temperature-correction');
                            setIsHelpingCalcOpen(true);
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-teal-100">
                            <calculator.icon className="h-4 w-4 text-teal-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{calculator.name}</span>
                            <p className="text-xs mt-1 text-gray-500">{calculator.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Business Card Modal */}
      {isBusinessCardModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setIsBusinessCardModalOpen(false)}>
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden border border-gray-200 flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header with Actions */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Anocab Business Card</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadBusinessCard('image')}
                  className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                  title="Download as Image"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => downloadBusinessCard('pdf')}
                  className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                  title="Download as PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsBusinessCardModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Business Card Content - for download */}
            <div className="py-8 px-4">
              <div ref={businessCardRef} className="w-[320px] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 flex flex-col mx-auto" style={{ minHeight: '500px' }}>
              {/* Top Section - Logo */}
              <div className="px-6 py-5 flex flex-col items-center bg-white">
                <img
                  src="/images/Anocab logo.png"
                  alt="Anocab Logo"
                  className="h-32 w-auto object-contain mb-2"
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Middle Section - Name, Title, and QR Code */}
              <div className="px-6 py-3 flex items-start justify-between bg-white">
                <div className="flex-1 pr-3">
                  <h1 className="text-2xl font-bold text-black mb-1 leading-tight" style={{ fontFamily: 'serif' }}>Saurabh Jhariya</h1>
                  <p className="text-base text-black" style={{ fontFamily: 'serif' }}>(Sales Head)</p>
                </div>
                <img
                  src="/images/QRs/SAURABH.jpg"
                  alt="QR Code"
                  className="w-20 h-20 object-contain flex-shrink-0 border border-gray-300 bg-white"
                  onError={(e) => {
                    console.error('QR Code failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Bottom Section - Company Name and Contact Details */}
              <div className="px-6 py-5 bg-white border-t border-gray-100 mt-auto">
                <h2 className="text-xl font-bold text-black text-center mb-4" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Bodoni Moda', 'Didot', serif", fontWeight: 700, letterSpacing: '0.02em' }}>Anode Electric Pvt. Ltd.</h2>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs">6262002116</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs">Saurabh@anocab.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs">www.anocab.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs leading-tight">Plot No. 10, IT Park, Bargi Hills, Jabalpur, M.P.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs">1800 27000 75</span>
                  </div>
                  <div className="h-4"></div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Samriddhi Industries Business Card Modal */}
      {isSamriddhiBusinessCardModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={closeSamriddhiBusinessCard}>
          <div className="bg-white rounded-lg w-full max-w-md overflow-hidden border border-gray-200 flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header with Actions */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Samriddhi Business Card</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadSamriddhiBusinessCard('image')}
                  className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                  title="Download as Image"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => downloadSamriddhiBusinessCard('pdf')}
                  className="p-2 rounded-lg hover:bg-green-100 text-green-600 transition-colors"
                  title="Download as PDF"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <button 
                  onClick={closeSamriddhiBusinessCard}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Business Card Content - for download */}
            <div className="py-8 px-4">
              <div ref={samriddhiBusinessCardRef} className="w-[320px] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 flex flex-col mx-auto" style={{ minHeight: '500px' }}>
              {/* Top Section - JEO Logo (Top Left) */}
              <div className="px-6 pt-5 pb-2 flex items-start bg-white">
                <img
                  src="/images/Samriddhi 1 logo.png"
                  alt="JEO Wires & Cables Logo"
                  className="h-16 w-auto object-contain"
                  onError={(e) => {
                    console.error('JEO Logo failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Middle Section - Name, Title, QR Code, and Samriddhi Logo */}
              <div className="px-6 py-3 bg-white">
                {/* Name, Title, and QR Code Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-3">
                    <h1 className="text-2xl font-bold text-black mb-1 leading-tight" style={{ fontFamily: 'serif' }}>Saurabh Jhariya</h1>
                    <p className="text-base text-black" style={{ fontFamily: 'serif' }}>(Sales Head)</p>
                  </div>
                  <img
                    src="/images/QRs/SAURABH.jpg"
                    alt="QR Code"
                    className="w-20 h-20 object-contain flex-shrink-0 border border-gray-300 bg-white"
                    onError={(e) => {
                      console.error('QR Code failed to load:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Samriddhi Industries Logo (Centered) */}
                <div className="flex justify-center mb-4">
                  <img
                    src="/images/Samriddhi logo.png"
                    alt="Samriddhi Industries Logo"
                    className="h-32 w-auto object-contain"
                    onError={(e) => {
                      console.error('Samriddhi Logo failed to load:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Bottom Section - Contact Details */}
              <div className="px-6 py-5 bg-white border-t border-gray-100 mt-auto">
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs">6262002116</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs">Saurabh@anocab.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs">www.anocab.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs leading-tight">W. No 73 infront of Dadda Nagar, Karmeta Road, Jabalpur, 482002</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="text-teal-700 font-mono text-xs">1800 27000 75</span>
                  </div>
                  <div className="h-4"></div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approvals Modal */}
      {isApprovalsModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4" onClick={closeApprovals}>
          <div className="bg-white rounded-lg w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Approvals</h3>
              <button 
                onClick={closeApprovals}
                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-3">
                {/* CHHATTISGARH */}
                <button
                  onClick={() => openApprovalPdf('CHHATTISGARH')}
                  className="w-full p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">CHHATTISGARH</h4>
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                </button>

                {/* MADHYA PRADESH */}
                <button
                  onClick={() => openApprovalPdf('MADHYA PRADESH')}
                  className="w-full p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">MADHYA PRADESH</h4>
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                </button>

                {/* MAHARASHTRA */}
                <button
                  onClick={() => openApprovalPdf('MAHARASHTRA')}
                  className="w-full p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">MAHARASHTRA</h4>
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Emails Modal */}
      {isCompanyEmailsModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setIsCompanyEmailsModalOpen(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-100">
                  <Mail className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Company Emails</h2>
                  <p className="text-sm text-gray-600">All company email addresses</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCompanyEmailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {/* Anshul Gupta - Managing Director */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Anshul Gupta</h3>
                      <p className="text-xs text-gray-600">Managing Director</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:MD@anocab.in" 
                    className="text-xs font-mono text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    MD@anocab.in
                  </a>
                  </div>

                {/* Suraj Gehani - Chief Executive Officer */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-green-100">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Suraj Gehani</h3>
                      <p className="text-xs text-gray-600">Chief Executive Officer</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:CEO@anocab.in" 
                    className="text-xs font-mono text-green-600 hover:text-green-700 hover:underline cursor-pointer"
                  >
                    CEO@anocab.in
                  </a>
                </div>

                {/* Akash Gupta - General Manager */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-purple-100">
                      <User className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Akash Gupta</h3>
                      <p className="text-xs text-gray-600">General Manager</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:GM@anocab.in" 
                    className="text-xs font-mono text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                  >
                    GM@anocab.in
                  </a>
                  </div>

                {/* Anushree Namdeo - CM */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-pink-100">
                      <User className="h-4 w-4 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Anushree Namdeo</h3>
                      <p className="text-xs text-gray-600">CM</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:CM@anocab.in" 
                    className="text-xs font-mono text-pink-600 hover:text-pink-700 hover:underline cursor-pointer"
                  >
                    CM@anocab.in
                  </a>
                </div>

                {/* Chief Financial Officer - CFO */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-yellow-100">
                      <User className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Chief Financial Officer</h3>
                      <p className="text-xs text-gray-600">CFO</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:CFO@anocab.in" 
                    className="text-xs font-mono text-yellow-600 hover:text-yellow-700 hover:underline cursor-pointer"
                  >
                    CFO@anocab.in
                  </a>
                  </div>

                {/* Saurabh Jhariya - Area Sales Manager */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-indigo-100">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Saurabh Jhariya</h3>
                      <p className="text-xs text-gray-600">Area Sales Manager</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:admin@anocab.in" 
                    className="text-xs font-mono text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    admin@anocab.in
                  </a>
                </div>

                {/* Deepshikha Jhariya - Junior Accountant */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-teal-100">
                      <User className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Deepshikha Jhariya</h3>
                      <p className="text-xs text-gray-600">Junior Accountant</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:deepshikha@anocab.com" 
                    className="text-xs font-mono text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                  >
                    deepshikha@anocab.com
                  </a>
                  </div>

                {/* Rajvansh Samal - Production Planning Controller */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-orange-100">
                      <User className="h-4 w-4 text-orange-600" />
                </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Rajvansh Samal</h3>
                      <p className="text-xs text-gray-600">Production Planning Controller</p>
              </div>
            </div>
                  <a 
                    href="mailto:rajvansh@anocab.com" 
                    className="text-xs font-mono text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                  >
                    rajvansh@anocab.com
                  </a>
                </div>

                {/* Tukesh Bisen - Senior Supervisor */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-cyan-100">
                      <User className="h-4 w-4 text-cyan-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Tukesh Bisen</h3>
                      <p className="text-xs text-gray-600">Senior Supervisor</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:tukesh@anocab.com" 
                    className="text-xs font-mono text-cyan-600 hover:text-cyan-700 hover:underline cursor-pointer"
                  >
                    tukesh@anocab.com
                  </a>
                </div>

                {/* Abhishek Namdeo - Employee */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-amber-100">
                      <User className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Abhishek Namdeo</h3>
                      <p className="text-xs text-gray-600">Employee</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:acnt.anocab@gmail.com" 
                    className="text-xs font-mono text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
                  >
                    acnt.anocab@gmail.com
                  </a>
                </div>

                {/* Vivian James - Security */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-red-100">
                      <User className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Vivian James</h3>
                      <p className="text-xs text-gray-600">Security</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:vivian@anocab.com" 
                    className="text-xs font-mono text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                  >
                    vivian@anocab.com
                  </a>
                </div>

                {/* Sameer Giri - COO */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-violet-100">
                      <User className="h-4 w-4 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Sameer Giri</h3>
                      <p className="text-xs text-gray-600">COO</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:COO@anocab.in" 
                    className="text-xs font-mono text-violet-600 hover:text-violet-700 hover:underline cursor-pointer"
                  >
                    COO@anocab.in
                  </a>
                </div>

                {/* Himanshu Sen - Sales Executive */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100">
                      <User className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Himanshu Sen</h3>
                      <p className="text-xs text-gray-600">Sales Executive</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:himanshusen@anocab.com" 
                    className="text-xs font-mono text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    himanshusen@anocab.com
                  </a>
                </div>

                {/* Vaishnavi Rajbhar - Sales Executive */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-rose-100">
                      <User className="h-4 w-4 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Vaishnavi Rajbhar</h3>
                      <p className="text-xs text-gray-600">Sales Executive</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:VAISHNAVI@anocab.com" 
                    className="text-xs font-mono text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    VAISHNAVI@anocab.com
                  </a>
                </div>

                {/* Radhika Jhariya - Sales Executive */}
                <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-sky-100">
                      <User className="h-4 w-4 text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Radhika Jhariya</h3>
                      <p className="text-xs text-gray-600">Sales Executive</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:radhika@anocab.com" 
                    className="text-xs font-mono text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                  >
                    radhika@anocab.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for price list images */}
      <input
        ref={imageUploadInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Image Upload Modal */}
      {isImageUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upload Image/Video</h3>
            <p className="text-sm text-gray-600 mb-4">Click the button below to select a file</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (imageUploadInputRef.current) {
                    imageUploadInputRef.current.click();
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Select File
              </button>
              <button
                onClick={() => {
                  setIsImageUploadOpen(false);
                  setSelectedImageIndex(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {isFileViewerOpen && viewingImageRowIndex !== null && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-lg max-w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Image/Video Preview</h3>
              <button
                onClick={() => {
                  setIsFileViewerOpen(false);
                  setViewingImageRowIndex(null);
                  setCurrentSlide(0);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4 relative">
              {(() => {
                const imageList = productImages[selectedProduct?.name]?.[viewingImageRowIndex] || [];
                if (imageList.length === 0) return <p className="text-gray-500">No images available</p>;
                
                const currentFile = imageList[currentSlide];
                const fileUrl = typeof currentFile === 'string' ? currentFile : (currentFile?.file_url || currentFile?.url || String(currentFile || ''));
                const isVideo = typeof fileUrl === 'string' && (fileUrl.match(/\.(mp4|webm|ogg)$/i) || fileUrl.includes('/video/'));
                
                return (
                  <>
                    {currentSlide > 0 && (
                      <button
                        onClick={() => setCurrentSlide(currentSlide - 1)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronRight className="h-5 w-5 rotate-180" />
                      </button>
                    )}
                    
                    <div className="max-w-full max-h-[70vh] flex items-center justify-center">
                      {isVideo ? (
                        <video src={fileUrl} controls className="max-w-full max-h-full" />
                      ) : (
                        <img src={fileUrl} alt={`Preview ${currentSlide + 1}`} className="max-w-full max-h-full object-contain" />
                      )}
                    </div>
                    
                    {currentSlide < imageList.length - 1 && (
                      <button
                        onClick={() => setCurrentSlide(currentSlide + 1)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    )}
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentSlide + 1} / {imageList.length}
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <button
                onClick={handleImageDeleteFromModal}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
              <button
                onClick={() => {
                  const imageList = productImages[selectedProduct?.name]?.[viewingImageRowIndex] || [];
                  const currentFile = imageList[currentSlide];
                  const fileUrl = typeof currentFile === 'string' ? currentFile : (currentFile?.file_url || currentFile?.url || String(currentFile || ''));
                  if (fileUrl) {
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = '';
                    link.target = '_blank';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Helping Calculators Modal - Technical Calculations */}
      {isHelpingCalcOpen && helpingCalcType === 'technical' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2">
          <div className="w-full max-w-full max-h-[95vh] overflow-y-auto bg-white rounded-lg">
            <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-gray-900">Technical Calculations</h3>
              <button onClick={closeHelpingCalc} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 space-y-4">
              {/* AERIAL BUNCHED CABLE PARAMETERS */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">AERIAL BUNCHED CABLE PARAMETERS CALCULATOR</h5>
                </div>
                <div className="p-3 space-y-3">
                  {/* Reduction % - Shared across all rows */}
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Reduction (%)</label>
                    <input 
                      type="number" 
                      value={tcReductionPercent} 
                      onChange={(e)=>setTcReductionPercent(Number(e.target.value))} 
                      className="w-full px-2 py-1.5 text-xs text-red-600 font-semibold bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>

                  {/* PHASE Row */}
                  <div className="border border-gray-300 rounded-lg p-2 space-y-2">
                    <div className="font-semibold text-xs text-gray-800 mb-2">{tcAerialParams[0]?.core}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">X-Selection Area</label>
                        <input 
                          type="text" 
                          value={tcAerialParams[0]?.xSelectionArea} 
                          onChange={(e)=>{ const v=e.target.value; setTcAerialParams(prev=>{ const next=[...prev]; next[0]={...prev[0], xSelectionArea:v}; return next;}); }} 
                          className="w-full px-2 py-1.5 text-xs text-red-600 font-semibold bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">No of Strands</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{phaseNoOfStrands}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Wire Size of Gauge</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{phaseWireSize > 0 ? `${phaseWireSize.toFixed(2)} MM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Selectional Area</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{phaseSelectionalArea > 0 ? `${Math.round(phaseSelectionalArea)} SQMM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Insulation Thickness</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{phaseInsulationThickness > 0 ? `${phaseInsulationThickness.toFixed(2)} MM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">OD of Cable</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{phaseOdOfCable > 0 ? `${phaseOdOfCable.toFixed(2)} MM` : '-'}</div>
                      </div>
                    </div>
                  </div>

                  {/* ST LIGHT Row */}
                  <div className="border border-gray-300 rounded-lg p-2 space-y-2">
                    <div className="font-semibold text-xs text-gray-800 mb-2">{tcAerialParams[1]?.core}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">X-Selection Area</label>
                        <input 
                          type="text" 
                          value={tcAerialParams[1]?.xSelectionArea} 
                          onChange={(e)=>{ const v=e.target.value; setTcAerialParams(prev=>{ const next=[...prev]; next[1]={...prev[1], xSelectionArea:v}; return next;}); }} 
                          className="w-full px-2 py-1.5 text-xs text-red-600 font-semibold bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">No of Strands</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{streetNoOfStrands}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Wire Size of Gauge</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{streetWireSize > 0 ? `${streetWireSize.toFixed(2)} MM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Selectional Area</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{streetSelectionalArea > 0 ? `${Math.round(streetSelectionalArea)} SQMM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Insulation Thickness</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{streetInsulationThickness > 0 ? `${streetInsulationThickness.toFixed(2)} MM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">OD of Cable</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{streetOdOfCable > 0 ? `${streetOdOfCable.toFixed(2)} MM` : '-'}</div>
                      </div>
                    </div>
                  </div>

                  {/* MESSENGER Row */}
                  <div className="border border-gray-300 rounded-lg p-2 space-y-2">
                    <div className="font-semibold text-xs text-gray-800 mb-2">{tcAerialParams[2]?.core}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">X-Selection Area</label>
                        <input 
                          type="text" 
                          value={tcAerialParams[2]?.xSelectionArea} 
                          onChange={(e)=>{ const v=e.target.value; setTcAerialParams(prev=>{ const next=[...prev]; next[2]={...prev[2], xSelectionArea:v}; return next;}); }} 
                          className="w-full px-2 py-1.5 text-xs text-red-600 font-semibold bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">No of Strands</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{messengerNoOfStrands}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Wire Size of Gauge</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{messengerWireSize > 0 ? `${messengerWireSize.toFixed(2)} MM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Selectional Area</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{messengerSelectionalArea > 0 ? `${Math.round(messengerSelectionalArea)} SQMM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">Insulation Thickness</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{messengerInsulationThickness > 0 ? `${messengerInsulationThickness.toFixed(2)} MM` : '-'}</div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-600 mb-1">OD of Cable</label>
                        <div className="px-2 py-1.5 text-xs font-semibold text-blue-600 bg-gray-50 border border-gray-200 rounded-md">{messengerOdOfCable > 0 ? `${messengerOdOfCable.toFixed(2)} MM` : '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CURRENT CARRYING CAPACITY & RESISTANCE CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">CURRENT CARRYING CAPACITY & RESISTANCE CALCULATOR</h5>
                  <p className="text-[9px] text-gray-600 mt-1">CURRENT CARRYING CAPACITY & RESISTANCE ACCORDING TO INDIAN STANDARDS</p>
                </div>
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Conductor Type</label>
                      <select value={tcConductorType} onChange={(e)=>setTcConductorType(e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option>AAAC Conductor</option>
                        <option>AB Cable</option>
                        <option>ACSR Conductor</option>
                        <option>Submersible Flat Cable</option>
                        <option>Copper House Wire</option>
                        <option>Agricultural Wire</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Standard</label>
                      <input value={tcStandard} onChange={(e)=>setTcStandard(e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Selection Area</label>
                      <input value={tcSelectionArea} onChange={(e)=>setTcSelectionArea(e.target.value)} className="w-full px-2 py-1.5 text-xs text-blue-700 font-semibold bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">CCC (Amps/km)</label>
                      <input value={tcCCCAmpsKm} onChange={(e)=>setTcCCCAmpsKm(e.target.value)} className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">At °C (Amps)</label>
                      <input value={tcAtCAmp1} onChange={(e)=>setTcAtCAmp1(e.target.value)} className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">AC Resistance (Ω/km)</label>
                      <input value={tcACResistance} onChange={(e)=>setTcACResistance(e.target.value)} className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">At °C (Amps)</label>
                      <input value={tcAtCAmp2} onChange={(e)=>setTcAtCAmp2(e.target.value)} className="w-full px-2 py-1.5 text-xs bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* AAAC CONDUCTOR PARAMETERS */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm"><h5 className="text-xs font-semibold text-gray-900">AAAC CONDUCTOR PARAMETERS CALCULATOR</h5></div>
                <div className="p-3 space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Select Conductor</label>
                    <select value={aaacSelected} onChange={(e)=>setAaacSelected(e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500">{aaacOptions.map(o => (<option key={o.name}>{o.name}</option>))}</select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Conductor Code</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{aaacCurrent.code}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Selectional Area (mm²)</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-blue-700 bg-gray-50 border border-gray-200 rounded-md">{aaacCurrent.area}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Stranding & Wire Dia. (nos/mm)</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-blue-700 bg-gray-50 border border-gray-200 rounded-md">{aaacCurrent.strandDia}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">DC Resistance (N) Normal (Ω/km)</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-blue-700 bg-gray-50 border border-gray-200 rounded-md">{aaacCurrent.dcResistance}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACSR CONDUCTOR PARAMETERS */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm"><h5 className="text-xs font-semibold text-gray-900">ACSR CONDUCTOR PARAMETERS CALCULATOR</h5></div>
                <div className="p-3 space-y-3">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-600 mb-1">Select Conductor</label>
                    <select value={acsrSelected} onChange={(e)=>setAcsrSelected(e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500">{acsrOptions.map(o => (<option key={o.name}>{o.name}</option>))}</select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Conductor Code</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{acsrCurrent.code}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Selectional Area (mm²)</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-blue-700 bg-gray-50 border border-gray-200 rounded-md">{acsrCurrent.area}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Stranding & Wire Dia. - Aluminium</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-blue-700 bg-gray-50 border border-gray-200 rounded-md">{acsrCurrent.alStrandDia}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Stranding & Wire Dia. - Steel</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-blue-700 bg-gray-50 border border-gray-200 rounded-md">{acsrCurrent.steelStrandDia}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">DC Resistance At 20°C (Ω/km)</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-blue-700 bg-gray-50 border border-gray-200 rounded-md">{acsrCurrent.dcResistance20}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACSR Cross-Section Diagram - Only for Aluminium Conductor Galvanized Steel Reinforced */}
              {selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Image className="h-5 w-5 text-blue-600" />
                      ACSR Conductor Cross-Section
                    </h2>
                  </div>
                  <div className="p-3 bg-gray-50">
                    <div className="w-full max-w-md mx-auto">
                      <img 
                        src="https://res.cloudinary.com/ddmxndtt6/image/upload/v1764248517/Screenshot_2025-11-27_at_6.31.24_PM_wn8tge.png" 
                        alt="ACSR Conductor Cross-Section showing Steel Reinforced core and Aluminum Conductor layers with labeled arrows"
                        className="w-full h-auto object-contain rounded-lg shadow-sm"
                        style={{ maxHeight: '400px' }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-64 bg-gray-100 rounded-lg items-center justify-center text-gray-400">
                        <div className="text-center p-4">
                          <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-xs font-medium">ACSR Cross-Section Diagram</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Helping Calculators Modal - Conversional Calculations */}
      {isHelpingCalcOpen && helpingCalcType === 'conversional' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2">
          <div className="w-full max-w-full max-h-[95vh] overflow-y-auto bg-white rounded-lg">
            <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-gray-900">Conversional Calculations</h3>
              <button onClick={closeHelpingCalc} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3 space-y-4">
              {/* LENGTH CONVERSION CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">Length Conversion Calculator</h5>
                </div>
                <div className="p-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">From</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={convLenValL} 
                          onChange={(e) => setConvLenValL(Number(e.target.value) || 0)}
                          className="flex-1 px-2 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={convLenUnitL}
                          onChange={(e) => setConvLenUnitL(e.target.value)}
                          className="px-2 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>km</option>
                          <option>m</option>
                          <option>dm</option>
                          <option>cm</option>
                          <option>mm</option>
                          <option>yd</option>
                          <option>ft</option>
                          <option>in</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-xl text-gray-400 font-semibold">→</div>
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">To</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={convLenValR.toFixed(4)} 
                          className="flex-1 px-2 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-300 rounded-md" 
                          readOnly 
                        />
                        <select 
                          value={convLenUnitR}
                          onChange={(e) => setConvLenUnitR(e.target.value)}
                          className="px-2 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>km</option>
                          <option>m</option>
                          <option>dm</option>
                          <option>cm</option>
                          <option>mm</option>
                          <option>yd</option>
                          <option>ft</option>
                          <option>in</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TEMPERATURE CONVERTOR CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">Temperature Convertor Calculator</h5>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">kt Factor</label>
                      <input 
                        type="number" 
                        step="0.001" 
                        value={ktFactor}
                        onChange={(e) => setKtFactor(Number(e.target.value) || 0)}
                        className="w-full px-2 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Temperature (°C)</label>
                      <input 
                        type="number" 
                        value={ktTemp}
                        onChange={(e) => setKtTemp(Number(e.target.value) || 0)}
                        className="w-full px-2 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">t°C to 20°C</label>
                      <input 
                        type="number" 
                        step="0.001" 
                        value={ktTo20}
                        className="w-full px-2 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-300 rounded-md" 
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CABLE SELECTION FOR SUBMERSIBLE MOTOR CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">Cable Selection for Submersible Motor</h5>
                  <p className="text-[9px] text-gray-600">3 PHASE, 220-240 V, 50Hz | Direct on line Starter</p>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Motor Rating</label>
                      <div className="space-y-1">
                        <input 
                          type="number" 
                          value={subMotorRating}
                          onChange={(e) => setSubMotorRating(Number(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={subMotorUnit}
                          onChange={(e) => setSubMotorUnit(e.target.value)}
                          className="w-full px-2 py-1.5 text-[10px] text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>HP</option>
                          <option>KW</option>
                          <option>WATT</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Length</label>
                      <div className="space-y-1">
                        <input 
                          type="number" 
                          value={subMotorLen}
                          onChange={(e) => setSubMotorLen(Number(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={subMotorLenUnit}
                          onChange={(e) => setSubMotorLenUnit(e.target.value)}
                          className="w-full px-2 py-1.5 text-[10px] text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>MTR</option>
                          <option>FT</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Voltage Drop</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subVoltDrop).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Current (Ω)</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subCurrent).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Actual Gauge</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subActualGauge).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Cable Size</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{subCableSize}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ARMOURING COVERING CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">Armouring Covering Calculator</h5>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Armoured OD</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armOd).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Wire/Strip OD</label>
                      <input 
                        type="number" 
                        value={armWireStripOd}
                        onChange={(e) => setArmWireStripOd(Number(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Width</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armWidth).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Lay</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armLay).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">COS(Φ)</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armCosPhi).toFixed(4)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Inner OD</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armInnerOd).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Covering %</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armCoveringPct).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">N/O Wires</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{armNoWires}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ENERGY CONVERSION CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">Energy Conversion Calculator</h5>
                </div>
                <div className="p-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">From</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={energyValL}
                          onChange={(e) => setEnergyValL(Number(e.target.value) || 0)}
                          className="flex-1 px-2 py-2 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={energyUnitL}
                          onChange={(e) => setEnergyUnitL(e.target.value)}
                          className="px-2 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>J</option>
                          <option>kJ</option>
                          <option>Wh</option>
                          <option>kWh</option>
                          <option>cal</option>
                          <option>kcal</option>
                          <option>BTU</option>
                          <option>eV</option>
                          <option>MJ</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-xl text-gray-400 font-semibold">→</div>
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">To</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          step="0.0001" 
                          value={energyValR.toFixed(4)} 
                          className="flex-1 px-2 py-2 text-xs text-gray-800 bg-gray-50 border border-gray-300 rounded-md" 
                          readOnly 
                        />
                        <select 
                          value={energyUnitR}
                          onChange={(e) => setEnergyUnitR(e.target.value)}
                          className="px-2 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>J</option>
                          <option>kJ</option>
                          <option>Wh</option>
                          <option>kWh</option>
                          <option>cal</option>
                          <option>kcal</option>
                          <option>BTU</option>
                          <option>eV</option>
                          <option>MJ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CABLE SELECTION FOR COPPER HOUSE WIRES CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">Cable Selection for Copper House Wires</h5>
                </div>
                <div className="p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Phase Φ</label>
                      <select 
                        value={chwPhase}
                        onChange={(e) => setChwPhase(Number(e.target.value) || 1)}
                        className="w-full px-2 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={1}>1</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Power Consumption</label>
                      <div className="space-y-1">
                        <input 
                          type="number" 
                          value={chwPowerVal}
                          onChange={(e) => setChwPowerVal(Number(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={chwPowerUnit}
                          onChange={(e) => setChwPowerUnit(e.target.value)}
                          className="w-full px-2 py-1.5 text-[10px] text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>HP</option>
                          <option>KW</option>
                          <option>WATT</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Length</label>
                      <div className="space-y-1">
                        <input 
                          type="number" 
                          value={chwLengthVal}
                          onChange={(e) => setChwLengthVal(Number(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 text-xs text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={chwLengthUnit}
                          onChange={(e) => setChwLengthUnit(e.target.value)}
                          className="w-full px-2 py-1.5 text-[10px] text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>MTR</option>
                          <option>FT</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Current (Ω)</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(chwCurrent).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Actual Gauge</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(chwActualGauge).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">Wire Size</label>
                      <div className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{chwWireSize}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* POWER CONVERSION CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">Power Conversion Calculator</h5>
                </div>
                <div className="p-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">From</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={powerValL}
                          onChange={(e) => setPowerValL(Number(e.target.value) || 0)}
                          className="flex-1 px-2 py-2 text-xs text-red-600 font-semibold bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={powerUnitL}
                          onChange={(e) => setPowerUnitL(e.target.value)}
                          className="px-2 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>J</option>
                          <option>kJ</option>
                          <option>Wh</option>
                          <option>kWh</option>
                          <option>cal</option>
                          <option>kcal</option>
                          <option>BTU</option>
                          <option>eV</option>
                          <option>MJ</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-xl text-gray-400 font-semibold">→</div>
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-medium text-gray-600 mb-1">To</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          step="0.0001" 
                          value={powerValR.toFixed(4)} 
                          className="flex-1 px-2 py-2 text-xs text-blue-700 font-semibold bg-gray-50 border border-gray-300 rounded-md" 
                          readOnly 
                        />
                        <select 
                          value={powerUnitR}
                          onChange={(e) => setPowerUnitR(e.target.value)}
                          className="px-2 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>J</option>
                          <option>kJ</option>
                          <option>Wh</option>
                          <option>kWh</option>
                          <option>cal</option>
                          <option>kcal</option>
                          <option>BTU</option>
                          <option>eV</option>
                          <option>MJ</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helping Calculators Modal - Wire Gauge Chart */}
      {isHelpingCalcOpen && helpingCalcType === 'wire-gauge' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2">
          <div className="w-full max-w-full max-h-[95vh] overflow-y-auto bg-white rounded-lg">
            <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-gray-900">Wire Gauge Chart</h3>
              <button onClick={closeHelpingCalc} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">WIRE GAUGE CHART</h5>
                </div>
                <div className="p-3">
                  <div className="space-y-2">
                    {wireGaugeData.map((row, index) => (
                      <div key={index} className="border border-gray-300 rounded-lg p-2 bg-white">
                        <div className="grid grid-cols-5 gap-2 text-[10px]">
                          <div>
                            <div className="text-[9px] font-medium text-gray-600 mb-1">Gauge</div>
                            <div className="font-semibold text-gray-800">{row[0]}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-medium text-gray-600 mb-1">SWG Inch</div>
                            <div className="text-blue-700 font-semibold">{row[1]}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-medium text-gray-600 mb-1">SWG MM</div>
                            <div className="text-blue-700 font-semibold">{row[2]}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-medium text-gray-600 mb-1">AWG Inch</div>
                            <div className="text-blue-700 font-semibold">{row[3]}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-medium text-gray-600 mb-1">AWG MM</div>
                            <div className="text-blue-700 font-semibold">{row[4]}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helping Calculators Modal - Temperature Correction Factors */}
      {isHelpingCalcOpen && helpingCalcType === 'temperature-correction' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2">
          <div className="w-full max-w-full max-h-[95vh] overflow-y-auto bg-white rounded-lg">
            <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
              <h3 className="text-base font-semibold text-gray-900">Temperature Correction Factors</h3>
              <button onClick={closeHelpingCalc} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-3">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-3 py-2 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-xs font-semibold text-gray-900">TEMPERATURE CORRECTION FACTORS kt FOR CONDUCTOR RESISTANCE</h5>
                  <p className="text-[9px] text-gray-600 mt-1">TO CORRECT THE MEASURED RESISTANCE AT t°C TO 20°C</p>
                </div>
                <div className="p-3">
                  <div className="space-y-2">
                    {temperatureCorrectionData.map((row, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        {/* Left Column */}
                        <div className="border border-gray-300 rounded-lg p-2 bg-white">
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <div className="text-[9px] font-medium text-gray-600 mb-1">Temperature °C</div>
                              <div className="font-semibold text-gray-800">{row[0]}</div>
                            </div>
                            <div>
                              <div className="text-[9px] font-medium text-gray-600 mb-1">Factor kt</div>
                              <div className="text-blue-700 font-semibold">{row[1]}</div>
                            </div>
                          </div>
                        </div>
                        {/* Right Column */}
                        <div className="border border-gray-300 rounded-lg p-2 bg-white">
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <div className="text-[9px] font-medium text-gray-600 mb-1">Temperature °C</div>
                              <div className="font-semibold text-gray-800">{row[2]}</div>
                            </div>
                            <div>
                              <div className="text-[9px] font-medium text-gray-600 mb-1">Factor kt</div>
                              <div className="text-blue-700 font-semibold">{row[3]}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProducts;

