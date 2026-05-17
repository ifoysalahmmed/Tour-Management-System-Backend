import type { Types } from "mongoose";

export interface ITour {
  title: string;
  slug: string;
  description?: string;
  images?: string[];
  location: string;
  costFrom: number;
  startDate: Date;
  endDate: Date;
  departureLocation?: string;
  arrivalLocation?: string;
  included?: string[];
  excluded?: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
}

export type TTourCreate = Required<
  Pick<
    ITour,
    | "title"
    | "location"
    | "costFrom"
    | "startDate"
    | "endDate"
    | "division"
    | "tourType"
  > &
    Partial<
      Omit<
        ITour,
        | "title"
        | "slug"
        | "location"
        | "costFrom"
        | "startDate"
        | "endDate"
        | "division"
        | "tourType"
      >
    >
>;

export type TTourUpdate = Partial<Omit<ITour, "slug">>;
