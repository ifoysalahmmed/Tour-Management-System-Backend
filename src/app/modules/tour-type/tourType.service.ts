import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import type { ITourType } from "./tourType.interface.js";
import { TourTypeModel } from "./tourType.model.js";

const createTourTypeIntoDB = async (payload: ITourType) => {
  return await TourTypeModel.create(payload);
};

const getAllTourTypesFromDB = async () => {
  const [tourTypes, total] = await Promise.all([
    TourTypeModel.find(),
    TourTypeModel.countDocuments(),
  ]);

  return { tourTypes, total };
};

const updateTourTypeIntoDB = async (id: string, payload: ITourType) => {
  const targetTourType = await TourTypeModel.findById(id);

  if (!targetTourType) {
    throw new AppError(status.NOT_FOUND, "Tour type not found");
  }

  return await TourTypeModel.findByIdAndUpdate(id, payload, { new: true });
};

const deleteTourTypeFromDB = async (id: string) => {
  const targetTourType = await TourTypeModel.findById(id);

  if (!targetTourType) {
    throw new AppError(status.NOT_FOUND, "Tour type not found");
  }

  const isTourTypeUsed = await TourTypeModel.exists({ tourType: id });

  if (isTourTypeUsed) {
    throw new AppError(status.BAD_REQUEST, "Tour type is used in tours");
  }

  return await TourTypeModel.findByIdAndDelete(id);
};

export const TourTypeServices = {
  createTourTypeIntoDB,
  getAllTourTypesFromDB,
  updateTourTypeIntoDB,
  deleteTourTypeFromDB,
};
