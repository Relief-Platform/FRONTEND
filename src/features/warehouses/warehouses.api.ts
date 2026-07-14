// ============================================================
//  Warehouses API — /api/warehouses (sinh từ swagger.json thật)
//
//  Quyền (API Reference mục 4):
//  - GET list / GET by id : mọi role đã đăng nhập
//  - POST / PUT / DELETE  : Admin + WarehouseManager
//
//  DELETE = ngưng hoạt động (set IsActive=false), không xoá cứng.
//  Envelope ApiResponse do http.ts tự bóc; lỗi (400/403/404...)
//  interceptor tự ném ApiError với message từ errorMessages.
// ============================================================

import { http } from '@/lib/api/http'
import type { PagedResult } from '@/lib/api/paging'
import type {
  WarehouseResponse,
  CreateWarehousePayload,
  UpdateWarehousePayload,
  WarehouseActionResult,
} from './warehouses.types'

/** GET /api/warehouses — danh sách kho (PHÂN TRANG, trả nguyên khung để UI làm pagination) */
export async function getWarehouses(
  pageNumber = 1,
  pageSize = 20,
): Promise<PagedResult<WarehouseResponse>> {
  const { data } = await http.get<PagedResult<WarehouseResponse>>('/warehouses', {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  })
  return data
}

/** Tiện ích: lấy hết kho cho dropdown chọn kho (không cần pagination UI) */
export async function getAllWarehouses(): Promise<WarehouseResponse[]> {
  const { data } = await http.get<PagedResult<WarehouseResponse>>('/warehouses', {
    params: { PageNumber: 1, PageSize: 100 },
  })
  return data.items ?? []
}

/** GET /api/warehouses/{id} — chi tiết 1 kho */
export async function getWarehouseById(id: string): Promise<WarehouseResponse> {
  const { data } = await http.get<WarehouseResponse>(`/warehouses/${id}`)
  return data
}

/** POST /api/warehouses — tạo kho mới (Admin + WarehouseManager) */
export async function createWarehouse(
  payload: CreateWarehousePayload,
): Promise<WarehouseActionResult> {
  const { data } = await http.post<WarehouseActionResult>('/warehouses', payload)
  return data
}

/** PUT /api/warehouses/{id} — cập nhật kho (Admin + WarehouseManager) */
export async function updateWarehouse(
  id: string,
  payload: UpdateWarehousePayload,
): Promise<WarehouseActionResult> {
  const { data } = await http.put<WarehouseActionResult>(`/warehouses/${id}`, payload)
  return data
}

/** DELETE /api/warehouses/{id} — ngưng hoạt động kho (Admin + WarehouseManager) */
export async function deactivateWarehouse(id: string): Promise<WarehouseActionResult> {
  const { data } = await http.delete<WarehouseActionResult>(`/warehouses/${id}`)
  return data
}