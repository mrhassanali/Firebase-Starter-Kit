export interface AddTags {
  userId: string;
  tag: string;
}

export interface UserModal {
  uid: string;
  stripeId: string;
  stripeLink: string;
  email: string;
  tags?: string[];
  name?: string;
  emailVerified: boolean;
  credits?: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailsModal {
  uid: string;
  stripeId: string;
  stripeLink: string;
  email: string;
  tags?: string[];
  name?: string;
  emailVerified: boolean;
  credits?: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  plan: string;
  joinDate: string;
}
