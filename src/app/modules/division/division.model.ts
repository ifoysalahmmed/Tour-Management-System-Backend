import { model, Schema } from "mongoose";

import { slugify } from "../../utils/slugify.js";
import type { IDivision } from "./division.interface.js";

const divisionSchema = new Schema<IDivision>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

divisionSchema.pre("validate", function () {
  if (this.isModified("name")) {
    this.slug = `${slugify(this.name)}-division`;
  }
});

divisionSchema.pre("findOneAndUpdate", function () {
  const targetDivision = this.getUpdate() as Partial<IDivision>;

  if (targetDivision.name) {
    targetDivision.slug = `${slugify(targetDivision.name)}-division`;
  }
});

export const DivisionModel = model<IDivision>("Division", divisionSchema);
