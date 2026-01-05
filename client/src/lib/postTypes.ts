export type TextPost = {
  id: string;
  type: "text";
  user: string;
  content: string;
};

export type VideoPost = {
  id: string;
  type: "video";
  user: string;
  src: string;
  caption?: string;
};

export type ListingPost = {
  id: string;
  type: "listing";
  user: string;
  title: string;
  price: number;
  location?: string;
  media?: string;
};

export type Post = TextPost | VideoPost | ListingPost;
