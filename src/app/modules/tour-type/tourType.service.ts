import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import type { ITourType } from "./tourType.interface.js";
import { tourTypeModel } from "./tourType.model.js";

const createTourTypeIntoDB = async (payload: ITourType) => {
  return await tourTypeModel.create(payload);
};

const getAllTourTypesFromDB = async () => {
  const [tourTypes, total] = await Promise.all([
    tourTypeModel.find(),
    tourTypeModel.countDocuments(),
  ]);

  return { tourTypes, total };
};

const updateTourTypeIntoDB = async (id: string, payload: ITourType) => {
  const targetTourType = await tourTypeModel.findById(id);

  if (!targetTourType) {
    throw new AppError(status.NOT_FOUND, "Tour type not found");
  }

  return await tourTypeModel.findByIdAndUpdate(id, payload, { new: true });
};

export const TourTypeServices = {
  createTourTypeIntoDB,
  getAllTourTypesFromDB,
  updateTourTypeIntoDB,
};
