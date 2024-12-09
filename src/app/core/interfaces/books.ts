import { Category } from './category';

export interface Books {
  id: number;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  hasDigitalVersion: boolean;
  langage: string;
  nbrPage: number;
  bioAuthor: string;
  url: string;
  price: number;
  categoryId: Category;
  isFavorite?: boolean;
  progress: number;
}
