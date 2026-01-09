export interface Reward {
  currency: number;
  amount: number;
  isAmountWithdrawable: boolean;
}

export interface BonusBox {
  _id?: string;
  backgroundImageUrl: string;
  mobileBackgroundImageUrl?: string;
  objectImageUrl?: string;
  buttonText: string;
  enableButton?: boolean;
  expireAt?: string; // Optional
  reward?: Reward[]; // Optional
  buttonAndTimerPosition?: number;
}

export interface Slide {
  _id: string;
  title: string;
  isActive: boolean;
  bonuses: BonusBox[];
  createdAt: string;
}

export interface SlideListItem {
  _id: string;
  title: string;
  isActive: boolean;
  createdAt: string;
}

export interface SlideFormValues {
  title: string;
  isActive: boolean;
  bonuses: BonusBox[];
}

export interface CreateSlidePayload {
  title: string;
  isActive: boolean;
  bonuses: Omit<BonusBox, "_id">[];
}

export interface UpdateSlidePayload extends CreateSlidePayload {
  slideId: string;
}
