export interface ScanResult {
  id: string
  identifier: string
  redFlags: string[]
  createdAt: string
}

export interface ApiScanResponse {
  data: {
    id: string
    identifier: string
    redFlags: string[]
    createdAt: string
  }
}
