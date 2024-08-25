export interface ICompareItem {
  product_id: number;
  title: string;
  slug:string,
  image: string;
  regular_price: number;
  price: number;
  default_quantity: number;
  description: string;
  rating: number;
  availability?: number;
  productAttribute?: any;
}
