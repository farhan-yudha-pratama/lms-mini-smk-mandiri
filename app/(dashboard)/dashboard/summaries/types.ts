export interface ActionResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface SummaryRow {
  id?: string;
  pageId: string;
  title: string;
  content: string;
  orderIndex: number;
}

export interface PageWithSummaryStatus {
  id: string;
  title: string;
  categoryName: string;
  summariesCount: number;
  hasSummary: boolean;
}

export interface SummariesTableProps {
  pages: PageWithSummaryStatus[];
}

export interface SummaryListProps {
  summaries: SummaryRow[];
  pageId: string;
}
