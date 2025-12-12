import { apiGet, apiPost } from '@/libs/api'

export interface ProductListResponse {
  status: number
  message: string
  data: ProductData[]
}

export interface ProductData {
  id: number
  productType: string
  size: string
  typeSpecs: string
  position: string
  description: string
  media: string[]
  pattern: string
  loadIndex: string
  brand: string
  supplier: string
  weight: number
  countryOrigin: string
  cbmPerCarton: number
  cartonsPerSKU: number
  totalWeightPerCarton: number
  unitsPerCarton: number
  category: number[] // category IDs
  companyId: number
  isActive: boolean
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  categories: CategoryItem[] // detailed categories
}

export interface CategoryItem {
  id: number
  name: string
}

// GET category list
export function getProductList() {
  return apiGet<ProductListResponse>('/product/product-list')
}
