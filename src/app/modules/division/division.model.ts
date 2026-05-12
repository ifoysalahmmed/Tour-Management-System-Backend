import { model, Schema } from "mongoose";

import type { IDivision } from "./division.interface.js";

const divisionSchema = new Schema<IDivision>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    thumbnail: { type: String, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

divisionSchema.pre("validate", function () {
  if (this.isModified("name")) {
    this.slug = `${this.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")}-division`;
  }
});

divisionSchema.pre("findOneAndUpdate", function () {
  const targetDivision = this.getUpdate() as Partial<IDivision>;

  if (targetDivision.name) {
    targetDivision.slug = `${targetDivision.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")}-division`;
  }
});

export const DivisionModel = model<IDivision>("Division", divisionSchema);
