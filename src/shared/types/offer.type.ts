import { Category, OfferType, User } from './index.js';


export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  image: string;
  type: OfferType
  price: number;
  categories: Category[];
  user: User;
}
