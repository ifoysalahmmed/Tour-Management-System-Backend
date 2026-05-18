import { model, Schema } from "mongoose";

import { slugify } from "../../utils/slugify.js";
import type { ITour } from "./tour.interface.js";

const tourSchema = new Schema<ITour>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    costFrom: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) =>
          value >= new Date(new Date().setHours(0, 0, 0, 0)),
        message: "Start date cannot be in the past",
      },
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator(value: Date) {
          const startDate = (this as ITour).startDate;
          return value >= startDate;
        },
        message: "End date must be on or after the start date",
      },
    },
    departureLocation: {
      type: String,
      trim: true,
    },
    arrivalLocation: {
      type: String,
      trim: true,
    },
    included: {
      type: [String],
      default: [],
    },
    excluded: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    tourPlan: {
      type: [String],
      default: [],
    },
    maxGuest: {
      type: Number,
      min: 1,
    },
    minAge: {
      type: Number,
      min: 0,
    },
    division: {
      type: Schema.Types.ObjectId,
      ref: "Division",
      required: [true, "Division id is required"],
    },
    tourType: {
      type: Schema.Types.ObjectId,
      ref: "TourType",
      required: [true, "Tour Type id is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tourSchema.index({
  division: 1,
  tourType: 1,
});

tourSchema.pre("validate", function () {
  if (this.isModified("title")) {
    this.slug = `${slugify(this.title)}-tour`;
  }
});

tourSchema.pre("findOneAndUpdate", function () {
  const targetTour = this.getUpdate() as Partial<ITour>;

  if (targetTour.title) {
    targetTour.slug = `${slugify(targetTour.title)}-tour`;
  }
});

export const TourModel = model<ITour>("Tour", tourSchema);
