// ============================================================
//  Inventory Items – Types
//  Sinh từ docs/swagger.json (schema thật của BE, 2026-07-14)
// ============================================================

/** Schema: InventoryItemResponse */
export interface InventoryItemResponse {
  id: string                 // GUID
  warehouseId: string        // GUID
  itemName: string | null
  unit: string | null
  quantity: number
  minimumQuantity: number
  isLowStock: boolean
}

/** Schema: CreateInventoryItemCommand — body POST /inventory-items */
export interface CreateInventoryItemPayload {
  warehouseId: string
  itemName: string
  unit: string
  minimumQuantity: number
}

/** Schema: UpdateInventoryItemRequest — body PUT /inventory-items/{id} (không đụng tồn) */
export interface UpdateInventoryItemPayload {
  itemName: string
  unit: string
  minimumQuantity: number
}

/** Schema: StockMoveCommand — body POST .../stock-in | .../stock-out */
export interface StockMovePayload {
  quantity: number
  referenceNo: string
  note: string
}

/** Schema: StockMoveResponse — tồn MỚI sau khi nhập/xuất */
export interface StockMoveResult {
  inventoryItemId: string
  quantity: number
  isLowStock: boolean
}

/** Schema: Create/Update InventoryItemResponse — result các action ghi */
export interface InventoryActionResult {
  id: string
  message: string | null
}

/** Schema: InventoryTransactionResponse */
export interface InventoryTransaction {
  id: string
  transactionType: string | null
  quantity: number
  referenceNo: string | null
  note: string | null
  createdAt: string
}
