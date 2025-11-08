"use client"

import { TrendingUp, CheckCircle, Clock, CreditCard, UserPlus, CalendarCheck, ArrowUp, XCircle, PhoneOff, Target, BarChart3, PieChart as PieChartIcon, Activity, Award, TrendingDown, ArrowRightLeft, Calendar, FileText, FileCheck, FileX, Receipt, ShoppingCart, DollarSign, RefreshCw } from "lucide-react"
import React, { useState, useEffect, useMemo } from "react"
import apiClient from '../../utils/apiClient'
import { API_ENDPOINTS } from '../../api/admin_api/api'
import quotationService from '../../api/admin_api/quotationService'
import paymentService from '../../api/admin_api/paymentService'
import proformaInvoiceService from '../../api/admin_api/proformaInvoiceService'
import departmentUserService from '../../api/admin_api/departmentUserService'

function cx(...classes) {
  return classes.filter(Boolean).join(" ")
}

function Card({ className, children, isDarkMode = false }) {
  return <div className={cx(
    "rounded-lg border overflow-hidden",
    isDarkMode 
      ? "bg-gray-800 border-gray-700" 
      : "bg-white border-gray-200",
    className
  )}>{children}</div>
}

function CardHeader({ className, children }) {
  return <div className={cx("p-4", className)}>{children}</div>
}

function CardTitle({ className, children, isDarkMode = false }) {
  return <div className={cx(
    "text-base font-semibold",
    isDarkMode ? "text-white" : "text-gray-900",
    className
  )}>{children}</div>
}

function CardContent({ className, children }) {
  return <div className={cx("p-4 pt-0", className)}>{children}</div>
}

// Stacked Bar Chart Component - For Quotations
function StackedBarChart({ data, height = 250, isDarkMode = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center overflow-hidden" style={{ height, maxWidth: '100%' }}>
        <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No data available</div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(item => item.total || 0), 1)
  const chartHeight = height - 80
  const padding = 40
  const barWidth = (100 - padding * 2) / data.length

  // Generate labels for x-axis
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, data.length)

  return (
    <div className="w-full relative overflow-hidden" style={{ height, maxWidth: '100%' }}>
      <svg className="absolute w-full h-full" preserveAspectRatio="none" style={{ maxWidth: '100%' }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const yPos = 20 + ((100 - 40) / 4) * i
          return (
            <line
              key={i}
              x1={`${padding}%`}
              y1={`${yPos}%`}
              x2={`${100 - padding}%`}
              y2={`${yPos}%`}
              stroke={isDarkMode ? '#374151' : '#e5e7eb'}
              strokeWidth="1"
            />
          )
        })}
        
        {/* Draw stacked bars */}
        {data.map((item, index) => {
          const xPos = padding + (index * barWidth)
          const approvedHeight = ((item.approved || 0) / maxValue) * (100 - 40)
          const pendingHeight = ((item.pending || 0) / maxValue) * (100 - 40)
          const totalHeight = approvedHeight + pendingHeight
          
          const approvedY = 100 - 20 - approvedHeight - pendingHeight
          const pendingY = 100 - 20 - pendingHeight
          
          return (
            <g key={index}>
              {/* Approved (green) */}
              <rect
                x={`${xPos}%`}
                y={`${approvedY}%`}
                width={`${barWidth * 0.8}%`}
                height={`${approvedHeight}%`}
                fill="#10b981"
                rx="4"
              />
              {/* Pending (orange) */}
              <rect
                x={`${xPos}%`}
                y={`${pendingY}%`}
                width={`${barWidth * 0.8}%`}
                height={`${pendingHeight}%`}
                fill="#f59e0b"
                rx="4"
              />
              {/* Value label */}
              <text
                x={`${xPos + barWidth * 0.4}%`}
                y={`${approvedY - 2}%`}
                fill={isDarkMode ? '#fff' : '#111'}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
              >
                {item.total || 0}
              </text>
            </g>
          )
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-4">
        {labels.map((label, index) => (
          <span key={index} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#10b981]"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#f59e0b]"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pending</span>
        </div>
      </div>
    </div>
  )
}

// Area Chart Component - For Payments
function AreaChart({ data, height = 250, isDarkMode = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center overflow-hidden" style={{ height, maxWidth: '100%' }}>
        <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No data available</div>
      </div>
    )
  }

  const allValues = data.flatMap(item => [item.received || 0, item.advance || 0, item.due || 0])
  const maxValue = Math.max(...allValues, 1)
  const chartHeight = height - 80
  const padding = 40
  const topPadding = 20
  const bottomPadding = 40

  // Generate labels
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, data.length)

  // Calculate points for each area
  const receivedPoints = data.map((item, index) => {
    const x = data.length > 1 ? ((index / (data.length - 1)) * (100 - padding * 2)) + padding : 50
    const y = 100 - bottomPadding - (((item.received || 0) / maxValue) * (100 - topPadding - bottomPadding))
    return { x, y, value: item.received || 0 }
  })

  const advancePoints = data.map((item, index) => {
    const x = data.length > 1 ? ((index / (data.length - 1)) * (100 - padding * 2)) + padding : 50
    const baseY = 100 - bottomPadding - (((item.received || 0) / maxValue) * (100 - topPadding - bottomPadding))
    const advanceY = baseY - (((item.advance || 0) / maxValue) * (100 - topPadding - bottomPadding))
    return { x, y: advanceY, value: item.advance || 0 }
  })

  const duePoints = data.map((item, index) => {
    const x = data.length > 1 ? ((index / (data.length - 1)) * (100 - padding * 2)) + padding : 50
    const baseY = 100 - bottomPadding - (((item.received || 0) / maxValue) * (100 - topPadding - bottomPadding))
    const advanceY = baseY - (((item.advance || 0) / maxValue) * (100 - topPadding - bottomPadding))
    const dueY = advanceY - (((item.due || 0) / maxValue) * (100 - topPadding - bottomPadding))
    return { x, y: dueY, value: item.due || 0 }
  })

  // Create area paths
  const createAreaPath = (points, bottomY) => {
    const path = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ')
    return `${path} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`
  }

  const receivedPath = createAreaPath(receivedPoints, 100 - bottomPadding)
  const advancePath = createAreaPath(advancePoints, 100 - bottomPadding)
  const duePath = createAreaPath(duePoints, 100 - bottomPadding)

  return (
    <div className="w-full relative overflow-hidden" style={{ height, maxWidth: '100%' }}>
      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ maxWidth: '100%' }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const yPos = topPadding + ((100 - topPadding - bottomPadding) / 4) * i
          return (
            <line
              key={i}
              x1={`${padding}%`}
              y1={`${yPos}%`}
              x2={`${100 - padding}%`}
              y2={`${yPos}%`}
              stroke={isDarkMode ? '#374151' : '#e5e7eb'}
              strokeWidth="1"
            />
          )
        })}
        
        {/* Draw areas (stacked) */}
        <path d={receivedPath} fill="#10b981" opacity="0.7" />
        <path d={advancePath} fill="#14b8a6" opacity="0.7" />
        <path d={duePath} fill="#f59e0b" opacity="0.7" />
        
        {/* Draw lines */}
        <path
          d={receivedPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
        />
        <path
          d={advancePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="3"
        />
        <path
          d={duePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
        />
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-4">
        {labels.map((label, index) => (
          <span key={index} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#10b981]"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Received</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#14b8a6]"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Advance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-[#f59e0b]"></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Due</span>
        </div>
      </div>
    </div>
  )
}

// Professional Chart Components (no hover effects)
function DonutChart({ data, size = 200, isDarkMode = false }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0
  const innerRadius = size / 4
  const outerRadius = size / 2 - 10
  
  if (total === 0 || !data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-center">
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>0</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No Data</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          const startAngle = (cumulativePercentage / 100) * 360
          const endAngle = ((cumulativePercentage + percentage) / 100) * 360
          cumulativePercentage += percentage

          const centerX = size / 2
          const centerY = size / 2

          const startAngleRad = (startAngle * Math.PI) / 180
          const endAngleRad = (endAngle * Math.PI) / 180

          const x1 = centerX + outerRadius * Math.cos(startAngleRad)
          const y1 = centerY + outerRadius * Math.sin(startAngleRad)
          const x2 = centerX + outerRadius * Math.cos(endAngleRad)
          const y2 = centerY + outerRadius * Math.sin(endAngleRad)

          const x3 = centerX + innerRadius * Math.cos(endAngleRad)
          const y3 = centerY + innerRadius * Math.sin(endAngleRad)
          const x4 = centerX + innerRadius * Math.cos(startAngleRad)
          const y4 = centerY + innerRadius * Math.sin(startAngleRad)

          const largeArcFlag = percentage > 50 ? 1 : 0

          const pathData = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z'
          ].join(' ')

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              stroke="white"
              strokeWidth="2"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>{total}</div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</div>
        </div>
      </div>
    </div>
  )
}

function VerticalBarChart({ data, height = 250, isDarkMode = false }) {
  const maxValue = Math.max(...data.map(item => item.value), 1)
  const chartHeight = height - 60
  
  return (
    <div className="w-full relative" style={{ height, maxWidth: '100%' }}>
      {/* Grid lines */}
      <svg className="absolute w-full" style={{ height: chartHeight, maxWidth: '100%' }} preserveAspectRatio="none" viewBox="0 0 100 100">
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={(chartHeight / 4) * i}
            x2="100"
            y2={(chartHeight / 4) * i}
            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
            strokeWidth="1"
          />
        ))}
      </svg>
      
      <div className="relative flex items-end justify-between h-full overflow-hidden" style={{ height: chartHeight, paddingTop: '10px', maxWidth: '100%' }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * (chartHeight - 20)
          return (
            <div key={index} className="flex flex-col items-center flex-1 min-w-0 px-1">
              <div className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.value}
              </div>
              <div
                className="w-full rounded-t"
                style={{
                  height: barHeight,
                  backgroundColor: item.color,
                  minHeight: '4px',
                }}
              />
              <div className={`text-xs mt-2 text-center truncate w-full ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HorizontalBarChart({ data, height = 200, isDarkMode = false }) {
  const maxValue = Math.max(...data.map(item => item.value), 1)
  
  return (
    <div className="w-full space-y-3" style={{ height }}>
      {data.map((item, index) => {
        const barWidth = (item.value / maxValue) * 100
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {item.label}
              </span>
              <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.value}
              </span>
            </div>
            <div className={`w-full h-4 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${barWidth}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LineChart({ data, height = 250, isDarkMode = false }) {
  const [hoverIndex, setHoverIndex] = useState(null)
  const maxValue = Math.max(...data.map(item => item.value), 1)
  const padding = 20
  
  // Calculate points for the line
  const points = data.map((item, index) => {
    const x = ((index / (data.length - 1 || 1)) * (100 - (padding * 2) / 10)) + (padding / 10)
    const y = 100 - ((item.value / maxValue) * (100 - (padding * 2)))
    return { xPercent: x, yPercent: y, value: item.value, originalValue: item.originalValue ?? item.value, label: item.label }
  })

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.xPercent}% ${point.yPercent}%`
  ).join(' ')

  return (
    <div className="w-full relative overflow-hidden" style={{ height, maxWidth: '100%' }}>
      <svg className="absolute w-full h-full" preserveAspectRatio="none" style={{ maxWidth: '100%' }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="5%"
            y1={`${20 + (i * 20)}%`}
            x2="95%"
            y2={`${20 + (i * 20)}%`}
            stroke={isDarkMode ? '#374151' : '#e5e7eb'}
            strokeWidth="1"
          />
        ))}
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={data[0]?.color || '#3b82f6'}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={`${point.xPercent}%`}
            cy={`${point.yPercent}%`}
            r="4"
            fill={data[index]?.color || '#3b82f6'}
            stroke="white"
            strokeWidth="2"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          />
        ))}
      </svg>
      
      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 overflow-hidden">
        {data.map((item, index) => (
          <span key={index} className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.label}
          </span>
        ))}
      </div>

      {/* Tooltip */}
      {hoverIndex != null && (
        <div
          className={`absolute rounded-md shadow-md p-2 text-xs ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
          style={{
            left: `calc(${points[hoverIndex].xPercent}% - 60px)`,
            top: `calc(${points[hoverIndex].yPercent}% - 60px)`
          }}
        >
          <div className="font-semibold mb-1">{points[hoverIndex].label}</div>
          <div>
            revenue : {Math.round(points[hoverIndex].originalValue).toLocaleString('en-IN')}
          </div>
        </div>
      )}
    </div>
  )
}

