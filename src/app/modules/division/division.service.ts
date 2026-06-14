import status from "http-status";

import { deleteFromCloudinary } from "../../helpers/cloudinary/index.js";
import { AppError } from "../../errors/app.error.js";
import { TourModel } from "../tour/tour.model.js";
import type { IDivision } from "./division.interface.js";
import { DivisionModel } from "./division.model.js";

const createDivisionIntoDB = async (payload: IDivision) => {
  return await DivisionModel.create(payload);
};

const getAllDivisionsFromDB = async () => {
  const [divisions, total] = await Promise.all([
    DivisionModel.find(),
    DivisionModel.countDocuments(),
  ]);

  return {
    divisions,
    total,
  };
};

const getDivisionBySlugFromDB = async (slug: string) => {
  const division = await DivisionModel.findOne({ slug });

  if (!division) {
    throw new AppError(status.NOT_FOUND, "Division not found");
  }

  return division;
};

const updateDivisionIntoDB = async (
  id: string,
  payload: Partial<IDivision>,
) => {
  const targetDivision = await DivisionModel.findById(id);

  if (!targetDivision) {
    throw new AppError(status.NOT_FOUND, "Division not found");
  }

  if (payload.thumbnail && targetDivision.thumbnail) {
    await deleteFromCloudinary(targetDivision.thumbnail);
  }

  return await DivisionModel.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteDivisionFromDB = async (id: string) => {
  const targetDivision = await DivisionModel.findById(id);

  if (!targetDivision) {
    throw new AppError(status.NOT_FOUND, "Division not found");
  }

  const isUsedInTour = await TourModel.exists({ division: id });

  if (isUsedInTour) {
    throw new AppError(
      status.CONFLICT,
      "Division cannot be deleted because it is associated with one or more tours",
    );
  }

  if (targetDivision.thumbnail) {
    await deleteFromCloudinary(targetDivision.thumbnail);
  }

  return await DivisionModel.findByIdAndDelete(id);
};

export const DivisionServices = {
  createDivisionIntoDB,
  getAllDivisionsFromDB,
  getDivisionBySlugFromDB,
  updateDivisionIntoDB,
  deleteDivisionFromDB,
};
