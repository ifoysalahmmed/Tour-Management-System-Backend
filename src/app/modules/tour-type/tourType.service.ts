import type { ITourType } from "./tourType.interface.js";
import { tourTypeModel } from "./tourType.model.js";

const createTourTypeIntoDB = async (payload: ITourType) => {
  return await tourTypeModel.create(payload);
};

export const TourTypeServices = {
  createTourTypeIntoDB,
};