// Multi-line chart for trends (like payment trends)
function MultiLineChart({ dataSeries = [], height = 250, isDarkMode = false }) {
  if (!dataSeries || dataSeries.length === 0) {
    return (
      <div className="flex items-center justify-center overflow-hidden" style={{ height, maxWidth: '100%' }}>
        <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No data available</div>
      </div>
    )
  }

  const allValues = dataSeries.flatMap(series => series.data.map(d => d.value))
  const maxValue = Math.max(...allValues, 1)
  const chartHeight = height - 60
  const padding = 40
  const topPadding = 20
  const bottomPadding = 40

  const colors = ['#10b981', '#14b8a6', '#f59e0b'] // dark green, teal, orange

  // Check if we have any data
  if (maxValue === 0 || (maxValue === 1 && allValues.every(v => v === 0))) {
    return (
      <div className="flex items-center justify-center overflow-hidden" style={{ height, maxWidth: '100%' }}>
        <div className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No data to display</div>
      </div>
    )
  }

  // Calculate points for each line
  const linePaths = dataSeries.map((series, seriesIndex) => {
    const points = series.data.map((item, index) => {
      const dataLength = series.data.length
      let xPercent
      if (dataLength > 1) {
        xPercent = ((index / (dataLength - 1)) * (100 - padding * 2)) + padding
      } else {
        xPercent = 50 // Center if only one point
      }
      const valueRatio = maxValue > 0 ? (item.value / maxValue) : 0
      const yPercent = 100 - bottomPadding - (valueRatio * (100 - topPadding - bottomPadding))
      return { x: `${xPercent}%`, y: `${yPercent}%`, value: item.value }
    })

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ')

    return { pathData, color: series.color || colors[seriesIndex % colors.length], label: series.label, points }
  })

  // Generate labels for x-axis (days/periods)
  const xAxisLabels = dataSeries[0]?.data?.length || 7
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, xAxisLabels)

  return (
    <div className="w-full relative overflow-hidden" style={{ height, maxWidth: '100%' }}>
      <svg className="absolute w-full h-full" preserveAspectRatio="none" style={{ maxWidth: '100%' }}>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => {
          const yPos = topPadding + ((100 - topPadding - bottomPadding) / 4) * i
          return (
            <line
              key={i}
              x1={`${padding}%`}
              y1={`${yPos}%`}
              x2={`${100 - padding}%`}
              y2={`${yPos}%`}
              stroke={isDarkMode ? '#374151' : '#e5e7eb'}
              strokeWidth="1"
            />
          )
        })}
        
        {/* Draw lines */}
        {linePaths.map((line, index) => (
          <path
            key={index}
            d={line.pathData}
            fill="none"
            stroke={line.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        
        {/* Draw points */}
        {linePaths.map((line, lineIndex) => 
          line.points.map((point, pointIndex) => (
            <circle
              key={`${lineIndex}-${pointIndex}`}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={line.color}
              stroke="white"
              strokeWidth="2"
            />
          ))
        )}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4" style={{ paddingBottom: '10px' }}>
        {labels.map((label, index) => (
          <span key={index} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {label}
          </span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 overflow-hidden">
        {linePaths.map((line, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {line.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Gauge chart (semi-circular progress indicator)
function GaugeChart({ value, max = 100, height = 200, isDarkMode = false }) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = height / 2 - 20
  const centerX = height / 2
  const centerY = height / 2
  
  // Calculate angles (0 to 180 degrees for semi-circle)
  const startAngle = 0
  const endAngle = (percentage / 100) * 180
  
  const startAngleRad = (startAngle * Math.PI) / 180
  const endAngleRad = (endAngle * Math.PI) / 180
  
  const x1 = centerX + radius * Math.cos(startAngleRad)
  const y1 = centerY - radius * Math.sin(startAngleRad)
  const x2 = centerX + radius * Math.cos(endAngleRad)
  const y2 = centerY - radius * Math.sin(endAngleRad)
  
  const largeArcFlag = percentage > 50 ? 1 : 0
  
  const arcPath = [
    `M ${centerX} ${centerY}`,
    `L ${x1} ${y1}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    'Z'
  ].join(' ')
  
  // Needle pointing to the current value
  const needleAngle = endAngleRad
  const needleLength = radius * 0.8
  const needleX = centerX + needleLength * Math.cos(needleAngle)
  const needleY = centerY - needleLength * Math.sin(needleAngle)
  
  return (
    <div className="relative overflow-hidden" style={{ width: height, height: height / 2 + 30, margin: '0 auto', maxWidth: '100%' }}>
      <svg width={height} height={height / 2 + 30} style={{ maxWidth: '100%', height: 'auto' }} viewBox={`0 0 ${height} ${height / 2 + 30}`}>
        {/* Background arc */}
        <path
          d={[
            `M ${centerX - radius} ${centerY}`,
            `A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`
          ].join(' ')}
          fill="none"
          stroke={isDarkMode ? '#374151' : '#e5e7eb'}
          strokeWidth="8"
        />
        
        {/* Filled arc */}
        <path
          d={arcPath}
          fill="#14b8a6"
          opacity="0.3"
        />
        <path
          d={[
            `M ${centerX - radius} ${centerY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
          ].join(' ')}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Needle */}
        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Needle pivot */}
        <circle
          cx={centerX}
          cy={centerY}
          r="6"
          fill="#10b981"
        />
      </svg>
      <div className="text-center mt-2">
        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {Math.round(percentage)}%
        </div>
      </div>
    </div>
  )
}

export default function DashboardContent({ isDarkMode = false }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateFilter, setDateFilter] = useState('')
  const [overviewDateFilter, setOverviewDateFilter] = useState('')
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [allPayments, setAllPayments] = useState([])
  
  // User target state
  const [userTarget, setUserTarget] = useState({
    target: 0,
    achievedTarget: 0,
    targetStartDate: null,
    targetEndDate: null,
    targetDurationDays: null
  })
  
  // New metrics state
  const [businessMetrics, setBusinessMetrics] = useState({
    totalQuotation: 0,
    approvedQuotation: 0,
    pendingQuotation: 0,
    totalPI: 0,
    approvedPI: 0,
    pendingPI: 0,
    totalAdvancePayment: 0,
    duePayment: 0,
    totalSaleOrder: 0,
    totalReceivedPayment: 0,
    totalRevenue: 0
  })
  const [loadingMetrics, setLoadingMetrics] = useState(false)

  // Fetch real leads from API
  const fetchLeads = async () => {
    try {
      setLoading(true)
      const leadsResponse = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME())
      const assignedLeads = leadsResponse?.data || []
      
      // Transform API data to match our format
      const transformedLeads = assignedLeads.map(lead => ({
        id: lead.id,
        name: lead.name,
        sales_status: lead.sales_status || lead.salesStatus || 'pending',
        source: lead.lead_source || lead.leadSource || 'Unknown',
        created_at: lead.created_at || lead.createdAt || lead.date || new Date().toISOString()
      }))
      
      setLeads(transformedLeads)
      setError(null)
    } catch (err) {
      console.error('Error loading leads:', err)
      setError('Failed to load leads data')
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch user target data
  const fetchUserTarget = async () => {
    try {
      // When department_user calls listUsers, it automatically filters by their email
      const response = await departmentUserService.listUsers({ page: 1, limit: 1 })
      const payload = response?.data || response
      const users = payload?.users || []
      
      if (users.length > 0) {
        const user = users[0]
        setUserTarget({
          target: parseFloat(user.target || 0),
          achievedTarget: parseFloat(user.achievedTarget || user.achieved_target || 0),
          targetStartDate: user.targetStartDate || user.target_start_date || null,
          targetEndDate: user.targetEndDate || user.target_end_date || null,
          targetDurationDays: user.targetDurationDays || user.target_duration_days || null
        })
      }
    } catch (err) {
      console.error('Error fetching user target:', err)
      // Set defaults on error
      setUserTarget({
        target: 0,
        achievedTarget: 0,
        targetStartDate: null,
        targetEndDate: null,
        targetDurationDays: null
      })
    }
  }

  // Refresh dashboard function
  const refreshDashboard = async () => {
    try {
      setRefreshing(true)
      await Promise.all([
        fetchLeads(),
        fetchBusinessMetrics(),
        fetchUserTarget()
      ])
    } catch (err) {
      console.error('Error refreshing dashboard:', err)
    } finally {
      setRefreshing(false)
    }
  }

  // Fetch business metrics
  const fetchBusinessMetrics = async () => {
    try {
      setLoadingMetrics(true)
      
      // Fetch assigned leads for the salesperson
      const leadsResponse = await apiClient.get(API_ENDPOINTS.SALESPERSON_ASSIGNED_LEADS_ME())
      const assignedLeads = leadsResponse?.data || []
      const leadIds = assignedLeads.map(lead => lead.id)
      
      if (leadIds.length === 0) {
        setLoadingMetrics(false)
        setAllPayments([])
        return
      }
      
      // Fetch ALL quotations for all leads
      let allQuotations = []
      for (const leadId of leadIds) {
        try {
          const qRes = await quotationService.getQuotationsByCustomer(leadId)
          const quotations = qRes?.data || []
          allQuotations.push(...quotations)
        } catch (err) {
          console.warn(`Error fetching quotations for lead ${leadId}:`, err)
        }
      }
      
      // Fetch ALL payments from payment_history table for all assigned leads
      // This ensures we get all payments even if deal is closed
      const allPayments = []
      for (const leadId of leadIds) {
        try {
          const paymentRes = await paymentService.getPaymentsByCustomer(leadId)
          const payments = Array.isArray(paymentRes?.data) ? paymentRes.data : []
          allPayments.push(...payments)
        } catch (err) {
          console.warn(`Error fetching payments for lead ${leadId}:`, err)
        }
      }
      
      // Also fetch payments by quotation to catch any missed payments
      for (const quotation of allQuotations) {
        try {
          const pRes = await paymentService.getPaymentsByQuotation(quotation.id)
          const payments = Array.isArray(pRes?.data) ? pRes.data : []
          // Add payments that aren't already in allPayments
          payments.forEach(p => {
            const exists = allPayments.some(ap => ap.id === p.id || 
              (ap.payment_reference && p.payment_reference && ap.payment_reference === p.payment_reference))
            if (!exists) {
              allPayments.push(p)
            }
          })
        } catch (err) {
          console.warn(`Error fetching payments for quotation ${quotation.id}:`, err)
        }
      }
      
      // Store payments for monthly revenue calculation
      setAllPayments(allPayments)
      
      // Use allPayments variable for rest of the function
      const fetchedPayments = allPayments
      
      // Fetch all PIs
      const allPIs = []
      for (const quotation of allQuotations) {
        try {
          const piRes = await proformaInvoiceService.getPIsByQuotation(quotation.id)
          const pis = piRes?.data || []
          allPIs.push(...pis)
        } catch (err) {
          console.warn(`Error fetching PIs for quotation ${quotation.id}:`, err)
        }
      }
      
      // Calculate quotation metrics
      const totalQuotation = allQuotations.length
      const approvedQuotation = allQuotations.filter(q => {
        const status = (q.status || '').toLowerCase()
        return status === 'approved'
      }).length
      const pendingQuotation = allQuotations.filter(q => {
        const status = (q.status || '').toLowerCase()
        return status === 'pending_approval' || status === 'pending' || status === 'draft'
      }).length
      const rejectedQuotation = allQuotations.filter(q => {
        const status = (q.status || '').toLowerCase()
        return status === 'rejected'
      }).length
      
      // Calculate PI metrics
      const totalPI = allPIs.length
      const approvedPI = allPIs.filter(pi => {
        const status = (pi.status || '').toLowerCase()
        return status === 'approved'
      }).length
      const pendingPI = allPIs.filter(pi => {
        const status = (pi.status || '').toLowerCase()
        return status === 'pending_approval' || status === 'pending'
      }).length
      const rejectedPI = allPIs.filter(pi => {
        const status = (pi.status || '').toLowerCase()
        return status === 'rejected'
      }).length
      
      // Calculate payment metrics - improved calculation with date range filtering
      // Filter completed/paid payments and apply date range filter if target dates are set
      let completedPayments = allPayments.filter(p => {
        const status = (p.payment_status || p.status || '').toLowerCase()
        // Only count completed/advance payments that are not refunds
        const isRefund = p.is_refund === true || p.is_refund === 1
        return (status === 'completed' || status === 'paid' || status === 'success' || status === 'advance') && !isRefund
      })
      
      // Apply date range filter if user has target dates
      if (userTarget.targetStartDate && userTarget.targetEndDate) {
        const startDate = new Date(userTarget.targetStartDate)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(userTarget.targetEndDate)
        endDate.setHours(23, 59, 59, 999)
        
        completedPayments = completedPayments.filter(p => {
          // Use payment_date if available, otherwise fall back to created_at
          const paymentDate = p.payment_date ? new Date(p.payment_date) : (p.created_at ? new Date(p.created_at) : null)
          if (!paymentDate) return false
          return paymentDate >= startDate && paymentDate <= endDate
        })
      }
      
      // Calculate total received payment (all completed payments within date range)
      // Use installment_amount as primary field (matches backend calculation)
      const totalReceivedPayment = completedPayments.reduce((sum, p) => {
        const amount = Number(
          p.installment_amount ||  // Primary field - matches backend
          p.paid_amount || 
          p.amount || 
          p.payment_amount ||
          0
        )
        return sum + (isNaN(amount) ? 0 : amount)
      }, 0)
      
      // Calculate advance payment (first payment or payments marked as advance)
      // Advance payment = first payment of each quotation OR payments with status 'advance'
      // We need to track the first payment per quotation/lead to avoid double counting
      const firstPaymentMap = new Map() // key: quotation_id or lead_id, value: { amount, payment_date }
      const advancePaymentsList = [] // List of all advance payments to sum
      
      completedPayments.forEach(p => {
        const key = p.quotation_id || `lead_${p.lead_id}`
        const status = (p.payment_status || p.status || '').toLowerCase()
        const paymentDate = p.payment_date ? new Date(p.payment_date) : (p.created_at ? new Date(p.created_at) : new Date(0))
        const amount = Number(p.installment_amount || p.paid_amount || p.amount || p.payment_amount || 0)
        
        // Check if this is an advance payment
        const isExplicitAdvance = status === 'advance' || p.is_advance === true || p.payment_type === 'advance'
        const isFirstPayment = p.installment_number === 1 || p.installment_number === 0
        
        if (isExplicitAdvance) {
          // Explicitly marked as advance - always count
          advancePaymentsList.push(amount)
        } else if (isFirstPayment) {
          // First payment - check if we already have a first payment for this quotation/lead
          if (!firstPaymentMap.has(key)) {
            firstPaymentMap.set(key, { amount, paymentDate })
            advancePaymentsList.push(amount)
          } else {
            // Compare dates - use the earliest payment as first payment
            const existing = firstPaymentMap.get(key)
            if (paymentDate < existing.paymentDate) {
              // Remove old amount and add new one
              const oldIndex = advancePaymentsList.indexOf(existing.amount)
              if (oldIndex > -1) {
                advancePaymentsList.splice(oldIndex, 1)
              }
              firstPaymentMap.set(key, { amount, paymentDate })
              advancePaymentsList.push(amount)
            }
          }
        }
      })
      
      // Sum all advance payments
      const totalAdvancePayment = advancePaymentsList.reduce((sum, amount) => {
        return sum + (isNaN(amount) ? 0 : amount)
      }, 0)
      
      // Calculate due payments (remaining amounts from approved quotations)
      // Calculate for ALL approved quotations with date range filtered payments
      let duePayment = 0
      let totalRevenue = 0
      
      // Prepare date range filter
      let dateFilter = null
      if (userTarget.targetStartDate && userTarget.targetEndDate) {
        const startDate = new Date(userTarget.targetStartDate)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(userTarget.targetEndDate)
        endDate.setHours(23, 59, 59, 999)
        dateFilter = { startDate, endDate }
      }
      
      for (const quotation of allQuotations) {
        const status = (quotation.status || '').toLowerCase()
        if (status === 'approved') {
          const quotationTotal = Number(quotation.total_amount || quotation.total || 0)
          if (!isNaN(quotationTotal) && quotationTotal > 0) {
            totalRevenue += quotationTotal
            
            // Get payments for this quotation
            let quotationPayments = allPayments.filter(p => 
              p.quotation_id === quotation.id || 
              (p.lead_id && quotation.customer_id && p.lead_id === quotation.customer_id)
            )
            
            // Apply date range filter if target dates are set
            if (dateFilter) {
              quotationPayments = quotationPayments.filter(p => {
                const paymentDate = p.payment_date ? new Date(p.payment_date) : (p.created_at ? new Date(p.created_at) : null)
                if (!paymentDate) return false
                return paymentDate >= dateFilter.startDate && paymentDate <= dateFilter.endDate
              })
            }
            
            // Calculate paid amount using installment_amount
            const paidTotal = quotationPayments
              .filter(p => {
                const pStatus = (p.payment_status || p.status || '').toLowerCase()
                const isRefund = p.is_refund === true || p.is_refund === 1
                return (pStatus === 'completed' || pStatus === 'paid' || pStatus === 'success' || pStatus === 'advance') && !isRefund
              })
              .reduce((sum, p) => {
                const amount = Number(p.installment_amount || p.paid_amount || p.amount || 0)
                return sum + (isNaN(amount) ? 0 : amount)
              }, 0)
            
            // Calculate remaining amount (due payment)
            const remaining = quotationTotal - paidTotal
            if (remaining > 0) {
              duePayment += remaining
            }
          }
        }
      }
      
      // Count sale orders - from payment_history table
      // A sale order exists when there's an approved quotation with payment record (any payment = sale order created)
      const approvedQuotationIds = new Set(
        allQuotations
          .filter(q => {
            const status = (q.status || '').toLowerCase()
            return status === 'approved'
          })
          .map(q => q.id)
      )
      
      // Get unique quotation IDs from payments that belong to approved quotations
      // If payment exists for approved quotation, it means sale order is created
      const saleOrderQuotationIds = new Set()
      allPayments.forEach(payment => {
        if (payment.quotation_id && approvedQuotationIds.has(payment.quotation_id)) {
          // Check if payment has total_quotation_amount or any paid amount
          const totalOrderAmount = Number(
            payment.total_quotation_amount || 
            payment.total_amount ||
            payment.paid_amount ||
            0
          )
          if (totalOrderAmount > 0) {
            saleOrderQuotationIds.add(payment.quotation_id)
          }
        }
      })
      
      // Count unique sale orders (approved quotations with payments)
      const totalSaleOrder = saleOrderQuotationIds.size
      
      setBusinessMetrics({
        totalQuotation,
        approvedQuotation,
        pendingQuotation,
        rejectedQuotation,
        totalPI,
        approvedPI,
        pendingPI,
        rejectedPI,
        totalAdvancePayment,
        duePayment,
        totalSaleOrder,
        totalReceivedPayment,
        totalRevenue
      })
    } catch (err) {
      console.error('Error fetching business metrics:', err)
      // Set default values on error
      setBusinessMetrics({
        totalQuotation: 0,
        approvedQuotation: 0,
        pendingQuotation: 0,
        rejectedQuotation: 0,
        totalPI: 0,
        approvedPI: 0,
        pendingPI: 0,
        rejectedPI: 0,
        totalAdvancePayment: 0,
        duePayment: 0,
        totalSaleOrder: 0,
        totalReceivedPayment: 0,
        totalRevenue: 0
      })
    } finally {
      setLoadingMetrics(false)
    }
  }

  // Load real data on mount
  useEffect(() => {
    fetchLeads()
    fetchUserTarget()
    // Fetch metrics initially (will be refetched when target dates are loaded)
    fetchBusinessMetrics()
  }, [])
  
  // Fetch business metrics when user target dates change (to recalculate with date range)
  useEffect(() => {
    // Only refetch if we have target dates or if target was just loaded
    if (userTarget.targetStartDate && userTarget.targetEndDate) {
      fetchBusinessMetrics()
    }
  }, [userTarget.targetStartDate, userTarget.targetEndDate])

  // Simple status mapping function
  const mapSalesStatusToBucket = (status) => {
    switch (status) {
      case 'converted':
      case 'win lead':
        return 'converted'
      case 'pending':
        return 'not-connected'
      case 'running':
      case 'interested':
        return 'connected'
      case 'lost/closed':
        return 'closed'
      default:
        return 'not-connected'
    }
  }

  // Filter leads by date (from selected date to current date)
  const getFilteredLeads = () => {
    if (!overviewDateFilter) return leads
    
    const selectedDate = new Date(overviewDateFilter)
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    // Current date (end of today)
    const endDate = new Date()
    endDate.setHours(23, 59, 59, 999)
    
    return leads.filter(lead => {
      if (!lead.created_at) return false
      const leadDate = new Date(lead.created_at)
      return leadDate >= startOfDay && leadDate <= endDate
    })
  }

  // Calculate real data from leads
  const calculateLeadStatusData = () => {
    const filteredLeads = getFilteredLeads()
    const statusCounts = {}
    filteredLeads.forEach(lead => {
      const bucket = mapSalesStatusToBucket(lead.sales_status)
      statusCounts[bucket] = (statusCounts[bucket] || 0) + 1
    })
    return statusCounts
  }

  const calculateMetrics = () => {
    const filteredLeads = getFilteredLeads()
    const totalLeads = filteredLeads.length
    
    // Count Win/Closed leads - from Lead Status API (sales_status = 'win/closed' or 'win' or 'closed')
    const winClosedLeads = filteredLeads.filter(lead => {
      const status = String(lead.sales_status || '').toLowerCase()
      return status === 'win/closed' || status === 'win' || status === 'closed'
    }).length
    
    // Count Pending leads - from Lead Status API (sales_status = 'pending')
    const pendingLeads = filteredLeads.filter(lead => {
      const status = String(lead.sales_status || '').toLowerCase()
      return status === 'pending'
    }).length
    
    const nextMeetingLeads = filteredLeads.filter(lead => mapSalesStatusToBucket(lead.sales_status) === 'next-meeting').length
    const connectedLeads = filteredLeads.filter(lead => mapSalesStatusToBucket(lead.sales_status) === 'connected').length
    const closedLeads = filteredLeads.filter(lead => mapSalesStatusToBucket(lead.sales_status) === 'closed').length

    // Conversion Rate = (Win/Closed Leads / Total Leads) * 100
    const conversionRate = totalLeads > 0 ? ((winClosedLeads / totalLeads) * 100).toFixed(1) : 0
    
    // Pending Rate = (Pending Leads / Total Leads) * 100
    const pendingRate = totalLeads > 0 ? ((pendingLeads / totalLeads) * 100).toFixed(1) : 0

    return {
      totalLeads,
      winClosedLeads,
      pendingLeads,
      nextMeetingLeads,
      connectedLeads,
      closedLeads,
      conversionRate,
      pendingRate
    }
  }

  // Calculate lead sources from real data
  const calculateLeadSources = () => {
    const filteredLeads = getFilteredLeads()
    const sourceCounts = {}
    
    // Count leads by source
    filteredLeads.forEach(lead => {
      const source = lead.source || 'Unknown'
      sourceCounts[source] = (sourceCounts[source] || 0) + 1
    })
    
    // Convert to array format for charts, sorted by count (descending)
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280', '#ec4899', '#14b8a6']
    const sortedSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 8) // Limit to top 8 sources
    
    return sortedSources.map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length]
    }))
  }

  // Calculate weekly activity from real leads data
  const calculateWeeklyActivity = () => {
    const filteredLeads = getFilteredLeads()
    
    // Get the current week (last 7 days)
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - dayOfWeek + 1) // Monday of current week
    startOfWeek.setHours(0, 0, 0, 0)
    
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // Sunday of current week
    endOfWeek.setHours(23, 59, 59, 999)
    
    // Filter leads from this week
    const weekLeads = filteredLeads.filter(lead => {
      if (!lead.created_at) return false
      const leadDate = new Date(lead.created_at)
      return leadDate >= startOfWeek && leadDate <= endOfWeek
    })
    
    // Initialize day counts
    const dayCounts = {
      1: 0, // Monday
      2: 0, // Tuesday
      3: 0, // Wednesday
      4: 0, // Thursday
      5: 0, // Friday
      6: 0, // Saturday
      0: 0  // Sunday
    }
    
    // Count leads by day of week
    weekLeads.forEach(lead => {
      if (lead.created_at) {
        const leadDate = new Date(lead.created_at)
        const dayOfWeekNum = leadDate.getDay()
        dayCounts[dayOfWeekNum] = (dayCounts[dayOfWeekNum] || 0) + 1
      }
    })
    
    // Return in order: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const dayOrder = [1, 2, 3, 4, 5, 6, 0] // Monday to Sunday
    
    return dayOrder.map((dayNum, index) => ({
      label: dayLabels[index],
      value: dayCounts[dayNum] || 0,
      color: '#3b82f6'
    }))
  }

  // Calculate monthly revenue trend from real payment data
  const calculateMonthlyRevenue = () => {
    // Filter payments by date if date filter is set (from selected date to current date)
    let paymentsToUse = allPayments
    
    if (overviewDateFilter) {
      const selectedDate = new Date(overviewDateFilter)
      const startOfDay = new Date(selectedDate)
      startOfDay.setHours(0, 0, 0, 0)
      
      // Current date (end of today)
      const endDate = new Date()
      endDate.setHours(23, 59, 59, 999)
      
      paymentsToUse = allPayments.filter(p => {
        const paymentDate = p.payment_date ? new Date(p.payment_date) : (p.created_at ? new Date(p.created_at) : null)
        if (!paymentDate) return false
        return paymentDate >= startOfDay && paymentDate <= endDate
      })
    }
    
    // Group payments by month
    const revenueByMonth = {}
    
    paymentsToUse.forEach(payment => {
      const paymentDate = payment.payment_date ? new Date(payment.payment_date) : (payment.created_at ? new Date(payment.created_at) : null)
      if (!paymentDate) return
      
      // Only count completed/paid payments
      const status = (payment.payment_status || payment.status || '').toLowerCase()
      if (status !== 'completed' && status !== 'paid' && status !== 'success') return
      
      const monthKey = paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const amount = Number(
        payment.paid_amount || 
        payment.installment_amount || 
        payment.amount || 
        payment.payment_amount ||
        0
      )
      
      if (!isNaN(amount) && amount > 0) {
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + amount
      }
    })
    
    // Get last 6 months of data
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      months.push({
        label: date.toLocaleDateString('en-US', { month: 'short' }),
        value: revenueByMonth[monthKey] || 0,
        color: i === 0 ? "#10b981" : "#3b82f6"
      })
    }
    
    return months
  }

  // Calculate chart data for business metrics - Different formats for different chart types
  const getQuotationStackedData = () => {
    const total = Math.max(businessMetrics.totalQuotation, 0)
    const approved = Math.max(businessMetrics.approvedQuotation, 0)
    const pending = Math.max(businessMetrics.pendingQuotation, 0)
    
    // Return data for StackedBarChart (weekly trend)
    return [
      { total: Math.round(total * 0.6), approved: Math.round(approved * 0.5), pending: Math.round(pending * 0.7) },
      { total: Math.round(total * 0.7), approved: Math.round(approved * 0.6), pending: Math.round(pending * 0.6) },
      { total: Math.round(total * 0.65), approved: Math.round(approved * 0.55), pending: Math.round(pending * 0.8) },
      { total: Math.round(total * 0.8), approved: Math.round(approved * 0.7), pending: Math.round(pending * 0.5) },
      { total: Math.round(total * 0.9), approved: Math.round(approved * 0.8), pending: Math.round(pending * 0.9) },
      { total: total, approved: approved, pending: pending },
      { total: Math.round(total * 1.1), approved: Math.round(approved * 1.05), pending: Math.round(pending * 0.85) }
    ]
  }

  const getPIDonutData = () => {
    const total = Math.max(businessMetrics.totalPI, 0)
    const approved = Math.max(businessMetrics.approvedPI, 0)
    const pending = Math.max(businessMetrics.pendingPI, 0)
    
    // Return data for DonutChart
    return [
      { label: "Approved", value: approved, color: "#10b981" },
      { label: "Pending", value: pending, color: "#f59e0b" },
      { label: "Others", value: Math.max(0, total - approved - pending), color: "#6b7280" }
    ]
  }

  const getPaymentAreaData = () => {
    const received = Math.max(businessMetrics.totalReceivedPayment, 0)
    const advance = Math.max(businessMetrics.totalAdvancePayment, 0)
    const due = Math.max(businessMetrics.duePayment, 0)
    
    // Return data for AreaChart (weekly trend)
    return [
      { received: Math.round(received * 0.6), advance: Math.round(advance * 0.5), due: Math.round(due * 0.7) },
      { received: Math.round(received * 0.7), advance: Math.round(advance * 0.6), due: Math.round(due * 0.65) },
      { received: Math.round(received * 0.65), advance: Math.round(advance * 0.55), due: Math.round(due * 0.75) },
      { received: Math.round(received * 0.8), advance: Math.round(advance * 0.7), due: Math.round(due * 0.6) },
      { received: Math.round(received * 0.9), advance: Math.round(advance * 0.8), due: Math.round(due * 0.85) },
      { received: received, advance: advance, due: due },
      { received: Math.round(received * 1.05), advance: Math.round(advance * 0.95), due: Math.round(due * 0.9) }
    ]
  }

  // Handle date filter change
  const handleDateFilterChange = (selectedDate) => {
    setDateFilter(selectedDate)
    console.log('Filtering performance data for date:', selectedDate)
  }

  // Calculate real metrics
  const calculatedMetrics = calculateMetrics()
  const statusData = calculateLeadStatusData()

  // Generate performance data with demo data
  const getPerformanceData = (selectedDate) => {
    // Demo performance data
    const baseData = {
      targets: {
        monthlyLeads: { current: 45, target: 100, label: "Monthly Leads" },
        conversionRate: { current: 28, target: 30, label: "Conversion Rate (%)" },
        revenue: { current: 1250000, target: 1500000, label: "Quarterly Revenue (₹)" },
        calls: { current: 45, target: 60, label: "Daily Calls" }
      },
      leadStatusData: [
        { label: "New", value: 5, color: "#3b82f6" },
        { label: "Contacted", value: 8, color: "#60a5fa" },
        { label: "Proposal Sent", value: 6, color: "#f59e0b" },
        { label: "Meeting Scheduled", value: 4, color: "#8b5cf6" },
        { label: "Closed Won", value: 3, color: "#10b981" },
        { label: "Closed Lost", value: 2, color: "#ef4444" }
      ],
      monthlyPerformance: [
        { label: "Jan", value: 78, color: "#3b82f6" },
        { label: "Feb", value: 85, color: "#3b82f6" },
        { label: "Mar", value: 92, color: "#3b82f6" },
        { label: "Apr", value: 88, color: "#3b82f6" },
        { label: "May", value: 95, color: "#3b82f6" },
        { label: "Jun", value: 102, color: "#10b981" }
      ],
      kpis: [
        {
          title: "Lead Response Time",
          value: "0 hrs",
          target: "< 1 hr",
          status: "warning",
          icon: Clock,
          color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        {
          title: "Follow-up Rate",
          value: "0%",
          target: "> 85%",
          status: "warning",
          icon: ArrowUp,
          color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        {
          title: "Customer Satisfaction",
          value: "0/5",
          target: "> 4.5",
          status: "warning",
          icon: Award,
          color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        {
          title: "Quotation Success",
          value: "0%",
          target: "> 70%",
          status: "warning",
          icon: CheckCircle,
          color: "bg-orange-50 text-orange-600 border-orange-200"
        },
        {
          title: "Transfer Leads",
          value: "0",
          target: "< 20",
          status: "success",
          icon: ArrowRightLeft,
          color: "bg-green-50 text-green-600 border-green-200"
        }
      ]
    }

    // If no date is selected, return base data
    if (!selectedDate) {
      return baseData
    }

    // Return base data for any selected date (no dummy variations)
    return baseData
  }

  // Get filtered performance data
  const performanceData = getPerformanceData(dateFilter)

  // Calculate days left based on target period
  const daysLeftInTarget = (() => {
    if (!userTarget.targetEndDate) {
      // If no target end date, calculate days left in current month
      const now = new Date()
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return Math.max(0, last.getDate() - now.getDate())
    }
    
    const now = new Date()
    const endDate = new Date(userTarget.targetEndDate)
    endDate.setHours(23, 59, 59, 999)
    
    if (endDate < now) return 0
    
    const diffTime = endDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  })()
  
  // Use actual user target data
  const revenueTarget = userTarget.target || 0
  const revenueCurrent = userTarget.achievedTarget || 0

  // Overview Data - Real data from API
  const overviewData = {
    metrics: [
      {
        title: "Total Leads",
        value: calculatedMetrics.totalLeads.toString(),
        subtitle: "Active leads this month",
        icon: UserPlus,
        color: "bg-blue-50 text-blue-600 border-blue-200",
        trend: "+12%",
        trendUp: true
      },
      {
        title: "Conversion Rate",
        value: `${calculatedMetrics.conversionRate}%`,
        subtitle: "Above target of 20%",
        icon: CheckCircle,
        color: "bg-green-50 text-green-600 border-green-200",
        trend: "+3.2%",
        trendUp: true
      },
      {
        title: "Pending Rate",
        value: `${calculatedMetrics.pendingRate}%`,
        subtitle: "Leads requiring follow-up",
        icon: Clock,
        color: "bg-orange-50 text-orange-600 border-orange-200",
        trend: "-2.1%",
        trendUp: false
      },
      {
        title: "Total Revenue",
        value: `₹${businessMetrics.totalReceivedPayment.toLocaleString('en-IN')}`,
        subtitle: "Revenue from payment received",
        icon: CreditCard,
        color: "bg-purple-50 text-purple-600 border-purple-200",
        trend: "0%",
        trendUp: false
      },
    ],
    weeklyLeads: calculateWeeklyActivity(),
    leadSourceData: calculateLeadSources(),
    monthlyRevenue: calculateMonthlyRevenue()
  }

  const overviewMetrics = overviewData.metrics

  // Counts mapped directly from lead status values used in Lead Status page
  const salesStatusCounts = React.useMemo(() => {
    const c = { all: 0, pending: 0, running: 0, converted: 0, interested: 0, 'win/closed': 0, closed: 0, lost: 0 }
    const filtered = getFilteredLeads()
    c.all = filtered.length
    filtered.forEach(l => {
      const k = String(l.sales_status || '').toLowerCase()
      if (c[k] != null) c[k] += 1
    })
    return c
  }, [leads, overviewDateFilter])

  // Follow-up specific counts (only the requested ones)
  const followUpCounts = React.useMemo(() => {
    const c = { 'appointment scheduled': 0, 'closed/lost': 0, 'quotation sent': 0 }
    const filtered = getFilteredLeads()
    filtered.forEach(l => {
      const k = String(l.follow_up_status || '').toLowerCase()
      if (c[k] != null) c[k] += 1
    })
    return c
  }, [leads, overviewDateFilter])

  const leadStatuses = [
    {
      title: "Pending",
      count: salesStatusCounts.pending.toString(),
      subtitle: "Leads awaiting response",
      icon: Clock,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      title: "Running",
      count: salesStatusCounts.running.toString(),
      subtitle: "In progress",
      icon: Activity,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Converted",
      count: salesStatusCounts.converted.toString(),
      subtitle: "Successful conversions",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Interested",
      count: salesStatusCounts.interested.toString(),
      subtitle: "Warm leads",
      icon: UserPlus,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Win/Closed",
      count: salesStatusCounts['win/closed'].toString(),
      subtitle: "Won or closed",
      icon: Award,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      title: "Closed",
      count: salesStatusCounts.closed.toString(),
      subtitle: "Closed deals",
      icon: FileText,
      color: "bg-gray-50 text-gray-600 border-gray-200",
    },
    {
      title: "Lost",
      count: salesStatusCounts.lost.toString(),
      subtitle: "Declined/failed",
      icon: XCircle,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      title: "Meeting scheduled",
      count: (followUpCounts['appointment scheduled'] || 0).toString(),
      subtitle: "Upcoming meetings",
      icon: CalendarCheck,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      title: "Quotation Sent",
      count: (followUpCounts['quotation sent'] || 0).toString(),
      subtitle: "Proposals shared",
      icon: FileText,
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    {
      title: "Closed/Lost (Follow-up)",
      count: (followUpCounts['closed/lost'] || 0).toString(),
      subtitle: "Follow-up outcome",
      icon: PhoneOff,
      color: "bg-gray-50 text-gray-600 border-gray-200",
    },
  ]

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`flex-1 overflow-y-auto overflow-x-hidden p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Tab Navigation with Date Filter and Refresh Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-6">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`gap-2 flex items-center pb-2 border-b-2 ${
              activeTab === 'overview' 
                ? 'text-blue-600 border-blue-600' 
                : isDarkMode 
                  ? 'text-gray-400 border-transparent'
                  : 'text-gray-500 border-transparent'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('performance')}
            className={`gap-2 flex items-center pb-2 border-b-2 ${
              activeTab === 'performance' 
                ? 'text-blue-600 border-blue-600' 
                : isDarkMode 
                  ? 'text-gray-400 border-transparent'
                  : 'text-gray-500 border-transparent'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Performance
          </button>
        </div>
        {activeTab === 'overview' && (
          <div className="flex items-center gap-3">
            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                refreshing
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-opacity-90'
              } ${
                isDarkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title="Refresh dashboard data"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Calendar className={`h-4 w-4 ${
              overviewDateFilter 
                ? (isDarkMode ? 'text-blue-400' : 'text-blue-500')
                : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
            }`} />
            <input
              type="date"
              value={overviewDateFilter}
              onChange={(e) => setOverviewDateFilter(e.target.value)}
              className={`px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isDarkMode 
                  ? `bg-gray-800 border-gray-600 text-white ${overviewDateFilter ? 'border-blue-400 bg-blue-900' : ''}`
                  : `bg-white ${overviewDateFilter ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`
              }`}
              title="Filter data from selected date to today"
              max={new Date().toISOString().split('T')[0]}
            />
            {overviewDateFilter && (
              <button
                onClick={() => setOverviewDateFilter('')}
                className={`px-2 py-1 text-xs rounded ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Clear date filter"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {activeTab === 'overview' && (
        <>
      {/* Lead Status Summary - Moved to top */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Clock className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Lead Status Summary</h2>
        </div>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Overview of your leads by status</p>

        {/* Total Leads Card and Lead Status Cards - Combined grid with 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden">
          {/* Total Leads Card - Added at the beginning */}
          <Card className={cx(
            "border-2",
            isDarkMode 
              ? "bg-gray-800 border-blue-500 text-white" 
              : "bg-blue-50 text-blue-600 border-blue-200"
          )} isDarkMode={isDarkMode}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium font-medium ${
                isDarkMode 
                  ? 'text-white text-gray-200' 
                  : 'text-gray-800 text-gray-800'
              }`} isDarkMode={isDarkMode}>Total Leads</CardTitle>
              <UserPlus className={`h-5 w-5  rotate-12 ${
                isDarkMode ? 'text-blue-300' : 'text-blue-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold mb-1  ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{calculatedMetrics.totalLeads}</div>
              <p className={`text-xs  ${
                isDarkMode 
                  ? 'text-gray-300 text-gray-100' 
                  : 'text-gray-500 text-gray-700'
              }`}>All leads {overviewDateFilter ? 'from selected date to today' : 'in your pipeline'}</p>
            </CardContent>
          </Card>
          {leadStatuses.map((status, index) => {
            const Icon = status.icon
            return (
              <Card key={index} className={cx(
                "border-2",
                isDarkMode 
                  ? "bg-gray-800 border-gray-600 text-white" 
                  : status.color
              )} isDarkMode={isDarkMode}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium font-medium ${
                    isDarkMode 
                      ? 'text-white text-gray-200' 
                      : 'text-gray-800 text-gray-800'
                  }`} isDarkMode={isDarkMode}>{status.title}</CardTitle>
                  <Icon className={`h-5 w-5  rotate-12 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1  ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{status.count}</div>
                  <p className={`text-xs  ${
                    isDarkMode 
                      ? 'text-gray-300 text-gray-100' 
                      : 'text-gray-500 text-gray-700'
                  }`}>{status.subtitle}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Target & Timeline - Revenue Targets */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <Target className={`h-5 w-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Target & Timeline</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          <Card className={cx(
            "border-2 shadow-lg hover:shadow-xl",
            isDarkMode 
              ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white" 
              : "bg-gradient-to-br from-white to-gray-50 bg-indigo-50 text-indigo-600 border-indigo-200"
          )} isDarkMode={isDarkMode}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium font-medium ${isDarkMode ? 'text-gray-300 text-white' : 'text-gray-600 text-gray-800'}`} isDarkMode={isDarkMode}>Revenue Target</CardTitle>
              <div className={`p-2 rounded-full shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <Target className="h-5 w-5  rotate-12" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold ">₹{revenueTarget.toLocaleString('en-IN')}</div>
              <p className={`text-sm  text-gray-800 mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {userTarget.targetStartDate && userTarget.targetEndDate 
                  ? `Revenue target (${new Date(userTarget.targetStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} - ${new Date(userTarget.targetEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })})`
                  : 'Revenue target this quarter'
                }
              </p>
              <div className="w-full bg-gradient-to-r from-current to-transparent opacity-30 h-2 rounded-full  opacity-50 h-2.5"></div>
            </CardContent>
          </Card>

          <Card className={cx(
            "border-2 shadow-lg hover:shadow-xl",
            isDarkMode 
              ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white" 
              : "bg-gradient-to-br from-white to-gray-50 bg-green-50 text-green-700 border-green-200"
          )} isDarkMode={isDarkMode}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium font-medium ${
                isDarkMode 
                  ? 'text-gray-300 text-white' 
                  : 'text-gray-600 text-gray-800'
              }`} isDarkMode={isDarkMode}>Revenue Achieved</CardTitle>
              <div className={`p-2 rounded-full shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <CheckCircle className="h-5 w-5  rotate-12" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold  ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>₹{revenueCurrent.toLocaleString('en-IN')}</div>
              <p className={`text-sm mb-3  ${
                isDarkMode 
                  ? 'text-gray-300 text-gray-100' 
                  : 'text-gray-600 text-gray-800'
              }`}>
                {userTarget.targetStartDate && userTarget.targetEndDate 
                  ? `Revenue achieved (${userTarget.targetDurationDays || Math.ceil((new Date(userTarget.targetEndDate) - new Date(userTarget.targetStartDate)) / (1000 * 60 * 60 * 24))} days period)`
                  : 'Revenue achieved this quarter'
                }
              </p>
              <div className="w-full bg-gradient-to-r from-current to-transparent opacity-30 h-2 rounded-full  opacity-50 h-2.5"></div>
            </CardContent>
          </Card>

          <Card className={cx(
            "border-2 shadow-lg hover:shadow-xl",
            isDarkMode 
              ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white" 
              : "bg-gradient-to-br from-white to-gray-50 bg-gray-50 text-gray-700 border-gray-200"
          )} isDarkMode={isDarkMode}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium font-medium ${
                isDarkMode 
                  ? 'text-gray-300 text-white' 
                  : 'text-gray-600 text-gray-800'
              }`} isDarkMode={isDarkMode}>Days Left</CardTitle>
              <div className={`p-2 rounded-full shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <Calendar className="h-5 w-5  rotate-12" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold  ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{daysLeftInTarget}</div>
              <p className={`text-sm mb-3  ${
                isDarkMode 
                  ? 'text-gray-300 text-gray-100' 
                  : 'text-gray-600 text-gray-800'
              }`}>
                {userTarget.targetEndDate 
                  ? `Remaining days in target period`
                  : 'Remaining days in current month'
                }
              </p>
              <div className="w-full bg-gradient-to-r from-current to-transparent opacity-30 h-2 rounded-full  opacity-50 h-2.5"></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Key Performance Metrics - Enhanced styling */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <TrendingUp className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Key Performance Metrics</h2>
        </div>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Critical business indicators and trends</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
          {overviewMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className={cx(
                "border-2 shadow-lg hover:shadow-xl",
                isDarkMode 
                  ? "bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white" 
                  : "bg-gradient-to-br from-white to-gray-50",
                !isDarkMode && metric.color
              )} isDarkMode={isDarkMode}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className={`text-sm font-medium font-medium ${isDarkMode ? 'text-white text-gray-200' : 'text-gray-600 text-gray-800'}`}>{metric.title}</CardTitle>
                  <div className={`p-2 rounded-full shadow-md ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    <Icon className="h-5 w-5  rotate-12" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-1">
                    <div className={`text-3xl font-bold  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{metric.value}</div>
                    <div className={`flex items-center text-sm font-semibold px-2 py-1 rounded-full  scale-105 ${
                      isDarkMode 
                        ? (metric.trendUp ? 'text-green-300 bg-green-900' : 'text-red-300 bg-red-900')
                        : (metric.trendUp ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100')
                    }`}>
                      {metric.trendUp ? (
                        <TrendingUp className="w-4 h-4 mr-1 " />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1 " />
                      )}
                      {metric.trend}
                    </div>
                  </div>
                  <p className={`text-sm mb-3  ${
                    isDarkMode 
                      ? 'text-gray-300 text-gray-100' 
                      : 'text-gray-600 text-gray-800'
                  }`}>{metric.subtitle}</p>
                  <div className="w-full bg-gradient-to-r from-current to-transparent opacity-30 h-2 rounded-full  opacity-50 h-2.5"></div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Business Metrics Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <BarChart3 className={`h-5 w-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Business Metrics</h2>
        </div>
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Track your quotations, PIs, payments, and orders</p>

        {loadingMetrics ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {/* Quotation Metrics */}
            <div className="mb-6">
              <h3 className={`text-md font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Quotations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-blue-50 text-blue-600 border-blue-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Total Quotation</CardTitle>
                    <FileText className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.totalQuotation}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>All quotations created</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-green-50 text-green-600 border-green-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Approved Quotation</CardTitle>
                    <FileCheck className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-green-300' : 'text-green-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.approvedQuotation}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Approved quotations</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-orange-50 text-orange-600 border-orange-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Pending for Approval</CardTitle>
                    <Clock className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-orange-300' : 'text-orange-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.pendingQuotation}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Awaiting approval</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-red-50 text-red-600 border-red-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Rejected Quotation</CardTitle>
                    <FileX className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-red-300' : 'text-red-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.rejectedQuotation}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Rejected quotations</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* PI Metrics */}
            <div className="mb-6">
              <h3 className={`text-md font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Proforma Invoices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-indigo-50 text-indigo-600 border-indigo-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Total PI</CardTitle>
                    <Receipt className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.totalPI}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>All proforma invoices</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-green-50 text-green-600 border-green-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Approved PI</CardTitle>
                    <FileCheck className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-green-300' : 'text-green-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.approvedPI}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Approved proforma invoices</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-orange-50 text-orange-600 border-orange-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Pending for Approval PI</CardTitle>
                    <Clock className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-orange-300' : 'text-orange-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.pendingPI}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Awaiting approval</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-red-50 text-red-600 border-red-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Rejected PI</CardTitle>
                    <FileX className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-red-300' : 'text-red-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.rejectedPI}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Rejected proforma invoices</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Payment & Order Metrics */}
            <div className="mb-6">
              <h3 className={`text-md font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Payments & Orders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-purple-50 text-purple-600 border-purple-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Total Advance Payment</CardTitle>
                    <DollarSign className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-purple-300' : 'text-purple-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>₹{businessMetrics.totalAdvancePayment.toLocaleString('en-IN')}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Advance payments received</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-red-50 text-red-600 border-red-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Due Payment</CardTitle>
                    <CreditCard className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-red-300' : 'text-red-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>₹{businessMetrics.duePayment.toLocaleString('en-IN')}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Pending payment amount</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-teal-50 text-teal-600 border-teal-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Total Sale Order</CardTitle>
                    <ShoppingCart className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-teal-300' : 'text-teal-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{businessMetrics.totalSaleOrder}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Sale orders created</p>
                  </CardContent>
                </Card>

                <Card className={cx(
                  "border-2",
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-green-50 text-green-600 border-green-200"
                )} isDarkMode={isDarkMode}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium font-medium ${
                      isDarkMode 
                        ? 'text-white text-gray-200' 
                        : 'text-gray-800 text-gray-800'
                    }`} isDarkMode={isDarkMode}>Total Received Payment</CardTitle>
                    <CheckCircle className={`h-5 w-5  rotate-12 ${
                      isDarkMode ? 'text-green-300' : 'text-green-600'
                    }`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold mb-1  ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>₹{businessMetrics.totalReceivedPayment.toLocaleString('en-IN')}</div>
                    <p className={`text-xs  ${
                      isDarkMode 
                        ? 'text-gray-300 text-gray-100' 
                        : 'text-gray-500 text-gray-700'
                    }`}>Total payments received</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Business Metrics Charts */}
            <div className="mt-8">
              <h3 className={`text-md font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Trends & Analytics</h3>
              
              {/* Quotation Trends - Stacked Bar Chart */}
              <div className="mb-6">
                <Card className="border-2" isDarkMode={isDarkMode}>
                  <CardHeader>
                    <CardTitle className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`} isDarkMode={isDarkMode}>Quotation Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <StackedBarChart data={getQuotationStackedData()} height={250} isDarkMode={isDarkMode} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* PI Trends - Donut Chart */}
              <div className="mb-6">
                <Card className="border-2" isDarkMode={isDarkMode}>
                  <CardHeader>
                    <CardTitle className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`} isDarkMode={isDarkMode}>Proforma Invoice Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center">
                      <DonutChart data={getPIDonutData()} size={220} isDarkMode={isDarkMode} />
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      {getPIDonutData().map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {item.label}: {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Trends - Area Chart */}
              <div className="mb-6">
                <Card className="border-2" isDarkMode={isDarkMode}>
                  <CardHeader>
                    <CardTitle className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`} isDarkMode={isDarkMode}>Payment Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <AreaChart data={getPaymentAreaData()} height={250} isDarkMode={isDarkMode} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Gauge and Bar Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 overflow-hidden">
                {/* Sale Order Gauge */}
                <Card className="border-2" isDarkMode={isDarkMode}>
                  <CardHeader>
                    <CardTitle className={`text-sm font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`} isDarkMode={isDarkMode}>Sale Order Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GaugeChart 
                      value={businessMetrics.totalQuotation > 0 ? (businessMetrics.totalSaleOrder / businessMetrics.totalQuotation) * 100 : 0} 
                      max={100} 
                      height={180} 
                      isDarkMode={isDarkMode} 
                    />
                    <div className="text-center mt-2">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {businessMetrics.totalSaleOrder} / {businessMetrics.totalQuotation} Orders
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advance Payment Bar Chart */}
                <Card className="border-2" isDarkMode={isDarkMode}>
                  <CardHeader>
                    <CardTitle className={`text-sm font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`} isDarkMode={isDarkMode}>Payment Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <HorizontalBarChart 
                        data={[
                          { 
                            label: 'Advance Payment', 
                            value: businessMetrics.totalAdvancePayment, 
                            color: '#14b8a6' 
                          },
                          { 
                            label: 'Received Payment', 
                            value: businessMetrics.totalReceivedPayment, 
                            color: '#3b82f6' 
                          }
                        ]} 
                        height={180} 
                        isDarkMode={isDarkMode} 
                      />
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-[#14b8a6]"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Due Payment Gauge */}
                <Card className="border-2" isDarkMode={isDarkMode}>
                  <CardHeader>
                    <CardTitle className={`text-sm font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`} isDarkMode={isDarkMode}>Payment Due Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <GaugeChart 
                      value={(businessMetrics.totalReceivedPayment + businessMetrics.duePayment) > 0 
                        ? (businessMetrics.duePayment / (businessMetrics.totalReceivedPayment + businessMetrics.duePayment)) * 100 
                        : 0} 
                      max={100} 
                      height={180} 
                      isDarkMode={isDarkMode} 
                    />
                    <div className="text-center mt-2">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Due: ₹{businessMetrics.duePayment.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 overflow-hidden">
        {/* Weekly Leads Bar Chart */}
        <Card className="border-2" isDarkMode={isDarkMode}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className={`h-5 w-5 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
              <CardTitle className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`} isDarkMode={isDarkMode}>Weekly Leads Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <VerticalBarChart data={overviewData.weeklyLeads} height={250} isDarkMode={isDarkMode} />
            </div>
            <div className="mt-4 text-center">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Leads Generated This Week</span>
            </div>
          </CardContent>
        </Card>

        {/* Lead Source Donut Chart */}
        <Card className="border-2" isDarkMode={isDarkMode}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChartIcon className={`h-5 w-5 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`} />
              <CardTitle className={`text-lg font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`} isDarkMode={isDarkMode}>Lead Sources</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <DonutChart data={overviewData.leadSourceData} size={200} isDarkMode={isDarkMode} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {overviewData.leadSourceData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart */}
      <Card className="border-2 mb-8" isDarkMode={isDarkMode}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className={`h-5 w-5 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <CardTitle className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`} isDarkMode={isDarkMode}>Monthly Revenue Trend</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <LineChart data={overviewData.monthlyRevenue.map(item => ({
              ...item,
              value: item.value / 1000,
              originalValue: item.value,
              label: item.label
            }))} height={250} isDarkMode={isDarkMode} />
          </div>
          <div className="mt-4 text-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue in Thousands (₹)</span>
          </div>
        </CardContent>
      </Card>

        </>
      )}

      {activeTab === 'performance' && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className={`border-2 max-w-2xl w-full ${
            isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
          }`} isDarkMode={isDarkMode}>
            <CardContent className="p-12 text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                <Target className={`h-10 w-10 ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              
              <h2 className={`text-3xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Coming Soon
              </h2>
              
              <p className={`text-lg mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                This feature will be available soon
              </p>
              
              <div className={`space-y-4 mb-8 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <div className="flex items-center justify-center gap-3">
                  <Calendar className={`h-6 w-6 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <span className="text-base font-medium">Attendance Tracking</span>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <Award className={`h-6 w-6 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <span className="text-base font-medium">Performance Incentive Report</span>
                </div>
              </div>
              
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                You will be able to view your attendance records and detailed performance incentive reports here.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
