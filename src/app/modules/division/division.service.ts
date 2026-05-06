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

export const DivisionService = {
  createDivisionIntoDB,
  getAllDivisionsFromDB,
};
