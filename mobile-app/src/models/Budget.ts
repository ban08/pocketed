export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: "monthly" | "weekly";
}