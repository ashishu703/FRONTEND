import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Ruler, 
  CheckCircle, 
  FileText, 
  ChevronRight,
  ChevronDown,
  Settings,
  Database,
  BarChart3,
  Wrench,
  Shield,
  Zap,
  Cable,
  Droplets,
  Layers,
  Package,
  Image,
  User,
  Mail,
  MapPin,
  Building,
  Phone,
  Globe,
  CreditCard,
  BookOpen,
  X,
  Download,
  Eye,
  Plus,
  Trash2
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

const sections = [
  {
    id: "products",
    title: "Products",
    icon: Package,
    tools: [
        { name: "Aerial Bunch Cable", description: "Overhead power distribution cable", icon: Image, imageUrl: "/images/products/aerial bunch cable.jpeg" },
      { name: "Aluminium Conductor Galvanized Steel Reinforced", description: "ACSR conductor for transmission lines", icon: Image, imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
      { name: "All Aluminium Alloy Conductor", description: "AAAC conductor for overhead lines", icon: Image, imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
      { name: "PVC Insulated Submersible Cable", description: "Water-resistant submersible cable", icon: Image, imageUrl: "/images/products/pvc insulated submersible cable.jpeg" },
      { name: "Multi Core XLPE Insulated Aluminium Unarmoured Cable", description: "Multi-core XLPE cable without armour", icon: Image, imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg" },
      { name: "Paper Cover Aluminium Conductor", description: "Traditional paper insulated conductor", icon: Image, imageUrl: "/images/products/paper covered aluminium conductor.jpeg" },
      { name: "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable", description: "Single core power cable with PVC insulation", icon: Image, imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg" },
      { name: "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable", description: "Single core power cable with XLPE insulation", icon: Image, imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg" },
      { name: "Multi Core PVC Insulated Aluminium Armoured Cable", description: "Multi-core power cable with aluminium armour", icon: Image, imageUrl: "/images/products/multi core pvc isulated aluminium armoured cable.jpeg" },
      { name: "Multi Core XLPE Insulated Aluminium Armoured Cable", description: "Multi-core XLPE cable with aluminium armour", icon: Image, imageUrl: "/images/products/multi core xlpe insulated aluminium armoured cable.jpeg" },
      { name: "Multi Core PVC Insulated Aluminium Unarmoured Cable", description: "Multi-core PVC cable without armour", icon: Image, imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg" },
      
      { name: "Multistrand Single Core Copper Cable", description: "Flexible single core copper cable", icon: Image, imageUrl: "/images/products/multistrand single core copper cable.jpeg" },
      { name: "Multi Core Copper Cable", description: "Multi-core copper power cable", icon: Image, imageUrl: "/images/products/multi core copper cable.jpeg" },
      { name: "PVC Insulated Single Core Aluminium Cable", description: "Single core aluminium cable with PVC insulation", icon: Image, imageUrl: "/images/products/pvc insulated single core aluminium cables.jpeg" },
      
      { name: "PVC Insulated Multicore Aluminium Cable", description: "Multi-core aluminium cable with PVC insulation", icon: Image, imageUrl: "/images/products/pvc insulated multicore aluminium cable.jpeg" },
      { name: "Submersible Winding Wire", description: "Specialized winding wire for submersible applications", icon: Image, imageUrl: "/images/products/submersible winding wire.jpeg" },
      { name: "Twin Twisted Copper Wire", description: "Twisted pair copper wire", icon: Image, imageUrl: "/images/products/twin twisted copper wire.jpeg" },
      { name: "Speaker Cable", description: "Audio speaker connection cable", icon: Image, imageUrl: "/images/products/speaker cable.jpeg" },
      { name: "CCTV Cable", description: "Closed-circuit television cable", icon: Image, imageUrl: "/images/products/cctv cable.jpeg" },
      { name: "LAN Cable", description: "Local area network cable", icon: Image, imageUrl: "/images/products/telecom switch board cables.jpeg" },
      { name: "Automobile Cable", description: "Automotive electrical cable", icon: Image, imageUrl: "/images/products/automobile wire.jpeg" },
      { name: "PV Solar Cable", description: "Photovoltaic solar panel cable", icon: Image, imageUrl: "/images/products/pv solar cable.jpeg" },
      { name: "Co Axial Cable", description: "Coaxial transmission cable", icon: Image, imageUrl: "/images/products/co axial cable.jpeg" },
      { name: "Uni-tube Unarmoured Optical Fibre Cable", description: "Single tube optical fibre cable", icon: Image, imageUrl: "/images/products/unitube unarmoured optical fibre cable.jpeg" },
      { name: "Armoured Unarmoured PVC Insulated Copper Control Cable", description: "Control cable for industrial applications", icon: Image, imageUrl: "/images/products/armoured unarmoured pvc insulated copper control cable.jpeg" },
      { name: "Telecom Switch Board Cables", description: "Telecommunications switchboard cable", icon: Image, imageUrl: "/images/products/telecom switch board cables.jpeg" },
    ],
  },
];

const ToolboxInterface = ({ isDarkMode = false }) => {
  const [activeSection, setActiveSection] = useState("products");
  const [selectedTableData, setSelectedTableData] = useState(null);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorInputs, setCalculatorInputs] = useState({
    conductorType: '',
    conductorSize: '',
    temperature: '',
    standard: ''
  });
  const [calculationResults, setCalculationResults] = useState({
    currentCapacity: null,
    resistance: null,
    cableOD: null
  });
  const [isTechnicalCalculationsOpen, setIsTechnicalCalculationsOpen] = useState(false);
  const [isConversionCalculationsOpen, setIsConversionCalculationsOpen] = useState(false);
  const [isWireGaugeChartOpen, setIsWireGaugeChartOpen] = useState(false);
  const [isTemperatureCorrectionOpen, setIsTemperatureCorrectionOpen] = useState(false);
  
  // Sidebar state
  const [selectedLocation, setSelectedLocation] = useState("IT Park, Jabalpur");
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [showCompanyEmails, setShowCompanyEmails] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showHelpingCalculators, setShowHelpingCalculators] = useState(false);
  
  // Product detail state
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
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
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isBusinessCardOpen, setIsBusinessCardOpen] = useState(false);
  const [isSamriddhiBusinessCardOpen, setIsSamriddhiBusinessCardOpen] = useState(false);
  const [isCompanyEmailsOpen, setIsCompanyEmailsOpen] = useState(false);
  const [isGstDetailsOpen, setIsGstDetailsOpen] = useState(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState([]);
  // AB Cable - Costing calculator editable inputs (sheet row 30)
  const [abPhaseInputs, setAbPhaseInputs] = useState({ cores: 3, strands: 7, strandSize: 2.12 });
  // CALCUS helper function
  const getCalcusValue = (strands) => {
    const map = {
      3: 3.029,
      7: 7.091,
      19: 19.34,
      37: 37.74,
      61: 62.35,
      1: 1.01,
      6: 6,
      36: 36,
      12: 12
    };
    return map[strands] || 0;
  };
  // CALCUS for row 2, 5, 8 (insulation multiplier)
  const getCalcusMultiplier = (strands) => {
    const map = {
      1: 1,
      7: 3,
      19: 5,
      37: 7,
      0: 0,
      12: 3.5
    };
    return map[strands] || 0;
  };
  const abPhaseGauge = (() => {
    const s = Number(abPhaseInputs.strandSize) || 0;
    const n = Number(abPhaseInputs.strands) || 0;
    const gauge = s * s * n * 0.785; // E30*E30*D30*0.785
    return Number.isFinite(gauge) ? gauge : 0;
  })();
  // CALCUS values
  const abPhaseCalcus = getCalcusValue(abPhaseInputs.strands); // F30
  const abPhInnCalcus = getCalcusMultiplier(abPhaseInputs.strands) * Number(abPhaseInputs.strandSize) || 0; // Row 2: IFS(D30=...)*E30
  // Pricing & details shared inputs
  const [lengthMeters, setLengthMeters] = useState(1000);
  const [aluminiumRate, setAluminiumRate] = useState(270.0); // C41
  const [alloyRate, setAlloyRate] = useState(270.0); // C42
  const [innerInsuRate, setInnerInsuRate] = useState(120.0); // C43
  const [outerInsuRate, setOuterInsuRate] = useState(0.0);   // C44
  const [drumType, setDrumType] = useState("DRUM 2X");
  
  // Reverse calculation mode - when user inputs sale price and profit %
  const [reverseMode, setReverseMode] = useState(false);
  const [targetSalePrice, setTargetSalePrice] = useState(0);
  const [targetProfitPercent, setTargetProfitPercent] = useState(0);
  const drumCost = (() => {
    const L = Number(lengthMeters) || 0;
    let ratePerM;
    switch (drumType) {
      case "DRUM 4.5 FT":
        ratePerM = 4;
        break;
      case "DRUM 3.5 FT":
        ratePerM = 2.5;
        break;
      case "COIL":
        ratePerM = 0;
        break;
      case "DRUM 2X":
        ratePerM = 2.5 * 2; // 5 per meter
        break;
      case "DRUM":
        // (2500/I42) * I42 → 2500 flat
        return 2500;
      default:
        ratePerM = 0;
    }
    return ratePerM * L;
  })();
  const abPhaseKgPerM = (() => {
    const F = abPhaseCalcus; // CALCUS (F30) - dynamic based on strands
    const E = Number(abPhaseInputs.strandSize) || 0; // E30
    const C = Number(abPhaseInputs.cores) || 0; // C30
    const density = 2.703; // Aluminium density
    const kg = ((F * E * E * 0.785) * density * C) * (lengthMeters / 1000);
    return Number.isFinite(kg) ? kg : 0;
  })();
  // PH INN INS (row 31) - Gauge: F31 + E31 + E31, with F31 fixed 6.36 mm
  const [abPhInnIns, setAbPhInnIns] = useState({ thickness: 1.20 });
  const abPhInnGauge = (() => {
    const e = Number(abPhInnIns.thickness) || 0;
    const f = 6.36; // CALCUS value (F31)
    const val = f + e + e;
    return Number.isFinite(val) ? val : 0;
  })();
  const abPhInnKgPerM = (() => {
    // Row 2: ((0.785*(((G31)^2)-((F31)^2))*C30)*0.94)/1000*I42
    const G = Number(abPhInnGauge) || 0; // G31
    const F = 6.36; // F31
    const C = Number(abPhaseInputs.cores) || 0; // C30
    const density = 0.94;
    const ringArea = 0.785 * (G * G - F * F);
    const kg = ((ringArea * C) * density) / 1000 * lengthMeters;
    return Number.isFinite(kg) ? kg : 0;
  })();
  // PH OUT INS (row 32) - Gauge: G31 + E32 + E32
  const [abPhOutIns, setAbPhOutIns] = useState({ thickness: 0 });
  const abPhOutGauge = (() => {
    const e = Number(abPhOutIns.thickness) || 0;
    const g31 = Number(abPhInnGauge) || 0;
    const val = g31 + e + e;
    return Number.isFinite(val) ? val : 0;
  })();
  const abPhOutKgPerM = (() => {
    // Row 3: ((0.785*(((G32)^2)-((F32)^2))*C30)*0.94)/1000*I42
    const G = Number(abPhOutGauge) || 0; // G32
    const F = Number(abPhInnGauge) || 0; // F32 = G31
    const C = Number(abPhaseInputs.cores) || 0; // C30
    const density = 0.94;
    const ringArea = 0.785 * (G * G - F * F);
    const kg = ((ringArea * C) * density) / 1000 * lengthMeters;
    return Number.isFinite(kg) ? kg : 0;
  })();
  // STREET LIGHT conductor (row 33) - Gauge: E33*E33*D33*0.785
  const [abStreetInputs, setAbStreetInputs] = useState({ cores: 1, strands: 7, strandSize: 1.70 });
  const abStreetGauge = (() => {
    const s = Number(abStreetInputs.strandSize) || 0;
    const n = Number(abStreetInputs.strands) || 0;
    const gauge = s * s * n * 0.785;
    return Number.isFinite(gauge) ? gauge : 0;
  })();
  // CALCUS for STREET (row 4)
  const abStreetCalcus = getCalcusValue(abStreetInputs.strands); // F33
  const abStlInnCalcus = getCalcusMultiplier(abStreetInputs.strands) * Number(abStreetInputs.strandSize) || 0; // Row 5: IFS(D33=...)*E33
  // STL INN/OUT INS thicknesses and derived gauges (rows 34, 35)
  const [stlInnIns, setStlInnIns] = useState({ thickness: 1.20 });
  const [stlOutIns, setStlOutIns] = useState({ thickness: 0 });
  const stlInnGauge = (() => {
    const e = Number(stlInnIns.thickness) || 0; // E34
    const f = 5.10; // F34
    const val = f + e + e;
    return Number.isFinite(val) ? val : 0;
  })();
  const stlOutGauge = (() => {
    const e = Number(stlOutIns.thickness) || 0; // E35
    const f = Number(stlInnGauge) || 0; // F35 = G34
    const val = f + e + e;
    return Number.isFinite(val) ? val : 0;
  })();
  const abStreetKgPerM = (() => {
    // Row 4: ((F33*E33*E33*0.785)*2.703*C33)*I42/1000
    const F = abStreetCalcus; // F33 - dynamic CALCUS
    const E = Number(abStreetInputs.strandSize) || 0; // E33
    const C = Number(abStreetInputs.cores) || 0; // C33
    const density = 2.703;
    const kg = ((F * E * E * 0.785) * density * C) * lengthMeters / 1000;
    return Number.isFinite(kg) ? kg : 0;
  })();
  // MESSENGER conductor (row 36) - Gauge: E36*E36*D36*0.785
  const [abMessengerInputs, setAbMessengerInputs] = useState({ cores: 1, strands: 7, strandSize: 2.12 });
  const abMessengerGauge = (() => {
    const s = Number(abMessengerInputs.strandSize) || 0;
    const n = Number(abMessengerInputs.strands) || 0;
    const gauge = s * s * n * 0.785;
    return Number.isFinite(gauge) ? gauge : 0;
  })();
  // CALCUS for MESSENGER (row 7)
  const abMessengerCalcus = getCalcusValue(abMessengerInputs.strands); // F36
  const abMsnInnCalcus = getCalcusMultiplier(abMessengerInputs.strands) * Number(abMessengerInputs.strandSize) || 0; // Row 8: IFS(D36=...)*E36
  const abMessengerKgPerM = (() => {
    // Row 7: ((F36*E36*E36*0.785)*2.703)*I42/1000
    const F = abMessengerCalcus; // F36 - dynamic CALCUS
    const E = Number(abMessengerInputs.strandSize) || 0; // E36
    const density = 2.703;
    const kg = ((F * E * E * 0.785) * density) * lengthMeters / 1000;
    return Number.isFinite(kg) ? kg : 0;
  })();
  // MSN INN INS (row 37) - Gauge: F37 + E37 + E37 (F37 = 6.36 mm)
  const [abMsnInn, setAbMsnInn] = useState({ thickness: 0 });
  const abMsnInnGauge = (() => {
    const e = Number(abMsnInn.thickness) || 0;
    const f = 6.36;
    const val = f + e + e;
    return Number.isFinite(val) ? val : 0;
  })();
  const abStlInnKgPerM = (() => {
    // Row 5: (0.785*(((G34)^2)-((F34)^2))*0.94*C33)/1000*I42
    const G = Number(stlInnGauge) || 0; // G34
    const F = 5.10; // F34
    const C = Number(abStreetInputs.cores) || 0; // C33
    const density = 0.94;
    const ringArea = 0.785 * (G * G - F * F);
    const kg = (ringArea * density * C) / 1000 * lengthMeters;
    return Number.isFinite(kg) ? kg : 0;
  })();
  const abStlOutKgPerM = (() => {
    // Row 6: (0.785*(((G35)^2)-((F35)^2))*0.94*C33)/1000*I42
    const G = Number(stlOutGauge) || 0; // G35
    const F = Number(stlInnGauge) || 0; // F35 = G34
    const C = Number(abStreetInputs.cores) || 0; // C33
    const density = 0.94;
    const ringArea = 0.785 * (G * G - F * F);
    const kg = (ringArea * density * C) / 1000 * lengthMeters;
    return Number.isFinite(kg) ? kg : 0;
  })();
  // MSN OUT INS (row 38) - Gauge: F38 + E38 + E38 (F38 = 6.36 mm)
  const [abMsnOut, setAbMsnOut] = useState({ thickness: 0 });
  const abMsnOutGauge = (() => {
    const e = Number(abMsnOut.thickness) || 0;
    const f = 6.36;
    const val = f + e + e;
    return Number.isFinite(val) ? val : 0;
  })();
  const abMsnInnKgPerM = (() => {
    // Row 8: (0.785*(((G37)^2)-((F37)^2))*0.94*C36)/1000*I42
    const G = Number(abMsnInnGauge) || 0; // G37
    const F = 6.36; // F37
    const C = Number(abMessengerInputs.cores) || 0; // C36
    const density = 0.94;
    const ringArea = 0.785 * (G * G - F * F);
    const kg = (ringArea * density * C) / 1000 * lengthMeters;
    return Number.isFinite(kg) ? kg : 0;
  })();
  const abMsnOutKgPerM = (() => {
    // Row 9: (0.785*(((G38)^2)-((F38)^2))*0.94*C36)/1000*I42
    const G = Number(abMsnOutGauge) || 0; // G38
    const F = 6.36; // F38
    const C = Number(abMessengerInputs.cores) || 0; // C36
    const density = 0.94;
    const ringArea = 0.785 * (G * G - F * F);
    const kg = (ringArea * density * C) / 1000 * lengthMeters;
    return Number.isFinite(kg) ? kg : 0;
  })();

  // Reverse calculation: Calculate required rates from target sale price and profit %
  const reverseCalculatedRates = (() => {
    if (!reverseMode || !targetSalePrice || !targetProfitPercent) {
      return { aluminiumRate, alloyRate, innerInsuRate, outerInsuRate };
    }
    
    // Calculate target base cost per meter from target sale price and profit %
    // profitPercent = ((salePrice - baseCostPerM) / baseCostPerM) * 100
    // Solving for baseCostPerM: baseCostPerM = salePrice / (1 + profitPercent/100)
    const targetBaseCostPerM = targetSalePrice / (1 + targetProfitPercent / 100);
    const targetTotalCost = targetBaseCostPerM * (lengthMeters || 1);
    
    // Calculate current rate-dependent costs (without drum cost)
    const currentAluminiumCost = (abPhaseKgPerM + abStreetKgPerM) * aluminiumRate;
    const currentAlloyCost = abMessengerKgPerM * alloyRate;
    const currentInnerInsuCost = (abPhInnKgPerM + abStlInnKgPerM + abMsnInnKgPerM) * innerInsuRate;
    const currentOuterInsuCost = (abPhOutKgPerM + abStlOutKgPerM + abMsnOutKgPerM) * outerInsuRate;
    const currentRateDependentCost = currentAluminiumCost + currentAlloyCost + currentInnerInsuCost + currentOuterInsuCost;
    
    // Calculate what the rate-dependent cost should be
    const targetRateDependentCost = targetTotalCost - drumCost;
    
    // Calculate scaling factor
    const scaleFactor = currentRateDependentCost > 0 ? targetRateDependentCost / currentRateDependentCost : 1;
    
    return {
      aluminiumRate: aluminiumRate * scaleFactor,
      alloyRate: alloyRate * scaleFactor,
      innerInsuRate: innerInsuRate * scaleFactor,
      outerInsuRate: outerInsuRate * scaleFactor
    };
  })();
  
  // Use reverse calculated rates if in reverse mode, otherwise use normal rates
  const effectiveAluminiumRate = reverseMode && targetSalePrice && targetProfitPercent ? reverseCalculatedRates.aluminiumRate : aluminiumRate;
  const effectiveAlloyRate = reverseMode && targetSalePrice && targetProfitPercent ? reverseCalculatedRates.alloyRate : alloyRate;
  const effectiveInnerInsuRate = reverseMode && targetSalePrice && targetProfitPercent ? reverseCalculatedRates.innerInsuRate : innerInsuRate;
  const effectiveOuterInsuRate = reverseMode && targetSalePrice && targetProfitPercent ? reverseCalculatedRates.outerInsuRate : outerInsuRate;

  // TOTAL calculations: H30*C41, H31*C43, etc. where H = KG/MTR (total kg) and C = rate
  // Note: KG/MTR values already include length factor, so they're total kg, not per meter
  const totalRow1 = abPhaseKgPerM * effectiveAluminiumRate; // H30*C41
  const totalRow2 = abPhInnKgPerM * effectiveInnerInsuRate; // H31*C43
  const totalRow3 = abPhOutKgPerM * effectiveOuterInsuRate; // H32*C44
  const totalRow4 = abStreetKgPerM * effectiveAluminiumRate; // H33*C41
  const totalRow5 = abStlInnKgPerM * effectiveInnerInsuRate; // H34*C43
  const totalRow6 = abStlOutKgPerM * effectiveOuterInsuRate; // H35*C44
  const totalRow7 = abMessengerKgPerM * effectiveAlloyRate; // H36*C42
  const totalRow8 = abMsnInnKgPerM * effectiveInnerInsuRate; // H37*C43
  const totalRow9 = abMsnOutKgPerM * effectiveOuterInsuRate; // H38*C44
  // SUM(I30:I41) includes all totals + drum cost
  // I30=I30, I31=I31, ..., I38=I38 (rows 1-9), I39=drum, I40=freight, I41=0 or other
  const sumI30ToI41 = totalRow1 + totalRow2 + totalRow3 + totalRow4 + totalRow5 + totalRow6 + totalRow7 + totalRow8 + totalRow9 + drumCost;
  // Base cost per meter
  const baseCostPerM = sumI30ToI41 / (lengthMeters || 1);
  
  // SALE PRICE calculation
  // In reverse mode: use target sale price directly
  // In normal mode: use baseCostPerM * 1.2 (20% markup) or calculate from profit %
  const salePrice = reverseMode && targetSalePrice && targetProfitPercent 
    ? targetSalePrice 
    : baseCostPerM * 1.2; // Default 20% markup
  
  // PROFIT calculation
  // In reverse mode: use target profit % directly
  // In normal mode: calculate from salePrice and baseCostPerM
  const profitPercent = reverseMode && targetSalePrice && targetProfitPercent
    ? targetProfitPercent
    : ((salePrice - baseCostPerM) / (baseCostPerM || 1)) * 100;

  // Function to apply calculated rates from reverse mode
  const applyCalculatedRates = () => {
    if (reverseMode && targetSalePrice && targetProfitPercent) {
      setAluminiumRate(reverseCalculatedRates.aluminiumRate);
      setAlloyRate(reverseCalculatedRates.alloyRate);
      setInnerInsuRate(reverseCalculatedRates.innerInsuRate);
      setOuterInsuRate(reverseCalculatedRates.outerInsuRate);
    }
  };

  // Summary weights
  const aluminiumWt = Math.round(abPhaseKgPerM + abStreetKgPerM);
  const alloyWt = Math.round(abMessengerKgPerM);
  const innerXlpeWt = Math.round(abPhInnKgPerM + abStlInnKgPerM + abMsnInnKgPerM);
  const outerXlpeWt = Math.round(abPhOutKgPerM + abStlOutKgPerM + abMsnOutKgPerM);
  const cableWt = aluminiumWt + alloyWt + innerXlpeWt + outerXlpeWt;
  const businessCardRef = useRef(null);
  const samriddhiBusinessCardRef = useRef(null);
  // Reduction Gauge Calculator - shared Reduction % (rowSpan over 3 rows)
  const [rgReduction, setRgReduction] = useState(10);
  // Reduction Gauge - PHASE area (C49) and derived STRAND (E49)
  const [rgPhaseArea, setRgPhaseArea] = useState("25 SQMM");
  const rgPhaseAreaNum = (() => {
    const str = String(rgPhaseArea || "");
    const num = Number(str.replace(/[^\d.]/g, ""));
    return Number.isFinite(num) ? num : 0;
  })();
  const rgPhaseStrand = (() => {
    const c = rgPhaseAreaNum;
    if (c === 0) return "0";
    if (c < 51) return "7";
    if (c > 51) return "19";
    return "0";
  })();
  // PHASE WIRE (F49): SQRT((C49 - (C49*D49/100))/E49/0.785)
  const rgPhaseWire = (() => {
    const area = rgPhaseAreaNum; // C49
    const reduction = Number(rgReduction) || 0; // D49 (%)
    const strands = Number(rgPhaseStrand) || 0; // E49
    if (area <= 0 || strands <= 0) return 0;
    const effectiveArea = area - (area * reduction / 100);
    const value = effectiveArea / strands / 0.785;
    const wire = Math.sqrt(Math.max(value, 0)); // SQRT
    return Number.isFinite(wire) ? wire : 0;
  })();
  // PHASE INSULATION (G49)
  const rgPhaseInsulation = (() => {
    const d = Number(rgReduction) || 0; // D49
    const c = rgPhaseAreaNum; // C49
    let addByReduction = 0;
    if (d >= 10 && d <= 20) addByReduction = 0.1;
    else if (d >= 21 && d <= 30) addByReduction = 0.2;
    else if (d >= 31 && d <= 50) addByReduction = 0.3;
    else if (d === 0) addByReduction = 0;
    let baseByArea = 0;
    if (c >= 0 && c <= 40) baseByArea = 1.2;
    else if (c >= 41 && c <= 95) baseByArea = 1.5;
    else if (c >= 96 && c <= 200) baseByArea = 1.8;
    const res = addByReduction + baseByArea;
    return Number.isFinite(res) ? res : 0;
  })();
  // PHASE OUTER DIA (H49): (IFS(E49="19",5,E49="7",3)*F49) + G49*2
  const rgPhaseOuterDia = (() => {
    const strand = String(rgPhaseStrand || ""); // E49
    const wire = Number(rgPhaseWire) || 0; // F49
    const ins = Number(rgPhaseInsulation) || 0; // G49
    let multiplier = 0;
    if (strand === "19") multiplier = 5;
    else if (strand === "7") multiplier = 3;
    const val = multiplier * wire + ins * 2;
    return Number.isFinite(val) ? val : 0;
  })();
  // Reduction Gauge - STREET LIGHT area (C50) and derived STRAND (E50)
  const [rgStreetArea, setRgStreetArea] = useState("16 SQMM");
  const rgStreetAreaNum = (() => {
    const str = String(rgStreetArea || "");
    const num = Number(str.replace(/[^\d.]/g, ""));
    return Number.isFinite(num) ? num : 0;
  })();
  const rgStreetStrand = (() => {
    const c = rgStreetAreaNum;
    if (c === 0) return "0";
    if (c > 10) return "7";
    return "0";
  })();
  // STREET WIRE (F50): SQRT((C50 - (C50*D49/100))/E50/0.785)
  const rgStreetWire = (() => {
    const area = rgStreetAreaNum; // C50
    const reduction = Number(rgReduction) || 0; // D49 shared
    const strands = Number(rgStreetStrand) || 0; // E50
    if (area <= 0 || strands <= 0) return 0;
    const effectiveArea = area - (area * reduction / 100);
    const value = effectiveArea / strands / 0.785;
    const wire = Math.sqrt(Math.max(value, 0));
    return Number.isFinite(wire) ? wire : 0;
  })();
  // STREET INSULATION (G50)
  const rgStreetInsulation = (() => {
    const d = Number(rgReduction) || 0; // D49
    const c = rgStreetAreaNum; // C50
    let addByReduction = 0;
    if (d >= 10 && d <= 20) addByReduction = 0.1;
    else if (d >= 21 && d <= 30) addByReduction = 0.2;
    else if (d >= 31 && d <= 50) addByReduction = 0.3;
    else if (d === 0) addByReduction = 0;
    let baseByArea = 0;
    if (c <= 49) baseByArea = 1.2;
    else if (c <= 120) baseByArea = 1.5;
    const res = addByReduction + baseByArea;
    return Number.isFinite(res) ? res : 0;
  })();
  // STREET OUTER DIA (H50): (IFS(E50="19",5,E50="7",3)*F50) + G50*2
  const rgStreetOuterDia = (() => {
    const strand = String(rgStreetStrand || ""); // E50
    const wire = Number(rgStreetWire) || 0; // F50
    const ins = Number(rgStreetInsulation) || 0; // G50
    let multiplier = 0;
    if (strand === "19") multiplier = 5;
    else if (strand === "7") multiplier = 3;
    const val = multiplier * wire + ins * 2;
    return Number.isFinite(val) ? val : 0;
  })();
  // Reduction Gauge - MESSENGER area (C51) and derived STRAND (E51)
  const [rgMessengerArea, setRgMessengerArea] = useState("25 SQMM");
  const rgMessengerAreaNum = (() => {
    const str = String(rgMessengerArea || "");
    const num = Number(str.replace(/[^\d.]/g, ""));
    return Number.isFinite(num) ? num : 0;
  })();
  const rgMessengerStrand = (() => {
    const c = rgMessengerAreaNum;
    if (c === 0) return "0";
    if (c > 10) return "7";
    return "0";
  })();
  // MESSENGER WIRE (F51): SQRT((C51 - (C51*D49/100))/E51/0.785)
  const rgMessengerWire = (() => {
    const area = rgMessengerAreaNum; // C51
    const reduction = Number(rgReduction) || 0; // D49 shared
    const strands = Number(rgMessengerStrand) || 0; // E51
    if (area <= 0 || strands <= 0) return 0;
    const effectiveArea = area - (area * reduction / 100);
    const value = effectiveArea / strands / 0.785;
    const wire = Math.sqrt(Math.max(value, 0));
    return Number.isFinite(wire) ? wire : 0;
  })();
  // MESSENGER INSULATION (G51)
  const rgMessengerInsulation = (() => {
    const d = Number(rgReduction) || 0; // D49
    const c = rgMessengerAreaNum; // C51
    let addByReduction = 0;
    if (d >= 10 && d <= 20) addByReduction = 0.1;
    else if (d >= 21 && d <= 30) addByReduction = 0.2;
    else if (d >= 31 && d <= 50) addByReduction = 0.3;
    else if (d === 0) addByReduction = 0;
    let baseByArea = 0;
    if (c <= 49) baseByArea = 1.2;
    else if (c <= 120) baseByArea = 1.5;
    const res = addByReduction + baseByArea;
    return Number.isFinite(res) ? res : 0;
  })();
  // MESSENGER OUTER DIA (H51): (IFS(E51="19",5,E51="7",3)*F51) + G51*2
  const rgMessengerOuterDia = (() => {
    const strand = String(rgMessengerStrand || ""); // E51
    const wire = Number(rgMessengerWire) || 0; // F51
    const ins = Number(rgMessengerInsulation) || 0; // G51
    let multiplier = 0;
    if (strand === "19") multiplier = 5;
    else if (strand === "7") multiplier = 3;
    const val = multiplier * wire + ins * 2;
    return Number.isFinite(val) ? val : 0;
  })();

  // Wire/Cable Selection Calculator state
  const [wsPhase, setWsPhase] = useState(3); // B57
  const [wsPower, setWsPower] = useState(20.0); // C57
  const [wsPowerUnit, setWsPowerUnit] = useState('HP'); // D57
  const [wsLength, setWsLength] = useState(500); // E57 (value only for display now)
  const [wsLengthUnit, setWsLengthUnit] = useState('MTR');
  // Current calculation per provided formula
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
  // Actual Gauge calculation
  const wsActualGauge = (() => {
    const current = Number(wsCurrent) || 0; // G57
    const phase = Number(wsPhase) || 1; // B57
    const lengthVal = Number(wsLength) || 0; // E57
    const lengthMetersSel = wsLengthUnit === 'FT' ? lengthVal * 0.3048 : lengthVal;
    const phaseFactor = phase === 3 ? 1.732 : 1;
    const option1 = current / 5;
    const option2 = (phaseFactor * current * 17.25 * lengthMetersSel) / ((0.05 * 430) * 1000);
    const result = Math.max(option1, option2);
    return Number.isFinite(result) ? result : 0;
  })();
  // Wire Size mapping from Actual Gauge (H57)
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
  

  // Image upload state
  const [productImages, setProductImages] = useState({}); // { [productName]: { [rowIndex]: [dataUrl1, ...] } }
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewingImageIndex, setViewingImageIndex] = useState(null); // Track which row index is being viewed in modal
  const technicalCalcRef = useRef(null);
  const conversionCalcRef = useRef(null);
  const [isHelpingCalcOpen, setIsHelpingCalcOpen] = useState(false);
  const [helpingCalcType, setHelpingCalcType] = useState(null); // 'technical' | 'conversional'
  const closeHelpingCalc = () => { setIsHelpingCalcOpen(false); setHelpingCalcType(null); };

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
  React.useEffect(() => {
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
  React.useEffect(() => {
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

  // Voltage Drop: = 0.05 * (430)
  React.useEffect(() => {
    setSubVoltDrop(0.05 * 430);
  }, []);

  // Current calculation
  // = ((IF(unit="HP", (0.746*power), IF(unit="WATT", (0.001*power), (1*power))))*1000) / (((1.732))*0.83*0.83*(430))
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
    const od = (Number(armInnerOd) || 0) + (Number(armWireStripOd) || 0) * 2;
    setArmOd(Number.isFinite(od) ? Number(od.toFixed(2)) : 0);
  }, [armInnerOd, armWireStripOd]);
  // Width = COS(RADIANS(COS(R36))) * S36 * 3.14
  React.useEffect(() => {
    const cosPhiVal = Number(armCosPhi) || 0; // assume this stores COS(Φ)
    const innerOd = Number(armInnerOd) || 0; // S36
    const width = Math.cos((cosPhiVal * Math.PI) / 180) * innerOd * 3.14;
    setArmWidth(Number.isFinite(width) ? Number(width.toFixed(2)) : 0);
  }, [armCosPhi, armInnerOd]);
  // Lay = N36 * 16 -> assume N36 corresponds to Wire/Strip OD
  React.useEffect(() => {
    const lay = (Number(armWireStripOd) || 0) * 16;
    setArmLay(Number.isFinite(lay) ? Number(lay.toFixed(2)) : 0);
  }, [armWireStripOd]);
  // COS(Φ) = COS(RADIANS(COS(DEGREES(ATAN(ATAN(3.14*S36/Q36))))))
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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
  React.useEffect(() => {
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

  // Technical Calculations (Helping Calculator) - initial display data (formulas to be added later)
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
  React.useEffect(() => {
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

  // Technical Calculations - AAAC & ACSR parameter blocks (static values for now, formulas later)
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

  // Image upload handlers
  const handleImageUpload = (index) => {
    setSelectedImageIndex(index);
    setIsImageUploadOpen(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && selectedImageIndex !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const productKey = selectedProduct || 'default';
        setProductImages(prev => {
          const productMap = prev[productKey] ? { ...prev[productKey] } : {};
          const list = productMap[selectedImageIndex] ? [...productMap[selectedImageIndex]] : [];
          list.push(e.target.result);
          productMap[selectedImageIndex] = list;
          return { ...prev, [productKey]: productMap };
        });
        setCurrentSlide((prev) => {
          const listLen = (productImages[productKey]?.[selectedImageIndex]?.length || 0);
          return listLen; // point to the newly appended image
        });
      };
      reader.readAsDataURL(file);
      setIsImageUploadOpen(false);
      setSelectedImageIndex(null);
    }
  };

  const handleImageClick = (index) => {
    const list = (productImages[selectedProduct]?.[index]) || [];
    if (list.length > 0) {
      setSelectedFile(list); // pass array to modal
      setCurrentSlide(list.length - 1); // start from latest
      setViewingImageIndex(index); // Store the row index being viewed
      setIsFileViewerOpen(true);
    }
  };

  const handleImageDeleteFromModal = () => {
    if (viewingImageIndex === null || !selectedFile || selectedFile.length === 0) return;
    
    const productKey = selectedProduct || 'default';
    const currentImageIndex = currentSlide;
    const newImageList = selectedFile.filter((_, idx) => idx !== currentImageIndex);
    
    // Update productImages state
    setProductImages(prev => {
      const productMap = prev[productKey] ? { ...prev[productKey] } : {};
      if (newImageList.length > 0) {
        productMap[viewingImageIndex] = newImageList;
      } else {
        // If no images left, remove the entry
        delete productMap[viewingImageIndex];
      }
      return { ...prev, [productKey]: productMap };
    });
    
    // Update selectedFile and currentSlide
    if (newImageList.length > 0) {
      setSelectedFile(newImageList);
      // Adjust currentSlide if we deleted the last image
      const newSlide = currentImageIndex >= newImageList.length ? newImageList.length - 1 : currentImageIndex;
      setCurrentSlide(newSlide);
    } else {
      // Close modal if no images left
      setIsFileViewerOpen(false);
      setSelectedFile([]);
      setCurrentSlide(0);
      setViewingImageIndex(null);
    }
  };

  // Cable data from original toolbox-interface
  const cableData = [
    {
      id: "anocab-1100-volt-multistrand-single-core",
      name: "ANOCAB 1100 VOLT ELECTRIC WIRE MULTISTRAND SINGLE CORE PVC INSULATED",
      headers: ["Nominal Area of Conductor (mm²)", "NO OF WIRES & DIA. OF EACH WIRES (In MM)", "Insulation Thickness (mm)", "Approx Overall Dimension (mm)", "CURRENT CARRYING CAPACITY (2 CABLES SINGLE PHASE) (Unenclosed clipped directly to a surface or on cable trays (Amps))", "CR At 20°C (Ω/km)"],
      rows: [
        ["0.5", "16/0.20", "0.60", "2.10", "4", "39.0"],
        ["0.75", "24/0.20", "0.60", "2.20", "6", "26.0"],
        ["1.0", "32/0.20", "0.60", "2.30", "10", "19.5"],
        ["1.5", "30/0.25", "0.70", "2.80", "16", "12.1"],
        ["2.5", "50/0.25", "0.80", "3.50", "25", "7.41"],
        ["4.0", "56/0.30", "0.80", "4.20", "35", "4.61"],
        ["6.0", "84/0.30", "0.80", "4.80", "50", "3.08"],
        ["10.0", "80/0.40", "1.00", "6.00", "70", "1.83"],
        ["16.0", "126/0.40", "1.00", "7.20", "95", "1.15"],
        ["25.0", "196/0.40", "1.20", "8.80", "130", "0.727"],
        ["35.0", "276/0.40", "1.20", "10.20", "160", "0.524"],
        ["50.0", "396/0.40", "1.40", "12.00", "200", "0.387"],
        ["70.0", "396/0.50", "1.40", "14.00", "250", "0.268"],
        ["95.0", "396/0.50", "1.60", "16.00", "300", "0.193"],
        ["120.0", "396/0.60", "1.60", "18.00", "350", "0.153"],
        ["150.0", "396/0.70", "1.80", "20.00", "400", "0.124"],
        ["185.0", "396/0.80", "1.80", "22.00", "450", "0.0991"],
        ["240.0", "396/0.90", "2.00", "25.00", "550", "0.0754"],
        ["300.0", "396/1.00", "2.00", "28.00", "650", "0.0601"],
        ["400.0", "396/1.20", "2.20", "32.00", "750", "0.0470"],
        ["500.0", "396/1.40", "2.40", "36.00", "850", "0.0366"],
        ["630.0", "396/1.60", "2.80", "38.00", "916", "0.0287"]
      ]
    },
    {
      id: "anocab-1100-volt-multi-strand-multi-core",
      name: "ANOCAB 1100 VOLT ELECTRIC MULTI-STRAND MULTI-CORE PVC INSULATED COPPER CABLE",
      headers: ["Nominal Area of Conductor (mm²)", "NO OF WIRES & DIA. In MM", "NO OF WIRES & DIA. In INCH", "Current Carrying Capacity (Bunched) 2 Core Cable", "Current Carrying Capacity (Bunched) 3/4 Core Cable", "Current Carrying Capacity (Clipped) 2 Core Cable", "Current Carrying Capacity (Clipped) 3/4 Core Cable", "CR At 20°C (Ω/km)"],
      rows: [
        ["0.5", "16/0.20", "16/0.00788", "4", "4 (1-Φ)", "-", "-", "39.00"],
        ["0.75", "24/0.20", "24/0.00788", "7", "7 (1-Φ)", "-", "-", "26.00"],
        ["1.0", "32/0.20", "32/0.00788", "10", "9", "12", "10", "19.50"],
        ["1.5", "30/0.25", "30/0.00985", "13", "11", "16", "14", "13.30"],
        ["2.5", "50/0.25", "50/0.00985", "18", "15", "20", "18", "7.89"],
        ["4.0", "56/0.30", "56/0.01181", "24", "20", "27", "24", "4.95"],
        ["6.0", "84/0.30", "84/0.01181", "28", "25", "34", "30", "3.30"],
        ["10.0", "80/0.40", "80/0.01575", "39", "34", "44", "39", "1.91"]
      ]
    },
    {
      id: "anocab-750-volt-single-core",
      name: "ANOCAB 750 VOLT ELECTRIC SINGLE CORE PVC INSULATED CABLE",
      headers: ["Nominal Area of Conductor (mm²)", "DIA (In MM)", "DIA (In A/SWG)", "DIA (In INCH)", "DIA (In NO)", "CURRENT CARRYING CAPACITY (2 CABLES SINGLE PHASE) (Bunched and Enclosed in Conduit or Trunking)", "CURRENT CARRYING CAPACITY (2 CABLES SINGLE PHASE) (Clipped Direct to a Surface or on a Cable Tray, Bunched & Unenclosed)", "CR At 20°C (Ω/km)"],
      rows: [
        ["4", "2.25", "13", "0.089", "90", "23", "27", "7.41"],
        ["6", "2.76", "11", "0.109", "110", "29", "35", "4.61"],
        ["8", "3.02", "10", "0.120", "120", "35", "40", "4.05"],
        ["10", "3.56", "9", "0.140", "140", "40", "48", "3.08"],
        ["4", "7/0.85", "7/20", "7/0.034", "90", "23", "27", "7.41"],
        ["6", "7/1.05", "7/18", "7/0.042", "110", "29", "35", "4.61"],
        ["10", "7/1.35", "7/16", "7/0.054", "120", "40", "48", "3.08"]
      ]
    },
    {
      id: "anocab-1100-volt-submersible-flat",
      name: "ANOCAB 1100 VOLT ELECTRIC PVC INSULATED SUBMERSIBLE FLAT CABLE",
      headers: ["Nominal Area of Conductor (mm²)", "No. / Dia of Strands (mm)", "Insulation Thickness (mm)", "Sheath Thickness (mm)", "Approx Overall Dimension - Width (mm)", "Approx Overall Dimension - Height (mm)", "Max Conductor Resistance At 20°C (Ω/km)", "Current Carrying Capacity at 40°C (Amps)"],
      rows: [
        ["1.5", "22/0.3", "0.60", "0.90", "10.10", "4.70", "12.10", "13"],
        ["2.5", "36/0.3", "0.70", "1.00", "12.20", "5.50", "7.41", "18"],
        ["4", "56/0.3", "0.80", "1.10", "16.20", "6.30", "4.95", "24"],
        ["6", "84/0.3", "0.80", "1.10", "16.20", "7.20", "3.30", "31"],
        ["10", "140/0.3", "1.00", "1.20", "22.00", "8.30", "1.91", "42"],
        ["16", "126/0.4", "1.00", "1.30", "23.50", "9.70", "1.21", "57"],
        ["25", "196/0.4", "1.20", "1.60", "28.40", "11.10", "0.78", "72"],
        ["35", "276/0.4", "1.20", "1.70", "32.10", "13.10", "0.554", "90"],
        ["50", "396/0.4", "1.20", "1.80", "35.00", "15.00", "0.386", "115"],
        ["70", "360/0.5", "1.40", "2.20", "43.40", "17.00", "0.272", "143"],
        ["95", "475/0.5", "1.60", "2.40", "49.60", "19.10", "0.206", "165"]
      ]
    },
    {
      id: "aluminium-conductor-galvanised-steel",
      name: "ALUMINIUM CONDUCTOR GALVANISED STEEL REINFORCED IS 398 PT-II : 1996",
      headers: [
        "ACSR Code",
        "Nom. Aluminium Area (mm²)",
        "Stranding and Wire Diameter (Aluminium: nos/mm)",
        "Stranding and Wire Diameter (Steel: nos/mm)",
        "DC Resistance at 20°C (Ω/km)",
        "AC Resistance at 65°C (Ω/km)",
        "AC Resistance at 75°C (Ω/km)",
        "Current Capacity at 65°C (Amps)",
        "Current Capacity at 75°C (Amps)"
      ],
      rows: [
        ["Mole", "10", "6/1.50", "1/1.50", "2.780", "3.777", "3.905", "58", "70"],
        ["Squirrel", "20", "6/1.96", "1/1.96", "1.394", "1.894", "1.958", "89", "107"],
        ["Weasel", "30", "6/2.59", "1/2.59", "0.929", "1.262", "1.308", "114", "138"],
        ["Rabbit", "50", "6/3.35", "1/3.35", "0.552", "0.705", "0.776", "157", "190"],
        ["Raccoon", "80", "6/4.09", "1/4.09", "0.371", "0.504", "0.522", "200", "244"],
        ["Dog", "100", "6/4.72", "7/1.57", "0.279", "0.379", "0.392", "239", "291"],
        ["Coyote", "130", "26/2.54", "7/1.91", "0.225", "0.266", "0.275", "292", "358"],
        ["Wolf", "150", "30/2.59", "7/2.59", "0.187", "0.222", "0.230", "329", "405"],
        ["Lynx", "180", "30/2.79", "7/2.79", "0.161", "0.191", "0.197", "361", "445"],
        ["Panther", "200", "30/3.00", "7/3.00", "0.139", "0.165", "0.171", "395", "487"],
        ["Goat", "320", "30/3.71", "7/3.71", "0.091", "0.108", "0.112", "510", "634"],
        ["Kundah", "400", "42/3.50", "7/1.96", "0.073", "0.089", "0.092", "566", "705"],
        ["Zebra", "420", "54/3.18", "7/3.18", "0.069", "0.084", "0.087", "590", "737"],
        ["Moose", "520", "54/3.53", "7/3.53", "0.056", "0.069", "0.071", "667", "836"],
        ["Morkulla", "560", "42/4.13", "7/2.30", "0.052", "0.065", "0.067", "688", "862"],
        ["Bersimis", "690", "42/4.57", "7/2.54", "0.042", "0.051", "0.052", "791", "998"]
      ]
    }
  ];

  // Helping calculators data from original toolbox-interface
  const technicalCalculationsData = [
    {
      id: "aerial-bunched-cable-parameters",
      name: "AERIAL BUNCHED CABLE PARAMETERS CALCULATOR",
      type: "aerial-bunched-cable",
      data: {
        headers: ["CORES", "X-SELECTION AREA", "REDUCTION (%)", "NO OF STRANDS", "WIRE SIZE OF GAUGE", "SELECTIONAL AREA", "INSULATION THIKNESS", "OD OF CABLE"],
        rows: [
          ["PHASE", "95 SQMM", "", "19", "2.26 MM", "76 SQMM", "1.60 MM", "14.49 MM"],
          ["ST LIGHT", "16 SQMM", "20", "7", "1.53 MM", "13 SQMM", "1.30 MM", "7.18 MM"],
          ["MESSENGER", "70 SQMM", "", "7", "3.19 MM", "56 SQMM", "1.60 MM", "12.78 MM"]
        ]
      }
    },
    {
      id: "current-carrying-capacity-resistance",
      name: "CURRENT CARRING CAPACITY & RESISTANCE CALCULATOR",
      type: "current-carrying-capacity",
      data: {
        conductorType: "AAAC Conductor",
        standard: "IS 398 P-IV",
        selectionArea: "95.00 mm²",
        headers: ["SELECTION AREA", "CCC (Amps/km)", "At °C (Amps)", "AC RESISTANCE (Ω/km)", "At °C (Amps)"],
        rows: [
          ["95.00 mm²", "", "", "", ""]
        ]
      }
    },
    {
      id: "aaac-conductor-parameters",
      name: "AAAC CONDUCTOR PARAMETERS CALCULATORS",
      type: "aaac-conductor",
      data: {
        selectedConductor: "Mole",
        headers: ["CONDUCTOR CODE", "SELECTIONAL AREA (mm²)", "STRANDING & WIRE DIA. (nos/mm)", "DC RESISTANCE (N) NORMAL (Ω/km)"],
        rows: [
          ["Mole", "15", "3/2.50", "2.2286"]
        ],
        availableConductors: [
          "Mole", "Squirrel", "Weasel", "Rabbit", "Raccoon", "Dog", "Dog(up)", "Coyote", 
          "Wolf", "Wolf(up)", "Panther", "Panther(up)", "Kundah", "Zebra", "Zebra(up)", "Moose"
        ]
      }
    },
    {
      id: "acsr-conductor-parameters",
      name: "ACSR CONDUCTOR PARAMETERS CALCULATORS",
      type: "acsr-conductor",
      data: {
        selectedConductor: "Rabbit",
        headers: ["CONDUCTOR CODE", "SELECTIONAL AREA (mm²)", "STRANDING & WIRE DIA. (Aluminium)", "STRANDING & WIRE DIA. (Steel)", "DC RESISTANCE At 20°C (Ω/km)"],
        rows: [
          ["Rabbit", "50", "6/3.35", "1/3.35", "0.55"]
        ],
        availableConductors: [
          "Mole", "Squirrel", "Weasel", "Rabbit", "Raccoon", "Dog", "Coyote", 
          "Wolf", "Lynx", "Panther", "Goat", "Kundah", "Zebra", "Moose", "Morkulla", "Bersimis"
        ]
      }
    }
  ];
  const conversionCalculationsData = [
    {
      id: "length-conversion",
      name: "LENGTH CONVERSION CALCULATOR",
      type: "length-conversion",
      data: {
        inputValue: "1.00",
        inputUnit: "km",
        outputValue: "1000.00",
        outputUnit: "m",
        note: "standardized measurements"
      }
    },
    {
      id: "temperature-conversion",
      name: "TEMPERATURE CONVERTOR CALCULATOR",
      type: "temperature-conversion",
      data: {
        description: "TEMPERATURE CORRECTION FACTORS kt FOR CONDUCTOR RESISTANCE TO CORRECT THE MEASURED RESISTANCE AT t°C TO 20°C",
        headers: ["kt", "t°C", "t°C TO 20°C"],
        rows: [
          ["0.980", "30°C", "0.943 20°C"]
        ],
        note: "standardized measurements at 20°C"
      }
    },
    {
      id: "energy-conversion",
      name: "ENERGY CONVERSION CALCULATOR",
      type: "energy-conversion",
      data: {
        subtitle: "DISTANCE CONVERSATION (LENGTH)",
        inputValue: "1.00",
        inputUnit: "J",
        outputValue: "0.0010",
        outputUnit: "kJ",
        note: "standardized measurements"
      }
    },
    {
      id: "power-conversion",
      name: "POWER CONVERSION CALCULATOR",
      type: "power-conversion",
      data: {
        inputValue: "1.00",
        inputUnit: "J",
        outputValue: "0.0010",
        outputUnit: "kJ",
        note: "standardized measurements",
        status: "WORKING ***"
      }
    },
    {
      id: "cable-selection-submersible",
      name: "CABLE SELECTION FOR SUBMERSIBLE MOTOR CALCULATOR",
      type: "cable-selection-submersible",
      data: {
        subtitle: "(3 PHASE, 220-240 V, 50Hz | Direct on line Starter)",
        headers: ["MOTOR RATING", "LENGTH OF CABLE", "VOLTAGE DROP", "CURRENT (Ω)", "ACTUAL GAUGE", "CABLE SIZE"],
        rows: [
          ["5.00 HP", "800 MTR", "21.50", "7.27", "8.08", "10 SQMM"]
        ]
      }
    },
    {
      id: "armouring-covering",
      name: "ARMOURING COVERING CALCULATOR",
      type: "armouring-covering",
      data: {
        headers: ["ARMOURED OD", "WIRE/STRIP OD", "WIGTH", "LAY", "COS(Ф)", "INNER OD", "COVERING %", "N/O WIRES"],
        rows: [
          ["16.00", "4.00", "25.12", "256.00", "0.9999", "8.00", "100.00", "6"]
        ]
      }
    },
    {
      id: "cable-selection-copper-house",
      name: "CABLE SELECTION FOR COPPER HOUSE WIRES CALCULATOR",
      type: "cable-selection-copper-house",
      data: {
        subtitle: "(1/3 PHASE, 220-240 V)",
        headers: ["PHASE Φ", "POWER CONSUMPTION", "LENGTH OF CABLE", "CURRENT (Ω)", "ACTUAL GAUGE", "WIRE SIZE"],
        rows: [
          ["1", "2.00 HP", "500 MTR", "5.04", "2.02", "2.5 SQMM"]
        ]
      }
    }
  ];

  const wireGaugeData = [
    {
      id: "wire-gauge-chart",
      name: "WIRE GAUGE CHART",
      type: "wire-gauge-chart",
      data: {
        headers: ["Gauge", "SWG Inch", "SWG MM", "AWG Inch", "AWG MM"],
        rows: [
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
        ]
      }
    }
  ];

  const temperatureCorrectionData = [
    {
      id: "temperature-correction-factors",
      name: "TEMPERATURE CORRECTION FACTORS kt FOR CONDUCTOR RESISTANCE TO CORRECT THE MEASURED RESISTANCE AT t°C TO 20°C",
      type: "temperature-correction-factors",
      data: {
        headers: ["Temperature of Conductor at Time of Measurement °C", "Correction Factor kt", "Temperature of Conductor at Time of Measurement °C", "Correction Factor kt"],
        rows: [
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
        ]
      }
    }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleToolClick = (tool) => {
    if (tool.dataId) {
      console.log("Looking for dataId:", tool.dataId);
      const cable = cableData.find(c => c.id === tool.dataId);
      if (cable) {
        setSelectedTableData(cable);
        setIsTableOpen(true);
      }
    } else if (tool.name === "TECHNICAL CALCULATIONS") {
      // Disabled - functionality removed
      return;
    } else if (tool.name === "CONVERSIONAL CALCULATIONS") {
      // Disabled - functionality removed
      return;
    } else if (tool.name === "WIRE GAUGE CHART") {
      // Load wire gauge data
      const wireGauge = wireGaugeData[0];
      setSelectedTableData({
        name: wireGauge.name,
        headers: wireGauge.data.headers,
        rows: wireGauge.data.rows
      });
      setIsTableOpen(true);
    } else if (tool.name === "TEMPERATURE CORRECTION FACTORS kt FOR CONDUCTOR RESISTANCE TO CORRECT THE MEASURED RESISTANCE AT t°C TO 20°C") {
      // Load temperature correction data
      const tempCorrection = temperatureCorrectionData[0];
      setSelectedTableData({
        name: tempCorrection.name,
        headers: tempCorrection.data.headers,
        rows: tempCorrection.data.rows
      });
      setIsTableOpen(true);
    } else if (tool.name === "Business Card") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Brochure") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "GST Details") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Company Emails") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Location") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else {
      // For product tools, check if they have data
      // Exclude special items (Business Card, Brochure, GST Details, Company Emails, Location)
      const specialItems = ["Business Card", "Brochure", "GST Details", "Company Emails", "Location"];
      if (!specialItems.includes(tool.name)) {
        // Check if it's a product from the products section
        const productsSection = sections.find(s => s.id === "products");
        const isProduct = productsSection?.tools.some(t => t.name === tool.name);
        
        if (isProduct) {
          if (hasProductData(tool.name)) {
            setSelectedProduct(tool.name);
            setIsProductDetailOpen(true);
          } else {
            setShowDataUpcoming(true);
          }
        }
      }
    }
  };

  const openTable = (cableId) => {
    const cable = cableData.find(c => c.id === cableId);
    if (cable) {
      setSelectedTableData(cable);
      setIsTableOpen(true);
    }
  };
  const closeTable = () => {
    setIsTableOpen(false);
    setSelectedTableData(null);
  };

  const openCalculator = (calculatorType) => {
    setSelectedCalculator(calculatorType);
    setIsCalculatorOpen(true);
  };

  const closeCalculator = () => {
    setIsCalculatorOpen(false);
    setSelectedCalculator(null);
  };

  const handleInputChange = (field, value) => {
    setCalculatorInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const calculateResults = () => {
    const { conductorType, conductorSize, temperature, standard } = calculatorInputs;
    
    if (!conductorType || !conductorSize || !temperature || !standard) {
      alert('Please fill in all fields');
      return;
    }

    // Reference data for calculations
    const conductorData = {
      '15': { current: 88, resistance: 2.2286, od: 6.5 },
      '25': { current: 130, resistance: 0.727, od: 8.8 },
      '35': { current: 160, resistance: 0.524, od: 10.4 },
      '50': { current: 200, resistance: 0.387, od: 12.0 },
      '70': { current: 245, resistance: 0.268, od: 14.0 },
      '95': { current: 300, resistance: 0.193, od: 16.0 },
      '120': { current: 350, resistance: 0.153, od: 18.0 },
      '150': { current: 400, resistance: 0.124, od: 20.0 },
      '185': { current: 450, resistance: 0.099, od: 22.0 },
      '240': { current: 550, resistance: 0.075, od: 25.0 }
    };

    const baseData = conductorData[conductorSize];
    if (!baseData) {
      alert('Invalid conductor size');
      return;
    }

    // Temperature correction factors
    const tempCorrection = {
      '20': 1.0,
      '65': 1.16,
      '75': 1.25,
      '90': 1.4
    };

    // Standard correction factors
    const standardCorrection = {
      'is398': 1.0,
      'is7098': 0.95,
      'iec': 1.1
    };

    // Conductor type correction factors
    const typeCorrection = {
      'aerial': 0.9,
      'aaac': 1.0,
      'acsr': 1.1,
      'copper': 1.2
    };

    const tempFactor = tempCorrection[temperature] || 1.0;
    const standardFactor = standardCorrection[standard] || 1.0;
    const typeFactor = typeCorrection[conductorType] || 1.0;

    // Calculate results
    const currentCapacity = Math.round(baseData.current * tempFactor * standardFactor * typeFactor);
    const resistance = (baseData.resistance / tempFactor).toFixed(4);
    const cableOD = (baseData.od * typeFactor).toFixed(1);

    setCalculationResults({
      currentCapacity,
      resistance,
      cableOD
    });
  };

  const selectCalculatorType = (type) => {
    setSelectedCalculator(type);
    // Auto-fill some inputs based on calculator type
    if (type === 'aerial') {
      setCalculatorInputs(prev => ({ ...prev, conductorType: 'aerial' }));
    } else if (type === 'aaac') {
      setCalculatorInputs(prev => ({ ...prev, conductorType: 'aaac' }));
    } else if (type === 'acsr') {
      setCalculatorInputs(prev => ({ ...prev, conductorType: 'acsr' }));
    }
  };

  const closeTechnicalCalculations = () => {
    setIsTechnicalCalculationsOpen(false);
  };

  const closeConversionCalculations = () => {
    setIsConversionCalculationsOpen(false);
  };

  const closeWireGaugeChart = () => {
    setIsWireGaugeChartOpen(false);
  };

  const closeTemperatureCorrection = () => {
    setIsTemperatureCorrectionOpen(false);
  };


  const closeProductDetail = () => {
    setIsProductDetailOpen(false);
    setSelectedProduct("");
  };

  const getProductData = (productName) => {
    const productData = {
      "Aerial Bunch Cable": {
        title: "Aerial Bunch Cable",
        description: "Overhead power distribution cable for electrical transmission",
        imageUrl: "/images/products/aerial bunch cable.jpeg",
        priceList: [
          { size: "AB CABLE 3CX16+1CX16+1CX25 SQMM", price: "", stock: "", image: "" },
          { size: "AB CABLE 3CX25+1CX16+1CX25 SQMM", price: "", stock: "", image: "" },
          { size: "AB CABLE 3CX35+1CX16+1CX25 SQMM", price: "", stock: "", image: "" },
          { size: "AB CABLE 3CX50+1CX16+1CX35 SQMM", price: "", stock: "", image: "" },
          { size: "AB CABLE 3CX70+1CX16+1CX50 SQMM", price: "", stock: "", image: "" },
          { size: "AB CABLE 3CX95+1CX16+1CX70 SQMM", price: "", stock: "", image: "" },
          { size: "AB CABLE 3CX120+1CX16+1CX95 SQMM", price: "", stock: "", image: "" }
        ],
        // Replaced demo key-value specs with actual tabular technical data
        technicalData: {},
        technicalTables: {
          note: "THE SIZE OF THE STREET LIGHT CONDUCTOR SHALL BE 16 SQMM UPTO 95 SQMM",
          tables: [
            {
              title: "PHASE Φ",
              columns: [
                "AREA (SQMM)",
                "STRANDS/WIRE",
                "C DIA (mm)",
                "INS Thick (mm)",
                "IC DIA (mm)",
                "MAX R (Ω/Km)"
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
                "AREA (SQMM)",
                "STRANDS/WIRE",
                "C DIA (mm)",
                "INS Thick (mm)",
                "MAX R (Ω/Km)",
                "Max br load (kN)"
              ],
              rows: [
                { sqmm: "25", strands: "7/2.12", conductorDia: "6.36", insulationThickness: "1.20", maxResistance: "1.380", maxBreakingLoad: "7.560" },
                { sqmm: "35", strands: "7/2.52", conductorDia: "7.56", insulationThickness: "1.20", maxResistance: "0.986", maxBreakingLoad: "8.760" },
                { sqmm: "50", strands: "7/3.02", conductorDia: "9.06", insulationThickness: "1.50", maxResistance: "0.689", maxBreakingLoad: "10.560" },
                { sqmm: "70", strands: "7/3.57", conductorDia: "10.71", insulationThickness: "1.50", maxResistance: "0.492", maxBreakingLoad: "12.210" }
              ]
            }
          ]
        }
      },
      "Aluminium Conductor Galvanized Steel Reinforced": {
        title: "Aluminium Conductor Galvanized Steel Reinforced",
        description: "ACSR conductor for overhead transmission and distribution lines",
        imageUrl: "/images/products/all aluminium alloy conductor.jpeg",
        priceList: [
          { size: "10 SQMM", price: "", stock: "", image: "" },
          { size: "18 SQMM", price: "", stock: "", image: "" },
          { size: "20 SQMM", price: "", stock: "", image: "" },
          { size: "30 SQMM", price: "", stock: "", image: "" },
          { size: "50 SQMM", price: "", stock: "", image: "" },
          { size: "80 SQMM", price: "", stock: "", image: "" },
          { size: "100 SQMM", price: "", stock: "", image: "" }
        ],
        technicalData: {},
        technicalTables: {
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
        }
      },
      "All Aluminium Alloy Conductor": {
        title: "AAAC Conductor",
        description: "All Aluminium Alloy Conductor for overhead lines",
        imageUrl: "/images/products/all aluminium alloy conductor.jpeg",
        priceList: [
          { size: "MOLE - 15 SQMM", price: "", stock: "", image: "" },
          { size: "SQUIRREL - 22 SQMM", price: "", stock: "", image: "" },
          { size: "WEASEL - 34 SQMM", price: "", stock: "", image: "" },
          { size: "RABBIT - 55 SQMM", price: "", stock: "", image: "" },
          { size: "RACCOON - 80 SQMM", price: "", stock: "", image: "" },
          { size: "DOG - 100 SQMM", price: "", stock: "", image: "" }
        ],
        technicalData: {
          voltage: "33 kV",
          conductor: "Aluminum Alloy",
          insulation: "Bare Conductor",
          sheath: "None",
          temperature: "-40°C to +80°C",
          bendingRadius: "12 times conductor diameter",
          standards: "IS 398 (Part 4)"
        }
      },
      "Paper Cover Aluminium Conductor": {
        title: "Paper Cover Aluminium Conductor",
        description: "Traditional paper insulated conductor for overhead lines",
        imageUrl: "/images/products/paper covered aluminium conductor.jpeg",
        priceList: [
          { size: "0.80 mm (covered Dia 1.085 mm)", price: "", stock: "Available", image: "" },
          { size: "1.06 mm (covered Dia 1.345 mm)", price: "", stock: "Available", image: "" },
          { size: "1.25 mm (covered Dia 1.540 mm)", price: "", stock: "Available", image: "" },
          { size: "1.32 mm (covered Dia 1.610 mm)", price: "", stock: "Available", image: "" },
          { size: "1.40 mm (covered Dia 1.715 mm)", price: "", stock: "Available", image: "" },
          { size: "1.50 mm (covered Dia 1.815 mm)", price: "", stock: "Available", image: "" },
          { size: "1.60 mm (covered Dia 1.915 mm)", price: "", stock: "Available", image: "" },
          { size: "1.70 mm (covered Dia 2.015 mm)", price: "", stock: "Available", image: "" },
          { size: "1.80 mm (covered Dia 2.120 mm)", price: "", stock: "Available", image: "" },
          { size: "1.90 mm (covered Dia 2.220 mm)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "11 kV",
          conductor: "Aluminum",
          insulation: "Paper",
          sheath: "None",
          temperature: "-20°C to +70°C",
          bendingRadius: "10 times conductor diameter",
          standards: "IS 398 (Part 1)"
        }
      },
      "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable": {
        title: "Single Core PVC Cable",
        description: "Single core power cable with PVC insulation",
        imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg",
        priceList: [
          { size: "4 sq.mm (Ø 2.25 mm | 0.088 in)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (Ø 2.76 mm | 0.108 in)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (Ø 3.56 mm | 0.140 in)", price: "", stock: "Available", image: "" },
          { size: "16 sq.mm (7/1.71 mm | 7/0.067 in)", price: "", stock: "Available", image: "" },
          { size: "25 sq.mm (7/2.13 mm | 7/0.084 in)", price: "", stock: "Available", image: "" },
          { size: "35 sq.mm (7/2.52 mm | 7/0.099 in)", price: "", stock: "Available", image: "" },
          { size: "50 sq.mm (7/3.02 mm | 7/0.119 in)", price: "", stock: "Available", image: "" },
          { size: "70 sq.mm (19/2.16 mm | 19/0.085 in)", price: "", stock: "Available", image: "" },
          { size: "95 sq.mm (19/2.52 mm | 19/0.099 in)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Aluminum/Copper",
          insulation: "PVC",
          sheath: "PVC",
          temperature: "-15°C to +70°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable": {
        title: "Single Core XLPE Cable",
        description: "Single core power cable with XLPE insulation",
        imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg",
        priceList: [
          { size: "4 sq.mm (Ø 2.25 mm | 0.088 in)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (Ø 2.76 mm | 0.108 in)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (Ø 3.56 mm | 0.140 in)", price: "", stock: "Available", image: "" },
          { size: "16 sq.mm (7/1.71 mm | 7/0.067 in)", price: "", stock: "Available", image: "" },
          { size: "25 sq.mm (7/2.13 mm | 7/0.084 in)", price: "", stock: "Available", image: "" },
          { size: "35 sq.mm (7/2.52 mm | 7/0.099 in)", price: "", stock: "Available", image: "" },
          { size: "50 sq.mm (7/3.02 mm | 7/0.119 in)", price: "", stock: "Available", image: "" },
          { size: "70 sq.mm (19/2.16 mm | 19/0.085 in)", price: "", stock: "Available", image: "" },
          { size: "95 sq.mm (19/2.52 mm | 19/0.099 in)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Aluminum/Copper",
          insulation: "XLPE",
          sheath: "PVC",
          temperature: "-15°C to +90°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 7098 (Part 1)"
        }
      },
      "Multi Core PVC Insulated Aluminium Armoured Cable": {
        title: "Multi Core PVC Armoured Cable",
        description: "Multi-core power cable with aluminium armour",
        imageUrl: "/images/products/multi core pvc isulated aluminium armoured cable.jpeg",
        priceList: [
          { size: "2.5 sq.mm (Ø 1.78 mm | 0.070 in)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (Ø 2.25 mm | 0.088 in)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (Ø 2.76 mm | 0.108 in)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (Ø 3.56 mm | 0.140 in)", price: "", stock: "Available", image: "" },
          { size: "16 sq.mm (7/1.71 mm | 7/0.067 in)", price: "", stock: "Available", image: "" },
          { size: "25 sq.mm (7/2.13 mm | 7/0.084 in)", price: "", stock: "Available", image: "" },
          { size: "35 sq.mm (7/2.52 mm | 7/0.099 in)", price: "", stock: "Available", image: "" },
          { size: "50 sq.mm (7/3.02 mm | 7/0.119 in)", price: "", stock: "Available", image: "" },
          { size: "70 sq.mm (19/2.16 mm | 19/0.085 in)", price: "", stock: "Available", image: "" },
          { size: "95 sq.mm (19/2.52 mm | 19/0.099 in)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Aluminum",
          insulation: "PVC",
          sheath: "PVC",
          armour: "Aluminum",
          temperature: "-15°C to +70°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Multi Core XLPE Insulated Aluminium Armoured Cable": {
        title: "Multi Core XLPE Armoured Cable",
        description: "Multi-core XLPE cable with aluminium armour",
        imageUrl: "/images/products/multi core xlpe insulated aluminium armoured cable.jpeg",
        priceList: [
          { size: "2.5 sq.mm (Ø 1.78 mm | 0.070 in)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (Ø 2.25 mm | 0.088 in)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (Ø 2.76 mm | 0.108 in)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (Ø 3.56 mm | 0.140 in)", price: "", stock: "Available", image: "" },
          { size: "16 sq.mm (7/1.71 mm | 7/0.067 in)", price: "", stock: "Available", image: "" },
          { size: "25 sq.mm (7/2.13 mm | 7/0.084 in)", price: "", stock: "Available", image: "" },
          { size: "35 sq.mm (7/2.52 mm | 7/0.099 in)", price: "", stock: "Available", image: "" },
          { size: "50 sq.mm (7/3.02 mm | 7/0.119 in)", price: "", stock: "Available", image: "" },
          { size: "70 sq.mm (19/2.16 mm | 19/0.085 in)", price: "", stock: "Available", image: "" },
          { size: "95 sq.mm (19/2.52 mm | 19/0.099 in)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Aluminum",
          insulation: "XLPE",
          sheath: "PVC",
          armour: "Aluminum",
          temperature: "-15°C to +90°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 7098 (Part 1)"
        }
      },
      "Multi Core PVC Insulated Aluminium Unarmoured Cable": {
        title: "Multi Core PVC Unarmoured Cable",
        description: "Multi-core power cable without armour",
        imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg",
        priceList: [
          { size: "2.5 sq.mm (Ø 1.78 mm | 0.070 in)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (Ø 2.25 mm | 0.088 in)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (Ø 2.76 mm | 0.108 in)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (Ø 3.56 mm | 0.140 in)", price: "", stock: "Available", image: "" },
          { size: "16 sq.mm (7/1.71 mm | 7/0.067 in)", price: "", stock: "Available", image: "" },
          { size: "25 sq.mm (7/2.13 mm | 7/0.084 in)", price: "", stock: "Available", image: "" },
          { size: "35 sq.mm (7/2.52 mm | 7/0.099 in)", price: "", stock: "Available", image: "" },
          { size: "50 sq.mm (7/3.02 mm | 7/0.119 in)", price: "", stock: "Available", image: "" },
          { size: "70 sq.mm (19/2.16 mm | 19/0.085 in)", price: "", stock: "Available", image: "" },
          { size: "95 sq.mm (19/2.52 mm | 19/0.099 in)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Aluminum",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Multi Core XLPE Insulated Aluminium Unarmoured Cable": {
        title: "Multi Core XLPE Unarmoured Cable",
        description: "Multi-core XLPE cable without armour",
        imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg",
        priceList: [
          { size: "2.5 sq.mm (Ø 1.78 mm | 0.070 in)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (Ø 2.25 mm | 0.088 in)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (Ø 2.76 mm | 0.108 in)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (Ø 3.56 mm | 0.140 in)", price: "", stock: "Available", image: "" },
          { size: "16 sq.mm (7/1.71 | 7/0.067 in)", price: "", stock: "Available", image: "" },
          { size: "25 sq.mm (7/2.13 | 7/0.084 in)", price: "", stock: "Available", image: "" },
          { size: "35 sq.mm (7/2.52 | 7/0.099 in)", price: "", stock: "Available", image: "" },
          { size: "50 sq.mm (7/3.02 | 7/0.119 in)", price: "", stock: "Available", image: "" },
          { size: "70 sq.mm (19/2.16 | 19/0.085 in)", price: "", stock: "Available", image: "" },
          { size: "95 sq.mm (19/2.52 | 19/0.099 in)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Aluminum",
          insulation: "XLPE",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +90°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 7098 (Part 1)"
        }
      },
      "Multistrand Single Core Copper Cable": {
        title: "Multistrand Single Core Copper Cable",
        description: "Flexible single core copper power cable",
        imageUrl: "/images/products/multistrand single core copper cable.jpeg",
        priceList: [
          { size: "0.5 sq.mm (16/0.20 | 16/0.00788)", price: "", stock: "Available", image: "" },
          { size: "0.75 sq.mm (24/0.20 | 24/0.00788)", price: "", stock: "Available", image: "" },
          { size: "1 sq.mm (32/0.20 | 32/0.00788)", price: "", stock: "Available", image: "" },
          { size: "1.5 sq.mm (30/0.25 | 30/0.00985)", price: "", stock: "Available", image: "" },
          { size: "2.5 sq.mm (50/0.25 | 50/0.00985)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (56/0.30 | 56/0.01181)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (84/0.30 | 84/0.01181)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Multi Core Copper Cable": {
        title: "Multi Core Copper Cable",
        description: "Multi-core copper power cable",
        imageUrl: "/images/products/multi core copper cable.jpeg",
        priceList: [
          { size: "0.5 sq.mm (16/0.20 | 16/0.00788)", price: "", stock: "Available", image: "" },
          { size: "0.75 sq.mm (24/0.20 | 24/0.00788)", price: "", stock: "Available", image: "" },
          { size: "1 sq.mm (32/0.20 | 32/0.00788)", price: "", stock: "Available", image: "" },
          { size: "1.5 sq.mm (30/0.25 | 30/0.00985)", price: "", stock: "Available", image: "" },
          { size: "2.5 sq.mm (50/0.25 | 50/0.00985)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (56/0.30 | 56/0.01181)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (84/0.30 | 84/0.01181)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (80/0.40 | 80/0.01575)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Business Card": {
        title: "Business Card",
        description: "Company contact information and details",
        priceList: [],
        technicalData: {},
        businessInfo: {
          companyName: "ANOCAB Electric Solutions",
          contactPerson: "Rajvansh Samal",
          designation: "Production Planning Controller",
          phone: "+91 6262002105",
          email: "rajvansh@anocab.com",
          address: "Near Dhan Darai, Dadda Nagar, Jabalpur, MP",
          website: "www.anocab.com",
          gstin: "27ABCDE1234F1Z5",
          pan: "ABCDE1234F",
          cin: "U31909MH2010PTC123456"
        }
      },
      "Brochure": {
        title: "Company Brochure",
        description: "Company brochure and product catalog",
        priceList: [],
        technicalData: {},
        businessInfo: {
          companyName: "Anode Electric Private Limited",
          established: "2010",
          employees: "150+",
          certifications: ["ISO 9001:2015", "ISO 14001:2015", "OHSAS 18001:2007"],
          products: ["Power Cables", "Control Cables", "Instrumentation Cables", "Telecom Cables"],
          markets: ["Domestic", "Export", "Industrial", "Infrastructure"],
          quality: "BIS Certified Products",
          capacity: "5000 KM per month"
        }
      },
      "GST Details": {
        title: "GST Details",
        description: "Tax registration and compliance information",
        priceList: [],
        technicalData: {},
        businessInfo: {
          gstin: "27ABCDE1234F1Z5",
          pan: "ABCDE1234F",
          state: "Maharashtra",
          stateCode: "27",
          registrationDate: "01-07-2017",
          businessType: "Manufacturing",
          address: "Industrial Area, Sector 5, Mumbai, Maharashtra - 400001",
          contact: "+91-9876543210",
          email: "gst@anodeelectric.com"
        }
      },
      "Company Emails": {
        title: "Company Emails",
        description: "All company email addresses and contacts",
        priceList: [],
        technicalData: {},
        businessInfo: {
          general: "info@anodeelectric.com",
          sales: "sales@anodeelectric.com",
          support: "support@anodeelectric.com",
          accounts: "accounts@anodeelectric.com",
          hr: "hr@anodeelectric.com",
          technical: "technical@anodeelectric.com",
          export: "export@anodeelectric.com",
          procurement: "procurement@anodeelectric.com"
        }
      },
      "Location": {
        title: "Company Location",
        description: "Office and manufacturing facility locations",
        priceList: [],
        technicalData: {},
        businessInfo: {
          headOffice: {
            address: "Industrial Area, Sector 5, Mumbai, Maharashtra - 400001",
            phone: "+91-9876543210",
            email: "info@anodeelectric.com"
          },
          manufacturing: {
            address: "Plot No. 123, Industrial Estate, Pune, Maharashtra - 411001",
            phone: "+91-9876543211",
            email: "manufacturing@anodeelectric.com"
          },
          branch: {
            address: "Office No. 456, Business Park, Delhi - 110001",
            phone: "+91-9876543212",
            email: "delhi@anodeelectric.com"
          }
        }
      },
      "PVC Insulated Single Core Aluminium Cable": {
        title: "PVC Insulated Single Core Aluminium Cable",
        description: "Single core aluminium cable with PVC insulation",
        imageUrl: "/images/products/pvc insulated single core aluminium cables.jpeg",
        priceList: [
          { size: "4 sq.mm (Ø 2.25 mm | 13 SWG | 0.088 in)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (Ø 2.76 mm | 11 SWG | 0.108 in)", price: "", stock: "Available", image: "" },
          { size: "> 8 sq.mm (Ø 3.02 mm | 10 SWG | 0.12 in)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (Ø 3.56 mm | 9 SWG | 0.14 in)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (7/0.85 | 7/20 | 7/0.034)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (7/1.05 | 7/18 | 7/0.042)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (7/1.35 | 7/16 | 7/0.054)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Aluminum",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "PVC Insulated Submersible Cable": {
        title: "PVC Insulated Submersible Cable",
        description: "Water-resistant submersible cable",
        imageUrl: "/images/products/pvc insulated submersible cable.jpeg",
        priceList: [
          { size: "1.0 mm² (32/0.20 | 32/0.00788)", price: "", stock: "", image: "" },
          { size: "1.5 mm² (30/0.25 | 30/0.00985)", price: "", stock: "", image: "" },
          { size: "2.5 mm² (50/0.25 | 50/0.00985)", price: "", stock: "", image: "" },
          { size: "4.0 mm² (56/0.30 | 56/0.01181)", price: "", stock: "", image: "" },
          { size: "6.0 mm² (84/0.30 | 84/0.01181)", price: "", stock: "", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "PVC Insulated Multicore Aluminium Cable": {
        title: "PVC Insulated Multicore Aluminium Cable",
        description: "Multi-core aluminium cable with PVC insulation",
        imageUrl: "/images/products/pvc insulated multicore aluminium cable.jpeg",
        priceList: [
          { size: "2.5 sq.mm (Ø 1.78 mm | 0.070 in)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (Ø 2.25 mm | 0.088 in)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (Ø 2.76 mm | 0.108 in)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (Ø 3.56 mm | 0.140 in)", price: "", stock: "Available", image: "" },
          { size: "16 sq.mm (Ø 4.51 mm | 0.177 in)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.1 kV",
          conductor: "Aluminum",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Submersible Winding Wire": {
        title: "Submersible Winding Wire",
        description: "Specialized winding wire for submersible applications",
        imageUrl: "/images/products/submersible winding wire.jpeg",
        priceList: [
          { size: "0.40 mm (covered Ø 0.800 mm)", price: "", stock: "Available", image: "" },
          { size: "0.45 mm (covered Ø 0.850 mm)", price: "", stock: "Available", image: "" },
          { size: "0.50 mm (covered Ø 0.900 mm)", price: "", stock: "Available", image: "" },
          { size: "0.55 mm (covered Ø 0.950 mm)", price: "", stock: "Available", image: "" },
          { size: "0.60 mm (covered Ø 1.000 mm)", price: "", stock: "Available", image: "" },
          { size: "0.65 mm (covered Ø 1.050 mm)", price: "", stock: "Available", image: "" },
          { size: "0.70 mm (covered Ø 1.100 mm)", price: "", stock: "Available", image: "" },
          { size: "0.75 mm (covered Ø 1.150 mm)", price: "", stock: "Available", image: "" },
          { size: "0.80 mm (covered Ø 1.200 mm)", price: "", stock: "Available", image: "" },
          { size: "0.85 mm (covered Ø 1.300 mm)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Twin Twisted Copper Wire": {
        title: "Twin Twisted Copper Wire",
        description: "Twisted pair copper wire",
        imageUrl: "/images/products/twin twisted copper wire.jpeg",
        priceList: [
          { size: "0.5 sq.mm (16/0.20 | 16/0.00788)", price: "", stock: "Available", image: "" },
          { size: "0.75 sq.mm (24/0.20 | 24/0.00788)", price: "", stock: "Available", image: "" },
          { size: "1.0 sq.mm (32/0.20 | 32/0.00788)", price: "", stock: "Available", image: "" },
          { size: "1.5 sq.mm (30/0.25 | 30/0.00985)", price: "", stock: "Available", image: "" },
          { size: "2.5 sq.mm (50/0.25 | 50/0.00985)", price: "", stock: "Available", image: "" },
          { size: "4.0 sq.mm (56/0.30 | 56/0.01181)", price: "", stock: "Available", image: "" },
          { size: "6.0 sq.mm (84/0.30 | 84/0.01181)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Speaker Cable": {
        title: "Speaker Cable",
        description: "Audio speaker connection cable",
        imageUrl: "/images/products/speaker cable.jpeg",
        priceList: [
          { size: "0.5 sq.mm (16/0.20 | 16/0.00788)", price: "", stock: "Available", image: "" },
          { size: "0.75 sq.mm (24/0.20 | 24/0.00788)", price: "", stock: "Available", image: "" },
          { size: "1.0 sq.mm (32/0.20 | 32/0.00788)", price: "", stock: "Available", image: "" },
          { size: "1.5 sq.mm (30/0.25 | 30/0.00985)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "CCTV Cable": {
        title: "CCTV Cable",
        description: "Closed-circuit television cable",
        imageUrl: "/images/products/cctv cable.jpeg",
        priceList: [
          { size: "CCTV 3+1 | Co-ax RG-59 | 84/0.01181 | CR@20°C 3.550 Ω/km", price: "", stock: "Available", image: "" },
          { size: "CCTV 4+1 | Co-ax RG-59 | 84/0.01181 | CR@20°C 3.550 Ω/km", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "LAN Cable": {
        title: "LAN Cable",
        description: "Local area network cable",
        imageUrl: "/images/products/telecom switch board cables.jpeg",
        priceList: [
          { size: "CAT-5 4 Pair (1/0.574 mm)", price: "", stock: "Available", image: "" },
          { size: "CAT-6 4 Pair (1/0.574 mm)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Automobile Cable": {
        title: "Automobile Cable",
        description: "Automotive electrical cable",
        imageUrl: "/images/products/automobile wire.jpeg",
        priceList: [
          { size: "0.35 sq.mm (12/0.20)", price: "", stock: "Available", image: "" },
          { size: "0.5 sq.mm (16/0.20)", price: "", stock: "Available", image: "" },
          { size: "0.75 sq.mm (24/0.20)", price: "", stock: "Available", image: "" },
          { size: "1 sq.mm (32/0.20)", price: "", stock: "Available", image: "" },
          { size: "1.5 sq.mm (30/0.25)", price: "", stock: "Available", image: "" },
          { size: "2.5 sq.mm (50/0.25)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (56/0.30)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (84/0.30)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "PV Solar Cable": {
        title: "PV Solar Cable",
        description: "Photovoltaic solar panel cable",
        imageUrl: "/images/products/pv solar cable.jpeg",
        priceList: [
          { size: "1.5 sq.mm (30/0.25)", price: "", stock: "Available", image: "" },
          { size: "2.5 sq.mm (50/0.25)", price: "", stock: "Available", image: "" },
          { size: "4 sq.mm (56/0.30)", price: "", stock: "Available", image: "" },
          { size: "6 sq.mm (84/0.30)", price: "", stock: "Available", image: "" },
          { size: "10 sq.mm (80/0.40)", price: "", stock: "Available", image: "" },
          { size: "16 sq.mm (126/0.40)", price: "", stock: "Available", image: "" },
          { size: "25 sq.mm (196/0.40)", price: "", stock: "Available", image: "" },
          { size: "35 sq.mm (276/0.40)", price: "", stock: "Available", image: "" },
          { size: "50 sq.mm (396/0.40)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "1.8 kV",
          conductor: "Copper",
          insulation: "XLPE",
          sheath: "PVC",
          armour: "None",
          temperature: "-40°C to +90°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Co Axial Cable": {
        title: "Co Axial Cable",
        description: "Coaxial transmission cable",
        imageUrl: "/images/products/co axial cable.jpeg",
        priceList: [
          { size: "RG59 (1/0.80 mm)", price: "", stock: "Available", image: "" },
          { size: "RG6 (1/1.02 mm)", price: "", stock: "Available", image: "" },
          { size: "RG11 (1/1.63 mm)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PE",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Uni-tube Unarmoured Optical Fibre Cable": {
        title: "Uni-tube Unarmoured Optical Fibre Cable",
        description: "Single tube optical fibre cable",
        imageUrl: "/images/products/unitube unarmoured optical fibre cable.jpeg",
        priceList: [
          { size: "2 Fibre (FRP Ø 0.8 mm)", price: "", stock: "Available", image: "" },
          { size: "4 Fibre (FRP Ø 0.8 mm)", price: "", stock: "Available", image: "" },
          { size: "6 Fibre (FRP Ø 0.8 mm)", price: "", stock: "Available", image: "" },
          { size: "12 Fibre (FRP Ø 0.8 mm)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Fiber Optic",
          insulation: "PE",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Armoured Unarmoured PVC Insulated Copper Control Cable": {
        title: "Armoured Unarmoured PVC Insulated Copper Control Cable",
        description: "Control cable for industrial applications",
        imageUrl: "/images/products/armoured unarmoured pvc insulated copper control cable.jpeg",
        priceList: [
          { size: "2C×1.5 (Ground 26A | Air 24A)", price: "", stock: "Available", image: "" },
          { size: "3C×1.5 (Ground 24A | Air 20A)", price: "", stock: "Available", image: "" },
          { size: "4C×1.5 (Ground 24A | Air 20A)", price: "", stock: "Available", image: "" },
          { size: "5C×1.5 (Ground 18A | Air 17A)", price: "", stock: "Available", image: "" },
          { size: "6C×1.5 (Ground 17A | Air 16A)", price: "", stock: "Available", image: "" },
          { size: "7C×1.5 (Ground 16A | Air 16A)", price: "", stock: "Available", image: "" },
          { size: "8C×1.5 (Ground 16A | Air 14A)", price: "", stock: "Available", image: "" },
          { size: "9C×1.5 (Ground 15A | Air 14A)", price: "", stock: "Available", image: "" },
          { size: "10C×1.5 (Ground 15A | Air 13A)", price: "", stock: "Available", image: "" },
          { size: "12C×1.5 (Ground 14A | Air 12A)", price: "", stock: "Available", image: "" },
          { size: "14C×1.5 (Ground 13A | Air 12A)", price: "", stock: "Available", image: "" },
          { size: "16C×1.5 (Ground 13A | Air 11A)", price: "", stock: "Available", image: "" },
          { size: "19C×1.5 (Ground 11A | Air 11A)", price: "", stock: "Available", image: "" },
          { size: "21C×1.5 (Ground 11A | Air 10A)", price: "", stock: "Available", image: "" },
          { size: "24C×1.5 (Ground 10A | Air 10A)", price: "", stock: "Available", image: "" },
          { size: "2C×2.5 (Ground 36A | Air 32A)", price: "", stock: "Available", image: "" },
          { size: "3C×2.5 (Ground 31A | Air 29A)", price: "", stock: "Available", image: "" },
          { size: "4C×2.5 (Ground 31A | Air 29A)", price: "", stock: "Available", image: "" },
          { size: "5C×2.5 (Ground 26A | Air 23A)", price: "", stock: "Available", image: "" },
          { size: "6C×2.5 (Ground 24A | Air 22A)", price: "", stock: "Available", image: "" },
          { size: "7C×2.5 (Ground 23A | Air 20A)", price: "", stock: "Available", image: "" },
          { size: "8C×2.5 (Ground 22A | Air 19A)", price: "", stock: "Available", image: "" },
          { size: "9C×2.5 (Ground 21A | Air 18A)", price: "", stock: "Available", image: "" },
          { size: "10C×2.5 (Ground 21A | Air 18A)", price: "", stock: "Available", image: "" },
          { size: "12C×2.5 (Ground 19A | Air 17A)", price: "", stock: "Available", image: "" },
          { size: "14C×2.5 (Ground 18A | Air 17A)", price: "", stock: "Available", image: "" },
          { size: "16C×2.5 (Ground 17A | Air 16A)", price: "", stock: "Available", image: "" },
          { size: "19C×2.5 (Ground 16A | Air 14A)", price: "", stock: "Available", image: "" },
          { size: "21C×2.5 (Ground 15A | Air 13A)", price: "", stock: "Available", image: "" },
          { size: "24C×2.5 (Ground 15A | Air 13A)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "Aluminum",
          temperature: "-15°C to +70°C",
          bendingRadius: "6 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      },
      "Telecom Switch Board Cables": {
        title: "Telecom Switch Board Cables",
        description: "Telecommunications switchboard cable",
        imageUrl: "/images/products/telecom switch board cables.jpeg",
        priceList: [
          { size: "2 Pair — 0.4 mm (286 Ω)", price: "", stock: "Available", image: "" },
          { size: "2 Pair — 0.5 mm (184 Ω)", price: "", stock: "Available", image: "" },
          { size: "2 Pair — 0.63 mm (128 Ω)", price: "", stock: "Available", image: "" },
          { size: "2 Pair — 0.7 mm (90 Ω)", price: "", stock: "Available", image: "" },
          { size: "5 Pair — 0.4 mm (286 Ω)", price: "", stock: "Available", image: "" },
          { size: "5 Pair — 0.5 mm (184 Ω)", price: "", stock: "Available", image: "" },
          { size: "5 Pair — 0.63 mm (128 Ω)", price: "", stock: "Available", image: "" },
          { size: "5 Pair — 0.7 mm (90 Ω)", price: "", stock: "Available", image: "" },
          { size: "10 Pair — 0.4 mm (286 Ω)", price: "", stock: "Available", image: "" },
          { size: "10 Pair — 0.5 mm (184 Ω)", price: "", stock: "Available", image: "" },
          { size: "10 Pair — 0.63 mm (128 Ω)", price: "", stock: "Available", image: "" },
          { size: "10 Pair — 0.7 mm (90 Ω)", price: "", stock: "Available", image: "" },
          { size: "20 Pair — 0.4 mm (286 Ω)", price: "", stock: "Available", image: "" },
          { size: "20 Pair — 0.5 mm (184 Ω)", price: "", stock: "Available", image: "" },
          { size: "20 Pair — 0.63 mm (128 Ω)", price: "", stock: "Available", image: "" },
          { size: "20 Pair — 0.7 mm (90 Ω)", price: "", stock: "Available", image: "" },
          { size: "25 Pair — 0.4 mm (286 Ω)", price: "", stock: "Available", image: "" },
          { size: "25 Pair — 0.5 mm (184 Ω)", price: "", stock: "Available", image: "" },
          { size: "25 Pair — 0.63 mm (128 Ω)", price: "", stock: "Available", image: "" },
          { size: "25 Pair — 0.7 mm (90 Ω)", price: "", stock: "Available", image: "" },
          { size: "30 Pair — 0.4 mm (286 Ω)", price: "", stock: "Available", image: "" },
          { size: "30 Pair — 0.5 mm (184 Ω)", price: "", stock: "Available", image: "" },
          { size: "30 Pair — 0.63 mm (128 Ω)", price: "", stock: "Available", image: "" },
          { size: "30 Pair — 0.7 mm (90 Ω)", price: "", stock: "Available", image: "" },
          { size: "50 Pair — 0.4 mm (286 Ω)", price: "", stock: "Available", image: "" },
          { size: "50 Pair — 0.5 mm (184 Ω)", price: "", stock: "Available", image: "" },
          { size: "50 Pair — 0.63 mm (128 Ω)", price: "", stock: "Available", image: "" },
          { size: "50 Pair — 0.7 mm (90 Ω)", price: "", stock: "Available", image: "" }
        ],
        technicalData: {
          voltage: "0.6/1 kV",
          conductor: "Copper",
          insulation: "PVC",
          sheath: "PVC",
          armour: "None",
          temperature: "-15°C to +70°C",
          bendingRadius: "4 times cable diameter",
          standards: "IS 1554 (Part 1)"
        }
      }
    };
    
    return productData[productName] || {
      title: productName,
      description: "Product details and specifications",
      priceList: [],
      technicalData: {}
    };
  };

  const openFileViewer = (file) => {
    setSelectedFile(file);
    setIsFileViewerOpen(true);
  };

  const closeFileViewer = () => {
    setIsFileViewerOpen(false);
    setSelectedFile(null);
    setViewingImageIndex(null);
    setCurrentSlide(0);
  };

  const openBusinessCard = () => {
    setIsBusinessCardOpen(true);
  };

  const closeBusinessCard = () => {
    setIsBusinessCardOpen(false);
  };

  const openSamriddhiBusinessCard = () => {
    setIsSamriddhiBusinessCardOpen(true);
  };

  const closeSamriddhiBusinessCard = () => {
    setIsSamriddhiBusinessCardOpen(false);
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

  const downloadSamriddhiBusinessCard = async (format = 'pdf') => {
    if (!samriddhiBusinessCardRef.current) return;

    try {
      const cardElement = samriddhiBusinessCardRef.current;
      
      // Wait a bit to ensure all images are loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (format === 'pdf') {
        // Download as PDF - capture card exactly as displayed
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
            height: cardElement.offsetHeight
          });
          
          const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
          const link = document.createElement('a');
          link.download = 'samriddhi-business-card.jpg';
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
            link.download = 'samriddhi-business-card.jpg';
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
      console.error('Error downloading Samriddhi business card:', error);
      alert('Failed to download business card. Please try again.');
    }
  };

  const openBrochure = () => {
    // Open the brochure PDF directly in a new tab
    const pdfUrl = `${window.location.origin}/pdf/Anocab brochure.pdf`;
    const newWindow = window.open(pdfUrl, '_blank');
    if (!newWindow) {
      alert('Please allow pop-ups for this site to view the brochure');
    }
  };

  const openApprovals = () => {
    setIsApprovalsOpen(true);
  };

  const closeApprovals = () => {
    setIsApprovalsOpen(false);
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
    // Show "DATA UPCOMING" popup
    setShowDataUpcoming(true);
  };

  const openCompanyEmails = () => {
    setIsCompanyEmailsOpen(true);
  };

  const closeCompanyEmails = () => {
    setIsCompanyEmailsOpen(false);
  };


  const openHelpingCalculators = () => {
    setShowHelpingCalculators(!showHelpingCalculators);
  };

  // keep rendering more modals and UI below within the component

  // (component continues)

  return (
    <div className={`flex min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Main Content */}
      <div className="flex-1 p-6 pr-80">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, sectionIndex) => {
              const IconComponent = section.icon;
              return (
                <section key={section.id} id={section.id} className="scroll-mt-6">
                  {section.id !== "products" && (
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                      }`}>
                        <IconComponent className={`h-6 w-6 ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <h2 className={`text-2xl font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{section.title}</h2>
                    </div>
                  )}

                  {section.id === "products" && (
                    <div className="mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            const query = e.target.value.toLowerCase();
                            const filtered = section.tools.filter(tool => {
                              const name = tool.name.toLowerCase();
                              const description = tool.description.toLowerCase();
                              
                              // Direct matches
                              if (name.includes(query) || description.includes(query)) {
                                return true;
                              }
                              
                              // Shortcuts and aliases
                              const shortcuts = {
                                'ab cable': 'aerial bunch cable',
                                'acsr': 'aluminium conductor galvanized steel reinforced',
                                'aaac': 'all aluminium alloy conductor',
                                'pvc': 'pvc insulated',
                                'xlpe': 'xlpe insulated',
                                'armoured': 'armoured cable',
                                'unarmoured': 'unarmoured cable',
                                'single core': 'single core',
                                'multi core': 'multi core'
                              };
                              
                              // Check if query matches any shortcut
                              for (const [shortcut, fullTerm] of Object.entries(shortcuts)) {
                                if (query.includes(shortcut) && (name.includes(fullTerm) || description.includes(fullTerm))) {
                                  return true;
                                }
                              }
                              
                              return false;
                            });
                            setFilteredTools(filtered);
                          }}
                          className={`w-full px-4 py-2 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className={`h-5 w-5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {(section.id === "products" && searchQuery ? filteredTools : section.tools).map((tool, toolIndex) => {
                      const ToolIcon = tool.icon;
                      return (
                        <div
                          key={toolIndex}
                          className={`p-4 transition-all duration-300 ease-in-out cursor-pointer group min-h-[140px] rounded-xl shadow-sm border 
                            ${section.id === "technical-size-chart"
                              ? isDarkMode 
                                ? "bg-gradient-to-b from-gray-800 to-gray-700 border-gray-600 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-blue-400/60"
                                : "bg-gradient-to-b from-white to-blue-50/50 border-blue-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-blue-200/60"
                              : isDarkMode 
                                ? "bg-gray-800 border-gray-600 hover:bg-gray-700 hover:shadow-lg hover:scale-105 hover:-translate-y-1 hover:border-blue-400"
                                : "bg-white border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:scale-105 hover:-translate-y-1 hover:border-blue-200"}
                          `}
                          onClick={() => handleToolClick(tool)}
                        >
                          <div className="flex flex-col text-left space-y-3">
                            {section.id === "products" ? (
                              tool.imageUrl ? (
                                <div className={`relative w-full h-24 mb-2 rounded-lg overflow-hidden ${
                                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}>
                                  <img 
                                    src={tool.imageUrl} 
                                    alt={tool.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center" style={{display: 'none'}}>
                                    <div className="text-white text-center">
                                      <div className="text-2xl font-bold mb-1">📦</div>
                                      <div className="text-xs font-medium px-2 text-center leading-tight">
                                        {tool.name.split(' ').slice(0, 2).join(' ')}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative w-full h-24 mb-2 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                  <div className="text-white text-center">
                                    <div className="text-2xl font-bold mb-1">📦</div>
                                    <div className="text-xs font-medium px-2 text-center leading-tight">
                                      {tool.name.split(' ').slice(0, 2).join(' ')}
                                    </div>
                                  </div>
                                </div>
                              )
                            ) : ToolIcon && (
                              <div className={`p-3 rounded-lg transition-all duration-300 ease-in-out group-hover:scale-110 
                                ${section.id === "technical-size-chart" 
                                  ? isDarkMode 
                                    ? "bg-blue-900 text-blue-400 group-hover:bg-blue-800"
                                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                  : isDarkMode 
                                    ? "bg-gray-700 group-hover:bg-blue-900"
                                    : "bg-gray-100 group-hover:bg-blue-100"}
                             `}>
                                <ToolIcon className={`h-6 w-6 transition-all duration-300 ease-in-out group-hover:rotate-3 
                                  ${section.id === "technical-size-chart" 
                                    ? isDarkMode ? "text-blue-400" : "text-blue-600"
                                    : isDarkMode ? "text-gray-400 group-hover:text-blue-400" : "text-gray-600 group-hover:text-blue-600"}
                                `} />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className={`font-medium mb-1 transition-colors duration-300 ${
                                section.id === "technical-size-chart" ? "text-sm leading-tight" : "text-sm"
                              } ${
                                isDarkMode 
                                  ? 'text-white group-hover:text-blue-400' 
                                  : 'text-gray-900 group-hover:text-blue-600'
                              }`}>
                                {tool.name}
                              </h3>
                              <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                                section.id === "technical-size-chart" 
                                  ? isDarkMode 
                                    ? "text-gray-400 group-hover:text-gray-300" 
                                    : "text-gray-600 group-hover:text-gray-700"
                                  : isDarkMode 
                                    ? "text-gray-400 group-hover:text-gray-300" 
                                    : "text-gray-500 group-hover:text-gray-700"
                              }`}>{tool.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      {/* Data Table Modal */}
      {selectedTableData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">{selectedTableData.name}</h2>
              <button 
                onClick={closeTable}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {selectedTableData.headers.map((header, index) => (
                        <th key={index} className="text-left py-3 px-4 font-medium text-gray-700">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTableData.rows.map((row, index) => (
                      <tr key={index} className="border-b">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="py-3 px-4 text-gray-900">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversional Calculations Modal */}
      {isHelpingCalcOpen && helpingCalcType === 'conversional' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Conversional Calculations</h3>
              <button onClick={closeHelpingCalc} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* LENGTH CONVERSION CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-900">Length Conversion Calculator</h5>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={convLenValL} 
                          onChange={(e) => setConvLenValL(Number(e.target.value) || 0)}
                          className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={convLenUnitL}
                          onChange={(e) => setConvLenUnitL(e.target.value)}
                          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={convLenValR.toFixed(4)} 
                          className="flex-1 px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-md" 
                          readOnly 
                        />
                        <select 
                          value={convLenUnitR}
                          onChange={(e) => setConvLenUnitR(e.target.value)}
                          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-900">Temperature Convertor Calculator</h5>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">kt Factor</label>
                      <input 
                        type="number" 
                        step="0.001" 
                        value={ktFactor}
                        onChange={(e) => setKtFactor(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                  </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Temperature (°C)</label>
                      <input 
                        type="number" 
                        value={ktTemp}
                        onChange={(e) => setKtTemp(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">t°C to 20°C</label>
                      <input 
                        type="number" 
                        step="0.001" 
                        value={ktTo20}
                        className="w-full px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-md" 
                        readOnly 
                      />
              </div>
            </div>
          </div>
        </div>

              {/* CABLE SELECTION FOR SUBMERSIBLE MOTOR CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-900">Cable Selection for Submersible Motor</h5>
                  <p className="text-[11px] text-gray-600">3 PHASE, 220-240 V, 50Hz | Direct on line Starter</p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Motor Rating</label>
                    <div className="space-y-2">
                        <input 
                          type="number" 
                          value={subMotorRating}
                          onChange={(e) => setSubMotorRating(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={subMotorUnit}
                          onChange={(e) => setSubMotorUnit(e.target.value)}
                          className="w-full px-3 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={subMotorLenUnit}
                          onChange={(e) => setSubMotorLenUnit(e.target.value)}
                          className="w-full px-3 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>MTR</option>
                          <option>FT</option>
                        </select>
                    </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Voltage Drop</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subVoltDrop).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Current (Ω)</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subCurrent).toFixed(2)}</div>
                  </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Actual Gauge</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(subActualGauge).toFixed(2)}</div>
                </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Cable Size</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{subCableSize}</div>
          </div>
        </div>
                </div>
              </div>

              {/* ARMOURING COVERING CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-900">Armouring Covering Calculator</h5>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Armoured OD</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armOd).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Wire/Strip OD</label>
                      <input 
                        type="number" 
                        value={armWireStripOd}
                        onChange={(e) => setArmWireStripOd(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
          </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armWidth).toFixed(2)}</div>
        </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Lay</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armLay).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">COS(Φ)</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armCosPhi).toFixed(4)}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Inner OD</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armInnerOd).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Covering %</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(armCoveringPct).toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">N/O Wires</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{armNoWires}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ENERGY CONVERSION CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-900">Energy Conversion Calculator</h5>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          value={energyValL}
                          onChange={(e) => setEnergyValL(Number(e.target.value) || 0)}
                          className="flex-1 px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={energyUnitL}
                          onChange={(e) => setEnergyUnitL(e.target.value)}
                          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          step="0.0001" 
                          value={energyValR.toFixed(4)} 
                          className="flex-1 px-3 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-md" 
                          readOnly 
                        />
                        <select 
                          value={energyUnitR}
                          onChange={(e) => setEnergyUnitR(e.target.value)}
                          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-900">Cable Selection for Copper House Wires</h5>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Phase Φ</label>
                      <select 
                        value={chwPhase}
                        onChange={(e) => setChwPhase(Number(e.target.value) || 1)}
                        className="w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={1}>1</option>
                        <option value={3}>3</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Power Consumption</label>
                    <div className="space-y-2">
                        <input 
                          type="number" 
                          value={chwPowerVal}
                          onChange={(e) => setChwPowerVal(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={chwPowerUnit}
                          onChange={(e) => setChwPowerUnit(e.target.value)}
                          className="w-full px-3 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          value={chwLengthVal}
                          onChange={(e) => setChwLengthVal(Number(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        />
                        <select 
                          value={chwLengthUnit}
                          onChange={(e) => setChwLengthUnit(e.target.value)}
                          className="w-full px-3 py-2 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option>MTR</option>
                          <option>FT</option>
                        </select>
                    </div>
                  </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Current (Ω)</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(chwCurrent).toFixed(2)}</div>
                </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Actual Gauge</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{Number(chwActualGauge).toFixed(2)}</div>
              </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Wire Size</label>
                      <div className="px-3 py-2 text-sm font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-md">{chwWireSize}</div>
            </div>
          </div>
        </div>
            </div>

              {/* POWER CONVERSION CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b"><h5 className="text-sm font-semibold text-gray-900">POWER CONVERSION CALCULATOR</h5></div>
                <div className="p-4 grid grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={powerValL}
                      onChange={(e) => setPowerValL(Number(e.target.value) || 0)}
                      className="w-28 text-red-600 font-semibold border border-gray-300 rounded px-2 py-1" 
                    />
                    <select 
                      value={powerUnitL}
                      onChange={(e) => setPowerUnitL(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
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
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      step="0.0001" 
                      value={powerValR.toFixed(4)} 
                      className="w-28 text-blue-700 font-semibold border border-gray-300 rounded px-2 py-1" 
                      readOnly 
                    />
                    <select 
                      value={powerUnitR}
                      onChange={(e) => setPowerUnitR(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
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

              {/* Additional sections will follow as per screenshot; placeholders to confirm modal works */}
              <div className="text-xs text-gray-500 italic">Placeholders added. I’ll wire exact tables and formulas next.</div>
            </div>
          </div>
        </div>
      )}
      {/* Image Viewer Modal - images only */}
      {isFileViewerOpen && Array.isArray(selectedFile) && selectedFile.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Image/Video Preview</h2>
                  </div>
                </div>
                <button onClick={closeFileViewer} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Image/Video Preview</h3>
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow"
                      disabled={currentSlide === 0}
                      aria-label="Previous"
                    >
                      ‹
                    </button>
                    {(() => {
                      const currentFile = selectedFile[currentSlide];
                      const isVideo = currentFile.startsWith('data:video/') || /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(currentFile);
                      return isVideo ? (
                        <video 
                          key={`video-${currentSlide}`}
                          src={currentFile}
                          controls
                          preload="auto"
                          playsInline
                          autoPlay={false}
                          muted={false}
                          className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-sm"
                          style={{ maxWidth: '100%', maxHeight: '60vh' }}
                          onError={(e) => {
                            console.error('Video playback error:', e);
                            console.error('Video src type:', currentFile.substring(0, 50));
                          }}
                          onLoadedData={() => {
                            console.log('Video loaded successfully');
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img 
                          src={currentFile}
                      alt={`Preview ${currentSlide + 1}`}
                      className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-sm"
                    />
                      );
                    })()}
                    <button
                      onClick={() => setCurrentSlide(s => Math.min(selectedFile.length - 1, s + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow"
                      disabled={currentSlide >= selectedFile.length - 1}
                      aria-label="Next"
                    >
                      ›
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {selectedFile.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full ${idx === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* File Viewer Modal */}
      {false && isFileViewerOpen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Document Preview</h2>
                    <p className="text-sm text-gray-500">{selectedFile.name}</p>
                  </div>
                </div>
                <button onClick={closeFileViewer} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h3>
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="text-center">
                    <Document
                      file={selectedFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 border-l shadow-lg overflow-y-auto ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="p-6 pt-12">
          {/* Blank space placeholder */}
          <div className="mb-12"></div>

          {/* Business Cards & Brochure */}
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Business Card - Anocab */}
              <div className="flex-1">
                <div 
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                      : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100'
                  }`}
                  onClick={openBusinessCard}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-full">
                      <h3 className={`font-semibold text-xs ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Anocab Business Card</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Samriddhi Industries Business Card */}
              <div className="flex-1">
                <div 
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                      : 'border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100'
                  }`}
                  onClick={openSamriddhiBusinessCard}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-full">
                      <h3 className={`font-semibold text-xs ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Samriddhi Business Card</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Brochure */}
            <div className="w-full">
                <div 
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                      : 'border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100'
                  }`}
                  onClick={openBrochure}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm">
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                    <div className="w-full">
                      <h3 className={`font-semibold text-xs ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Brochure</h3>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Approvals */}
          <div className="mb-4">
            <div 
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                isDarkMode 
                  ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                  : 'border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100'
              }`}
              onClick={openApprovals}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Approvals</h3>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Product approvals and certifications</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>
          </div>

          {/* License */}
          <div className="mb-4">
            <div 
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                isDarkMode 
                  ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                  : 'border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100'
              }`}
              onClick={openLicense}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>License</h3>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Company licenses and certifications</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>
          </div>

          {/* GST Details */}
          <div className="mb-4">
            <div 
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
              isDarkMode 
                  ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                  : 'border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100'
              }`}
              onClick={() => setIsGstDetailsOpen(!isGstDetailsOpen)}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>GST Details</h3>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Tax registration information</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } ${isGstDetailsOpen ? 'rotate-90' : ''}`} />
              </div>
            </div>
            
            {isGstDetailsOpen && (
              <div className="mt-3 space-y-3">
                {/* ANODE ELECTRIC PVT LTD */}
                <div className={`p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`font-semibold text-xs mb-1 ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>ANODE ELECTRIC PVT LTD.</div>
                  <div className={`font-mono text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>23AANCA7455R1ZX</div>
                </div>
                
                {/* SAMRIDDHI CABLE INDUSTRIES PVT LTD */}
                <div className={`p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`font-semibold text-xs mb-1 ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>SAMRIDDHI CABLE INDUSTRIES PVT LTD.</div>
                  <div className={`font-mono text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>23ABPCS7684F1ZT</div>
                </div>
                
                {/* SAMRIDDHI INDUSTRIES */}
                <div className={`p-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`font-semibold text-xs mb-1 ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>SAMRIDDHI INDUSTRIES</div>
                  <div className={`font-mono text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>23ABWFS1117M1ZT</div>
                </div>
              </div>
            )}
          </div>

          {/* Company Emails */}
          <div className="mb-4">
            <div 
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                isDarkMode 
                  ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                  : 'border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100'
              }`}
              onClick={openCompanyEmails}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-sm">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Company Emails</h3>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>All company email addresses</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>
            
          </div>
          {/* Location Dropdown */}
          <div className="mb-4">
            <div 
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                isDarkMode 
                  ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                  : 'border-gray-200 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-slate-100 hover:to-gray-100'
              }`}
              onClick={() => setShowLocations(!showLocations)}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 shadow-sm">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Location</h3>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Company locations</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } ${showLocations ? 'rotate-90' : ''}`} />
              </div>
            </div>
            
            {showLocations && (
              <div className="mt-3 space-y-2">
                {/* IT Park, Jabalpur */}
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                    selectedLocation === "IT Park, Jabalpur" 
                      ? isDarkMode 
                        ? "bg-gray-600 border-gray-500 shadow-md" 
                        : "bg-slate-50 border-slate-200 shadow-md"
                      : isDarkMode 
                        ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                        : "bg-white border-gray-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedLocation("IT Park, Jabalpur")}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-slate-100'
                    }`}>
                      <MapPin className={`h-4 w-4 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>IT Park, Jabalpur</div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Plot No 10, IT Park, Bargi Hills, Jabalpur, M.P.</div>
                    </div>
                  </div>
                </div>
                
                {/* Dadda Nagar */}
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                    selectedLocation === "Dadda Nagar" 
                      ? isDarkMode 
                        ? "bg-gray-600 border-gray-500 shadow-md" 
                        : "bg-slate-50 border-slate-200 shadow-md"
                      : isDarkMode 
                        ? "bg-gray-700 border-gray-600 hover:bg-gray-600" 
                        : "bg-white border-gray-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedLocation("Dadda Nagar")}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-600' : 'bg-slate-100'
                    }`}>
                      <MapPin className={`h-4 w-4 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-semibold mb-1 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Dadda Nagar</div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Ward no. 73 in front of Dadda Nagar, Karmeta Road, Jabalpur, M.P.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Helping Calculators */}
          <div className="mb-4">
            <div 
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${
                isDarkMode 
                  ? 'border-gray-600 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500' 
                  : 'border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100'
              }`}
              onClick={openHelpingCalculators}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Helping Calculators</h3>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Advanced calculation tools</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } ${showHelpingCalculators ? 'rotate-90' : ''}`} />
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
                    className={`p-3 rounded-lg border transition-all duration-200 shadow-sm cursor-pointer hover:shadow-md ${
                      isDarkMode ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' : 'border-gray-200 bg-white hover:bg-teal-50'
                    }`}
                    onClick={() => {
                      if (calculator.name === 'TECHNICAL CALCULATIONS') {
                        setHelpingCalcType('technical');
                        setIsHelpingCalcOpen(true);
                      } else if (calculator.name === 'CONVERSIONAL CALCULATIONS') {
                        setHelpingCalcType('conversional');
                        setIsHelpingCalcOpen(true);
                      } else {
                        handleToolClick(calculator);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        isDarkMode ? 'bg-gray-600' : 'bg-teal-100'
                      }`}>
                        <calculator.icon className={`h-4 w-4 ${
                          isDarkMode ? 'text-teal-400' : 'text-teal-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{calculator.name}</span>
                        <p className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>{calculator.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {false && showHelpingCalculators && (<div />)}
          </div>

        </div>
      </div>
      {/* Product Detail Modal - Dynamic */}
      {isProductDetailOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-7xl max-h-[95vh] overflow-hidden bg-white rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Image className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{getProductData(selectedProduct).title}</h2>
                      <p className="text-gray-600">{getProductData(selectedProduct).description}</p>
                    </div>
                  </div>
                  <button onClick={closeProductDetail} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
            <div className="p-6 overflow-auto max-h-[80vh]">
              {/* Business Information Section for Business Cards */}
              {getProductData(selectedProduct).businessInfo && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5 text-blue-600" />
                    Business Information
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <p className="text-gray-600">Business information will be displayed here based on the selected card.</p>
                  </div>
                </div>
              )}

              {/* Technical Specifications Section - includes products with custom specs */}
              {(selectedProduct === "Aerial Bunch Cable" || selectedProduct === "All Aluminium Alloy Conductor" || selectedProduct === "PVC Insulated Submersible Cable" || selectedProduct === "Multi Core XLPE Insulated Aluminium Unarmoured Cable" || selectedProduct === "Multistrand Single Core Copper Cable" || selectedProduct === "Multi Core Copper Cable" || selectedProduct === "PVC Insulated Single Core Aluminium Cable" || selectedProduct === "PVC Insulated Multicore Aluminium Cable" || selectedProduct === "Submersible Winding Wire" || selectedProduct === "Twin Twisted Copper Wire" || selectedProduct === "Speaker Cable" || selectedProduct === "CCTV Cable" || selectedProduct === "LAN Cable" || selectedProduct === "Automobile Cable" || selectedProduct === "PV Solar Cable" || selectedProduct === "Co Axial Cable" || selectedProduct === "Uni-tube Unarmoured Optical Fibre Cable" || selectedProduct === "Armoured Unarmoured PVC Insulated Copper Control Cable" || selectedProduct === "Telecom Switch Board Cables" || selectedProduct === "Multi Core PVC Insulated Aluminium Unarmoured Cable" || selectedProduct === "Multi Core XLPE Insulated Aluminium Armoured Cable" || selectedProduct === "Multi Core PVC Insulated Aluminium Armoured Cable" || selectedProduct === "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable" || selectedProduct === "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable" || selectedProduct === "Paper Cover Aluminium Conductor") && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Technical Specifications
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-6 flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        {selectedProduct === "All Aluminium Alloy Conductor" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Application</h4>
                              <p className="text-sm text-gray-800">Over Head Power Transmission Purposes</p>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>100% Pure EC Grade Aluminium.</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                        ) : selectedProduct === "PVC Insulated Submersible Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Application</h4>
                              <p className="text-sm text-gray-800">Submersible pump connections and wet environments</p>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>High quality multilayer PVC having greater IR Value.</li>
                                <li>REACH and RoHS Compliant Cable.</li>
                                <li>Flame Retardant Cable with higher Oxygen Index.</li>
                                <li>Anti-Rodent, Anti-Termite.</li>
                                <li>100% Pure EC Grade Aluminium.</li>
                                <li>Super Annealed Conductor.</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                                  <p className="text-sm text-gray-800">Standard packing of 300/500 mtr coil; other lengths on request. Cables printed with ‘ANOCAB’ marking.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Multi Core XLPE Insulated Aluminium Unarmoured Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Premium Quality Compound having protection against UV, O₃, oil, grease and diverse weather conditions.</li>
                                <li>100% Pure EC Grade Aluminium.</li>
                                <li>Heavy duty cable suitable for outdoor installation.</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IS 7098 PT-1</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">EC Grade Aluminium Class 1 & 2 as per IS 8130</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">XLPE Insulation as per 7098 PT-1</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colour of Core</span>
                                  <p className="text-sm text-gray-800">Red & Black for 2 core cable; Red, Yellow, Blue for 3 core cable; Red, Yellow, Blue & Black for 4 core cable</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Sheath</span>
                                  <p className="text-sm text-gray-800">PVC Type ST-1 / PVC Type ST-2 as per IS 5831</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Colour of Sheath</span>
                                  <p className="text-sm text-gray-800">Black and other colours as per requirement</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                                  <p className="text-sm text-gray-800">Up to and including 1100 Volt</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                                  <p className="text-sm text-gray-800">Standard packing of 500 mtr coil; other lengths available on request. Cables are printed with marking of ‘ANOCAB’.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Multi Core Copper Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Suitable for low voltage grade applications</li>
                                <li>Transferring & connecting power for residential and commercial infrastructure</li>
                                <li>Useful for control of motors and other electric appliances</li>
                                <li>PVC insulated & sheathed multicore cables for general purpose; temperature range -15°C to 70°C</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IS 694:2010</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">Electrolytic grade annealed copper Class 5 as per IS 8130</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">PVC Type A, HR PVC Type C, as per IS 5831</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colour of Core</span>
                                  <p className="text-sm text-gray-800">Red & black for 2 core; Red, Yellow, Blue for 3 core; Red, Yellow, Blue & Black for 4 core</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Sheath</span>
                                  <p className="text-sm text-gray-800">PVC Type ST-1, PVC Type ST-2 as per IS 5831</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Colour of Sheath</span>
                                  <p className="text-sm text-gray-800">Black and other colours as per customer demand</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                                  <p className="text-sm text-gray-800">Up to and including 450/750V</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                                  <p className="text-sm text-gray-800">Standard packing of 100/300/500 mtr coil; other lengths on request. Cables printed with ‘ANOCAB’ marking.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Multistrand Single Core Copper Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
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
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                                  <p className="text-sm text-gray-800">The cables are printed with marking of ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">90 mtr. coil is packed in protective plastic bag; longer length available on customer demand</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "PVC Insulated Single Core Aluminium Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>High quality multilayer PVC having greater IR Value</li>
                                <li>REACH and RoHS Compliant Cable</li>
                                <li>Flame Retardant Cable with higher Oxygen Index</li>
                                <li>Anti-Rodent, Anti-Termite</li>
                                <li>100% Pure EC Grade Aluminium</li>
                                <li>Super Annealed Conductor</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IS 694:2010</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Grade</span>
                                  <p className="text-sm text-gray-800">Up to and including 450/750V</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">EC grade Annealed Aluminium Class I, II as per IS 8130:2013</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">PVC confirming to IS-5831 and formulated with FR properties and ultraviolet rays; IS 5831 Type A/C FR 70°C</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">Red, yellow, blue, black & other colours on customer demand</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">The cables are printed with marking of ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">90 mtr & 270 mtr coil packed in protective plastic bag</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "PVC Insulated Multicore Aluminium Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>High quality multilayer PVC having greater IR Value</li>
                                <li>REACH and RoHS Compliant Cable</li>
                                <li>Flame Retardant Cable with higher Oxygen Index</li>
                                <li>Anti-Rodent, Anti-Termite</li>
                                <li>100% Pure EC Grade Aluminium</li>
                                <li>Super Annealed Conductor</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IS 694:2010</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">EC Grade Aluminium Class 1 & 2 as per IS 8130</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">PVC Type A as per IS 5831</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colour of Core</span>
                                  <p className="text-sm text-gray-800">Red & black (2 core); Red, Yellow, Blue (3 core); Red, Yellow, Blue & Black (4 core)</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Sheath</span>
                                  <p className="text-sm text-gray-800">PVC Type ST-1, PVC Type ST-2 as per IS 5831</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Colour of Sheath</span>
                                  <p className="text-sm text-gray-800">Black and other colours as per requirement</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                                  <p className="text-sm text-gray-800">Up to and including 450/750V</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                                  <p className="text-sm text-gray-800">Standard packing of 500 mtr coil; other lengths available on request. Cables printed with ‘ANOCAB’ marking.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Submersible Winding Wire" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>100% Pure CC Grade Copper</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IS-8783 Part 4 Section 3 for Polyester & Polypropylene taped; IS-8783 Part 4 Section 1 for HR PVC</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">As per IS-8783 Part 1 Annealed Copper</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">Polypropylene and Polyester Tape; HR PVC as per IS 5831</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Resistivity</span>
                                  <p className="text-sm text-gray-800">Material Resistivity 0.01724 Ω·mm²/m at 20°C</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Test</span>
                                  <p className="text-sm text-gray-800">Tested at 3 kV</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Twin Twisted Copper Wire" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
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
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                                  <p className="text-sm text-gray-800">Electrolytic Grade Copper Class 2/5 as per IS 8130:2013</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">PVC confirming to IS-5831 and formulated with FR properties and heat resistance up to 85°C; IS 5831 Type A/C FR 70°C</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">Red, black & other colours on customer demand</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">Cables printed with ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">90 m coil packed in protective plastic bag; longer length on demand</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Speaker Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
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
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IS 694:2010</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Grade</span>
                                  <p className="text-sm text-gray-800">Up to and including 450/750V</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">Electrolytic Grade Copper class-5, as per IS 8130:2013</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">PVC confirming to IS-5831 with FR properties and heat resistance up to 85°C; IS 5831 Type A/C FR 70°C</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">Transparent colour with colored strip for core identification; other colours on demand</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">Cables printed with ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">90 m coil packed in protective plastic bag; longer lengths on demand</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "CCTV Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>High definition video signal transmission</li>
                                <li>Minimum distortion or attenuation</li>
                                <li>Suitable for outdoor application</li>
                                <li>Super Annealed Copper</li>
                                <li>Aluminium alloy braided</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Grade</span>
                                  <p className="text-sm text-gray-800">Up to and including 600/1000 V AC, 1800 V DC</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">Electrolytic Grade Annealed Copper class-1</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">Gas injected Polyethylene foam / solid LDPE</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Sheath</span>
                                  <p className="text-sm text-gray-800">PVC compound ST1</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">Gray & other colours on customer demand</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">The cables are printed with marking of ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">100 mtr. coil packed in protective plastic bag; longer length on customer demand</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "LAN Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Low attenuation and cross talk</li>
                                <li>Insulated with high quality Polyethylene</li>
                                <li>Flame Retardant Cable with higher Oxygen Index</li>
                                <li>Anti-Rodent, Anti-Termite</li>
                                <li>Super Annealed Conductor</li>
                                <li>Low structural return loss</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">ISO/IEC 11801, TIA/EIA-568-C.2 : UTP cable</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Voltage</span>
                                  <p className="text-sm text-gray-800">72 Volt</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">Annealed Solid Bare Copper</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">High Quality Polyethylene compound</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">White, Blue, Orange, Green, Brown</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">Cables printed with ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">100 mtr & 305 mtr coil packed in protective plastic bag</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Automobile Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Flame Retardant</li>
                                <li>Highly resistant against acid, petrol, diesel, grease</li>
                                <li>High temperature range -40°C to 105°C</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">DIN 72551 Pt-6 FLRY-B</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Test Voltage</span>
                                  <p className="text-sm text-gray-800">3000 Volts</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">Class-B according to DIN 13602</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">Plasticized PVC with properties according to DIN 72551 & ISO 6722, lead free</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "PV Solar Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>High grade crosslinked halogen free & flame retardant compound with protection against UV, O₃, oil, grease and weather</li>
                                <li>REACH and RoHS compliant cable</li>
                                <li>High temperature grade</li>
                                <li>Super annealed tinned copper</li>
                                <li>Super flexible conductor</li>
                                <li>Low smoke emission</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">TUV : EN50618</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Grade</span>
                                  <p className="text-sm text-gray-800">Up to and including 600/1000 V AC, 1800 V DC</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">Electrolytic grade annealed tinned copper class-5</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">Crosslinked halogen free & flame retardant compound</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Sheath</span>
                                  <p className="text-sm text-gray-800">XLPO compound ozone and UV resistant</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">Red, black & other colours on customer demand</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">Cables printed with ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">100 m coil packed in protective plastic bag; longer length on demand</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Co Axial Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Low loss video signal transmission</li>
                                <li>REACH and RoHS compliant cable</li>
                                <li>Suitable for outdoor application</li>
                                <li>Super annealed copper</li>
                                <li>Aluminium alloy braided</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IS 14459</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Grade</span>
                                  <p className="text-sm text-gray-800">Up to and including 600/1000 V AC, 1800 V DC</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">Electrolytic Grade Annealed Copper class-1</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">Gas injected Polyethylene foam / solid LDPE</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Sheath</span>
                                  <p className="text-sm text-gray-800">PVC compound ST1</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">Black & other colours on customer demand</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">Cables printed with ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">100 m coil packed in protective plastic bag; longer length on demand</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Uni-tube Unarmoured Optical Fibre Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Longitudinal water protection</li>
                                <li>UV Protected</li>
                                <li>High Speed Signal transmission</li>
                                <li>High Flexibility</li>
                                <li>Totally Dielectric</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IEC.60794 series, ANSI/ICEA S-87-640, ITU-T Rec. G 652 D</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Tensile Strength</span>
                                  <p className="text-sm text-gray-800">500 N</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Bending Radius</span>
                                  <p className="text-sm text-gray-800">20 D</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Crush Resistance (N/100mm)</span>
                                  <p className="text-sm text-gray-800">1000</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Impact Strength (N.m)</span>
                                  <p className="text-sm text-gray-800">50 N 0.5 m</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">Blue, Orange, Green, Brown, Grey, White, Red, Black, Yellow, Violet, Pink and Aqua</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">The cables are printed with marking of ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">2000 mtr coil packed in protective Plastic bag</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Armoured Unarmoured PVC Insulated Copper Control Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Premium quality compound with protection against UV, O₃, oil, grease and various weather conditions</li>
                                <li>101% Pure Copper</li>
                                <li>Flammability test as per IS 10810-53</li>
                                <li>Heavy duty cable suitable for outdoor installation</li>
                                <li>2 to 24 core, 1.5 & 2.5 sq mm control cable</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">IS 1554 PT-1</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">CC Grade Copper Class 1 & 2 as per IS 8130</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">PVC Type A, C as per IS 5831</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colour of Core</span>
                                  <p className="text-sm text-gray-800">Red & Black for 2 core; Red, Yellow, Blue for 3 core; Red, Yellow, Blue & Black for 4 core</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Sheath</span>
                                  <p className="text-sm text-gray-800">PVC Type ST-1, ST-2; PVC Type ST-2 as per IS 5831</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Colour of Sheath</span>
                                  <p className="text-sm text-gray-800">Black and other colours as per requirement</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Voltage Rating</span>
                                  <p className="text-sm text-gray-800">Up to and including 1100 Volt</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing & Marking</span>
                                  <p className="text-sm text-gray-800">Standard packing of 500 mtr coil; other lengths on request. Cables are printed with ‘ANOCAB’.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : selectedProduct === "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                                <li>100% Pure EC Grade Aluminium/Copper</li>
                                <li>Galvanized Iron Armoured Protected</li>
                                <li>Heavy duty Cable suitable for outdoor installation</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                        ) : selectedProduct === "Paper Cover Aluminium Conductor" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>100% Pure EC Grade Aluminium</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                        ) : selectedProduct === "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                                <li>100% Pure EC Grade Aluminium</li>
                                <li>Galvanized Iron Armoured Protected</li>
                                <li>Heavy duty Cable suitable for outdoor installation</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                        ) : selectedProduct === "Multi Core PVC Insulated Aluminium Armoured Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                                <li>100% Pure EC Grade Aluminium</li>
                                <li>Galvanized Iron Armoured Protected</li>
                                <li>Heavy duty Cable suitable for outdoor installation</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                        ) : selectedProduct === "Multi Core XLPE Insulated Aluminium Armoured Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                                <li>100% Pure EC Grade Aluminium</li>
                                <li>Galvanized Iron Armoured Protected</li>
                                <li>Heavy duty Cable suitable for outdoor installation</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                        ) : selectedProduct === "Multi Core PVC Insulated Aluminium Unarmoured Cable" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>Premium Quality Compound having Protection against UV, O3, Oil Grease and different weather conditions</li>
                                <li>100% Pure EC Grade Aluminium</li>
                                <li>Heavy duty Cable suitable for outdoor installation</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
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
                        ) : selectedProduct === "Telecom Switch Board Cables" ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-2">Features</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
                                <li>High quality multilayer PVC having greater IR Value</li>
                                <li>REACH and RoHS Compliant Cable</li>
                                <li>Flame Retardant Cable with higher Oxygen Index</li>
                                <li>Anti-Rodent, Anti-Termite</li>
                                <li>Super Annealed Conductor</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-base font-semibold text-gray-900 mb-3">Technical Data</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Reference</span>
                                  <p className="text-sm text-gray-800">DOT TEC Spec No: G/WIR-06/02</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Test Voltage</span>
                                  <p className="text-sm text-gray-800">2000 V spark Tester</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Conductor</span>
                                  <p className="text-sm text-gray-800">Annealed Tinned Copper Conductor</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Insulation</span>
                                  <p className="text-sm text-gray-800">Hard PVC confirming to IS-13176 (1991) type-2</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Colours</span>
                                  <p className="text-sm text-gray-800">White, Blue, Orange, Green, Brown & Grey colour as per DOT</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-800">Marking</span>
                                  <p className="text-sm text-gray-800">Cables printed with marking of ‘ANOCAB’</p>
                                </div>
                                <div className="space-y-1 md:col-span-2">
                                  <span className="text-sm font-semibold text-gray-800">Packing</span>
                                  <p className="text-sm text-gray-800">100 mtr. & 200 mtr. coil packed in protective Plastic bag</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <span className="text-sm font-semibold text-gray-800">REFERENCE</span>
                                <p className="text-sm text-gray-800">IS 14255:1995</p>
                              </div>
                              <div className="space-y-2">
                                <span className="text-sm font-semibold text-gray-800">RATED VOLTAGE</span>
                                <p className="text-sm text-gray-800">1100 volts</p>
                              </div>
                              <div className="space-y-2">
                                <span className="text-sm font-semibold text-gray-800">CONDUCTOR</span>
                                <p className="text-sm text-gray-800">Class-2 as per IS-8130</p>
                              </div>
                              <div className="space-y-2">
                                <span className="text-sm font-semibold text-gray-800">INSULATION</span>
                                <p className="text-sm text-gray-800">Cross link polythene insulated</p>
                              </div>
                              <div className="space-y-2">
                                <span className="text-sm font-semibold text-gray-800">MESSENGER</span>
                                <p className="text-sm text-gray-800">Aluminium alloy conductor as per IS-398 pt-4</p>
                              </div>
                              <div className="space-y-2">
                                <span className="text-sm font-semibold text-gray-800">TEMPERATURE RANGE</span>
                                <p className="text-sm text-gray-800">-30°C to 90°C</p>
                              </div>
                            </div>
                            <div className="space-y-2 mt-4">
                              <span className="text-sm font-semibold text-gray-800">FEATURES</span>
                              <div className="text-sm text-gray-800">
                                <ul className="list-disc list-inside space-y-1">
                                  <li>UV radiation protected</li>
                                  <li>Higher current carrying capacity</li>
                                  <li>High temperature range -30°C to 90°C</li>
                                </ul>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      {/* Vertical Buttons Section */}
                      <div className="flex flex-col gap-3 lg:min-w-[140px]">
                        <button 
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                          onClick={() => {
                            // Scroll to Approvals section
                            const approvalsSection = document.querySelector('[data-section="approvals"]');
                            if (approvalsSection) {
                              approvalsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                        >
                          Approvals
                        </button>
                        <button 
                          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                          onClick={() => {
                            // Scroll to License section or open license
                            const licenseSection = document.querySelector('[data-section="license"]');
                            if (licenseSection) {
                              licenseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                        >
                          License
                        </button>
                        <button 
                          className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                          onClick={() => {
                            // Scroll to GTP section
                            const gtpSection = document.querySelector('[data-section="gtp"]');
                            if (gtpSection) {
                              gtpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                        >
                          GTP
                        </button>
                        <button 
                          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                          onClick={() => {
                            // Scroll to Type Test section
                            const typeTestSection = document.querySelector('[data-section="type-test"]');
                            if (typeTestSection) {
                              typeTestSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                        >
                          Type Test
                        </button>
                        <button 
                          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                          onClick={() => {
                            // Scroll to Process Chart section
                            const processChartSection = document.querySelector('[data-section="process-chart"]');
                            if (processChartSection) {
                              processChartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                        >
                          Process Chart
                        </button>
                      </div>
                      <div className="lg:w-1/3 flex flex-col items-center">
                        <div className="w-full h-64 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                          <img 
                            src={selectedProduct === "All Aluminium Alloy Conductor" 
                                  ? "/images/products/all aluminium alloy conductor.jpeg" 
                                  : selectedProduct === "PVC Insulated Submersible Cable" 
                                  ? "/images/products/pvc insulated submersible cable.jpeg" 
                                  : selectedProduct === "Multi Core XLPE Insulated Aluminium Unarmoured Cable"
                                  ? "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg"
                                  : selectedProduct === "Multi Core XLPE Insulated Aluminium Armoured Cable"
                                  ? "/images/products/multi core xlpe insulated aluminium armoured cable.jpeg"
                                  : selectedProduct === "Multi Core PVC Insulated Aluminium Armoured Cable"
                                  ? "/images/products/multi core pvc isulated aluminium armoured cable.jpeg"
                                  : selectedProduct === "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable"
                                  ? "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg"
                                  : selectedProduct === "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable"
                                  ? "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg"
                                  : selectedProduct === "Paper Cover Aluminium Conductor"
                                  ? "/images/products/paper covered aluminium conductor.jpeg"
                                  : selectedProduct === "Multistrand Single Core Copper Cable"
                                  ? "/images/products/multistrand single core copper cable.jpeg"
                                  : selectedProduct === "Multi Core Copper Cable"
                                  ? "/images/products/multi core copper cable.jpeg"
                                  : selectedProduct === "PVC Insulated Single Core Aluminium Cable"
                                  ? "/images/products/pvc insulated single core aluminium cables.jpeg"
                                  : selectedProduct === "PVC Insulated Multicore Aluminium Cable"
                                  ? "/images/products/pvc insulated multicore aluminium cable.jpeg"
                                  : selectedProduct === "Submersible Winding Wire"
                                  ? "/images/products/submersible winding wire.jpeg"
                                  : selectedProduct === "Twin Twisted Copper Wire"
                                  ? "/images/products/twin twisted copper wire.jpeg"
                                  : selectedProduct === "Speaker Cable"
                                  ? "/images/products/speaker cable.jpeg"
                                  : selectedProduct === "CCTV Cable"
                                  ? "/images/products/cctv cable.jpeg"
                                  : selectedProduct === "LAN Cable"
                                  ? "/images/products/telecom switch board cables.jpeg"
                                  : selectedProduct === "Automobile Cable"
                                  ? "/images/products/automobile wire.jpeg"
                                  : selectedProduct === "PV Solar Cable"
                                  ? "/images/products/pv solar cable.jpeg"
                                  : selectedProduct === "Co Axial Cable"
                                  ? "/images/products/co axial cable.jpeg"
                                  : selectedProduct === "Uni-tube Unarmoured Optical Fibre Cable"
                                  ? "/images/products/unitube unarmoured optical fibre cable.jpeg"
                                  : selectedProduct === "Armoured Unarmoured PVC Insulated Copper Control Cable"
                                  ? "/images/products/armoured unarmoured pvc insulated copper control cable.jpeg"
                                  : selectedProduct === "Telecom Switch Board Cables"
                                  ? "/images/products/telecom switch board cables.jpeg"
                                  : selectedProduct === "Multi Core PVC Insulated Aluminium Unarmoured Cable"
                                  ? "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg"
                                  : "/images/products/aerial bunch cable.jpeg"}
                            alt={selectedProduct}
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full items-center justify-center text-gray-400">
                            <div className="text-center p-4">
                              <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">{selectedProduct}</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center">{selectedProduct} Sample</p>
                        
                        <div className="mt-6 w-full">
                          <h4 className="font-semibold text-gray-800 mb-3">Standards Compliance:</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {selectedProduct === "All Aluminium Alloy Conductor" ? (
                              <>
                                <li>• IS 398 (Part 4)</li>
                              </>
                            ) : selectedProduct === "PVC Insulated Submersible Cable" ? (
                              <>
                                <li>• IS 694 (PVC Insulated Cables)</li>
                              </>
                            ) : (
                              <>
                                <li>• IS 14255: 1995 (Reaffirmed 2020)</li>
                                <li>• IS 8130: 1984 (Reaffirmed 2021)</li>
                                <li>• IS 1554 (Part-1): 1988 (Reaffirmed 2021)</li>
                                <li>• IS 7098 (Part-1): 1988 (Reaffirmed 2021)</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Specification Section - Only for ACSR (AAAC moved below after calculators) */}
              {(selectedProduct === "Aluminium Conductor Galvanized Steel Reinforced") && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Technical Specification
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <span className="text-sm font-semibold text-gray-800">REFERENCE</span>
                            <p className="text-sm text-gray-800">IS-398 (Pt-2): 1996</p>
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
                        </div>
                        <div className="space-y-2 mt-4">
                          <span className="text-sm font-semibold text-gray-800">FEATURES</span>
                          <div className="text-sm text-gray-800">
                            <ul className="list-disc list-inside space-y-1">
                              {selectedProduct === "All Aluminium Alloy Conductor" ? (
                                <>
                                  <li>Alloyed aluminium for improved strength</li>
                                  <li>Lightweight, corrosion-resistant, long span capability</li>
                                </>
                              ) : (
                                <>
                                  <li>100% pure EC grade aluminium</li>
                                  <li>Heavy duty cable suitable for outdoor installation</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-full h-64 bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <img 
                            src={getProductData(selectedProduct)?.imageUrl || "/images/products/acsr-conductor.jpg"}
                            alt={getProductData(selectedProduct)?.title || selectedProduct}
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="hidden w-full h-full items-center justify-center text-gray-400">
                            <div className="text-center p-4">
                              <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">ACSR Conductor</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center">ACSR Conductor Sample</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Price List Section - Only for Product Cards */}
              {getProductData(selectedProduct).priceList && getProductData(selectedProduct).priceList.length > 0 && (
                <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Price List
                  </h3>
                  <button 
                  onClick={async () => {
                    const productData = getProductData(selectedProduct);
                    if (!productData.priceList || productData.priceList.length === 0) {
                      alert('No price list data available.');
                      return;
                    }

                    // APPROACH 1: Direct jsPDF table (most reliable)
                    try {
                      const JS_PDF = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (await import('jspdf')).jsPDF;
                      const doc = new JS_PDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

                      // Title
                      doc.setFont('helvetica', 'bold');
                      doc.setFontSize(16);
                      doc.text(`${productData.title} - Price List`, 105, 15, { align: 'center' });
                      doc.setFont('helvetica', 'normal');
                      doc.setFontSize(10);
                      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 21, { align: 'center' });

                      // Table headers
                      const startX = 10; // mm
                      let y = 30; // start Y
                      const colW = [90, 50, 50];
                      const headers = ['Size', 'Price per Meter', 'Stock Status'];
                      doc.setFillColor(243, 244, 246);
                      doc.setDrawColor(209, 213, 219);
                      doc.setTextColor(55, 65, 81);
                      doc.setFont('helvetica', 'bold');
                      doc.setFontSize(11);
                      // Header background
                      doc.rect(startX, y - 6, colW[0] + colW[1] + colW[2], 8, 'F');
                      // Header text
                      let xCursor = startX + 2;
                      doc.text(headers[0], xCursor, y);
                      xCursor += colW[0];
                      doc.text(headers[1], xCursor + 2, y);
                      xCursor += colW[1];
                      doc.text(headers[2], xCursor + 2, y);
                      // Header border
                      doc.rect(startX, y - 6, colW[0] + colW[1] + colW[2], 8);

                      y += 6; // move below header
                      doc.setFont('helvetica', 'normal');
                      doc.setFontSize(10);
                      doc.setTextColor(17, 24, 39);

                      const lineHeight = 7; // mm
                      for (const item of productData.priceList) {
                        // Page break check
                        if (y + lineHeight > 285) { // approx bottom margin
                          doc.addPage();
                          y = 20;
                        }
                        // Row borders
                        doc.setDrawColor(209, 213, 219);
                        doc.rect(startX, y - 5.5, colW[0] + colW[1] + colW[2], lineHeight);
                        // Text
                        let x = startX + 2;
                        const sizeTxt = String(item.size || '-');
                        const priceTxt = String(item.price || '-');
                        const stockTxt = String(item.stock || '-');
                        doc.text(sizeTxt, x, y);
                        x += colW[0];
                        doc.text(priceTxt, x + 2, y);
                        x += colW[1];
                        doc.text(stockTxt, x + 2, y);
                        y += lineHeight;
                      }

                      doc.save(`${productData.title.toLowerCase().replace(/\s+/g, '-')}-price-list.pdf`);
                      return; // done
                    } catch (jsPdfErr) {
                      // Fallback to html2pdf approach below
                      console.warn('jsPDF not available, falling back to html2pdf', jsPdfErr);
                    }

                    // APPROACH 2: html2pdf fallback (keep only required columns)
                    const rows = productData.priceList.map(item => {
                      const stockClass = item.stock === 'Available'
                        ? 'background-color: #d1fae5; color: #065f46;'
                        : 'background-color: #f3f4f6; color: #374151;';
                      return `
                        <tr>
                          <td style=\"padding: 10px; border: 1px solid #d1d5db; font-size: 12px;\">${item.size || '-'}<\/td>
                          <td style=\"padding: 10px; border: 1px solid #d1d5db; font-size: 12px;\">${item.price || '-'}<\/td>
                          <td style=\"padding: 10px; border: 1px solid #d1d5db; font-size: 12px;\"><span style=\"${stockClass} padding: 4px 8px; border-radius: 12px; font-size: 10px; display: inline-block;\">${item.stock || '-'}<\/span><\/td>
                        <\/tr>`;
                    }).join('');

                    // Off-screen container for html2pdf rendering
                    const tempDiv = document.createElement('div');
                    tempDiv.id = 'price-list-pdf-temp';
                    tempDiv.style.width = '794px';
                    tempDiv.style.padding = '20px';
                    tempDiv.style.fontFamily = 'Arial, sans-serif';
                    tempDiv.style.backgroundColor = '#ffffff';
                    // Keep it in the DOM flow and on-screen (some environments render blank if fully off-screen)
                    tempDiv.style.position = 'fixed';
                    tempDiv.style.top = '0px';
                    tempDiv.style.left = '0px';
                    tempDiv.style.zIndex = '-1';
                    tempDiv.style.opacity = '0.01';
                    tempDiv.style.visibility = 'visible';
                    tempDiv.innerHTML = `
                      <div style=\"text-align: center; margin-bottom: 16px;\">
                        <h1 style=\"color: #2563eb; margin: 0 0 8px 0; font-size: 22px;\">${productData.title} - Price List<\/h1>
                        <p style=\"color: #6b7280; font-size: 12px; margin: 0;\">Generated on ${new Date().toLocaleDateString()}<\/p>
                      <\/div>
                      <table style=\"width: 100%; border-collapse: collapse; margin-top: 12px;\">
                            <thead>
                              <tr>
                            <th style=\"padding: 10px; border: 1px solid #d1d5db; background-color: #f3f4f6; font-weight: 600; color: #374151; text-align: left; font-size: 12px;\">Size<\/th>
                            <th style=\"padding: 10px; border: 1px solid #d1d5db; background-color: #f3f4f6; font-weight: 600; color: #374151; text-align: left; font-size: 12px;\">Price per Meter<\/th>
                            <th style=\"padding: 10px; border: 1px solid #d1d5db; background-color: #f3f4f6; font-weight: 600; color: #374151; text-align: left; font-size: 12px;\">Stock Status<\/th>
                          <\/tr>
                        <\/thead>
                            <tbody>
                          ${rows}
                        <\/tbody>
                      <\/table>`;

                    document.body.appendChild(tempDiv);
                    void tempDiv.offsetHeight; // force layout

                    // Small delay to ensure layout is ready
                    await new Promise(res => setTimeout(res, 250));

                    const opt = {
                      margin: [10, 10, 10, 10],
                      filename: `${productData.title.toLowerCase().replace(/\s+/g, '-')}-price-list.pdf`,
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { 
                        scale: 2, 
                        useCORS: true, 
                        allowTaint: true, 
                        backgroundColor: '#ffffff', 
                        logging: false,
                        scrollX: 0,
                        scrollY: 0,
                        windowWidth: 794,
                        windowHeight: Math.max(1123, tempDiv.scrollHeight)
                      },
                      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };

                    try {
                      await html2pdf().set(opt).from(tempDiv).save();
                    } catch (err) {
                      console.error('Error generating PDF:', err);
                      alert('Error generating PDF. Please try again.');
                    } finally {
                      setTimeout(() => {
                        const el = document.getElementById('price-list-pdf-temp');
                        if (el && document.body.contains(el)) document.body.removeChild(el);
                      }, 300);
                    }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Price List
                  </button>
                </div>
                <div className="overflow-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-1.5 text-left font-medium text-gray-700 border border-gray-200 text-sm">Size</th>
                        <th className="px-4 py-1.5 text-left font-medium text-gray-700 border border-gray-200 text-sm">Price per Meter</th>
                        <th className="px-4 py-1.5 text-left font-medium text-gray-700 border border-gray-200 text-sm">Stock Status</th>
                        <th className="px-4 py-1.5 text-left font-medium text-gray-700 border border-gray-200 text-sm">img/vid</th>
                        <th className="px-4 py-1.5 text-left font-medium text-gray-700 border border-gray-200 text-sm">Add Images</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getProductData(selectedProduct).priceList.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-1.5 border border-gray-200 text-sm font-medium">{item.size}</td>
                          <td className="px-4 py-1.5 border border-gray-200 text-sm text-blue-600 font-semibold">{item.price}</td>
                          <td className="px-4 py-1.5 border border-gray-200 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              item.stock === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.stock}
                            </span>
                          </td>
                          <td className="px-4 py-1.5 border border-gray-200">
                            <div 
                              className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" 
                              title={((productImages[selectedProduct]?.[index]?.length > 0)) ? "Click to view images/videos" : "No image/video uploaded"}
                              onClick={() => handleImageClick(index)}
                            >
                              {(productImages[selectedProduct]?.[index]?.length > 0) ? (() => {
                                const lastFile = productImages[selectedProduct][index][productImages[selectedProduct][index].length - 1];
                                const isVideo = lastFile.startsWith('data:video/') || /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(lastFile);
                                return isVideo ? (
                                  <video 
                                    src={lastFile}
                                    className="w-full h-full object-cover rounded-md"
                                    muted
                                  />
                                ) : (
                                  <img 
                                    src={lastFile} 
                                  alt={`${item.size} image`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                                );
                              })() : (
                                <Image className="h-3.5 w-3.5 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-1.5 border border-gray-200">
                            <button 
                              className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors" 
                              title="Add image/video"
                              onClick={() => handleImageUpload(index)}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              )}

              {/* Technical Data (PVC Submersible) - appears right after Price List */}
              {selectedProduct === "PVC Insulated Submersible Cable" && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Technical Data
                  </h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Nominal Area (mm²)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">No./Dia of Strands (mm)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Insulation Thickness (mm)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Sheath Thickness (mm)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Width (mm)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Height (mm)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Max Conductor Resistance 20°C (Ω/km)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Current Capacity at 40°C (Amps)</th>
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
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.area}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 whitespace-nowrap">{row.strands}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.ins}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.sheath}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.width}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.height}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.res}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.amps}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Technical Data (AAAC) - appears right after Price List */}
              {selectedProduct === "All Aluminium Alloy Conductor" && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Technical Data
                  </h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">AAAC Code</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Nom Alloy Area (mm²)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Stranding And Wire Dia. (nos/mm)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">DC Resistance (N) Nom (Ω/km)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">DC Resistance (M) Max (Ω/km)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">AC Resistance 65°C (Ω/km)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">AC Resistance 75°C (Ω/km)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">AC Resistance 90°C (Ω/km)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Current 65°C (A/km)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Current 75°C (A/km)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Current 90°C (A/km)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
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
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 whitespace-nowrap">{row.code}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.area}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 whitespace-nowrap">{row.strand}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.dcn}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.dcm}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.ac65}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.ac75}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.ac90}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.i65}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.i75}</td>
                            <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{row.i90}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Hidden file input for image upload */}
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload-input"
              />

              {/* Image Upload Modal */}
              {isImageUploadOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4">Upload Image/Video</h3>
                    <p className="text-gray-600 mb-4">Select an image or video file to upload for this cable size.</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          document.getElementById('image-upload-input').click();
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Choose File
                      </button>
                      <button
                        onClick={() => {
                          setIsImageUploadOpen(false);
                          setSelectedImageIndex(null);
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                </div>
              </div>
              )}

              {/* Technical Tables Section for Aerial Bunch Cable and ACSR */}
              {(() => {
                const productData = getProductData(selectedProduct);
                const techTables = productData && productData.technicalTables;
                if (!techTables || !techTables.tables || techTables.tables.length === 0) return null;
                
                const tableKeyOrders = {
                  'PHASE Φ': ['sqmm','strands','conductorDia','insulationThickness','insulatedCoreDia','maxResistance'],
                  'MESSENGER Φ': ['sqmm','strands','conductorDia','insulationThickness','maxResistance','maxBreakingLoad'],
                  'ACSR CONDUCTOR SPECIFICATIONS': ['code', 'alArea', 'alStrand', 'steelStrand', 'dcResistance', 'acResistance65', 'acResistance75', 'current65', 'current75']
                };
                
                // Shortened headers for ACSR table
                const getShortHeader = (originalHeader, tableTitle) => {
                  if (tableTitle !== 'ACSR CONDUCTOR SPECIFICATIONS') return originalHeader;
                  
                  const headerMap = {
                    'ACSR Code': 'ACSR\nCode',
                    'Nom. Aluminium Area (mm²)': 'Nom. Al\nArea\n(mm²)',
                    'Stranding and Wire Diameter - Aluminium (nos/mm)': 'Stranding & Wire\nDia - Al\n(nos/mm)',
                    'Stranding and Wire Diameter - Steel (nos/mm)': 'Stranding & Wire\nDia - Steel\n(nos/mm)',
                    'DC Resistance at 20°C (Ω/km)': 'DC R\n@20°C\n(Ω/km)',
                    'AC Resistance at 65°C (Ω/km)': 'AC R\n@65°C\n(Ω/km)',
                    'AC Resistance at 75°C (Ω/km)': 'AC R\n@75°C\n(Ω/km)',
                    'Current Capacity at 65°C (Amps)': 'Current\n@65°C\n(Amps)',
                    'Current Capacity at 75°C (Amps)': 'Current\n@75°C\n(Amps)'
                  };
                  
                  return headerMap[originalHeader] || originalHeader;
                };
                
                const isAcsrTable = techTables.tables.some(t => t.title === 'ACSR CONDUCTOR SPECIFICATIONS');
                
                return (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      Technical Data
                    </h3>
                    <div className="space-y-4">
                      {techTables.tables.map((tbl, idx) => {
                        const isAcsr = tbl.title === 'ACSR CONDUCTOR SPECIFICATIONS';
                        const isPhaseOrMessenger = tbl.title === 'PHASE Φ' || tbl.title === 'MESSENGER Φ';
                        return (
                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-800">{tbl.title}</div>
                            <div className={isAcsr ? 'overflow-x-auto' : ''}>
                              <table className={`${isPhaseOrMessenger ? 'w-full table-fixed' : 'min-w-full'} bg-white`}>
                              <thead>
                                <tr>
                                  {tbl.columns.map((col, cIdx) => (
                                      <th key={cIdx} className={`${isPhaseOrMessenger ? 'px-1.5 py-2 text-center' : 'px-3 py-2 text-left'} text-xs font-semibold text-gray-700 border border-gray-200 ${isAcsr ? 'leading-tight text-center' : 'whitespace-nowrap'}`} style={isAcsr ? { whiteSpace: 'normal' } : {}}>
                                        {isAcsr ? getShortHeader(col, tbl.title).split('\n').map((line, i) => (
                                          <div key={i}>{line}</div>
                                        )) : col}
                                      </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {tbl.rows.map((row, rIdx) => {
                                  const order = tableKeyOrders[tbl.title] || Object.keys(row);
                                  return (
                                    <tr key={rIdx} className="hover:bg-gray-50">
                                      {order.map((key, kIdx) => (
                                          <td key={kIdx} className={`${isPhaseOrMessenger ? 'px-1.5 py-2 text-center' : 'px-3 py-2'} text-sm text-gray-800 border border-gray-200 ${isAcsr ? 'text-center' : ''} whitespace-nowrap`}>{row[key]}</td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                      {techTables.note && (
                      <div className="text-xs text-gray-600 mt-3">NOTE: {techTables.note}</div>
                      )}
                  </div>
                );
              })()}
              {/* Costing Calculator Section - For Aerial Bunch Cable, ACSR, AAAC and PVC Submersible */}
              {selectedProduct === "Aerial Bunch Cable" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Costing Calculator
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">DISC.</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">CORE Φ</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">N/O STRAND</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">STAND SIZE</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">CALCUS</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">GAUGE</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">KG/MTR</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* PHASE Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">PHASE</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" value={abPhaseInputs.cores}
                                onChange={(e) => setAbPhaseInputs(v => ({ ...v, cores: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abPhaseInputs.cores}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" value={abPhaseInputs.strands}
                                onChange={(e) => setAbPhaseInputs(v => ({ ...v, strands: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abPhaseInputs.strands}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" step="0.01" value={abPhaseInputs.strandSize}
                                onChange={(e) => setAbPhaseInputs(v => ({ ...v, strandSize: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abPhaseInputs.strandSize.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{abPhaseCalcus.toFixed(3)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abPhaseGauge)} SQMM`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abPhaseKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow1)}</td>
                        </tr>
                        {/* PH INN INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">PH INN INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" value={abPhInnIns.thickness}
                              onChange={(e) => setAbPhInnIns({ thickness: Number(e.target.value) })}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{abPhInnCalcus.toFixed(3)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`OD ${abPhInnGauge.toFixed(2)}`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abPhInnKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow2)}</td>
                        </tr>
                        {/* PH OUT INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">PH OUT INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" value={abPhOutIns.thickness}
                              onChange={(e) => setAbPhOutIns({ thickness: Number(e.target.value) })}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{abPhInnGauge.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`OD ${abPhOutGauge.toFixed(2)}`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abPhOutKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow3)}</td>
                        </tr>
                        {/* STREET LIGHT Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">STREET LIGHT</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" value={abStreetInputs.cores}
                                onChange={(e) => setAbStreetInputs(v => ({ ...v, cores: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abStreetInputs.cores}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" value={abStreetInputs.strands}
                                onChange={(e) => setAbStreetInputs(v => ({ ...v, strands: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abStreetInputs.strands}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" step="0.01" value={abStreetInputs.strandSize}
                                onChange={(e) => setAbStreetInputs(v => ({ ...v, strandSize: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abStreetInputs.strandSize.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{abStreetCalcus.toFixed(3)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abStreetGauge)} SQMM`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abStreetKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow4)}</td>
                        </tr>
                        {/* STL INN INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">STL INN INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" value={stlInnIns.thickness}
                              onChange={(e) => setStlInnIns({ thickness: Number(e.target.value) })}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{abStlInnCalcus.toFixed(3)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`OD ${stlInnGauge.toFixed(2)}`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abStlInnKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow5)}</td>
                        </tr>
                        {/* STL OUT INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">STL OUT INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" value={stlOutIns.thickness}
                              onChange={(e) => setStlOutIns({ thickness: Number(e.target.value) })}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{stlInnGauge.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`OD ${stlOutGauge.toFixed(2)}`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abStlOutKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow6)}</td>
                        </tr>
                        {/* MESSENGER Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">MESSENGER</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" value={abMessengerInputs.cores}
                                onChange={(e) => setAbMessengerInputs(v => ({ ...v, cores: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abMessengerInputs.cores}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" value={abMessengerInputs.strands}
                                onChange={(e) => setAbMessengerInputs(v => ({ ...v, strands: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abMessengerInputs.strands}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center gap-1">
                              <input type="number" step="0.01" value={abMessengerInputs.strandSize}
                                onChange={(e) => setAbMessengerInputs(v => ({ ...v, strandSize: Number(e.target.value) }))}
                                className="flex-1 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              {reverseMode && targetSalePrice && targetProfitPercent && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                  {abMessengerInputs.strandSize.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{abMessengerCalcus.toFixed(3)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abMessengerGauge)} SQMM`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abMessengerKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow7)}</td>
                        </tr>
                        {/* MSN INN INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">MSN INN INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" value={abMsnInn.thickness}
                              onChange={(e) => setAbMsnInn({ thickness: Number(e.target.value) })}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{abMsnInnCalcus.toFixed(3)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`OD ${abMsnInnGauge.toFixed(2)}`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abMsnInnKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow8)}</td>
                        </tr>
                        {/* MSN OUT INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">MSN OUT INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" value={abMsnOut.thickness}
                              onChange={(e) => setAbMsnOut({ thickness: Number(e.target.value) })}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{abMsnInnGauge.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`OD ${abMsnOutGauge.toFixed(2)}`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{`${Math.round(abMsnOutKgPerM)}/KG`}</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">{Math.round(totalRow9)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Bottom Summary Tables */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50">
                    {/* Material Inputs */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Material Inputs</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">ALUMINIUM:</span>
                          <div className="flex items-center gap-1">
                            <input type="number" step="0.01" value={aluminiumRate} onChange={(e)=>setAluminiumRate(Number(e.target.value))} className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                            {reverseMode && targetSalePrice && targetProfitPercent && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                {effectiveAluminiumRate.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">ALLOY:</span>
                          <div className="flex items-center gap-1">
                            <input type="number" step="0.01" value={alloyRate} onChange={(e)=>setAlloyRate(Number(e.target.value))} className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                            {reverseMode && targetSalePrice && targetProfitPercent && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                {effectiveAlloyRate.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">INNER INSU:</span>
                          <div className="flex items-center gap-1">
                            <input type="number" step="0.01" value={innerInsuRate} onChange={(e)=>setInnerInsuRate(Number(e.target.value))} className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                            {reverseMode && targetSalePrice && targetProfitPercent && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                {effectiveInnerInsuRate.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">OUTER INSU:</span>
                          <div className="flex items-center gap-1">
                            <input type="number" step="0.01" value={outerInsuRate} onChange={(e)=>setOuterInsuRate(Number(e.target.value))} className="w-20 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                            {reverseMode && targetSalePrice && targetProfitPercent && (
                              <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded border border-blue-300 font-semibold">
                                {effectiveOuterInsuRate.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cable Weights */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Cable Weights</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">CABLE WT:</span>
                          <span className="text-xs text-gray-800 font-semibold">{`${cableWt} KG`}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">ALUMINUM WT:</span>
                          <span className="text-xs text-gray-800 font-semibold">{`${aluminiumWt} KG`}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">ALLOY WT:</span>
                          <span className="text-xs text-gray-800 font-semibold">{`${alloyWt} KG`}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">INN XLPE WT:</span>
                          <span className="text-xs text-gray-800 font-semibold">{`${innerXlpeWt} KG`}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">OUT XLPE WT:</span>
                          <span className="text-xs text-gray-800 font-semibold">{`${outerXlpeWt} KG`}</span>
                        </div>
                      </div>
                    </div>
                    {/* Pricing and Drum Details */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Pricing & Details</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <select 
                              value={drumType}
                              onChange={(e)=>setDrumType(e.target.value)}
                              className="text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent cursor-pointer"
                            >
                              <option value="COIL">COIL</option>
                              <option value="DRUM 3.5 FT">DRUM 3.5 FT</option>
                              <option value="DRUM 4.5 FT">DRUM 4.5 FT</option>
                              <option value="DRUM 2X">DRUM 2X</option>
                              <option value="DRUM">DRUM</option>
                            </select>
                          </div>
                          <span className="text-xs text-gray-800 font-semibold">{Math.round(drumCost)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">FREIGHT:</span>
                          <input type="number" step="0.01" defaultValue="0" className="w-20 text-right text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">LENGTH:</span>
                            <div className="flex items-center justify-end w-28">
                              <input type="number" value={lengthMeters} onChange={(e)=>setLengthMeters(Number(e.target.value))} className="w-16 text-right text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent" />
                            <span className="text-xs text-red-600 font-semibold ml-1">MTR</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">SALE PRICE:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600 font-semibold">{`₹ ${salePrice.toFixed(2)}`}</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={targetSalePrice || ''} 
                              onChange={(e)=>setTargetSalePrice(Number(e.target.value))} 
                              onFocus={() => setReverseMode(true)}
                              className="w-20 text-xs text-red-600 font-semibold border border-gray-300 rounded px-1 focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                              placeholder="Target ₹"
                              title="Enter target sale price for reverse calculation"
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">PROFIT:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-green-600 font-semibold">{`${profitPercent.toFixed(0)} %`}</span>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={targetProfitPercent || ''} 
                              onChange={(e)=>setTargetProfitPercent(Number(e.target.value))} 
                              onFocus={() => setReverseMode(true)}
                              className="w-20 text-xs text-red-600 font-semibold border border-gray-300 rounded px-1 focus:ring-1 focus:ring-blue-500 focus:outline-none" 
                              placeholder="Target %"
                              title="Enter target profit % for reverse calculation"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Reduction Gauge Calculator Section - For Aerial Bunch Cable, ACSR and AAAC */}
              {selectedProduct === "Aerial Bunch Cable" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Reduction Gauge Calculator
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">AREA</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">AREA</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">REDUCTION %</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">STRAND</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">WIRE</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">INSULATION</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">OUTER DIA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* PHASE Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">PHASE</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input
                              type="text"
                              value={rgPhaseArea}
                              onChange={(e)=>setRgPhaseArea(e.target.value)}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none"
                            />
                          </td>
                          <td rowSpan={3} className="px-3 py-2 align-middle text-sm border border-gray-200">
                            <input
                              type="number"
                              value={rgReduction}
                              onChange={(e) => setRgReduction(Number(e.target.value))}
                              className="w-20 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none"
                            />
                          </td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgPhaseStrand}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgPhaseWire > 0 ? `${rgPhaseWire.toFixed(2)} MM` : '-'}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgPhaseInsulation > 0 ? `${rgPhaseInsulation.toFixed(2)} MM` : '-'}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgPhaseOuterDia > 0 ? `${rgPhaseOuterDia.toFixed(2)} MM` : '-'}</td>
                        </tr>
                        {/* STREET LIGHT Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">STREET LIGHT</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input
                              type="text"
                              value={rgStreetArea}
                              onChange={(e)=>setRgStreetArea(e.target.value)}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none"
                            />
                          </td>
                          
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgStreetStrand}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgStreetWire > 0 ? `${rgStreetWire.toFixed(2)} MM` : '-'}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgStreetInsulation > 0 ? `${rgStreetInsulation.toFixed(2)} MM` : '-'}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgStreetOuterDia > 0 ? `${rgStreetOuterDia.toFixed(2)} MM` : '-'}</td>
                        </tr>
                        {/* MESSENGER Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">MESSENGER</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input
                              type="text"
                              value={rgMessengerArea}
                              onChange={(e)=>setRgMessengerArea(e.target.value)}
                              className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none"
                            />
                          </td>
                          
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgMessengerStrand}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgMessengerWire > 0 ? `${rgMessengerWire.toFixed(2)} MM` : '-'}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgMessengerInsulation > 0 ? `${rgMessengerInsulation.toFixed(2)} MM` : '-'}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{rgMessengerOuterDia > 0 ? `${rgMessengerOuterDia.toFixed(2)} MM` : '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600">
                    NOTE: UP TO & INCLUDED 150 SQMM.
                  </div>
                </div>
              </div>
              )}
              {/* Wire Selection Calculator Section - For Aerial Bunch Cable, ACSR and AAAC */}
              {selectedProduct === "Aerial Bunch Cable" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Wire Selection Calculator
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-black">
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white border border-gray-200">PHASE Φ</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white border border-gray-200">POWER CONSUMPTION</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white border border-gray-200">LENGTH OF CABLE</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white border border-gray-200">CURRENT (Ω)</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white border border-gray-200">ACTUAL GAUGE</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold text-white border border-gray-200">WIRE SIZE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 border border-gray-200">
                            <select
                              value={wsPhase}
                              onChange={(e)=>setWsPhase(Number(e.target.value))}
                              className="text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none bg-transparent"
                            >
                              <option value={1}>1</option>
                              <option value={3}>3</option>
                            </select>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center">
                              <input type="number" step="0.01" value={wsPower} onChange={(e)=>setWsPower(Number(e.target.value))} className="w-20 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              <select value={wsPowerUnit} onChange={(e)=>setWsPowerUnit(e.target.value)} className="ml-2 text-xs text-red-600 border-0 focus:ring-0 focus:outline-none bg-transparent font-semibold">
                                <option value="HP">HP</option>
                                <option value="KW">KW</option>
                                <option value="WATT">WATT</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center">
                              <input type="number" value={wsLength} onChange={(e)=>setWsLength(Number(e.target.value))} className="w-20 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              <select value={wsLengthUnit} onChange={(e)=>setWsLengthUnit(e.target.value)} className="ml-2 text-xs text-red-600 border-0 focus:ring-0 focus:outline-none bg-transparent font-semibold">
                                <option value="MTR">MTR</option>
                                <option value="FT">FT</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{wsCurrent.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{wsActualGauge.toFixed(2)}</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">{wsWireSize}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              )}
              {/* Identification Section - Only for Aerial Bunch Cable */}
              {selectedProduct === "Aerial Bunch Cable" && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  Identification
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">CORE IDENTIFICATION:</h4>
                      <p className="text-gray-700 leading-relaxed">
                        The phase conductors shall be provided with one, two or three 'ridges' and Outer neutral insulated conductors, 
                        if provided, shall have four 'ridges' as shown in Fig. I for quick identification. The street lighting conductor 
                        and messenger conductor (if insulated) shall not have any identification mark.
                      </p>
                    </div>
                    
                    <div className="mt-6 max-w-2xl mx-auto">
                      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
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
                            <p>Core identification image</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
                      <h6 className="font-semibold text-blue-800 mb-2">Key Points:</h6>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Phase conductors: 1, 2, or 3 ridges for identification</li>
                        <li>• Neutral conductors: 4 ridges for identification</li>
                        <li>• Street lighting conductor: No identification marks</li>
                        <li>• Messenger conductor: No identification marks (if insulated)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Technical Data Section - Only for Product Cards (exclude AAAC and PVC Submersible to avoid duplication) */}
              {selectedProduct !== "All Aluminium Alloy Conductor" && selectedProduct !== "PVC Insulated Submersible Cable" && selectedProduct !== "Multi Core XLPE Insulated Aluminium Unarmoured Cable" && selectedProduct !== "Multistrand Single Core Copper Cable" && selectedProduct !== "Multi Core Copper Cable" && selectedProduct !== "PVC Insulated Single Core Aluminium Cable" && selectedProduct !== "PVC Insulated Multicore Aluminium Cable" && selectedProduct !== "Submersible Winding Wire" && selectedProduct !== "Twin Twisted Copper Wire" && selectedProduct !== "Speaker Cable" && selectedProduct !== "CCTV Cable" && selectedProduct !== "LAN Cable" && selectedProduct !== "Automobile Cable" && selectedProduct !== "PV Solar Cable" && selectedProduct !== "Co Axial Cable" && selectedProduct !== "Uni-tube Unarmoured Optical Fibre Cable" && selectedProduct !== "Armoured Unarmoured PVC Insulated Copper Control Cable" && selectedProduct !== "Telecom Switch Board Cables" && selectedProduct !== "Multi Core PVC Insulated Aluminium Unarmoured Cable" && selectedProduct !== "Multi Core XLPE Insulated Aluminium Armoured Cable" && selectedProduct !== "Multi Core PVC Insulated Aluminium Armoured Cable" && selectedProduct !== "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable" && selectedProduct !== "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable" && selectedProduct !== "Paper Cover Aluminium Conductor" && getProductData(selectedProduct).technicalData && Object.keys(getProductData(selectedProduct).technicalData).length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-600" />
                  Technical Data
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Voltage Rating</span>
                        <p className="text-sm font-semibold">{getProductData(selectedProduct).technicalData.voltage || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Conductor</span>
                        <p className="text-sm font-semibold">{getProductData(selectedProduct).technicalData.conductor || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Insulation</span>
                        <p className="text-sm font-semibold">{getProductData(selectedProduct).technicalData.insulation || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Sheath</span>
                        <p className="text-sm font-semibold">{getProductData(selectedProduct).technicalData.sheath || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Temperature Range</span>
                        <p className="text-sm font-semibold">{getProductData(selectedProduct).technicalData.temperature || 'N/A'}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Bending Radius</span>
                        <p className="text-sm font-semibold">{getProductData(selectedProduct).technicalData.bendingRadius || 'N/A'}</p>
                      </div>
                      {getProductData(selectedProduct).technicalData.armour && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">Armour</span>
                          <p className="text-sm font-semibold">{getProductData(selectedProduct).technicalData.armour}</p>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Standards</span>
                      <p className="text-sm font-semibold">{getProductData(selectedProduct).technicalData.standards || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                      {(() => {
                        const productData = getProductData(selectedProduct);
                        const productImage = productData?.imageUrl || null;
                        
                        if (productImage) {
                          return (
                            <img 
                              src={productImage} 
                              alt={selectedProduct}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          );
                        }
                        
                        return (
                          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <Image className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500">Product Image</p>
                            </div>
                          </div>
                        );
                      })()}
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                        <div className="text-center">
                          <Image className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Product Image</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}

              
              {/* Approvals, Licenses, GTP, Type Test, Others - Only for Product Cards */}
              {getProductData(selectedProduct).priceList && getProductData(selectedProduct).priceList.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Approvals */}
                <div className="p-4 border border-gray-200 rounded-lg" data-section="approvals">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Approvals</h4>
                  </div>
                  <div className="space-y-2">
                    {(() => {
                      // Map PDFs to products
                      const pdfMappings = {
                        "Aerial Bunch Cable": "aerial bunch cable, bis liscence .pdf",
                        "All Aluminium Alloy Conductor": "all aluminium alloy conductor,bis liscence.pdf",
                        "Aluminium Conductor Galvanized Steel Reinforced": "aluminium conductor galvanised steel reinforced, bis liscence.pdf",
                        "Multi Core XLPE Insulated Aluminium Unarmoured Cable": "multicore xlpe insulated aluminium unrmoured cable,bis liscence.pdf",
                        "PVC Insulated Submersible Cable": "pvc insulated submersible cable, bis liscence .pdf",
                        "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable": "single core xlpe insulated aluminium:copper armoured:unarmoured cable bis liscence.pdf"
                      };
                      
                      // List of products that actually have licenses uploaded and available
                      // Buttons will be disabled for products not in this list
                      const availableCertificates = [
                        "Aerial Bunch Cable",
                        "All Aluminium Alloy Conductor",
                        "Aluminium Conductor Galvanized Steel Reinforced",
                        "Multi Core XLPE Insulated Aluminium Unarmoured Cable",
                        "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable"
                        // "PVC Insulated Submersible Cable" - license not uploaded yet, buttons will be disabled
                      ];
                      
                      const productName = selectedProduct; // Use the original product name from tools array
                      const relevantPdfs = [];
                      
                      // Show BIS license for all products in pdfMappings, but buttons will be disabled if not in availableCertificates
                      if (pdfMappings[productName]) {
                        relevantPdfs.push({
                          type: `BIS License - ${productName}`,
                          status: "Valid",
                          expiry: "2025-12-31",
                          file: pdfMappings[productName],
                          isAvailable: availableCertificates.includes(productName)
                        });
                      }
                      
                      // Add general certifications (always available)
                      relevantPdfs.push(
                        { type: "ISO 9001:2015", status: "Valid", expiry: "2024-06-30", file: "ISO_9001_2015_Certificate.pdf", isAvailable: false },
                        { type: "CE Marking", status: "Valid", expiry: "2025-03-15", file: "CE_Marking_Certificate.pdf", isAvailable: false }
                      );
                      
                      return relevantPdfs.map((approval, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{approval.type}</div>
                          <div className="flex gap-2">
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // Check if certificate is available (not disabled)
                                const isCertificateAvailable = approval.isAvailable || false;
                                
                                if (!isCertificateAvailable) {
                                  return; // Button is disabled, do nothing
                                }
                                
                                // Check if PDF exists for this product
                                if (pdfMappings[productName] && approval.file === pdfMappings[productName]) {
                                  const pdfUrl = `${window.location.origin}/pdf/${approval.file}`;
                                  
                                  // Verify PDF exists before downloading
                                  try {
                                    const response = await fetch(pdfUrl, { method: 'HEAD' });
                                    if (response.ok) {
                                      console.log('Downloading PDF:', pdfUrl);
                                  const link = document.createElement('a');
                                  link.href = pdfUrl;
                                  link.download = approval.file;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                    } else {
                                      alert('Certificate not available for download. The file does not exist.');
                                    }
                                  } catch (error) {
                                    console.error('Error checking PDF:', error);
                                    alert('Certificate not available for download. The file does not exist.');
                                  }
                                } else if (approval.type.includes('ISO') || approval.type.includes('CE')) {
                                  // For general certifications, show placeholder message
                                  alert('Certificate not available for download');
                                }
                              }}
                              disabled={approval.isAvailable === false}
                              className={`${approval.isAvailable ? 'text-green-600 hover:text-green-800 cursor-pointer' : 'text-gray-400 cursor-not-allowed opacity-50'} transition-colors`}
                              title={approval.isAvailable ? "Download PDF" : "PDF not available"}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                // Check if certificate is available (not disabled)
                                const isCertificateAvailable = approval.isAvailable || false;
                                
                                if (!isCertificateAvailable) {
                                  return; // Button is disabled, do nothing
                                }
                                
                                // Check if PDF exists for this product
                                if (pdfMappings[productName] && approval.file === pdfMappings[productName]) {
                                  const pdfUrl = `${window.location.origin}/pdf/${approval.file}`;
                                  
                                  // Verify PDF exists before opening
                                  try {
                                    const response = await fetch(pdfUrl, { method: 'HEAD' });
                                    if (response.ok) {
                                      console.log('Opening PDF:', pdfUrl);
                                  const newWindow = window.open(pdfUrl, '_blank');
                                  if (!newWindow) {
                                    alert('Please allow pop-ups for this site to view the PDF');
                                      }
                                    } else {
                                      alert('Certificate not available for viewing. The file does not exist.');
                                    }
                                  } catch (error) {
                                    console.error('Error checking PDF:', error);
                                    alert('Certificate not available for viewing. The file does not exist.');
                                  }
                                } else if (approval.type.includes('ISO') || approval.type.includes('CE')) {
                                  // For general certifications, show placeholder message
                                  alert('Certificate not available for viewing');
                                }
                              }}
                              disabled={approval.isAvailable === false}
                              className={`${approval.isAvailable ? 'text-blue-600 hover:text-blue-800 cursor-pointer' : 'text-gray-400 cursor-not-allowed opacity-50'} transition-colors`}
                              title={approval.isAvailable ? "View Document" : "PDF not available"}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            approval.status === "Valid" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {approval.status}
                          </span>
                          <span className="text-xs text-gray-500">{approval.expiry}</span>
                        </div>
                      </div>
                    ));
                    })()}
                  </div>
                </div>

                {/* Licenses */}
                <div className="p-4 border border-gray-200 rounded-lg" data-section="license">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Licenses</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { type: "Manufacturing License", number: "ML/2023/001", status: "Active", file: "Manufacturing_License_2023.pdf" },
                      { type: "Trade License", number: "TL/2023/045", status: "Active", file: "Trade_License_2023.pdf" }
                    ].map((license, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{license.type}</div>
                          <div className="flex gap-2">
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Download className="h-4 w-4" />
                            </span>
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Eye className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-1">{license.number}</div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          license.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {license.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* GTP */}
                <div className="p-4 border border-gray-200 rounded-lg" data-section="gtp">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">GTP</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { process: "Raw Material Testing", status: "Completed", date: "2024-01-15", file: "Raw_Material_Testing_Report.pdf" },
                      { process: "Conductor Testing", status: "Completed", date: "2024-01-16", file: "Conductor_Testing_Report.pdf" },
                      { process: "Insulation Testing", status: "Completed", date: "2024-01-17", file: "Insulation_Testing_Report.pdf" },
                      { process: "Final Inspection", status: "Completed", date: "2024-01-18", file: "Final_Inspection_Report.pdf" }
                    ].map((process, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{process.process}</div>
                          <div className="flex gap-2">
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Download className="h-4 w-4" />
                            </span>
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Eye className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            process.status === "Completed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {process.status}
                          </span>
                          <span className="text-xs text-gray-500">{process.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Type Test */}
                <div className="p-4 border border-gray-200 rounded-lg" data-section="type-test">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Type Test</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { test: "Electrical Properties", result: "Pass", certificate: "ET/2024/001", file: "Electrical_Properties_Test_Report.pdf" },
                      { test: "Mechanical Properties", result: "Pass", certificate: "MT/2024/001", file: "Mechanical_Properties_Test_Report.pdf" },
                      { test: "Fire Resistance", result: "Pass", certificate: "FR/2024/001", file: "Fire_Resistance_Test_Report.pdf" },
                      { test: "Weather Resistance", result: "Pass", certificate: "WR/2024/001", file: "Weather_Resistance_Test_Report.pdf" }
                    ].map((test, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{test.test}</div>
                          <div className="flex gap-2">
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Download className="h-4 w-4" />
                            </span>
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Eye className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            test.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}>
                            {test.result}
                          </span>
                          <span className="text-xs text-gray-500">{test.certificate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Process Chart */}
                <div className="p-4 border border-gray-200 rounded-lg" data-section="process-chart">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Process Chart</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { chart: "Manufacturing Process Flow", status: "Available", lastUpdated: "2024-01-10", file: "Manufacturing_Process_Flow_Chart.pdf" },
                      { chart: "Quality Control Process", status: "Available", lastUpdated: "2024-01-12", file: "Quality_Control_Process_Chart.pdf" }
                    ].map((chart, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{chart.chart}</div>
                          <div className="flex gap-2">
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Download className="h-4 w-4" />
                            </span>
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Eye className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            chart.status === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {chart.status}
                          </span>
                          <span className="text-xs text-gray-500">{chart.lastUpdated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Others */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Others</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { document: "Plant Layout", status: "Available", lastUpdated: "2024-01-10", file: "Plant_Layout_Diagram.pdf" },
                      { document: "Equipment List", status: "Available", lastUpdated: "2024-01-12", file: "Equipment_List_Document.pdf" },
                      { document: "Machine List", status: "Available", lastUpdated: "2024-01-14", file: "Machine_List_Document.pdf" },
                      { document: "Experience Certificate", status: "Available", lastUpdated: "2024-01-16", file: "Experience_Certificate.pdf" }
                    ].map((doc, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{doc.document}</div>
                          <div className="flex gap-2">
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Download className="h-4 w-4" />
                            </span>
                            <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                              <Eye className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            doc.status === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {doc.status}
                          </span>
                          <span className="text-xs text-gray-500">{doc.lastUpdated}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Helping Calculators Modal */}
      {isHelpingCalcOpen && helpingCalcType === 'technical' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Technical Calculations</h3>
              <button onClick={closeHelpingCalc} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* AERIAL BUNCHED CABLE PARAMETERS */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-900">AERIAL BUNCHED CABLE PARAMETERS CALCULATOR</h5>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border border-gray-300">
                      <thead>
                        <tr className="bg-black text-white">
                          <th className="px-2 py-2 border border-gray-300">CORES</th>
                          <th className="px-2 py-2 border border-gray-300">X-SELECTION AREA</th>
                          <th className="px-2 py-2 border border-gray-300">REDUCTION (%)</th>
                          <th className="px-2 py-2 border border-gray-300">NO OF STRANDS</th>
                          <th className="px-2 py-2 border border-gray-300">WIRE SIZE OF GAUGE</th>
                          <th className="px-2 py-2 border border-gray-300">SELECTIONAL AREA</th>
                          <th className="px-2 py-2 border border-gray-300">INSULATION THICKNESS</th>
                          <th className="px-2 py-2 border border-gray-300">OD OF CABLE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Row 1 - PHASE (reduction cell starts here with rowSpan=3) */}
                        <tr className="bg-white">
                          <td className="px-2 py-2 border border-gray-300 font-medium text-gray-800">{tcAerialParams[0]?.core}</td>
                          <td className="px-2 py-2 border border-gray-300">
                            <input type="text" value={tcAerialParams[0]?.xSelectionArea} onChange={(e)=>{ const v=e.target.value; setTcAerialParams(prev=>{ const next=[...prev]; next[0]={...prev[0], xSelectionArea:v}; return next;}); }} className="w-28 text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          {/* Reduction merged starting here via rowSpan */}
                          <td rowSpan={3} className="px-2 py-2 border border-gray-300 align-middle">
                            <input type="number" value={tcReductionPercent} onChange={(e)=>setTcReductionPercent(Number(e.target.value))} className="w-16 text-center text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{phaseNoOfStrands}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{phaseWireSize > 0 ? `${phaseWireSize.toFixed(2)} MM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{phaseSelectionalArea > 0 ? `${Math.round(phaseSelectionalArea)} SQMM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{phaseInsulationThickness > 0 ? `${phaseInsulationThickness.toFixed(2)} MM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{phaseOdOfCable > 0 ? `${phaseOdOfCable.toFixed(2)} MM` : '-'}</td>
                        </tr>
                        {/* Row 2 - ST LIGHT (skip reduction column since merged above) */}
                        <tr className="bg-white">
                          <td className="px-2 py-2 border border-gray-300 font-medium text-gray-800">{tcAerialParams[1]?.core}</td>
                          <td className="px-2 py-2 border border-gray-300">
                            <input type="text" value={tcAerialParams[1]?.xSelectionArea} onChange={(e)=>{ const v=e.target.value; setTcAerialParams(prev=>{ const next=[...prev]; next[1]={...prev[1], xSelectionArea:v}; return next;}); }} className="w-28 text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{streetNoOfStrands}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{streetWireSize > 0 ? `${streetWireSize.toFixed(2)} MM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{streetSelectionalArea > 0 ? `${Math.round(streetSelectionalArea)} SQMM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{streetInsulationThickness > 0 ? `${streetInsulationThickness.toFixed(2)} MM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{streetOdOfCable > 0 ? `${streetOdOfCable.toFixed(2)} MM` : '-'}</td>
                        </tr>
                        {/* Row 3 - MESSENGER (skip reduction column) */}
                        <tr className="bg-white">
                          <td className="px-2 py-2 border border-gray-300 font-medium text-gray-800">{tcAerialParams[2]?.core}</td>
                          <td className="px-2 py-2 border border-gray-300">
                            <input type="text" value={tcAerialParams[2]?.xSelectionArea} onChange={(e)=>{ const v=e.target.value; setTcAerialParams(prev=>{ const next=[...prev]; next[2]={...prev[2], xSelectionArea:v}; return next;}); }} className="w-28 text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{messengerNoOfStrands}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{messengerWireSize > 0 ? `${messengerWireSize.toFixed(2)} MM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{messengerSelectionalArea > 0 ? `${Math.round(messengerSelectionalArea)} SQMM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{messengerInsulationThickness > 0 ? `${messengerInsulationThickness.toFixed(2)} MM` : '-'}</td>
                          <td className="px-2 py-2 border border-gray-300 text-blue-600 font-semibold text-center">{messengerOdOfCable > 0 ? `${messengerOdOfCable.toFixed(2)} MM` : '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* CURRENT CARRYING CAPACITY & RESISTANCE CALCULATOR */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-900">CURRENT CARRYING CAPACITY & RESISTANCE CALCULATOR</h5>
                  <p className="text-[11px] text-gray-600">CURRENT CARRYING CAPACITY & RESISTANCE ACCORDING TO INDIAN STANDARDS</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <select value={tcConductorType} onChange={(e)=>setTcConductorType(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded">
                        <option>AAAC Conductor</option>
                        <option>AB Cable</option>
                        <option>ACSR Conductor</option>
                        <option>Submersible Flat Cable</option>
                        <option>Copper House Wire</option>
                        <option>Agricultural Wire</option>
                      </select>
                      <input value={tcStandard} onChange={(e)=>setTcStandard(e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded" />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs border border-gray-300">
                        <thead>
                          <tr className="bg-black text-white">
                            <th className="px-2 py-2 border">SELECTION AREA</th>
                            <th className="px-2 py-2 border">CCC (Amps/km)</th>
                            <th className="px-2 py-2 border">At °C (Amps)</th>
                            <th className="px-2 py-2 border">AC RESISTANCE (Ω/km)</th>
                            <th className="px-2 py-2 border">At °C (Amps)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="px-2 py-2 border"><input value={tcSelectionArea} onChange={(e)=>setTcSelectionArea(e.target.value)} className="w-28 text-center text-blue-700 font-semibold border-0 focus:ring-0 focus:outline-none" /></td>
                            <td className="px-2 py-2 border"><input value={tcCCCAmpsKm} onChange={(e)=>setTcCCCAmpsKm(e.target.value)} className="w-20 text-center border-0 focus:ring-0 focus:outline-none" /></td>
                            <td className="px-2 py-2 border"><input value={tcAtCAmp1} onChange={(e)=>setTcAtCAmp1(e.target.value)} className="w-20 text-center border-0 focus:ring-0 focus:outline-none" /></td>
                            <td className="px-2 py-2 border"><input value={tcACResistance} onChange={(e)=>setTcACResistance(e.target.value)} className="w-24 text-center border-0 focus:ring-0 focus:outline-none" /></td>
                            <td className="px-2 py-2 border"><input value={tcAtCAmp2} onChange={(e)=>setTcAtCAmp2(e.target.value)} className="w-20 text-center border-0 focus:ring-0 focus:outline-none" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* AAAC CONDUCTOR PARAMETERS */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm"><h5 className="text-sm font-semibold text-gray-900">AAAC CONDUCTOR PARAMETERS CALCULATOR</h5></div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <select value={aaacSelected} onChange={(e)=>setAaacSelected(e.target.value)} className="w-60 px-2 py-1 border border-gray-300 rounded">{aaacOptions.map(o => (<option key={o.name}>{o.name}</option>))}</select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border border-gray-300">
                      <thead>
                        <tr className="bg-black text-white">
                          <th className="px-2 py-2 border">CONDUCTOR CODE</th>
                          <th className="px-2 py-2 border">SELECTIONAL AREA<br/>mm²</th>
                          <th className="px-2 py-2 border">STRANDING & WIRE DIA.<br/>nos/mm</th>
                          <th className="px-2 py-2 border">DC RESISTANCE<br/>(N) NORMAL<br/>Ω/km</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-2 py-2 border text-center text-gray-800 font-medium">{aaacCurrent.code}</td>
                          <td className="px-2 py-2 border text-center text-blue-700 font-semibold">{aaacCurrent.area}</td>
                          <td className="px-2 py-2 border text-center text-blue-700 font-semibold">{aaacCurrent.strandDia}</td>
                          <td className="px-2 py-2 border text-center text-blue-700 font-semibold">{aaacCurrent.dcResistance}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ACSR CONDUCTOR PARAMETERS */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-200 border-b-2 border-gray-300 shadow-sm"><h5 className="text-sm font-semibold text-gray-900">ACSR CONDUCTOR PARAMETERS CALCULATOR</h5></div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <select value={acsrSelected} onChange={(e)=>setAcsrSelected(e.target.value)} className="w-60 px-2 py-1 border border-gray-300 rounded">{acsrOptions.map(o => (<option key={o.name}>{o.name}</option>))}</select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs border border-gray-300">
                      <thead>
                        <tr className="bg-black text-white">
                          <th className="px-2 py-2 border">CONDUCTOR CODE</th>
                          <th className="px-2 py-2 border">SELECTIONAL AREA<br/>mm²</th>
                          <th className="px-2 py-2 border">STRANDING & WIRE DIA.</th>
                          <th className="px-2 py-2 border">DC RESISTANCE<br/>At 20°C<br/>Ω/km</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-2 py-2 border text-center text-gray-800 font-medium">{acsrCurrent.code}</td>
                          <td className="px-2 py-2 border text-center text-blue-700 font-semibold">{acsrCurrent.area}</td>
                          <td className="px-2 py-2 border text-center text-blue-700 font-semibold"><div className="grid grid-cols-2 gap-2"><div><div className="text-[10px] text-gray-600">Aluminium</div><div>{acsrCurrent.alStrandDia}</div></div><div><div className="text-[10px] text-gray-600">Steel</div><div>{acsrCurrent.steelStrandDia}</div></div></div></td>
                          <td className="px-2 py-2 border text-center text-blue-700 font-semibold">{acsrCurrent.dcResistance20}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isFileViewerOpen && Array.isArray(selectedFile) && selectedFile.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                  <h2 className="text-xl font-bold text-gray-900">Image/Video Preview</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!selectedFile || selectedFile.length === 0 || currentSlide >= selectedFile.length) return;
                      const imageUrl = selectedFile[currentSlide];
                      try {
                        let blob;
                        let extension = 'jpg';
                        
                        if (imageUrl.startsWith('data:video/')) {
                          // Handle data URL (base64 video)
                          const base64Response = await fetch(imageUrl);
                          blob = await base64Response.blob();
                          // Extract extension from data URL if available
                          const mimeMatch = imageUrl.match(/data:video\/([^;]+)/);
                          if (mimeMatch) {
                            extension = mimeMatch[1];
                          }
                        } else if (imageUrl.startsWith('data:image/')) {
                          // Handle data URL (base64 image)
                          const base64Response = await fetch(imageUrl);
                          blob = await base64Response.blob();
                          // Extract extension from data URL if available
                          const mimeMatch = imageUrl.match(/data:image\/([^;]+)/);
                          if (mimeMatch) {
                            extension = mimeMatch[1];
                          }
                        } else {
                          // Handle regular URL
                          const response = await fetch(imageUrl);
                          blob = await response.blob();
                          // Extract extension from URL or blob type
                          const urlMatch = imageUrl.match(/\.([a-z]{3,4})(?:\?|$)/i);
                          if (urlMatch) {
                            extension = urlMatch[1];
                          } else if (blob.type) {
                            extension = blob.type.split('/')[1] || 'jpg';
                          }
                        }
                        
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        const isVideo = imageUrl.startsWith('data:video/') || /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(imageUrl);
                        link.download = `${isVideo ? 'video' : 'image'}-${currentSlide + 1}.${extension}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        window.URL.revokeObjectURL(url);
                      } catch (error) {
                        console.error('Error downloading image:', error);
                      }
                    }}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                    title="Download this image/video"
                  >
                    <Download className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleImageDeleteFromModal}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Delete this image"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                <button onClick={closeFileViewer} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Image/Video Preview</h3>
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="relative flex items-center justify-center">
                      <button 
                      onClick={() => setCurrentSlide(s => Math.max(0, s - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow z-10"
                      disabled={currentSlide === 0}
                      aria-label="Previous"
                    >
                      ‹
                      </button>
                    {(() => {
                      const currentFile = selectedFile[currentSlide];
                      const isVideo = currentFile.startsWith('data:video/') || /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(currentFile);
                      return isVideo ? (
                        <video 
                          key={`video-${currentSlide}`}
                          src={currentFile}
                          controls
                          preload="auto"
                          playsInline
                          autoPlay={false}
                          muted={false}
                          className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-sm"
                          style={{ maxWidth: '100%', maxHeight: '60vh' }}
                          onError={(e) => {
                            console.error('Video playback error:', e);
                            console.error('Video src type:', currentFile.substring(0, 50));
                          }}
                          onLoadedData={() => {
                            console.log('Video loaded successfully');
                          }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img 
                          src={currentFile}
                      alt={`Preview ${currentSlide + 1}`}
                      className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-sm"
                    />
                      );
                    })()}
                      <button 
                      onClick={() => setCurrentSlide(s => Math.min(selectedFile.length - 1, s + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow z-10"
                      disabled={currentSlide >= selectedFile.length - 1}
                      aria-label="Next"
                    >
                      ›
                    </button>
                                </div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {selectedFile.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full ${idx === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                                    </div>
                                    </div>
                                    </div>
                                  </div>
                                </div>
                                </div>
      )}
      {/* File Viewer Modal */}
      {false && isFileViewerOpen && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Document Preview</h2>
                    <p className="text-sm text-gray-500">{selectedFile.name}</p>
                  </div>
                </div>
                <button onClick={closeFileViewer} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                      </button>
                    </div>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Preview</h3>
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="text-center">
                    <Document
                      file={selectedFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Calculations Calculator Modal */}
      {isCalculatorOpen && selectedCalculator === "technical-calculations" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Technical Calculations</h2>
              <button 
                onClick={closeCalculator}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {/* Simple Calculator Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Calculator Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={() => selectCalculatorType('aerial')}
                    className={`p-4 border-2 rounded-lg hover:bg-blue-100 transition-colors ${
                      selectedCalculator === 'aerial' 
                        ? 'bg-blue-100 border-blue-400' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="text-center">
                      <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Aerial Cable</h4>
                      <p className="text-sm text-gray-600">Parameters</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => selectCalculatorType('current')}
                    className={`p-4 border-2 rounded-lg hover:bg-green-100 transition-colors ${
                      selectedCalculator === 'current' 
                        ? 'bg-green-100 border-green-400' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">Current Capacity</h4>
                      <p className="text-sm text-gray-600">& Resistance</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => selectCalculatorType('aaac')}
                    className={`p-4 border-2 rounded-lg hover:bg-purple-100 transition-colors ${
                      selectedCalculator === 'aaac' 
                        ? 'bg-purple-100 border-purple-400' 
                        : 'bg-purple-50 border-purple-200'
                    }`}
                  >
                    <div className="text-center">
                      <Cable className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">AAAC Conductor</h4>
                      <p className="text-sm text-gray-600">Parameters</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => selectCalculatorType('acsr')}
                    className={`p-4 border-2 rounded-lg hover:bg-orange-100 transition-colors ${
                      selectedCalculator === 'acsr' 
                        ? 'bg-orange-100 border-orange-400' 
                        : 'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <div className="text-center">
                      <Shield className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-900">ACSR Conductor</h4>
                      <p className="text-sm text-gray-600">Parameters</p>
                    </div>
                  </button>
                </div>
              </div>
              {/* Simple Input Form */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Calculator</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Conductor Type</label>
                    <select 
                      value={calculatorInputs.conductorType}
                      onChange={(e) => handleInputChange('conductorType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="aerial">Aerial Bunched Cable</option>
                      <option value="aaac">AAAC Conductor</option>
                      <option value="acsr">ACSR Conductor</option>
                      <option value="copper">Copper Conductor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Conductor Size (mm²)</label>
                    <select 
                      value={calculatorInputs.conductorSize}
                      onChange={(e) => handleInputChange('conductorSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Size</option>
                      <option value="15">15 mm²</option>
                      <option value="25">25 mm²</option>
                      <option value="35">35 mm²</option>
                      <option value="50">50 mm²</option>
                      <option value="70">70 mm²</option>
                      <option value="95">95 mm²</option>
                      <option value="120">120 mm²</option>
                      <option value="150">150 mm²</option>
                      <option value="185">185 mm²</option>
                      <option value="240">240 mm²</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                    <select 
                      value={calculatorInputs.temperature}
                      onChange={(e) => handleInputChange('temperature', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Temperature</option>
                      <option value="20">20°C</option>
                      <option value="65">65°C</option>
                      <option value="75">75°C</option>
                      <option value="90">90°C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Standard</label>
                    <select 
                      value={calculatorInputs.standard}
                      onChange={(e) => handleInputChange('standard', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Standard</option>
                      <option value="is398">IS 398 P-IV</option>
                      <option value="is7098">IS 7098</option>
                      <option value="iec">IEC Standards</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button 
                    onClick={calculateResults}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-lg font-medium"
                  >
                    Calculate Results
                  </button>
                </div>
              </div>

              {/* Results Display */}
              <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculationResults.currentCapacity || '--'}
                    </div>
                    <div className="text-sm text-gray-600">Current Capacity (Amps)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {calculationResults.resistance || '--'}
                    </div>
                    <div className="text-sm text-gray-600">Resistance (Ω/km)</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {calculationResults.cableOD || '--'}
                    </div>
                    <div className="text-sm text-gray-600">Cable OD (mm)</div>
                  </div>
                </div>
              </div>
              {/* Quick Reference Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Reference</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Size (mm²)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Current (Amps)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Resistance (Ω/km)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">OD (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">15</td>
                        <td className="px-4 py-3 text-sm text-gray-900">88</td>
                        <td className="px-4 py-3 text-sm text-gray-900">2.2286</td>
                        <td className="px-4 py-3 text-sm text-gray-900">6.5</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">25</td>
                        <td className="px-4 py-3 text-sm text-gray-900">130</td>
                        <td className="px-4 py-3 text-sm text-gray-900">0.727</td>
                        <td className="px-4 py-3 text-sm text-gray-900">8.8</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">50</td>
                        <td className="px-4 py-3 text-sm text-gray-900">200</td>
                        <td className="px-4 py-3 text-sm text-gray-900">0.387</td>
                        <td className="px-4 py-3 text-sm text-gray-900">12.0</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-900">95</td>
                        <td className="px-4 py-3 text-sm text-gray-900">300</td>
                        <td className="px-4 py-3 text-sm text-gray-900">0.193</td>
                        <td className="px-4 py-3 text-sm text-gray-900">16.0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Company Emails Modal */}
      {isCompanyEmailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDarkMode ? 'bg-pink-900' : 'bg-pink-100'
                }`}>
                  <Mail className={`h-6 w-6 ${
                    isDarkMode ? 'text-pink-400' : 'text-pink-600'
                  }`} />
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Company Emails</h2>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>All company email addresses</p>
                </div>
              </div>
              <button 
                onClick={closeCompanyEmails}
                className={`${
                  isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {/* Anshul Gupta - Managing Director */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Anshul Gupta</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Managing Director</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:MD@anocab.in" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    MD@anocab.in
                  </a>
                </div>

                {/* Suraj Gehani - Chief Executive Officer */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-green-900' : 'bg-green-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Suraj Gehani</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Chief Executive Officer</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:CEO@anocab.in" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-green-300 hover:text-green-200' : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    CEO@anocab.in
                  </a>
                </div>

                {/* Akash Gupta - General Manager */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-purple-900' : 'bg-purple-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                  </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Akash Gupta</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>General Manager</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:GM@anocab.in" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-purple-600 hover:text-purple-700'
                    }`}
                  >
                    GM@anocab.in
                  </a>
                </div>

                {/* Anushree Namdeo - CM */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-pink-900' : 'bg-pink-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-pink-400' : 'text-pink-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Anushree Namdeo</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>CM</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:CM@anocab.in" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-pink-300 hover:text-pink-200' : 'text-pink-600 hover:text-pink-700'
                    }`}
                  >
                    CM@anocab.in
                  </a>
                </div>

                {/* Chief Financial Officer - CFO */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Chief Financial Officer</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>CFO</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:CFO@anocab.in" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-yellow-600 hover:text-yellow-700'
                    }`}
                  >
                    CFO@anocab.in
                  </a>
                </div>

                {/* Saurabh Jhariya - Area Sales Manager */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-indigo-900' : 'bg-indigo-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Saurabh Jhariya</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Area Sales Manager</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:admin@anocab.in" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-700'
                    }`}
                  >
                    admin@anocab.in
                  </a>
                </div>

                {/* Deepshikha Jhariya - Junior Accountant */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-teal-900' : 'bg-teal-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-teal-400' : 'text-teal-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Deepshikha Jhariya</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Junior Accountant</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:deepshikha@anocab.com" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-teal-300 hover:text-teal-200' : 'text-teal-600 hover:text-teal-700'
                    }`}
                  >
                    deepshikha@anocab.com
                  </a>
                </div>

                {/* Rajvansh Samal - Production Planning Controller */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-orange-900' : 'bg-orange-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-orange-400' : 'text-orange-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Rajvansh Samal</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Production Planning Controller</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:rajvansh@anocab.com" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-orange-300 hover:text-orange-200' : 'text-orange-600 hover:text-orange-700'
                    }`}
                  >
                    rajvansh@anocab.com
                  </a>
                </div>

                {/* Tukesh Bisen - Senior Supervisor */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-cyan-900' : 'bg-cyan-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
                      }`} />
                  </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Tukesh Bisen</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Senior Supervisor</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:tukesh@anocab.com" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-cyan-300 hover:text-cyan-200' : 'text-cyan-600 hover:text-cyan-700'
                    }`}
                  >
                    tukesh@anocab.com
                  </a>
                </div>

                {/* Abhishek Namdeo - Employee */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-amber-900' : 'bg-amber-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-amber-400' : 'text-amber-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Abhishek Namdeo</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Employee</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:acnt.anocab@gmail.com" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-amber-300 hover:text-amber-200' : 'text-amber-600 hover:text-amber-700'
                    }`}
                  >
                    acnt.anocab@gmail.com
                  </a>
                </div>

                {/* Vivian James - Security */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-red-900' : 'bg-red-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                  </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Vivian James</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Security</p>
                </div>
              </div>
                  <a 
                    href="mailto:vivian@anocab.com" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-red-300 hover:text-red-200' : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    vivian@anocab.com
                  </a>
            </div>

                {/* Sameer Giri - COO */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-violet-900' : 'bg-violet-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-violet-400' : 'text-violet-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Sameer Giri</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>COO</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:COO@anocab.in" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-violet-300 hover:text-violet-200' : 'text-violet-600 hover:text-violet-700'
                    }`}
                  >
                    COO@anocab.in
                  </a>
                </div>

                {/* Himanshu Sen - Sales Executive */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-emerald-900' : 'bg-emerald-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Himanshu Sen</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Sales Executive</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:himanshusen@anocab.com" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-emerald-300 hover:text-emerald-200' : 'text-emerald-600 hover:text-emerald-700'
                    }`}
                  >
                    himanshusen@anocab.com
                  </a>
                </div>

                {/* Vaishnavi Rajbhar - Sales Executive */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-rose-900' : 'bg-rose-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-rose-400' : 'text-rose-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Vaishnavi Rajbhar</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Sales Executive</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:VAISHNAVI@anocab.com" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-rose-300 hover:text-rose-200' : 'text-rose-600 hover:text-rose-700'
                    }`}
                  >
                    VAISHNAVI@anocab.com
                  </a>
                </div>

                {/* Radhika Jhariya - Sales Executive */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDarkMode ? 'bg-sky-900' : 'bg-sky-100'
                    }`}>
                      <User className={`h-5 w-5 ${
                        isDarkMode ? 'text-sky-400' : 'text-sky-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Radhika Jhariya</h3>
                      <p className={`text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Sales Executive</p>
                    </div>
                  </div>
                  <a 
                    href="mailto:radhika@anocab.com" 
                    className={`text-sm font-mono hover:underline cursor-pointer ${
                      isDarkMode ? 'text-sky-300 hover:text-sky-200' : 'text-sky-600 hover:text-sky-700'
                    }`}
                  >
                    radhika@anocab.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Card Modal */}
      {isBusinessCardOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeBusinessCard} key="business-card-modal-v2">
          <div 
            className={`rounded-lg shadow-2xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col max-w-md w-full bg-white`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Actions */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Anocab Business Card</h3>
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
                  onClick={closeBusinessCard}
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
                  className="h-32 w-auto object-contain"
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
      {isSamriddhiBusinessCardOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeSamriddhiBusinessCard} key="samriddhi-business-card-modal">
          <div 
            className={`rounded-lg shadow-2xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col max-w-md w-full bg-white`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Actions */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Samriddhi Business Card</h3>
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
      {isApprovalsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeApprovals}>
          <div 
            className={`rounded-lg shadow-2xl overflow-hidden border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col max-w-md w-full bg-white`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Approvals</h3>
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
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-gray-500' 
                      : 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>CHHATTISGARH</h4>
                    <FileText className={`h-5 w-5 ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                </button>

                {/* MADHYA PRADESH */}
                <button
                  onClick={() => openApprovalPdf('MADHYA PRADESH')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-gray-500' 
                      : 'border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>MADHYA PRADESH</h4>
                    <FileText className={`h-5 w-5 ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                </button>

                {/* MAHARASHTRA */}
                <button
                  onClick={() => openApprovalPdf('MAHARASHTRA')}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600 hover:border-gray-500' 
                      : 'border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>MAHARASHTRA</h4>
                    <FileText className={`h-5 w-5 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Upcoming Modal */}
      {showDataUpcoming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
              <button
                onClick={() => setShowDataUpcoming(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-6">📊</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">Data Upcoming</h3>
                <p className="text-gray-600">Product data will be available soon.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolboxInterface;