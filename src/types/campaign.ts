export type ICampaign = {
    id: number;
    name: string | null;
    image: string;
    start_date: string;
    end_date: string;
    product_id: string;
    created_at: string;
    updated_at: string;
  };
  export interface ICampaignResponse {
    message: string;
    data: {
      count: number;
      rows: ICampaign[];
    };
  }
  