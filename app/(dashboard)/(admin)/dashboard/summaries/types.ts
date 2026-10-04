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
  slug?: string;
  categoryId?: string;
  categoryName: string;
  categorySlug?: string;
  categoryOrderIndex?: number;
  orderIndex?: number;
  summariesCount: number;
  hasSummary: boolean;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
  icon?: string | null;
}

export interface SiblingPage {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  categoryId: string;
}

export interface SummariesTableProps {
  pages: PageWithSummaryStatus[];
  categories?: CategoryOption[];
  initialCategoryId?: string;
}

export interface SummaryListProps {
  summaries: SummaryRow[];
  pageId: string;
}

