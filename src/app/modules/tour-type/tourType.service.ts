import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { TourModel } from "../tour/tour.model.js";
import type { ITourType } from "./tourType.interface.js";
import { TourTypeModel } from "./tourType.model.js";

const createTourTypeIntoDB = async (payload: ITourType) => {
  return await TourTypeModel.create(payload);
};

const getAllTourTypesFromDB = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(TourTypeModel.find(), query);

  const data = queryBuilder
    .search(["name"])
    .filter()
    .sort()
    .select()
    .paginate();

  const [tourTypes, meta] = await Promise.all([
    data.modelQuery,
    queryBuilder.getMetaData(),
  ]);

  return { tourTypes, meta };
};

const getTourTypeByIdFromDB = async (id: string) => {
  const tourType = await TourTypeModel.findById(id);

  if (!tourType) {
    throw new AppError(status.NOT_FOUND, "Tour type not found");
  }

  return tourType;
};

const updateTourTypeIntoDB = async (
  id: string,
  payload: Partial<ITourType>,
) => {
  const targetTourType = await TourTypeModel.findById(id);

  if (!targetTourType) {
    throw new AppError(status.NOT_FOUND, "Tour type not found");
  }

  return await TourTypeModel.findByIdAndUpdate(id, payload, {
    returnDocument: "after",
    runValidators: true,
  });
};

const deleteTourTypeFromDB = async (id: string) => {
  const targetTourType = await TourTypeModel.findById(id);

  if (!targetTourType) {
    throw new AppError(status.NOT_FOUND, "Tour type not found");
  }

  const isTourTypeUsed = await TourModel.exists({ tourType: id });

  if (isTourTypeUsed) {
    throw new AppError(status.BAD_REQUEST, "Tour type is used in tours");
  }

  return await TourTypeModel.findByIdAndDelete(id);
};

export const TourTypeServices = {
  createTourTypeIntoDB,
  getAllTourTypesFromDB,
  getTourTypeByIdFromDB,
  updateTourTypeIntoDB,
  deleteTourTypeFromDB,
};
