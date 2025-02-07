export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: {
    city: string;
    state: string;
  };
  salary: string;
  jobType: string;
  status: "open" | "closed";
  applicants: {
    filled: number;
    total: number;
  };
  updatedAt: string;
}

export interface BookmarkData {
  id: string;
}