export interface DataTablesResponse {
    recordsTotal: number;
    recordsFiltered: number;
    data: any[]; // Change 'any' to the actual type for your data
    startnumber: number;
    // Add other properties if needed
  }
  