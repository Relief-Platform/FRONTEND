// ============================================================
//  Inventory – Types
// ============================================================

/** Schema: InventoryItemResponse */
export interface InventoryItemResponse {
  id: string                 // GUID
  warehouseId: string        // GUID
  warehouseName: string | null
  itemName: string | null
  unit: string | null        // đơn vị: "thùng", "chai", "kg"...
  quantity: number           // tồn hiện tại (chỉ đổi qua stock-in/stock-out)
  minimumQuantity: number    // ngưỡng cảnh báo
  isLowStock: boolean        // true = dưới ngưỡng, UI tô cảnh báo
}

/** Schema: CreateInventoryItemCommand — body POST /inventory-items
 *  Lưu ý: KHÔNG có quantity — tồn khởi tạo luôn = 0, nhập qua stock-in */
export interface CreateInventoryItemPayload {
  warehouseId: string
  itemName: string
  unit: string
  minimumQuantity: number
}

/** Schema: UpdateInventoryItemRequest — body PUT /inventory-items/{id}
 *  Chỉ sửa mô tả, KHÔNG sửa tồn trực tiếp */
export interface UpdateInventoryItemPayload {
  itemName: string
  unit: string
  minimumQuantity: number
}

/** Schema: StockInRequest / StockOutRequest — body nhập/xuất kho */
export interface StockMovePayload {
  quantity: number
  referenceNo?: string | null   // số chứng từ, optional
  note?: string | null
}

/** Schema: StockInResponse / StockOutResponse */
export interface StockMoveResult {
  inventoryItemId: string
  quantity: number              // tồn MỚI sau khi nhập/xuất
  isLowStock: boolean
  message: string | null
}

/** Schema: Create/UpdateInventoryItemResponse */
export interface InventoryActionResult {
  id: string
  message: string | null
}

/** Schema: InventoryTransactionResponse — lịch sử nhập/xuất */
export interface InventoryTransaction {
  id: string
  inventoryItemId: string
  quantity: number
  transactionType: string | null   // "StockIn" | "StockOut" (BE trả string)
  referenceNo: string | null
  note: string | null
  createdAt: string                // ISO UTC
}