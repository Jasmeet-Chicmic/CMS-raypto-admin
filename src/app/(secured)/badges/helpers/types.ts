export const BADGE_TYPES = {
  CONDITIONAL: 1,
  EXPERT: 2,
} as const;
export const BADGE_TYPE_NAMES = {
  [BADGE_TYPES.CONDITIONAL]: "Conditional",
  [BADGE_TYPES.EXPERT]: "Expert",
};
export type BadgeTypes = (typeof BADGE_TYPES)[keyof typeof BADGE_TYPES];
export interface BadgeConditions {
  eventsJoined?: number;
  eventsAttended?: number;
  pointsEarned?: number;
  postsCreated?: number;
  usersReferred?: number;
  learningModulesCompleted?: number;
  completedGoals?: number;
  connectionScore?: number;
  engagementScore?: number;
  growthScore?: number;
  impactScore?: number;
  businessGrowthScore?: number;
}
export interface BadgesInterface {
  _id: string;
  name: string;
  type: BadgeTypes;
  imageURL: string;
  conditions?: BadgeConditions;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserBadgesInterface {
  _id: string;
  badgeId: string;
  userId: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
