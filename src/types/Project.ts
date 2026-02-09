export interface Project {
  _id: string;
  title: string;
  website: string;
  github: string;
  xProfile: string;
  creatorName?: string;
  views?: number;
  createdAt?: string;
  previewTitle?: string;
  previewImage?: string;
  user?: {
    name: string;
  };
}
