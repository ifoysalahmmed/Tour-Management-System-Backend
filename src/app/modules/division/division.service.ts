import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import { TourModel } from "../tour/tour.model.js";
import type { IDivision } from "./division.interface.js";
import { DivisionModel } from "./division.model.js";

const createDivisionIntoDB = async (payload: IDivision) => {
  const { name } = payload;

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const divisionData = { ...payload, slug };

  return await DivisionModel.create(divisionData);
};

const getAllDivisionsFromDB = async () => {
  const [divisions, total] = await Promise.all([
    DivisionModel.find(),
    DivisionModel.countDocuments(),
  ]);

  return { divisions, total };
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

  const { name } = payload;

  if (!name) {
    throw new AppError(
      status.BAD_REQUEST,
      "Name is required for updating division",
    );
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const divisionData = { ...payload, slug };

  return await DivisionModel.findByIdAndUpdate(id, divisionData, {
    new: true,
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
    throw new AppError(status.CONFLICT, "Division is used in a tour");
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
