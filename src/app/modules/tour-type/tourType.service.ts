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

export const TourTypeServices = {
  createTourTypeIntoDB,
  getAllTourTypesFromDB,
};
