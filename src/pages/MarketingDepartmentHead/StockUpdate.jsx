// Import and re-export the StockUpdate from SalesDepartmentHead as MarketingDepartmentHead StockUpdate
// This provides the same interface as the sales head stock update
import StockUpdate from '../SalesDepartmentHead/StockUpdate';

// Re-export with the same name - this is a direct reference to the same component
// Both sales head and marketing sales head will now use the same stock update interface
export default StockUpdate;