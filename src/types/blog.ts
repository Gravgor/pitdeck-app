interface BlogSubsection {
  title: string;
  content: string;
  image?: string;
  highlights?: string[];
}

interface BlogSection {
  title: string;
  content: string;
  subsections?: BlogSubsection[];
  highlights?: string[];
  images?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  introduction: string;
  sections: BlogSection[];
  conclusion: string;
  cta: string;
  slug: string;
  published: boolean;
  authorId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    image: string;
  };
} 