export interface Team {
  id: number;
  name: string;
  description: string;
  projectsCount?: number;
  teammates?: {
    id: number;
    profile: {
      firstName: string;
      lastName: string;
    };
    admin: boolean;
    active: boolean;
    status: string;
  }[]; 
}
