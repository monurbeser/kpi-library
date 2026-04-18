export type Direction = "Artması İyi" | "Azalması İyi";

export type Measurement = "Zaman" | "Yüzde" | "Sayı" | "Ton" | "Para" | "Ses" | "Puan" | "Adet" | "Enerji";

export interface Indicator {
  indicator_id: string;
  indicator_name: string;
  indicator_name_en?: string;
  indicator_definition: string;
  indicator_definition_en?: string;
  direction: Direction;
  measurement: Measurement;
  related_process: string;
  related_other_process?: string;
  indicator_tag: string;
  indicator_related_management_system?: string;
  constituent_name: string;
  organization_name: string;
  is_default: boolean;
  is_accepted: boolean;
  is_deleted: boolean;
  is_confirm_deleted: boolean;
  created_at: string;
  indicator_likes?: IndicatorLike[];
}

export interface IndicatorLike {
  like_id: string;
  indicator_id: string;
  liker_account_id: string;
  liker_account_name: string;
}

export interface Category {
  category_name: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  is_admin: boolean;
}

// Form types
export interface CreateIndicatorInput {
  indicator_name: string;
  indicator_definition: string;
  direction: Direction;
  measurement: Measurement;
  related_process: string;
  related_other_process?: string;
  indicator_tag?: string;
  indicator_related_management_system?: string;
  constituent_name?: string;
  organization_name?: string;
}

export interface UpdateIndicatorInput extends Partial<CreateIndicatorInput> {
  is_accepted?: boolean;
  is_deleted?: boolean;
  is_confirm_deleted?: boolean;
}
