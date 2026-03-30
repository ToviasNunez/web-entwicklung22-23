/**
 *  interface from Post to make sure that only post from this type are stored
 */
export interface Post {
  id: string | null | undefined;
  country: string;
  city: string;
  topic: string;
  rate: number;
  imagePath: string | null;
  content: string;
  subtitel: string;
  date: string | null;
  creator: string | null;
  author: string | null;
}
