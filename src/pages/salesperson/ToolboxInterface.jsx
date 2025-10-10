import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';

const sections = [
  {
    id: "products",
    title: "Products",
    icon: Package,
    tools: [
        { name: "Aerial Bunch Cable", description: "Overhead power distribution cable", icon: Image, imageUrl: "/images/products/aerial bunch cable.jpeg" },
      { name: "Aluminium Conductor Galvanized Steel Reinforced", description: "ACSR conductor for transmission lines", icon: Image, imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
      { name: "All Aluminium Alloy Conductor", description: "AAAC conductor for overhead lines", icon: Image, imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
      { name: "Paper Cover Aluminium Conductor", description: "Traditional paper insulated conductor", icon: Image, imageUrl: "/images/products/paper covered aluminium conductor.jpeg" },
      { name: "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable", description: "Single core power cable with PVC insulation", icon: Image, imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg" },
      { name: "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable", description: "Single core power cable with XLPE insulation", icon: Image, imageUrl: "/images/products/single core pvc insulated aluminium copper armoured_unarmoured cable.jpeg" },
      { name: "Multi Core PVC Insulated Aluminium Armoured Cable", description: "Multi-core power cable with aluminium armour", icon: Image, imageUrl: "/images/products/multi core pvc isulated aluminium armoured cable.jpeg" },
      { name: "Multi Core XLPE Insulated Aluminium Armoured Cable", description: "Multi-core XLPE cable with aluminium armour", icon: Image, imageUrl: "/images/products/multi core xlpe insulated aluminium armoured cable.jpeg" },
      { name: "Multi Core PVC Insulated Aluminium Unarmoured Cable", description: "Multi-core PVC cable without armour", icon: Image, imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg" },
      { name: "Multi Core XLPE Insulated Aluminium Unarmoured Cable", description: "Multi-core XLPE cable without armour", icon: Image, imageUrl: "/images/products/multi core pvc insulated aluminium unarmoured cable.jpeg" },
      { name: "Multistrand Single Core Copper Cable", description: "Flexible single core copper cable", icon: Image, imageUrl: "/images/products/multistrand single core copper cable.jpeg" },
      { name: "Multi Core Copper Cable", description: "Multi-core copper power cable", icon: Image, imageUrl: "/images/products/multi core copper cable.jpeg" },
      { name: "PVC Insulated Single Core Aluminium Cable", description: "Single core aluminium cable with PVC insulation", icon: Image, imageUrl: "/images/products/pvc insulated single core aluminium cables.jpeg" },
      { name: "PVC Insulated Submersible Cable", description: "Water-resistant submersible cable", icon: Image, imageUrl: "/images/products/pvc insulated submersible cable.jpeg" },
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
  {
    id: "technical-size-chart",
    title: "Technical Size Chart",
    icon: Ruler,
    tools: [
      { name: "ANOCAB 1100 VOLT ELECTRIC WIRE MULTISTRAND SINGLE CORE PVC INSULATED", description: "Single core multistrand cable specifications", icon: Zap, dataId: "anocab-1100-volt-multistrand-single-core" },
      { name: "ANOCAB 1100 VOLT ELECTRIC MULTI-STRAND MULTI-CORE PVC INSULATED COPPER CABLE", description: "Multi-core copper cable specifications", icon: Cable, dataId: "anocab-1100-volt-multi-strand-multi-core" },
      { name: "ANOCAB 750 VOLT ELECTRIC SINGLE CORE PVC INSULATED CABLE", description: "Single core 750V cable specifications", icon: Zap, dataId: "anocab-750-volt-single-core" },
      { name: "ANOCAB 1100 VOLT ELECTRIC PVC INSULATED SUBMERSIBLE FLAT CABLE", description: "Submersible flat cable specifications", icon: Droplets, dataId: "anocab-1100-volt-submersible-flat" },
      { name: "ALL ALUMINIUM ALLOY CONDUCTORS (AAAC) IS 398 PT-IV : 1994", description: "Aluminium alloy conductor specifications", icon: Layers, dataId: "aaac-conductors" },
      { name: "ALUMINIUM CONDUCTOR GALVANISED STEEL REINFORCED IS 398 PT-II : 1996", description: "Galvanised steel reinforced conductor specifications", icon: Shield, dataId: "aluminium-conductor-galvanised-steel" },
    ],
  },
];

const ToolboxInterface = () => {
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
  const [selectedLocation, setSelectedLocation] = useState("Anode Electric Private Limited");
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [showCompanyEmails, setShowCompanyEmails] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [showCalculators, setShowCalculators] = useState(false);
  const [showHelpingCalculators, setShowHelpingCalculators] = useState(false);
  
  // Product detail state
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isBusinessCardOpen, setIsBusinessCardOpen] = useState(false);
  const [isCompanyEmailsOpen, setIsCompanyEmailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState([]);

  // Image upload state
  const [productImages, setProductImages] = useState({}); // { [productName]: { [rowIndex]: [dataUrl1, ...] } }
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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
      setIsFileViewerOpen(true);
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
      // Open technical calculations calculator
      openCalculator("technical-calculations");
    } else if (tool.name === "CONVERSIONAL CALCULATIONS") {
      // Load conversion calculations data
      const convCalc = conversionCalculationsData[0]; // Default to first calculation
      setSelectedTableData({
        name: convCalc.name,
        headers: convCalc.data.headers || ["Input", "Output", "Note"],
        rows: convCalc.data.rows || [
          [convCalc.data.inputValue || "", convCalc.data.outputValue || "", convCalc.data.note || ""]
        ]
      });
      setIsTableOpen(true);
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
    } else if (tool.name === "Aerial Bunch Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Aluminium Conductor Galvanized Steel Reinforced") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "All Aluminium Alloy Conductor") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Paper Cover Aluminium Conductor") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Single Core PVC Insulated Aluminium/Copper Armoured/Unarmoured Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Single Core XLPE Insulated Aluminium/Copper Armoured/Unarmoured Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Multi Core PVC Insulated Aluminium Armoured Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Multi Core XLPE Insulated Aluminium Armoured Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Multi Core PVC Insulated Aluminium Unarmoured Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Multi Core XLPE Insulated Aluminium Unarmoured Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Multistrand Single Core Copper Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Multi Core Copper Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
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
    } else if (tool.name === "PVC Insulated Single Core Aluminium Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "PVC Insulated Submersible Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "PVC Insulated Multicore Aluminium Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Submersible Winding Wire") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Twin Twisted Copper Wire") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Speaker Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "CCTV Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "LAN Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Automobile Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "PV Solar Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Co Axial Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Uni-tube Unarmoured Optical Fibre Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Armoured Unarmoured PVC Insulated Copper Control Cable") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
    } else if (tool.name === "Telecom Switch Board Cables") {
      setSelectedProduct(tool.name);
      setIsProductDetailOpen(true);
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
        }
      },
      "Aluminium Conductor Galvanized Steel Reinforced": {
        title: "Aluminium Conductor Galvanized Steel Reinforced",
        description: "ACSR conductor for overhead transmission and distribution lines",
        imageUrl: "/images/products/all aluminium alloy conductor.jpeg",
        priceList: [
          { size: "SQUIRREL (6/1/2.11) - 10.5mm", price: "", stock: "", image: "" },
          { size: "RABBIT (6/2.11) - 6.33mm", price: "", stock: "", image: "" },
          { size: "WEASEL (6/2.59) - 7.77mm", price: "", stock: "", image: "" },
          { size: "MARTEN (6/3.35) - 10.05mm", price: "", stock: "", image: "" },
          { size: "LYNX (6/3.71) - 11.13mm", price: "", stock: "", image: "" },
          { size: "DOG (6/4.72) - 14.16mm", price: "", stock: "", image: "" },
          { size: "WOLF (6/4.72 + 6/1.57) - 14.5mm", price: "", stock: "", image: "" },
          { size: "PANTHER (30/3.00) - 15.0mm", price: "", stock: "", image: "" },
          { size: "ZEBRA (30/3.00 + 7/1.95) - 15.75mm", price: "", stock: "", image: "" },
          { size: "MOOSE (54/3.53) - 24.26mm", price: "", stock: "", image: "" }
        ],
        technicalData: {},
        technicalTables: {
          note: "ACSR CONDUCTOR AS PER IS 398 (PART II) : 1996",
          tables: [
            {
              title: "ACSR CONDUCTOR SPECIFICATIONS",
              columns: [
                "CODE NAME",
                "ALUMINIUM STRANDING (No. / mm)",
                "STEEL STRANDING (No. / mm)",
                "OVERALL DIAMETER (mm)",
                "ALUMINIUM AREA (sq.mm)",
                "STEEL AREA (sq.mm)",
                "TOTAL AREA (sq.mm)",
                "APPROX. WEIGHT (kg/km)",
                "RATED STRENGTH (kN)",
                "DC RESISTANCE (Ohm/km) at 20°C"
              ],
              rows: [
                { code: "SQUIRREL", alStrand: "6/1.50", steelStrand: "1/1.50", dia: "4.50", alArea: "10.6", steelArea: "1.77", totalArea: "12.37", weight: "49.8", strength: "5.30", resistance: "2.706" },
                { code: "RABBIT", alStrand: "6/1.50", steelStrand: "1/1.50", dia: "4.50", alArea: "10.6", steelArea: "1.77", totalArea: "12.37", weight: "49.8", strength: "5.30", resistance: "2.706" },
                { code: "WEASEL", alStrand: "6/2.11", steelStrand: "1/2.11", dia: "6.33", alArea: "21.0", steelArea: "3.50", totalArea: "24.50", weight: "98.6", strength: "10.5", resistance: "1.369" },
                { code: "MARTEN", alStrand: "6/3.35", steelStrand: "1/3.35", dia: "10.05", alArea: "52.9", steelArea: "8.82", totalArea: "61.72", weight: "248.0", strength: "26.5", resistance: "0.544" },
                { code: "LYNX", alStrand: "6/3.71", steelStrand: "1/3.71", dia: "11.13", alArea: "65.0", steelArea: "10.8", totalArea: "75.80", weight: "304.0", strength: "32.6", resistance: "0.442" },
                { code: "DOG", alStrand: "6/4.72", steelStrand: "1/4.72", dia: "14.16", alArea: "105.0", steelArea: "17.5", totalArea: "122.5", weight: "492.0", strength: "52.7", resistance: "0.274" },
                { code: "WOLF", alStrand: "6/4.72", steelStrand: "7/1.57", dia: "14.5", alArea: "105.0", steelArea: "13.6", totalArea: "118.6", weight: "465.0", strength: "63.5", resistance: "0.274" },
                { code: "PANTHER", alStrand: "30/3.00", steelStrand: "7/3.00", dia: "15.0", alArea: "212.0", steelArea: "49.5", totalArea: "261.5", weight: "1010.0", strength: "123.0", resistance: "0.136" },
                { code: "ZEBRA", alStrand: "30/3.00", steelStrand: "7/1.95", dia: "15.75", alArea: "212.0", steelArea: "20.9", totalArea: "232.9", weight: "844.0", strength: "95.0", resistance: "0.136" },
                { code: "MOOSE", alStrand: "54/3.53", steelStrand: "7/3.53", dia: "24.26", alArea: "528.0", steelArea: "68.6", totalArea: "596.6", weight: "2030.0", strength: "194.0", resistance: "0.055" }
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
          { size: "25 sq.mm", price: "₹78.50/m", stock: "Available", image: "/images/aaac-25mm.jpg" },
          { size: "50 sq.mm", price: "₹145.20/m", stock: "Available", image: "/images/aaac-50mm.jpg" },
          { size: "70 sq.mm", price: "₹198.80/m", stock: "Available", image: "/images/aaac-70mm.jpg" },
          { size: "95 sq.mm", price: "₹265.40/m", stock: "Available", image: "/images/aaac-95mm.jpg" },
          { size: "120 sq.mm", price: "₹325.60/m", stock: "Available", image: "/images/aaac-120mm.jpg" },
          { size: "150 sq.mm", price: "₹398.20/m", stock: "Available", image: "/images/aaac-150mm.jpg" }
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
          { size: "25 sq.mm", price: "₹65.80/m", stock: "Available", image: "/images/paper-25mm.jpg" },
          { size: "50 sq.mm", price: "₹125.40/m", stock: "Available", image: "/images/paper-50mm.jpg" },
          { size: "70 sq.mm", price: "₹168.90/m", stock: "Available", image: "/images/paper-70mm.jpg" },
          { size: "95 sq.mm", price: "₹225.60/m", stock: "Available", image: "/images/paper-95mm.jpg" },
          { size: "120 sq.mm", price: "₹285.40/m", stock: "Available", image: "/images/paper-120mm.jpg" }
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
          { size: "25 sq.mm", price: "₹95.50/m", stock: "Available", image: "/images/pvc-25mm.jpg" },
          { size: "50 sq.mm", price: "₹185.20/m", stock: "Available", image: "/images/pvc-50mm.jpg" },
          { size: "70 sq.mm", price: "₹245.80/m", stock: "Available", image: "/images/pvc-70mm.jpg" },
          { size: "95 sq.mm", price: "₹325.40/m", stock: "Available", image: "/images/pvc-95mm.jpg" },
          { size: "120 sq.mm", price: "₹398.60/m", stock: "Available", image: "/images/pvc-120mm.jpg" },
          { size: "150 sq.mm", price: "₹485.20/m", stock: "Available", image: "/images/pvc-150mm.jpg" }
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
          { size: "25 sq.mm", price: "₹125.80/m", stock: "Available", image: "/images/xlpe-25mm.jpg" },
          { size: "50 sq.mm", price: "₹245.60/m", stock: "Available", image: "/images/xlpe-50mm.jpg" },
          { size: "70 sq.mm", price: "₹325.40/m", stock: "Available", image: "/images/xlpe-70mm.jpg" },
          { size: "95 sq.mm", price: "₹425.80/m", stock: "Available", image: "/images/xlpe-95mm.jpg" },
          { size: "120 sq.mm", price: "₹525.20/m", stock: "Available", image: "/images/xlpe-120mm.jpg" },
          { size: "150 sq.mm", price: "₹645.60/m", stock: "Available", image: "/images/xlpe-150mm.jpg" }
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
          { size: "2x25 sq.mm", price: "₹185.50/m", stock: "Available", image: "/images/multicore-pvc-25mm.jpg" },
          { size: "2x50 sq.mm", price: "₹365.80/m", stock: "Available", image: "/images/multicore-pvc-50mm.jpg" },
          { size: "3x25 sq.mm", price: "₹245.20/m", stock: "Available", image: "/images/multicore-pvc-3x25mm.jpg" },
          { size: "3x50 sq.mm", price: "₹485.40/m", stock: "Available", image: "/images/multicore-pvc-3x50mm.jpg" },
          { size: "4x25 sq.mm", price: "₹325.60/m", stock: "Available", image: "/images/multicore-pvc-4x25mm.jpg" },
          { size: "4x50 sq.mm", price: "₹645.80/m", stock: "Available", image: "/images/multicore-pvc-4x50mm.jpg" }
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
          { size: "2x25 sq.mm", price: "₹245.80/m", stock: "Available", image: "/images/multicore-xlpe-25mm.jpg" },
          { size: "2x50 sq.mm", price: "₹485.60/m", stock: "Available", image: "/images/multicore-xlpe-50mm.jpg" },
          { size: "3x25 sq.mm", price: "₹325.40/m", stock: "Available", image: "/images/multicore-xlpe-3x25mm.jpg" },
          { size: "3x50 sq.mm", price: "₹645.80/m", stock: "Available", image: "/images/multicore-xlpe-3x50mm.jpg" },
          { size: "4x25 sq.mm", price: "₹425.60/m", stock: "Available", image: "/images/multicore-xlpe-4x25mm.jpg" },
          { size: "4x50 sq.mm", price: "₹845.20/m", stock: "Available", image: "/images/multicore-xlpe-4x50mm.jpg" }
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
          { size: "2x25 sq.mm", price: "₹165.50/m", stock: "Available", image: "/images/multicore-pvc-unarmoured-25mm.jpg" },
          { size: "2x50 sq.mm", price: "₹325.80/m", stock: "Available", image: "/images/multicore-pvc-unarmoured-50mm.jpg" },
          { size: "3x25 sq.mm", price: "₹205.20/m", stock: "Available", image: "/images/multicore-pvc-unarmoured-3x25mm.jpg" },
          { size: "3x50 sq.mm", price: "₹405.40/m", stock: "Available", image: "/images/multicore-pvc-unarmoured-3x50mm.jpg" },
          { size: "4x25 sq.mm", price: "₹275.60/m", stock: "Available", image: "/images/multicore-pvc-unarmoured-4x25mm.jpg" },
          { size: "4x50 sq.mm", price: "₹545.80/m", stock: "Available", image: "/images/multicore-pvc-unarmoured-4x50mm.jpg" }
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
          { size: "2x25 sq.mm", price: "₹205.80/m", stock: "Available", image: "/images/multicore-xlpe-unarmoured-25mm.jpg" },
          { size: "2x50 sq.mm", price: "₹405.60/m", stock: "Available", image: "/images/multicore-xlpe-unarmoured-50mm.jpg" },
          { size: "3x25 sq.mm", price: "₹275.40/m", stock: "Available", image: "/images/multicore-xlpe-unarmoured-3x25mm.jpg" },
          { size: "3x50 sq.mm", price: "₹545.80/m", stock: "Available", image: "/images/multicore-xlpe-unarmoured-3x50mm.jpg" },
          { size: "4x25 sq.mm", price: "₹365.60/m", stock: "Available", image: "/images/multicore-xlpe-unarmoured-4x25mm.jpg" },
          { size: "4x50 sq.mm", price: "₹725.20/m", stock: "Available", image: "/images/multicore-xlpe-unarmoured-4x50mm.jpg" }
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
          { size: "25 sq.mm", price: "₹185.50/m", stock: "Available", image: "/images/copper-single-25mm.jpg" },
          { size: "50 sq.mm", price: "₹365.80/m", stock: "Available", image: "/images/copper-single-50mm.jpg" },
          { size: "70 sq.mm", price: "₹485.40/m", stock: "Available", image: "/images/copper-single-70mm.jpg" },
          { size: "95 sq.mm", price: "₹645.20/m", stock: "Available", image: "/images/copper-single-95mm.jpg" },
          { size: "120 sq.mm", price: "₹785.60/m", stock: "Available", image: "/images/copper-single-120mm.jpg" },
          { size: "150 sq.mm", price: "₹945.80/m", stock: "Available", image: "/images/copper-single-150mm.jpg" }
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
          { size: "2x25 sq.mm", price: "₹325.50/m", stock: "Available", image: "/images/copper-multicore-25mm.jpg" },
          { size: "2x50 sq.mm", price: "₹645.80/m", stock: "Available", image: "/images/copper-multicore-50mm.jpg" },
          { size: "3x25 sq.mm", price: "₹425.20/m", stock: "Available", image: "/images/copper-multicore-3x25mm.jpg" },
          { size: "3x50 sq.mm", price: "₹845.40/m", stock: "Available", image: "/images/copper-multicore-3x50mm.jpg" },
          { size: "4x25 sq.mm", price: "₹565.60/m", stock: "Available", image: "/images/copper-multicore-4x25mm.jpg" },
          { size: "4x50 sq.mm", price: "₹1125.80/m", stock: "Available", image: "/images/copper-multicore-4x50mm.jpg" }
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
          { size: "25 sq.mm", price: "₹85.50/m", stock: "Available", image: "/images/pvc-aluminium-single-25mm.jpg" },
          { size: "50 sq.mm", price: "₹165.80/m", stock: "Available", image: "/images/pvc-aluminium-single-50mm.jpg" },
          { size: "70 sq.mm", price: "₹225.40/m", stock: "Available", image: "/images/pvc-aluminium-single-70mm.jpg" },
          { size: "95 sq.mm", price: "₹298.60/m", stock: "Available", image: "/images/pvc-aluminium-single-95mm.jpg" },
          { size: "120 sq.mm", price: "₹365.20/m", stock: "Available", image: "/images/pvc-aluminium-single-120mm.jpg" },
          { size: "150 sq.mm", price: "₹445.80/m", stock: "Available", image: "/images/pvc-aluminium-single-150mm.jpg" }
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
          { size: "1.5 sq.mm", price: "₹45.50/m", stock: "Available", image: "/images/submersible-1.5mm.jpg" },
          { size: "2.5 sq.mm", price: "₹68.75/m", stock: "Available", image: "/images/submersible-2.5mm.jpg" },
          { size: "4 sq.mm", price: "₹92.30/m", stock: "Available", image: "/images/submersible-4mm.jpg" },
          { size: "6 sq.mm", price: "₹125.80/m", stock: "Available", image: "/images/submersible-6mm.jpg" },
          { size: "10 sq.mm", price: "₹168.90/m", stock: "Available", image: "/images/submersible-10mm.jpg" },
          { size: "16 sq.mm", price: "₹215.60/m", stock: "Available", image: "/images/submersible-16mm.jpg" }
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
          { size: "2x25 sq.mm", price: "₹165.50/m", stock: "Available", image: "/images/pvc-aluminium-multicore-25mm.jpg" },
          { size: "2x50 sq.mm", price: "₹325.80/m", stock: "Available", image: "/images/pvc-aluminium-multicore-50mm.jpg" },
          { size: "3x25 sq.mm", price: "₹205.20/m", stock: "Available", image: "/images/pvc-aluminium-multicore-3x25mm.jpg" },
          { size: "3x50 sq.mm", price: "₹405.40/m", stock: "Available", image: "/images/pvc-aluminium-multicore-3x50mm.jpg" },
          { size: "4x25 sq.mm", price: "₹275.60/m", stock: "Available", image: "/images/pvc-aluminium-multicore-4x25mm.jpg" },
          { size: "4x50 sq.mm", price: "₹545.80/m", stock: "Available", image: "/images/pvc-aluminium-multicore-4x50mm.jpg" }
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
          { size: "0.5 sq.mm", price: "₹25.50/m", stock: "Available", image: "/images/winding-wire-0.5mm.jpg" },
          { size: "0.75 sq.mm", price: "₹35.80/m", stock: "Available", image: "/images/winding-wire-0.75mm.jpg" },
          { size: "1.0 sq.mm", price: "₹45.20/m", stock: "Available", image: "/images/winding-wire-1.0mm.jpg" },
          { size: "1.5 sq.mm", price: "₹65.40/m", stock: "Available", image: "/images/winding-wire-1.5mm.jpg" },
          { size: "2.5 sq.mm", price: "₹95.60/m", stock: "Available", image: "/images/winding-wire-2.5mm.jpg" },
          { size: "4.0 sq.mm", price: "₹145.80/m", stock: "Available", image: "/images/winding-wire-4.0mm.jpg" }
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
          { size: "0.5 sq.mm", price: "₹15.50/m", stock: "Available", image: "/images/twin-twisted-0.5mm.jpg" },
          { size: "0.75 sq.mm", price: "₹22.80/m", stock: "Available", image: "/images/twin-twisted-0.75mm.jpg" },
          { size: "1.0 sq.mm", price: "₹28.20/m", stock: "Available", image: "/images/twin-twisted-1.0mm.jpg" },
          { size: "1.5 sq.mm", price: "₹38.40/m", stock: "Available", image: "/images/twin-twisted-1.5mm.jpg" },
          { size: "2.5 sq.mm", price: "₹55.60/m", stock: "Available", image: "/images/twin-twisted-2.5mm.jpg" },
          { size: "4.0 sq.mm", price: "₹85.80/m", stock: "Available", image: "/images/twin-twisted-4.0mm.jpg" }
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
          { size: "2x0.5 sq.mm", price: "₹25.50/m", stock: "Available", image: "/images/speaker-2x0.5mm.jpg" },
          { size: "2x0.75 sq.mm", price: "₹35.80/m", stock: "Available", image: "/images/speaker-2x0.75mm.jpg" },
          { size: "2x1.0 sq.mm", price: "₹45.20/m", stock: "Available", image: "/images/speaker-2x1.0mm.jpg" },
          { size: "2x1.5 sq.mm", price: "₹65.40/m", stock: "Available", image: "/images/speaker-2x1.5mm.jpg" },
          { size: "2x2.5 sq.mm", price: "₹95.60/m", stock: "Available", image: "/images/speaker-2x2.5mm.jpg" },
          { size: "2x4.0 sq.mm", price: "₹145.80/m", stock: "Available", image: "/images/speaker-2x4.0mm.jpg" }
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
          { size: "4+1 Core", price: "₹35.50/m", stock: "Available", image: "/images/cctv-4+1core.jpg" },
          { size: "8+1 Core", price: "₹55.80/m", stock: "Available", image: "/images/cctv-8+1core.jpg" },
          { size: "12+1 Core", price: "₹75.20/m", stock: "Available", image: "/images/cctv-12+1core.jpg" },
          { size: "16+1 Core", price: "₹95.40/m", stock: "Available", image: "/images/cctv-16+1core.jpg" },
          { size: "20+1 Core", price: "₹115.60/m", stock: "Available", image: "/images/cctv-20+1core.jpg" },
          { size: "24+1 Core", price: "₹135.80/m", stock: "Available", image: "/images/cctv-24+1core.jpg" }
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
          { size: "Cat5e", price: "₹25.50/m", stock: "Available", image: "/images/lan-cat5e.jpg" },
          { size: "Cat6", price: "₹35.80/m", stock: "Available", image: "/images/lan-cat6.jpg" },
          { size: "Cat6A", price: "₹55.20/m", stock: "Available", image: "/images/lan-cat6a.jpg" },
          { size: "Cat7", price: "₹75.40/m", stock: "Available", image: "/images/lan-cat7.jpg" },
          { size: "Cat8", price: "₹95.60/m", stock: "Available", image: "/images/lan-cat8.jpg" },
          { size: "Fiber Optic", price: "₹125.80/m", stock: "Available", image: "/images/lan-fiber.jpg" }
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
          { size: "0.5 sq.mm", price: "₹15.50/m", stock: "Available", image: "/images/automobile-0.5mm.jpg" },
          { size: "0.75 sq.mm", price: "₹22.80/m", stock: "Available", image: "/images/automobile-0.75mm.jpg" },
          { size: "1.0 sq.mm", price: "₹28.20/m", stock: "Available", image: "/images/automobile-1.0mm.jpg" },
          { size: "1.5 sq.mm", price: "₹38.40/m", stock: "Available", image: "/images/automobile-1.5mm.jpg" },
          { size: "2.5 sq.mm", price: "₹55.60/m", stock: "Available", image: "/images/automobile-2.5mm.jpg" },
          { size: "4.0 sq.mm", price: "₹85.80/m", stock: "Available", image: "/images/automobile-4.0mm.jpg" }
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
          { size: "2x2.5 sq.mm", price: "₹45.50/m", stock: "Available", image: "/images/pv-solar-2x2.5mm.jpg" },
          { size: "2x4.0 sq.mm", price: "₹65.80/m", stock: "Available", image: "/images/pv-solar-2x4.0mm.jpg" },
          { size: "2x6.0 sq.mm", price: "₹85.20/m", stock: "Available", image: "/images/pv-solar-2x6.0mm.jpg" },
          { size: "2x10.0 sq.mm", price: "₹125.40/m", stock: "Available", image: "/images/pv-solar-2x10.0mm.jpg" },
          { size: "2x16.0 sq.mm", price: "₹185.60/m", stock: "Available", image: "/images/pv-solar-2x16.0mm.jpg" },
          { size: "2x25.0 sq.mm", price: "₹285.80/m", stock: "Available", image: "/images/pv-solar-2x25.0mm.jpg" }
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
          { size: "RG-6", price: "₹25.50/m", stock: "Available", image: "/images/coaxial-rg6.jpg" },
          { size: "RG-11", price: "₹35.80/m", stock: "Available", image: "/images/coaxial-rg11.jpg" },
          { size: "RG-58", price: "₹15.20/m", stock: "Available", image: "/images/coaxial-rg58.jpg" },
          { size: "RG-59", price: "₹18.40/m", stock: "Available", image: "/images/coaxial-rg59.jpg" },
          { size: "RG-174", price: "₹12.60/m", stock: "Available", image: "/images/coaxial-rg174.jpg" },
          { size: "RG-213", price: "₹45.80/m", stock: "Available", image: "/images/coaxial-rg213.jpg" }
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
          { size: "2 Core", price: "₹45.50/m", stock: "Available", image: "/images/optical-2core.jpg" },
          { size: "4 Core", price: "₹65.80/m", stock: "Available", image: "/images/optical-4core.jpg" },
          { size: "6 Core", price: "₹85.20/m", stock: "Available", image: "/images/optical-6core.jpg" },
          { size: "8 Core", price: "₹105.40/m", stock: "Available", image: "/images/optical-8core.jpg" },
          { size: "12 Core", price: "₹145.60/m", stock: "Available", image: "/images/optical-12core.jpg" },
          { size: "24 Core", price: "₹285.80/m", stock: "Available", image: "/images/optical-24core.jpg" }
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
          { size: "2x1.5 sq.mm", price: "₹45.50/m", stock: "Available", image: "/images/control-2x1.5mm.jpg" },
          { size: "3x1.5 sq.mm", price: "₹65.80/m", stock: "Available", image: "/images/control-3x1.5mm.jpg" },
          { size: "4x1.5 sq.mm", price: "₹85.20/m", stock: "Available", image: "/images/control-4x1.5mm.jpg" },
          { size: "6x1.5 sq.mm", price: "₹125.40/m", stock: "Available", image: "/images/control-6x1.5mm.jpg" },
          { size: "8x1.5 sq.mm", price: "₹165.60/m", stock: "Available", image: "/images/control-8x1.5mm.jpg" },
          { size: "12x1.5 sq.mm", price: "₹245.80/m", stock: "Available", image: "/images/control-12x1.5mm.jpg" }
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
          { size: "10 Pair", price: "₹25.50/m", stock: "Available", image: "/images/telecom-10pair.jpg" },
          { size: "20 Pair", price: "₹45.80/m", stock: "Available", image: "/images/telecom-20pair.jpg" },
          { size: "50 Pair", price: "₹95.20/m", stock: "Available", image: "/images/telecom-50pair.jpg" },
          { size: "100 Pair", price: "₹185.40/m", stock: "Available", image: "/images/telecom-100pair.jpg" },
          { size: "200 Pair", price: "₹365.60/m", stock: "Available", image: "/images/telecom-200pair.jpg" },
          { size: "300 Pair", price: "₹545.80/m", stock: "Available", image: "/images/telecom-300pair.jpg" }
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
  };

  const openBusinessCard = () => {
    setIsBusinessCardOpen(true);
  };

  const closeBusinessCard = () => {
    setIsBusinessCardOpen(false);
  };

  const openBrochure = () => {
    // Open the brochure PDF directly in a new tab
    const pdfUrl = `${window.location.origin}/pdf/Anocab brochure.pdf`;
    const newWindow = window.open(pdfUrl, '_blank');
    if (!newWindow) {
      alert('Please allow pop-ups for this site to view the brochure');
    }
  };

  const openCompanyEmails = () => {
    setIsCompanyEmailsOpen(true);
  };

  const closeCompanyEmails = () => {
    setIsCompanyEmailsOpen(false);
  };

  const openCalculators = () => {
    setShowCalculators(!showCalculators);
  };

  const openHelpingCalculators = () => {
    setShowHelpingCalculators(!showHelpingCalculators);
  };

  // keep rendering more modals and UI below within the component

  // (component continues)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-6 pr-80">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, sectionIndex) => {
              const IconComponent = section.icon;
              return (
                <section key={section.id} id={section.id} className="scroll-mt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                  </div>

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
                          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                              ? "bg-gradient-to-b from-white to-blue-50/50 border-blue-100 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 hover:ring-2 hover:ring-blue-200/60"
                              : "bg-white border-gray-200 hover:bg-gray-50 hover:shadow-lg hover:scale-105 hover:-translate-y-1 hover:border-blue-200"}
                          `}
                          onClick={() => handleToolClick(tool)}
                        >
                          <div className="flex flex-col text-left space-y-3">
                            {section.id === "products" ? (
                              tool.imageUrl ? (
                                <div className="relative w-full h-24 mb-2 rounded-lg overflow-hidden bg-gray-100">
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
                                  ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                                  : "bg-gray-100 group-hover:bg-blue-100"}
                             `}>
                                <ToolIcon className={`h-6 w-6 transition-all duration-300 ease-in-out group-hover:rotate-3 
                                  ${section.id === "technical-size-chart" ? "text-blue-600" : "text-gray-600 group-hover:text-blue-600"}
                                `} />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className={`font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 ${
                                section.id === "technical-size-chart" ? "text-sm leading-tight" : "text-sm"
                              }`}>
                                {tool.name}
                              </h3>
                              <p className={`text-xs leading-relaxed transition-colors duration-300 
                                ${section.id === "technical-size-chart" ? "text-gray-600 group-hover:text-gray-700" : "text-gray-500 group-hover:text-gray-700"}
                              `}>{tool.description}</p>
                              <p className={`text-xs leading-relaxed transition-colors duration-300 
                                ${section.id === "technical-size-chart" ? "text-gray-600 group-hover:text-gray-700" : "text-gray-500 group-hover:text-gray-700"}
                              `}>{tool.description}</p>
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
      {/* Technical Calculations Modal */}
      {isTechnicalCalculationsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Technical Calculations</h2>
              <button 
                onClick={closeTechnicalCalculations}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Carrying Capacity Calculator</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conductor Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Copper</option>
                        <option>Aluminium</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                      <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Conductor Area (mm²)</label>
                      <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="100" />
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Calculate
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Results</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Capacity:</span>
                        <span className="font-semibold">250 A</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resistance:</span>
                        <span className="font-semibold">0.172 Ω</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Other Modals - Simplified for now */}
      {isConversionCalculationsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Conversion Calculations</h2>
              <button onClick={closeConversionCalculations} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Conversion calculation tools will be implemented here.</p>
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
                  <h2 className="text-xl font-bold text-gray-900">Image Preview</h2>
                  </div>
                </div>
                <button onClick={closeFileViewer} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Preview</h3>
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
                    <img 
                      src={selectedFile[currentSlide]}
                      alt={`Preview ${currentSlide + 1}`}
                      className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-sm"
                    />
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
      <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
        <div className="p-6">
          {/* Company Details Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Company Details
            </h2>
          </div>

          {/* Business Card */}
          <div className="mb-4">
            <div 
              className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={openBusinessCard}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">Business Card</h3>
                  <p className="text-xs text-gray-600">Company contact information</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showBusinessCard ? 'rotate-90' : ''}`} />
              </div>
            </div>
            
            {showBusinessCard && (
              <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{selectedLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">+91 9876543210</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">info@anodeelectric.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Industrial Area, Mumbai</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Brochure */}
          <div className="mb-4">
            <div 
              className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={openBrochure}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">Brochure</h3>
                  <p className="text-xs text-gray-600">Company brochure and catalog</p>
                </div>
              </div>
            </div>
          </div>

          {/* GST Details */}
          <div className="mb-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">GST Details</h3>
                  <p className="text-xs text-gray-600">Tax registration information</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-medium text-gray-600">GSTIN:</span>
                  <span className="text-gray-900 font-mono text-xs">27ABCDE1234F1Z5</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-medium text-gray-600">PAN:</span>
                  <span className="text-gray-900 font-mono text-xs">ABCDE1234F</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-600">State:</span>
                  <span className="text-gray-900">Maharashtra</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculators */}
          <div className="mb-4">
            <div 
              className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={openCalculators}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">Calculators</h3>
                  <p className="text-xs text-gray-600">Mathematical and conversion tools</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showCalculators ? 'rotate-90' : ''}`} />
              </div>
            </div>
            
            {showCalculators && (
              <div className="mt-3 space-y-2">
                {[
                  { name: "Basic Calculator", description: "Standard calculations", icon: Calculator },
                  { name: "Scientific Calculator", description: "Advanced mathematical functions", icon: Settings },
                  { name: "Unit Converter", description: "Convert between units", icon: Wrench },
                  { name: "Financial Calculator", description: "Financial computations", icon: DollarSign },
                  { name: "Statistics Calculator", description: "Statistical analysis", icon: BarChart3 },
                ].map((calculator, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-orange-50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => handleToolClick(calculator)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-100">
                        <calculator.icon className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{calculator.name}</span>
                        <p className="text-xs text-gray-500 mt-1">{calculator.description}</p>
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
              onClick={openHelpingCalculators}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">Helping Calculators</h3>
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
                    onClick={() => handleToolClick(calculator)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-100">
                        <calculator.icon className="h-4 w-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{calculator.name}</span>
                        <p className="text-xs text-gray-500 mt-1">{calculator.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <h3 className="font-semibold text-gray-900 text-sm">Company Emails</h3>
                  <p className="text-xs text-gray-600">All company email addresses</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showCompanyEmails ? 'rotate-90' : ''}`} />
              </div>
            </div>
            
            {showCompanyEmails && (
              <div className="mt-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="space-y-2">
                  <div className="text-sm">
                    <strong>General:</strong> info@anodeelectric.com
                  </div>
                  <div className="text-sm">
                    <strong>Sales:</strong> sales@anodeelectric.com
                  </div>
                  <div className="text-sm">
                    <strong>Support:</strong> support@anodeelectric.com
                  </div>
                  <div className="text-sm">
                    <strong>Accounts:</strong> accounts@anodeelectric.com
                  </div>
                </div>
              </div>
            )}
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
                  <h3 className="font-semibold text-gray-900 text-sm">Location</h3>
                  <p className="text-xs text-gray-600">Select company location</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${showLocations ? 'rotate-90' : ''}`} />
              </div>
            </div>
            
            {showLocations && (
              <div className="mt-3 space-y-2">
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                    selectedLocation === "Anode Electric Private Limited" 
                      ? "bg-slate-50 border-slate-200 shadow-md" 
                      : "bg-white border-gray-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedLocation("Anode Electric Private Limited")}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Building className="h-4 w-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Anode Electric Private Limited</span>
                  </div>
                </div>
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
                    selectedLocation === "Samriddhi Industries" 
                      ? "bg-slate-50 border-slate-200 shadow-md" 
                      : "bg-white border-gray-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedLocation("Samriddhi Industries")}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Building className="h-4 w-4 text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">Samriddhi Industries</span>
                  </div>
                </div>
              </div>
            )}
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

              {/* Technical Specifications Section - Only for Aerial Bunch Cable */}
              {selectedProduct === "Aerial Bunch Cable" && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Technical Specifications
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-6 flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
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
                      </div>
                      <div className="lg:w-1/3 flex flex-col items-center">
                        <div className="w-full h-64 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                          <img 
                            src="/images/products/aerial bunch cable.jpeg"
                            alt="Aerial Bunch Cable"
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
                              <p className="text-sm">Aerial Bunch Cable</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center">Aerial Bunch Cable Sample</p>
                        
                        <div className="mt-6 w-full">
                          <h4 className="font-semibold text-gray-800 mb-3">Standards Compliance:</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• IS 14255: 1995 (Reaffirmed 2020)</li>
                            <li>• IS 8130: 1984 (Reaffirmed 2021)</li>
                            <li>• IS 1554 (Part-1): 1988 (Reaffirmed 2021)</li>
                            <li>• IS 7098 (Part-1): 1988 (Reaffirmed 2021)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Identification Section - Only for ACSR */}
              {selectedProduct === "Aluminium Conductor Galvanized Steel Reinforced" && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    Identification
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
                              <li>100% pure EC grade aluminium</li>
                              <li>Heavy duty cable suitable for outdoor installation</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-full h-64 bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <img 
                            src="/images/products/acsr-conductor.jpg"
                            alt="ACSR Conductor"
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
                    onClick={() => {
                      const htmlContent = `
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>${productData.title} - Price List</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            h1 { color: #2563eb; margin-bottom: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
                            th { background-color: #f3f4f6; font-weight: 600; color: #374151; }
                            .header { text-align: center; margin-bottom: 30px; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h1>${getProductData(selectedProduct).title} - Price List</h1>
                            <p>Generated on ${new Date().toLocaleDateString()}</p>
                          </div>
                          <table>
                            <thead>
                              <tr>
                                <th>Image</th>
                                <th>Size</th>
                                <th>Price per Meter</th>
                                <th>Stock Status</th>
                                <th>Add Images</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${getProductData(selectedProduct).priceList.map(item => 
                                `<tr><td><img src="${item.image}" alt="${getProductData(selectedProduct).title} ${item.size}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" /></td><td>${item.size}</td><td>${item.price}</td><td>${item.stock}</td><td>${item.stock === "Available" ? "<button className='w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-300 cursor-not-allowed' title='Add images (coming soon)' disabled><Plus className='h-4 w-4' /></button>" : ""}</td></tr>`
                              ).join('')}
                            </tbody>
                          </table>
                        </body>
                        </html>
                      `;
                      const blob = new Blob([htmlContent], { type: 'text/html' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${getProductData(selectedProduct).title.toLowerCase().replace(/\s+/g, '-')}-price-list.html`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
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
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-200">Size</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-200">Price per Meter</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-200">Stock Status</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-200">Image</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700 border border-gray-200">Add Images</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getProductData(selectedProduct).priceList.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 border border-gray-200 text-sm font-medium">{item.size}</td>
                          <td className="px-4 py-3 border border-gray-200 text-sm text-blue-600 font-semibold">{item.price}</td>
                          <td className="px-4 py-3 border border-gray-200 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.stock === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 border border-gray-200">
                            <div 
                              className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" 
                              title={((productImages[selectedProduct]?.[index]?.length > 0)) ? "Click to view images" : "No image uploaded"}
                              onClick={() => handleImageClick(index)}
                            >
                              {(productImages[selectedProduct]?.[index]?.length > 0) ? (
                                <img 
                                  src={productImages[selectedProduct][index][productImages[selectedProduct][index].length - 1]} 
                                  alt={`${item.size} image`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <Image className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 border border-gray-200">
                            <button 
                              className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors" 
                              title="Add image"
                              onClick={() => handleImageUpload(index)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </td>
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
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload-input"
              />

              {/* Image Upload Modal */}
              {isImageUploadOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full">
                    <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
                    <p className="text-gray-600 mb-4">Select an image file to upload for this cable size.</p>
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
                  'MESSENGER Φ': ['sqmm','strands','conductorDia','insulationThickness','maxResistance','maxBreakingLoad']
                };
                
                return (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      Technical Data
                    </h3>
                    <div className="space-y-6">
                      {techTables.tables.map((tbl, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800">{tbl.title}</div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                              <thead>
                                <tr>
                                  {tbl.columns.map((col, cIdx) => (
                                    <th key={cIdx} className="px-4 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {tbl.rows.map((row, rIdx) => {
                                  const order = tableKeyOrders[tbl.title] || Object.keys(row);
                                  return (
                                    <tr key={rIdx} className="hover:bg-gray-50">
                                      {order.map((key, kIdx) => (
                                        <td key={kIdx} className="px-4 py-2 text-sm text-gray-800 border border-gray-200">{row[key]}</td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                      {techTables.note && (
                        <div className="text-xs text-gray-600">NOTE: {techTables.note}</div>
                      )}
                    </div>
                  </div>
                );
              })()}
              {/* Costing Calculator Section - For Aerial Bunch Cable and ACSR */}
              {(selectedProduct === "Aerial Bunch Cable" || selectedProduct === "Aluminium Conductor Galvanized Steel Reinforced") && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Costing Calculator
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-end items-center px-3 py-2 bg-gray-50 border-b">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700" onClick={() => {/* TODO: compute Costing */}}>
                      Calculate
                    </button>
                  </div>
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
                            <input type="number" defaultValue="3" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" defaultValue="7" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" defaultValue="2.12" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">7.091</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">25 SQMM</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">203/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">54775</td>
                        </tr>
                        {/* PH INN INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">PH INN INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" defaultValue="1.20" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">6.36 mm</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">OD 8.76</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">80/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">9640</td>
                        </tr>
                        {/* PH OUT INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">PH OUT INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">8.76 mm</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">OD 8.76</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">0/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">0</td>
                        </tr>
                        {/* STREET LIGHT Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">STREET LIGHT</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" defaultValue="1" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" defaultValue="7" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" defaultValue="1.70" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">7.091</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">16 SQMM</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">43/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">11740</td>
                        </tr>
                        {/* STL INN INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">STL INN INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" defaultValue="1.20" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">5.10 mm</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">OD 7.50</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">22/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">2678</td>
                        </tr>
                        {/* STL OUT INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">STL OUT INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">7.50 mm</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">OD 7.50</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">0/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">0</td>
                        </tr>
                        {/* MESSENGER Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">MESSENGER</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" defaultValue="1" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" defaultValue="7" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" step="0.01" defaultValue="2.12" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">7.091</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">25 SQMM</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">68/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">18258</td>
                        </tr>
                        {/* MSN INN INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">MSN INN INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">6.36 mm</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">OD 6.36</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">0/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">0</td>
                        </tr>
                        {/* MSN OUT INS Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">MSN OUT INS</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">6.36 mm</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">OD 6.36</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">0/KG</td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">0</td>
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
                          <span className="text-xs text-green-600 font-semibold">20 %</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Reduction Gauge Calculator Section - For Aerial Bunch Cable and ACSR */}
              {(selectedProduct === "Aerial Bunch Cable" || selectedProduct === "Aluminium Conductor Galvanized Steel Reinforced") && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Reduction Gauge Calculator
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-end items-center px-3 py-2 bg-gray-50 border-b">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700" onClick={() => {/* TODO: compute Reduction Gauge */}}>
                      Calculate
                    </button>
                  </div>
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
                            <input type="text" defaultValue="25 SQMM" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">7</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">2.02 MM</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">1.30 MM</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">8.67 MM</td>
                        </tr>
                        {/* STREET LIGHT Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">STREET LIGHT</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="text" defaultValue="16 SQMM" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="number" defaultValue="10" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">7</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">1.62 MM</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">1.30 MM</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">7.46 MM</td>
                        </tr>
                        {/* MESSENGER Row */}
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200 font-medium">MESSENGER</td>
                          <td className="px-3 py-2 border border-gray-200">
                            <input type="text" defaultValue="25 SQMM" className="w-full text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-800 border border-gray-200">-</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">7</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">2.02 MM</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">1.30 MM</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">8.67 MM</td>
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
              {/* Wire Selection Calculator Section - For Aerial Bunch Cable and ACSR */}
              {(selectedProduct === "Aerial Bunch Cable" || selectedProduct === "Aluminium Conductor Galvanized Steel Reinforced") && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Wire Selection Calculator
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex justify-end items-center px-3 py-2 bg-gray-50 border-b">
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700" onClick={() => {/* TODO: compute Wire Selection */}}>
                      Calculate
                    </button>
                  </div>
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
                            <div className="flex items-center">
                              <input type="number" defaultValue="3" className="w-16 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center">
                              <input type="number" step="0.01" defaultValue="20.00" className="w-20 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              <select className="ml-2 text-xs text-red-600 border-0 focus:ring-0 focus:outline-none bg-transparent font-semibold">
                                <option>HP</option>
                                <option>KW</option>
                              </select>
                              <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                            </div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div className="flex items-center">
                              <input type="number" defaultValue="500" className="w-20 text-sm text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                              <select className="ml-2 text-xs text-red-600 border-0 focus:ring-0 focus:outline-none bg-transparent font-semibold">
                                <option>MTR</option>
                                <option>FT</option>
                              </select>
                              <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                            </div>
                          </td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">29.08</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">20.21</td>
                          <td className="px-3 py-2 text-sm text-blue-600 border border-gray-200 font-semibold">25 SQMM</td>
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

              {/* Technical Data Section - Only for Product Cards */}
              {getProductData(selectedProduct).technicalData && Object.keys(getProductData(selectedProduct).technicalData).length > 0 && (
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
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Approvals</h4>
                  </div>
                  <div className="space-y-2">
                    {(() => {
                      // Map PDFs to products
                      const pdfMappings = {
                        "Aerial Bunch Cable": "aerial bunch cable, bis certificate .pdf",
                        "All Aluminium Alloy Conductor": "all aluminium alloy conductor,bis certificate .pdf",
                        "Aluminium Conductor Galvanized Steel Reinforced": "aluminium conductor galvanised steel reinforced, bis certificate.pdf",
                        "Multi Core XLPE Insulated Aluminium Unarmoured Cable": "multicore xlpe insulated aluminium unrmoured cable,bis certificate.pdf"
                      };
                      
                      const productName = selectedProduct; // Use the original product name from tools array
                      const relevantPdfs = [];
                      
                      // Add product-specific BIS certificate if available
                      if (pdfMappings[productName]) {
                        relevantPdfs.push({
                          type: `BIS Certification - ${productName}`,
                          status: "Valid",
                          expiry: "2025-12-31",
                          file: pdfMappings[productName]
                        });
                      }
                      
                      // Add general certifications
                      relevantPdfs.push(
                        { type: "ISO 9001:2015", status: "Valid", expiry: "2024-06-30", file: "ISO_9001_2015_Certificate.pdf" },
                        { type: "CE Marking", status: "Valid", expiry: "2025-03-15", file: "CE_Marking_Certificate.pdf" }
                      );
                      
                      return relevantPdfs.map((approval, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{approval.type}</div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                // Check if PDF exists for this product
                                if (pdfMappings[productName] && approval.file === pdfMappings[productName]) {
                                  const pdfUrl = `${window.location.origin}/pdf/${approval.file}`;
                                  console.log('Downloading PDF:', pdfUrl);
                                  
                                  const link = document.createElement('a');
                                  link.href = pdfUrl;
                                  link.download = approval.file;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } else if (approval.type.includes('ISO') || approval.type.includes('CE')) {
                                  // For general certifications, show placeholder message
                                  alert('Certificate not available for download');
                                } else {
                                  // For products without PDFs, do nothing
                                  return;
                                }
                              }}
                              className={`${pdfMappings[productName] && approval.file === pdfMappings[productName] ? 'text-green-600 hover:text-green-800' : 'text-gray-400 cursor-not-allowed'} transition-colors`}
                              title={pdfMappings[productName] && approval.file === pdfMappings[productName] ? "Download PDF" : "PDF not available"}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                // Check if PDF exists for this product
                                if (pdfMappings[productName] && approval.file === pdfMappings[productName]) {
                                  const pdfUrl = `${window.location.origin}/pdf/${approval.file}`;
                                  console.log('Opening PDF:', pdfUrl);
                                  
                                  const newWindow = window.open(pdfUrl, '_blank');
                                  if (!newWindow) {
                                    alert('Please allow pop-ups for this site to view the PDF');
                                  }
                                } else if (approval.type.includes('ISO') || approval.type.includes('CE')) {
                                  // For general certifications, show placeholder message
                                  alert('Certificate not available for viewing');
                                } else {
                                  // For products without PDFs, do nothing
                                  return;
                                }
                              }}
                              className={`${pdfMappings[productName] && approval.file === pdfMappings[productName] ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'} transition-colors`}
                              title={pdfMappings[productName] && approval.file === pdfMappings[productName] ? "View Document" : "PDF not available"}
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
                <div className="p-4 border border-gray-200 rounded-lg">
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
                <div className="p-4 border border-gray-200 rounded-lg">
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
                <div className="p-4 border border-gray-200 rounded-lg">
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
                  <h2 className="text-xl font-bold text-gray-900">Image Preview</h2>
                  </div>
                </div>
                <button onClick={closeFileViewer} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Preview</h3>
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
                    <img 
                      src={selectedFile[currentSlide]}
                      alt={`Preview ${currentSlide + 1}`}
                      className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-sm"
                    />
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
    </div>
  );
};

export default ToolboxInterface;