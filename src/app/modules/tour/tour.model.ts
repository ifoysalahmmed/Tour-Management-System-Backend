import { model, Schema } from "mongoose";

import type { ITour } from "./tour.interface.js";

const tourSchema = new Schema<ITour>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    location: { type: String },
    costFrom: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: [true, "Division id is required"],
      index: true,
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: [true, "Tour Type id is required"],
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const TourModel = model<ITour>("Tour", tourSchema);
