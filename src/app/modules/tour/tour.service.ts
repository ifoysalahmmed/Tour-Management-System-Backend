import status from "http-status";

import { AppError } from "../../errors/app.error.js";
import { DivisionModel } from "../division/division.model.js";
import { tourTypeModel } from "../tour-type/tourType.model.js";
import type { ITour } from "./tour.interface.js";
import { tourModel } from "./tour.model.js";

const createTourIntoDB = async (payload: Partial<ITour>) => {
  const { title, division, tourType } = payload as ITour;

  const isDivisionExists = await DivisionModel.exists({ _id: division });

  if (!isDivisionExists) {
    throw new AppError(status.NOT_FOUND, "Invalid division ID");
  }

  const isTourTypeExists = await tourTypeModel.exists({ _id: tourType });

  if (!isTourTypeExists) {
    throw new AppError(status.NOT_FOUND, "Invalid tour type ID");
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-");

  const newTour = { ...payload, slug } as ITour;

  return await tourModel.create(newTour);
};

export const TourServices = {
  createTourIntoDB,
};
