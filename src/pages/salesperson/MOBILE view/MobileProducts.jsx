import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, Box, Eye, Edit, Trash2, Calendar, Star, Package, Image, CreditCard, Wrench, Calculator, ChevronDown, CheckCircle, Shield, FileText, Download, MoreVertical, User, Phone, Mail, MapPin, Building, ChevronRight, DollarSign, Settings, BarChart3, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

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
    'pvc insulated submersible cable'
  ];
  
  // Check if product has data
  const hasProductData = (productName) => {
    const nameLower = productName.toLowerCase();
    return productsWithData.some(allowed => nameLower.includes(allowed));
  };
  // Image upload state for Price List
  const [priceImages, setPriceImages] = useState({}); // { [rowIndex]: [dataUrl, ...] }
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  // Approvals: BIS doc preview (uses desktop mapping)
  const [bisDocUrl, setBisDocUrl] = useState(() => {
    // Desktop mapping for BIS PDFs
    const pdfMappings = {
      'Aerial Bunch Cable': 'aerial bunch cable, bis certificate .pdf',
      'All Aluminium Alloy Conductor': 'all aluminium alloy conductor,bis certificate .pdf',
      'Aluminium Conductor Galvanized Steel Reinforced': 'aluminium conductor galvanised steel reinforced, bis certificate.pdf',
      'Multi Core XLPE Insulated Aluminium Unarmoured Cable': 'multicore xlpe insulated aluminium unrmoured cable,bis certificate.pdf'
    };
    const file = pdfMappings['Aerial Bunch Cable'];
    return file ? `${window.location.origin}/pdf/${file}` : '';
  });
  const [bisPreviewOpen, setBisPreviewOpen] = useState(false);

  // Right Sidebar state
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("IT Park, Jabalpur");
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [showCalculators, setShowCalculators] = useState(false);
  const [showHelpingCalculators, setShowHelpingCalculators] = useState(false);
  const [showLocations, setShowLocations] = useState(false);
  const [isBusinessCardModalOpen, setIsBusinessCardModalOpen] = useState(false);
  const [isCompanyEmailsModalOpen, setIsCompanyEmailsModalOpen] = useState(false);
  const businessCardRef = useRef(null);

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
    { size: 'MOLE - 15 SQMM', price: '', stock: '', image: '' },
    { size: 'SQUIRREL - 22 SQMM', price: '', stock: '', image: '' },
    { size: 'WEASEL - 34 SQMM', price: '', stock: '', image: '' },
    { size: 'RABBIT - 55 SQMM', price: '', stock: '', image: '' },
    { size: 'RACCOON - 80 SQMM', price: '', stock: '', image: '' },
    { size: 'DOG - 100 SQMM', price: '', stock: '', image: '' },
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

  // Handle image upload for price list
  const handleImageUpload = (index) => {
    setUploadIndex(index);
    const fileInput = document.getElementById('mobile-price-image-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  // Handle image click to view/preview
  const handleImageClick = (index) => {
    if (priceImages[index]?.length > 0) {
      setPreviewUrl(priceImages[index][priceImages[index].length - 1]);
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
                  ) : selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ? (
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
                        <h4 className="text-base font-semibold text-gray-800 mb-2">Features</h4>
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
                        <h4 className="text-base font-semibold text-gray-800 mb-3">Technical Data</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-sm font-semibold text-gray-800">ISO & BIS Certification</span>
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Size</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Price per Meter</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Stock Status</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Image</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 border border-gray-200">Add Images</th>
                        </tr>
                      </thead>
                      <tbody>
                      {(selectedProduct.name.toLowerCase().includes('aerial bunch cable') ? abPriceList : 
                        selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ? acsrPriceList :
                        selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor') ? aaacPriceList :
                        selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable') ? pvcSubmersiblePriceList : []).map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 border border-gray-200 text-xs font-medium">{item.size}</td>
                          <td className="px-3 py-2 border border-gray-200 text-xs text-blue-600 font-semibold">{item.price || '-'}</td>
                          <td className="px-3 py-2 border border-gray-200 text-xs">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.stock === "Available" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}>
                              {item.stock || '-'}
                              </span>
                            </td>
                          <td className="px-3 py-2 border border-gray-200">
                            <div 
                              className={`w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center ${priceImages[index]?.length > 0 ? 'cursor-pointer hover:bg-gray-200 transition-colors' : ''}`}
                              onClick={() => handleImageClick(index)}
                              title={priceImages[index]?.length > 0 ? "Click to view image" : "No image uploaded"}
                            >
                              {(priceImages[index]?.length > 0) ? (
                                <img 
                                  src={priceImages[index][priceImages[index].length - 1]} 
                                  alt={`${item.size} image`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <Image className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 border border-gray-200">
                              <button
                                className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors" 
                                title="Add image"
                                onClick={() => handleImageUpload(index)}
                              >
                                <Plus className="h-3 w-3" />
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
                  ) : (
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
                    
                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-800">{tbl.title}</div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white">
                    <thead>
                              <tr>
                                {tbl.columns.map((col, cIdx) => (
                                  <th key={cIdx} className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200 whitespace-nowrap">{col}</th>
                                ))}
                      </tr>
                    </thead>
                    <tbody>
                              {tbl.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="hover:bg-gray-50">
                                  {order.map((key, kIdx) => (
                                    <td key={kIdx} className="px-2 py-2 text-xs text-gray-800 border border-gray-200">{row[key] || '-'}</td>
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

                {/* Costing Calculator - Show for AB Cable, ACSR, AAAC, and PVC Submersible */}
                {(selectedProduct.name.toLowerCase().includes('aerial bunch cable') || 
                  selectedProduct.name.toLowerCase().includes('aluminium conductor galvanized steel reinforced') ||
                  selectedProduct.name.toLowerCase().includes('all aluminium alloy conductor') ||
                  selectedProduct.name.toLowerCase().includes('pvc insulated submersible cable')) && (
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
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">AREA</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">AREA</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">REDUCTION %</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">STRAND</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">WIRE</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">INSULATION</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-gray-600 border border-gray-200">OUTER DIA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* PHASE Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">PHASE</td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="text" defaultValue="25 SQMM" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">7</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">2.02 MM</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">1.30 MM</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">8.67 MM</td>
                      </tr>
                      {/* STREET LIGHT Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">STREET LIGHT</td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="text" defaultValue="16 SQMM" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="number" defaultValue="10" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">7</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">1.62 MM</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">1.30 MM</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">7.46 MM</td>
                      </tr>
                      {/* MESSENGER Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200 font-medium">MESSENGER</td>
                        <td className="px-2 py-2 border border-gray-200">
                          <input type="text" defaultValue="25 SQMM" className="w-full text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                        </td>
                        <td className="px-2 py-2 text-xs text-gray-800 border border-gray-200">-</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">7</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">2.02 MM</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">1.30 MM</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">8.67 MM</td>
                      </tr>
                    </tbody>
                  </table>
                        </div>
                <div className="px-4 py-2 bg-gray-50 text-xs text-gray-600">
                  NOTE: UP TO & INCLUDED 150 SQMM.
                  </div>
                </div>

              {/* Wire Selection Calculator */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-600" />
                    Wire Selection Calculator
                  </h2>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700" onClick={() => {/* TODO: compute Wire Selection */}}>
                    Calculate
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-black">
                        <th className="px-2 py-2 text-left text-xs font-semibold text-white border border-gray-200">PHASE Φ</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-white border border-gray-200">POWER CONSUMPTION</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-white border border-gray-200">LENGTH OF CABLE</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-white border border-gray-200">CURRENT (Ω)</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-white border border-gray-200">ACTUAL GAUGE</th>
                        <th className="px-2 py-2 text-left text-xs font-semibold text-white border border-gray-200">WIRE SIZE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50">
                        <td className="px-2 py-2 border border-gray-200">
                          <div className="flex items-center">
                            <input type="number" defaultValue="3" className="w-12 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                            <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
                          </div>
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <div className="flex items-center">
                            <input type="number" step="0.01" defaultValue="20.00" className="w-16 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                            <select className="ml-1 text-xs text-red-600 border-0 focus:ring-0 focus:outline-none bg-transparent font-semibold">
                              <option>HP</option>
                              <option>KW</option>
                            </select>
                            <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
                          </div>
                        </td>
                        <td className="px-2 py-2 border border-gray-200">
                          <div className="flex items-center">
                            <input type="number" defaultValue="500" className="w-16 text-xs text-red-600 font-semibold border-0 focus:ring-0 focus:outline-none" />
                            <select className="ml-1 text-xs text-red-600 border-0 focus:ring-0 focus:outline-none bg-transparent font-semibold">
                              <option>MTR</option>
                              <option>FT</option>
                            </select>
                            <ChevronDown className="h-3 w-3 text-gray-400 ml-1" />
                  </div>
                        </td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">29.08</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">20.21</td>
                        <td className="px-2 py-2 text-xs text-blue-600 border border-gray-200 font-semibold">25 SQMM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

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
                      <li>• Phase conductors: 1, 2, or 3 ridges for identification</li>
                      <li>• Neutral conductors: 4 ridges for identification</li>
                      <li>• Street lighting conductor: No identification marks</li>
                      <li>• Messenger conductor: No identification marks (if insulated)</li>
                    </ul>
                  </div>
                </div>
              </div>
              )}

              {/* Technical Documents */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Technical Documents</h2>
                  </div>
                <div className="p-4 space-y-4">
                  {/* Approvals */}
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">Approvals</h4>
                          </div>
                    <div className="space-y-2">
                      {(() => {
                        const pdfMappings = {
                          "Aerial Bunch Cable": "aerial bunch cable, bis certificate .pdf",
                          "All Aluminium Alloy Conductor": "all aluminium alloy conductor,bis certificate .pdf",
                          "Aluminium Conductor Galvanized Steel Reinforced": "aluminium conductor galvanised steel reinforced, bis certificate.pdf",
                          "Multi Core XLPE Insulated Aluminium Unarmoured Cable": "multicore xlpe insulated aluminium unrmoured cable,bis certificate.pdf",
                          "PVC Insulated Submersible Cable": "pvc insulated submersible cable, bis certificate .pdf"
                        };
                        
                        // List of products that actually have certificates uploaded and available
                        // Buttons will be disabled for products not in this list
                        const availableCertificates = [
                          "Aerial Bunch Cable",
                          "All Aluminium Alloy Conductor",
                          "Aluminium Conductor Galvanized Steel Reinforced",
                          "Multi Core XLPE Insulated Aluminium Unarmoured Cable"
                          // "PVC Insulated Submersible Cable" - certificate not uploaded yet, buttons will be disabled
                        ];
                        
                        const productName = selectedProduct?.name || "";
                        const relevantPdfs = [];
                        
                        // Show BIS certificate for all products in pdfMappings, but buttons will be disabled if not in availableCertificates
                        if (pdfMappings[productName]) {
                          relevantPdfs.push({
                            type: `BIS Certification - ${productName}`,
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
                          <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium text-xs">{approval.type}</div>
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
                                    
                                    if (pdfMappings[productName] && approval.file === pdfMappings[productName]) {
                                      const pdfUrl = `${window.location.origin}/pdf/${approval.file}`;
                                      
                                      // Verify PDF exists before downloading
                                      try {
                                        const response = await fetch(pdfUrl, { method: 'HEAD' });
                                        if (response.ok) {
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
                                    } else {
                                      alert('Certificate not available for download');
                                    }
                                  }}
                                  disabled={approval.isAvailable === false}
                                  className={`${approval.isAvailable ? 'text-green-600 hover:text-green-800 cursor-pointer' : 'text-gray-400 cursor-not-allowed opacity-50'} transition-colors`}
                                  title={approval.isAvailable ? "Download PDF" : "PDF not available"}
                                >
                                  <Download className="h-3 w-3" />
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
                                    
                                    if (pdfMappings[productName] && approval.file === pdfMappings[productName]) {
                                      const pdfUrl = `${window.location.origin}/pdf/${approval.file}`;
                                      
                                      // Verify PDF exists before opening
                                      try {
                                        const response = await fetch(pdfUrl, { method: 'HEAD' });
                                        if (response.ok) {
                                          setBisDocUrl(pdfUrl);
                                          setBisPreviewOpen(true);
                                        } else {
                                          alert('Certificate not available for viewing. The file does not exist.');
                                        }
                                      } catch (error) {
                                        console.error('Error checking PDF:', error);
                                        alert('Certificate not available for viewing. The file does not exist.');
                                      }
                                    } else {
                                      alert('Certificate not available for viewing');
                                    }
                                  }}
                                  disabled={approval.isAvailable === false}
                                  className={`${approval.isAvailable ? 'text-blue-600 hover:text-blue-800 cursor-pointer' : 'text-gray-400 cursor-not-allowed opacity-50'} transition-colors`}
                                  title={approval.isAvailable ? "View Document" : "PDF not available"}
                                >
                                  <Eye className="h-3 w-3" />
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
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">Licenses</h4>
                  </div>
                    <div className="space-y-2">
                      {[
                        { type: "Manufacturing License", number: "ML/2023/001", status: "Active" },
                        { type: "Trade License", number: "TL/2023/045", status: "Active" }
                      ].map((license, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-xs">{license.type}</div>
                            <div className="flex gap-2">
                              <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                                <Download className="h-3 w-3" />
                              </span>
                              <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                                <Eye className="h-3 w-3" />
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
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">GTP</h4>
                  </div>
                    <div className="space-y-2">
                      {[
                        { process: "Raw Material Testing", status: "Completed", date: "2024-01-15" },
                        { process: "Conductor Testing", status: "Completed", date: "2024-01-16" },
                        { process: "Insulation Testing", status: "Completed", date: "2024-01-17" },
                        { process: "Final Inspection", status: "Completed", date: "2024-01-18" }
                      ].map((process, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-xs">{process.process}</div>
                            <div className="flex gap-2">
                              <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                                <Download className="h-3 w-3" />
                              </span>
                              <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                                <Eye className="h-3 w-3" />
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
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-gray-900 text-sm">Type Test</h4>
                  </div>
                    <div className="space-y-2">
                      {[
                        { test: "Electrical Properties", result: "Pass", certificate: "ET/2024/001" },
                        { test: "Mechanical Properties", result: "Pass", certificate: "MT/2024/001" },
                        { test: "Fire Resistance", result: "Pass", certificate: "FR/2024/001" },
                        { test: "Weather Resistance", result: "Pass", certificate: "WR/2024/001" }
                      ].map((test, index) => (
                        <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-xs">{test.test}</div>
                            <div className="flex gap-2">
                              <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                                <Download className="h-3 w-3" />
                              </span>
                              <span className="text-gray-300 cursor-not-allowed" title="Document not available">
                                <Eye className="h-3 w-3" />
                              </span>
                        </div>
                      </div>
                          <div className="text-xs text-gray-500 mb-1">{test.certificate}</div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            test.result === "Pass" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {test.result}
                          </span>
                      </div>
                    ))}
                  </div>
                </div>
                  </div>
                        </div>
                      </div>
                  </div>
                </div>
      )}

      {bisPreviewOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setBisPreviewOpen(false)}>
          <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] overflow-hidden" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-2 border-b">
              <div className="text-sm font-semibold">BIS Certification - Aerial Bunch Cable</div>
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
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
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
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewUrl("")}>
          <div className="bg-white rounded-lg w-full max-w-2xl h-[80vh] overflow-hidden" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-2 border-b">
              <div className="text-sm font-semibold">Image Preview</div>
              <button className="px-2 py-1 text-xs bg-gray-200 rounded" onClick={()=>setPreviewUrl("")}>Close</button>
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
              
              {/* Business Card & Brochure - Side by Side */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Business Card */}
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
                          <h3 className="font-semibold text-xs text-gray-900">Business Card</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brochure */}
                  <div className="flex-1">
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
              </div>

              {/* GST Details */}
              <div className="mb-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-purple-50 to-violet-50 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm">
                      <CreditCard className="h-5 w-5 text-white" />
                  </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">GST Details</h3>
                      <p className="text-xs text-gray-600">Tax registration information</p>
                    </div>
                  </div>
                  <div className="space-y-3">
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
                </div>
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

              {/* Calculators */}
              <div className="mb-4">
                <div 
                  className="p-4 rounded-xl border border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => setShowCalculators(!showCalculators)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900">Calculators</h3>
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
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-orange-100">
                            <calculator.icon className="h-4 w-4 text-orange-600" />
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
              <h3 className="text-sm font-semibold text-gray-900">Business Card</h3>
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
              <div ref={businessCardRef} className="w-96 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 flex flex-col mx-auto">
              {/* Header with Logo */}
              <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-white text-sm font-bold tracking-wide">ANODE ELECTRICAL</h2>
                  <p className="text-slate-300 text-xs italic">A Positive Connection...</p>
                </div>
                <img
                  src="/images/Anocab logo.png"
                  alt="Anocab Logo"
                  className="h-8 object-contain opacity-90"
                  style={{ filter: "brightness(0.9) saturate(0.8)" }}
                />
              </div>

              {/* Main Content */}
              <div className="flex-1 px-6 py-4 flex items-center gap-4 bg-white">
                <img
                  src="/images/profiles/ABHAY.png"
                  alt="Abhay Tiwari"
                  className="w-16 h-16 rounded border-2 border-blue-600 object-cover flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-avatar.png';
                  }}
                />

                <div className="flex-1">
                  <h1 className="text-lg font-bold text-slate-900">Abhay Tiwari</h1>
                  <p className="text-blue-600 font-semibold text-sm">Intern</p>
                  <p className="text-xs text-slate-600 mt-1">Electrical Systems & Design</p>
                </div>
              </div>

              {/* Footer with Contact */}
              <div className="bg-slate-50 px-6 py-3 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-3 text-xs text-slate-700">
                  <div className="min-w-0">
                    <p className="font-semibold text-blue-600 text-xs mb-1">📧</p>
                    <p className="text-xs text-slate-600 break-words leading-tight">abhu9513@gmail.com</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600 text-xs mb-1">📱</p>
                    <p className="text-xs text-slate-600">0000000000</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600 text-xs mb-1">📍</p>
                    <p className="text-xs text-slate-600">Jabalpur, MP</p>
                  </div>
                </div>
              </div>
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
            <div className="p-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">General Inquiries</h3>
                      <p className="text-sm text-gray-600">For general information and inquiries</p>
                    </div>
                  </div>
                  <div className="text-lg font-mono text-blue-600">
                    info@anodeelectric.com
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Mail className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Sales Department</h3>
                      <p className="text-sm text-gray-600">For sales inquiries and quotations</p>
                    </div>
                  </div>
                  <div className="text-lg font-mono text-green-600">
                    sales@anodeelectric.com
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Mail className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Technical Support</h3>
                      <p className="text-sm text-gray-600">For technical assistance and support</p>
                    </div>
                  </div>
                  <div className="text-lg font-mono text-orange-600">
                    support@anodeelectric.com
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Accounts Department</h3>
                      <p className="text-sm text-gray-600">For billing and account related queries</p>
                    </div>
                  </div>
                  <div className="text-lg font-mono text-purple-600">
                    accounts@anodeelectric.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for price list images */}
      <input
        type="file"
        id="mobile-price-image-input"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadIndex !== null) {
          const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result;
              if (dataUrl) {
                setPriceImages(prev => {
                  const newImages = { ...prev };
                  if (!newImages[uploadIndex]) newImages[uploadIndex] = [];
                  newImages[uploadIndex].push(dataUrl);
                  return newImages;
                });
              }
          };
          reader.readAsDataURL(file);
          }
          e.target.value = '';
          setUploadIndex(null);
        }}
      />
    </div>
  );
};

export default MobileProducts;

