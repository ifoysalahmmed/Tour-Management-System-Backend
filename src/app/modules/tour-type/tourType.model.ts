import { model, Schema } from "mongoose";

import type { ITourType } from "./tourType.interface.js";

const tourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const TourTypeModel = model<ITourType>("TourType", tourTypeSchema);
