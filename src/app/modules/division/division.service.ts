import status from "http-status";

import { AppError } from "../../errors/app.error.js";
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

  return await DivisionModel.findByIdAndUpdate(id, divisionData, { new: true });
};

export const DivisionService = {
  createDivisionIntoDB,
  getAllDivisionsFromDB,
  updateDivisionIntoDB,
};
