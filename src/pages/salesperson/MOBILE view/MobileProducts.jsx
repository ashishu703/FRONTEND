import React, { useState } from 'react';
import { Search, Filter, Plus, Box, Eye, Edit, Trash2, Calendar, Star, Package, Image } from 'lucide-react';

const MobileProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
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

  // Product data matching the desktop toolbox interface
  const products = [
    { name: "Aerial Bunch Cable", description: "Overhead power distribution cable", imageUrl: "/images/products/aerial bunch cable.jpeg" },
    { name: "Aluminium Conductor Galvanized Steel Reinforced", description: "ACSR conductor for transmission lines", imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
    { name: "All Aluminium Alloy Conductor", description: "AAAC conductor for overhead lines", imageUrl: "/images/products/all aluminium alloy conductor.jpeg" },
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
    { name: "PVC Insulated Submersible Cable", description: "Water-resistant submersible cable", imageUrl: "/images/products/pvc insulated submersible cable.jpeg" },
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'cables' && product.name.toLowerCase().includes('cable')) ||
                           (selectedCategory === 'conductors' && product.name.toLowerCase().includes('conductor')) ||
                           (selectedCategory === 'wires' && product.name.toLowerCase().includes('wire'));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Product Toolbar</h1>
        <button className="p-2 bg-blue-600 text-white rounded-lg">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            className="group cursor-pointer bg-white rounded-xl p-3 shadow-sm border border-gray-100 transform transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => {
              if (product.name.toLowerCase().includes('aerial bunch cable')) {
                setSelectedProduct(product);
              }
            }}
          >
            {/* Product Image */}
            <div className="relative h-24 bg-gray-100 rounded-lg mb-3 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
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
              <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Detail Modal for Aerial Bunch Cable */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Technical Specifications</h2>
                <p className="text-xs text-gray-500">Aerial Bunch Cable</p>
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
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">REFERENCE</div>
                      <div className="text-sm text-gray-800">IS 14255:1995</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">CONDUCTOR</div>
                      <div className="text-sm text-gray-800">Class-2 as per IS-8130</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">MESSENGER</div>
                      <div className="text-sm text-gray-800">Aluminium alloy conductor as per IS-398 pt-4</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">FEATURES</div>
                      <ul className="text-sm text-gray-800 list-disc pl-4 space-y-1">
                        <li>UV radiation protected</li>
                        <li>Higher current carrying capacity</li>
                        <li>High temperature range -30°C to 90°C</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">RATED VOLTAGE</div>
                      <div className="text-sm text-gray-800">1100 volts</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">INSULATION</div>
                      <div className="text-sm text-gray-800">Cross link polythene insulated</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-gray-700">TEMPERATURE RANGE</div>
                      <div className="text-sm text-gray-800">-30°C to 90°C</div>
                    </div>
                  </div>
                </div>

                {/* Reduction Gauge Calculator */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Reduction Gauge Calculator</h3>
                    <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Calculate</button>
                  </div>
                  <div className="overflow-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-3 py-2 border-b">Area</th>
                          <th className="px-3 py-2 border-b">Area</th>
                          <th className="px-3 py-2 border-b">Reduction %</th>
                          <th className="px-3 py-2 border-b">Strand</th>
                          <th className="px-3 py-2 border-b">Wire</th>
                          <th className="px-3 py-2 border-b">Insulation</th>
                          <th className="px-3 py-2 border-b">Outer Dia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { a:'PHASE', a2:'25 SQMM', red:'-', s:'7', w:'2.02 MM', ins:'1.30 MM', od:'8.67 MM' },
                          { a:'STREET LIGHT', a2:'16 SQMM', red:'10', s:'7', w:'1.62 MM', ins:'1.30 MM', od:'7.46 MM' },
                          { a:'MESSENGER', a2:'25 SQMM', red:'-', s:'7', w:'2.02 MM', ins:'1.30 MM', od:'8.67 MM' },
                        ].map((r, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            <td className="px-3 py-2 border-b text-gray-800">{r.a}</td>
                            <td className="px-3 py-2 border-b text-red-600 font-semibold">{r.a2}</td>
                            <td className="px-3 py-2 border-b text-red-600 font-semibold">{r.red}</td>
                            <td className="px-3 py-2 border-b text-gray-800">{r.s}</td>
                            <td className="px-3 py-2 border-b text-blue-700 font-semibold">{r.w}</td>
                            <td className="px-3 py-2 border-b text-blue-700 font-semibold">{r.ins}</td>
                            <td className="px-3 py-2 border-b text-blue-700 font-semibold">{r.od}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-2 text-[11px] text-gray-500 border-t">NOTE: UP TO & INCLUDED 150 SQMM.</div>
                </div>

              {/* Wire Selection Calculator */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">Wire Selection Calculator</h3>
                  <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Calculate</button>
                </div>
                <div className="overflow-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="px-3 py-2">PHASE Φ</th>
                        <th className="px-3 py-2">POWER CONSUMPTION</th>
                        <th className="px-3 py-2">LENGTH OF CABLE</th>
                        <th className="px-3 py-2">CURRENT (Ω)</th>
                        <th className="px-3 py-2">ACTUAL GAUGE</th>
                        <th className="px-3 py-2">WIRE SIZE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white">
                        <td className="px-3 py-3 text-red-600 font-semibold">3</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 font-semibold">20.00</span>
                            <span className="text-gray-600">HP</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 font-semibold">500</span>
                            <span className="text-gray-600">MTR</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-blue-700 font-semibold">29.08</td>
                        <td className="px-3 py-3 text-blue-700 font-semibold">20.21</td>
                        <td className="px-3 py-3 text-blue-700 font-semibold">25 SQMM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Core Identification */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">CORE IDENTIFICATION:</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    The phase conductors shall be provided with one, two or three 'ridges' and Outer neutral insulated conductors,
                    if provided, shall have four 'ridges' as shown in Fig. I for quick identification. The street lighting conductor
                    and messenger conductor (if insulated) shall not have any identification mark.
                  </p>
                  <div className="w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden p-3 flex items-center justify-center">
                    <img
                      src="/images/core-identification.png"
                      alt="Core Identification"
                      className="w-full max-w-xl h-auto object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Key Points:</h4>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
                      <li>Phase conductors: 1, 2, or 3 ridges for identification</li>
                      <li>Neutral conductors: 4 ridges for identification</li>
                      <li>Street lighting conductor: No identification marks</li>
                      <li>Messenger conductor: No identification marks (if insulated)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Approvals, Licenses, GTP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Approvals */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center text-blue-600 text-xs">✓</span>
                    <h3 className="text-sm font-semibold text-gray-900">Approvals</h3>
                  </div>
                  <div className="divide-y">
                    {[{
                      name:'BIS Certification - Aerial Bunch Cable', status:'Valid', date:'2025-12-31', isBIS:true
                    },{
                      name:'ISO 9001:2015', status:'Valid', date:'2024-06-30'
                    },{
                      name:'CE Marking', status:'Valid', date:'2025-03-15'
                    }].map((a,i)=> (
                      <div key={i} className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">{a.name}</div>
                            <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">{a.status}</span>
                          </div>
                          {a.isBIS && (
                            <div className="flex items-center gap-2">
                              <button
                                className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-600"
                                title="View BIS document"
                                onClick={() => setBisPreviewOpen(true)}
                              >View</button>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{a.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Licenses */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center text-blue-600 text-xs">🛡</span>
                    <h3 className="text-sm font-semibold text-gray-900">Licenses</h3>
                  </div>
                  <div className="divide-y">
                    {[{
                      title:'Manufacturing License', id:'ML/2023/001', status:'Active'
                    },{
                      title:'Trade License', id:'TL/2023/045', status:'Active'
                    }].map((l,i)=> (
                      <div key={i} className="p-3">
                        <div className="text-sm text-gray-900">{l.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{l.id}</div>
                        <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">{l.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GTP */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-blue-500 flex items-center justify-center text-blue-600 text-xs">🔧</span>
                    <h3 className="text-sm font-semibold text-gray-900">GTP</h3>
                  </div>
                  <div className="divide-y">
                    {[{
                      name:'Raw Material Testing', status:'Completed', date:'2024-01-15'
                    },{
                      name:'Conductor Testing', status:'Completed', date:'2024-01-16'
                    },{
                      name:'Insulation Testing', status:'Completed', date:'2024-01-17'
                    },{
                      name:'Final Inspection', status:'Completed', date:'2024-01-18'
                    }].map((g,i)=> (
                      <div key={i} className="p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">{g.name}</div>
                          <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">{g.status}</span>
                        </div>
                        <div className="text-xs text-gray-500 ml-3">{g.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Type Test & Others */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type Test */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md border border-blue-500 flex items-center justify-center text-blue-600 text-xs">📄</span>
                    <h3 className="text-sm font-semibold text-gray-900">Type Test</h3>
                  </div>
                  <div className="divide-y">
                    {[{
                      name:'Electrical Properties', status:'Pass', ref:'ET/2024/001'
                    },{
                      name:'Mechanical Properties', status:'Pass', ref:'MT/2024/001'
                    },{
                      name:'Fire Resistance', status:'Pass', ref:'FR/2024/001'
                    },{
                      name:'Weather Resistance', status:'Pass', ref:'WR/2024/001'
                    }].map((t,i)=> (
                      <div key={i} className="p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">{t.name}</div>
                          <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">{t.status}</span>
                        </div>
                        <div className="text-xs text-gray-500 ml-3">{t.ref}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Others */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md border border-blue-500 flex items-center justify-center text-blue-600 text-xs">🏷</span>
                    <h3 className="text-sm font-semibold text-gray-900">Others</h3>
                  </div>
                  <div className="divide-y">
                    {[{
                      name:'Plant Layout', status:'Available', date:'2024-01-10'
                    },{
                      name:'Equipment List', status:'Available', date:'2024-01-12'
                    },{
                      name:'Machine List', status:'Available', date:'2024-01-14'
                    },{
                      name:'Experience Certificate', status:'Available', date:'2024-01-16'
                    }].map((o,i)=> (
                      <div key={i} className="p-3 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm text-gray-900">{o.name}</div>
                          <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">{o.status}</span>
                        </div>
                        <div className="text-xs text-gray-500 ml-3">{o.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

                {/* Image */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col items-center">
                  <div className="w-full max-w-xs h-32 bg-white rounded-lg overflow-hidden border">
                    <img src="/images/products/aerial bunch cable.jpeg" alt="Aerial Bunch Cable" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Aerial Bunch Cable Sample</p>
                </div>

                {/* Standards Compliance */}
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Standards Compliance:</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• IS 14255: 1995 (Reaffirmed 2020)</li>
                    <li>• IS 8130: 1984 (Reaffirmed 2021)</li>
                    <li>• IS 1554 (Part-1): 1988 (Reaffirmed 2021)</li>
                    <li>• IS 7098 (Part-1): 1988 (Reaffirmed 2021)</li>
                  </ul>
                </div>

                {/* Price List */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4">
                    <h3 className="text-sm font-semibold text-gray-900">Price List</h3>
                    <button
                      onClick={() => {
                        const headers = ['Size', 'Price per Meter', 'Stock Status'];
                        const rows = abPriceList.map(r => [r.size, r.price, r.stock]);
                        const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v || ''}"`).join(','))].join('\n');
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'ab-cable-price-list.csv';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                      Download Price List
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-3 py-2 border-b">Size</th>
                          <th className="px-3 py-2 border-b">Price per Meter</th>
                          <th className="px-3 py-2 border-b">Stock Status</th>
                          <th className="px-3 py-2 border-b">Image</th>
                          <th className="px-3 py-2 border-b">Add Images</th>
                        </tr>
                      </thead>
                      <tbody>
                        {abPriceList.map((row, idx) => (
                          <tr key={idx} className="odd:bg-white even:bg-gray-50">
                            <td className="px-3 py-2 border-b text-gray-800">{row.size}</td>
                            <td className="px-3 py-2 border-b text-blue-600 font-semibold">{row.price}</td>
                            <td className="px-3 py-2 border-b">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${row.stock === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {row.stock || ''}
                              </span>
                            </td>
                            <td className="px-3 py-2 border-b">
                              <div
                                className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
                                title={(priceImages[idx] && priceImages[idx].length > 0) ? 'Click to preview' : 'No image uploaded'}
                                onClick={() => {
                                  const imgs = priceImages[idx] || [];
                                  if (imgs.length > 0) setPreviewUrl(imgs[imgs.length - 1]);
                                }}
                              >
                                {(priceImages[idx] && priceImages[idx].length > 0) ? (
                                  <img src={priceImages[idx][priceImages[idx].length - 1]} alt={`${row.size} image`} className="w-full h-full object-cover rounded-md" />
                                ) : (
                                  <span className="text-xs text-gray-400">No Img</span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 border-b">
                              <button
                                className="w-9 h-9 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-200"
                                onClick={() => {
                                  setUploadIndex(idx);
                                  document.getElementById('mobile-price-image-input').click();
                                }}
                              >
                                +
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
                    <h3 className="text-sm font-semibold text-gray-900">Technical Data</h3>
                  </div>
                  <div className="p-4 space-y-6">
                    {/* Phase Table */}
                    <div className="rounded-lg border border-gray-200 overflow-auto">
                      <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-700 border-b">PHASE Φ</div>
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-3 py-2 border-b">Cross Sectional Area of Phase Conductor (sqmm)</th>
                            <th className="px-3 py-2 border-b">Strands/Wire (nos/mm)</th>
                            <th className="px-3 py-2 border-b">Conductor Dia (mm)</th>
                            <th className="px-3 py-2 border-b">Insulation Thickness (mm)</th>
                            <th className="px-3 py-2 border-b">Insulated Core Dia (mm)</th>
                            <th className="px-3 py-2 border-b">Maximum Resistance (Ohm/Km) @20°C</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { cs: '16', s: '7/1.70', d: '5.10', t: '1.20', ic: '7.50', r: '1.910' },
                            { cs: '25', s: '7/2.12', d: '6.36', t: '1.20', ic: '8.76', r: '1.200' },
                            { cs: '35', s: '7/2.52', d: '7.56', t: '1.20', ic: '9.96', r: '0.868' },
                            { cs: '50', s: '7/3.02', d: '9.06', t: '1.50', ic: '12.06', r: '0.641' },
                            { cs: '70', s: '19/2.17', d: '10.85', t: '1.50', ic: '13.85', r: '0.443' },
                            { cs: '95', s: '19/2.52', d: '12.60', t: '1.50', ic: '15.60', r: '0.320' },
                          ].map((row, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                              <td className="px-3 py-2 border-b text-gray-800">{row.cs}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.s}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.d}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.t}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.ic}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.r}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Messenger Table */}
                    <div className="rounded-lg border border-gray-200 overflow-auto">
                      <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-700 border-b">MESSENGER Φ</div>
                      <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-3 py-2 border-b">Cross Sectional Area of Messenger (sqmm)</th>
                            <th className="px-3 py-2 border-b">Strands/Wire (nos/mm)</th>
                            <th className="px-3 py-2 border-b">Conductor Dia (mm)</th>
                            <th className="px-3 py-2 border-b">Insulation Thickness (mm)</th>
                            <th className="px-3 py-2 border-b">Maximum Resistance (Ohm/Km) @20°C</th>
                            <th className="px-3 py-2 border-b">Maximum Breaking Load (kN)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { cs: '25', s: '7/2.12', d: '6.36', t: '1.20', r: '1.380', b: '7.560' },
                            { cs: '35', s: '7/2.52', d: '7.56', t: '1.20', r: '0.986', b: '8.760' },
                            { cs: '50', s: '7/3.02', d: '9.06', t: '1.50', r: '0.689', b: '10.560' },
                            { cs: '70', s: '7/3.57', d: '10.71', t: '1.50', r: '0.492', b: '12.210' },
                          ].map((row, i) => (
                            <tr key={i} className="odd:bg-white even:bg-gray-50">
                              <td className="px-3 py-2 border-b text-gray-800">{row.cs}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.s}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.d}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.t}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.r}</td>
                              <td className="px-3 py-2 border-b text-gray-800">{row.b}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Costing Calculator */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Costing Calculator</h3>
                    <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Calculate</button>
                  </div>
                  <div className="overflow-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-600">
                        <tr>
                          <th className="px-3 py-2 border-b">Disc.</th>
                          <th className="px-3 py-2 border-b">Core Φ</th>
                          <th className="px-3 py-2 border-b">No Strand</th>
                          <th className="px-3 py-2 border-b">Stand Size</th>
                          <th className="px-3 py-2 border-b">Calcus</th>
                          <th className="px-3 py-2 border-b">Gauge</th>
                          <th className="px-3 py-2 border-b">KG/MTR</th>
                          <th className="px-3 py-2 border-b">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { d:'PHASE', c:'3', n:'7', s:'2.12', cal:'7.091', g:'25 SQMM', kg:'203/KG', t:'54775' },
                          { d:'PH INN INS', c:'-', n:'-', s:'1.20', cal:'6.36 mm', g:'OD 8.76', kg:'80/KG', t:'9640' },
                          { d:'PH OUT INS', c:'-', n:'-', s:'-', cal:'8.76 mm', g:'OD 8.76', kg:'0/KG', t:'0' },
                          { d:'STREET LIGHT', c:'1', n:'7', s:'1.70', cal:'7.091', g:'16 SQMM', kg:'43/KG', t:'11740' },
                          { d:'STL INN INS', c:'-', n:'-', s:'1.20', cal:'5.10 mm', g:'OD 7.50', kg:'22/KG', t:'2678' },
                          { d:'STL OUT INS', c:'-', n:'-', s:'-', cal:'7.50 mm', g:'OD 7.50', kg:'0/KG', t:'0' },
                          { d:'MESSENGER', c:'1', n:'7', s:'2.12', cal:'7.091', g:'25 SQMM', kg:'68/KG', t:'18258' },
                          { d:'MSN INN INS', c:'-', n:'-', s:'-', cal:'6.36 mm', g:'OD 6.36', kg:'0/KG', t:'0' },
                          { d:'MSN OUT INS', c:'-', n:'-', s:'-', cal:'6.36 mm', g:'OD 6.36', kg:'0/KG', t:'0' },
                        ].map((r, i) => (
                          <tr key={i} className="odd:bg-white even:bg-gray-50">
                            <td className="px-3 py-2 border-b text-gray-800">{r.d}</td>
                            <td className="px-3 py-2 border-b text-red-600 font-semibold">{r.c}</td>
                            <td className="px-3 py-2 border-b text-red-600 font-semibold">{r.n}</td>
                            <td className="px-3 py-2 border-b text-red-600 font-semibold">{r.s}</td>
                            <td className="px-3 py-2 border-b text-gray-800">{r.cal}</td>
                            <td className="px-3 py-2 border-b text-gray-800">{r.g}</td>
                            <td className="px-3 py-2 border-b text-gray-800">{r.kg}</td>
                            <td className="px-3 py-2 border-b text-gray-800">{r.t}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Grids */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4">
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Material Inputs</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span>ALUMINIUM:</span><span className="text-red-600 font-semibold">270.00</span></div>
                        <div className="flex justify-between"><span>ALLOY:</span><span className="text-red-600 font-semibold">270.00</span></div>
                        <div className="flex justify-between"><span>INNER INSU:</span><span className="text-red-600 font-semibold">120.00</span></div>
                        <div className="flex justify-between"><span>OUTER INSU:</span><span className="text-red-600 font-semibold">0.00</span></div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Cable Weights</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span>CABLE WT:</span><span className="font-semibold text-gray-900">417 KG</span></div>
                        <div className="flex justify-between"><span>ALUMINUM WT:</span><span className="font-semibold text-gray-900">246 KG</span></div>
                        <div className="flex justify-between"><span>ALLOY WT:</span><span className="font-semibold text-gray-900">68 KG</span></div>
                        <div className="flex justify-between"><span>INN XLPE WT:</span><span className="font-semibold text-gray-900">103 KG</span></div>
                        <div className="flex justify-between"><span>OUT XLPE WT:</span><span className="font-semibold text-gray-900">0 KG</span></div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="text-xs font-semibold text-gray-700 mb-2">Pricing & Details</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span>DRUM 2X:</span><span className="text-blue-700 font-semibold">5000</span></div>
                        <div className="flex justify-between"><span>FREIGHT:</span><span className="font-semibold text-gray-900">0</span></div>
                        <div className="flex justify-between"><span>LENGTH:</span><span className="text-red-600 font-semibold">1000</span><span>MTR</span></div>
                        <div className="flex justify-between"><span>SALE PRICE:</span><span className="text-green-600 font-semibold">₹ 122.51</span></div>
                        <div className="flex justify-between"><span>PROFIT:</span><span className="text-green-600 font-semibold">20 %</span></div>
                      </div>
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
      {/* Hidden file input */}
      <input
        id="mobile-price-image-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          if (!file || uploadIndex === null) return;
          const reader = new FileReader();
          reader.onload = () => {
            setPriceImages((prev) => {
              const existing = prev[uploadIndex] || [];
              return { ...prev, [uploadIndex]: [...existing, reader.result] };
            });
            setIsUploadOpen(false);
          };
          reader.readAsDataURL(file);
          e.target.value = '';
        }}
      />

      {/* Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewUrl("") }>
          <div className="bg-white rounded-lg p-2 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <img src={previewUrl} alt="Preview" className="w-full h-auto rounded" />
            <div className="text-right mt-2">
              <button className="px-3 py-1 text-sm bg-gray-200 rounded" onClick={() => setPreviewUrl("")}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-8">
          <Box className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No products found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default MobileProducts;
