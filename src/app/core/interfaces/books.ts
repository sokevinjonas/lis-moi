import { Category } from './category';

export interface Books {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  hasDigitalVersion: boolean;
  langage: string;
  nbrPage: number;
  bioAuthor: string;
  author: string;
  url: string;
  price: number;
  category_id: Category;
  isFavorite?: boolean;
  progress: number;
}
