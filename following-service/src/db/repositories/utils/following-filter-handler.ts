import { Filter } from '../../../types/where-conditions';
import { Op } from 'sequelize';

export const followingFilterHandler = (
  filters: Filter[],
  where: any,
  include: any
) => {
  filters.forEach((f) => {
    if (f.is_foreign_key) {
      const parentModel = include.find((inc: any) => inc.as === f.belongs_to);
      const relatedModel = parentModel.include
        ? parentModel.include.find((inc: any) => Boolean(inc.as))
        : null;
      if (relatedModel && parentModel) {
        const where = relatedModel.where;
        if (where) {
          where[Op.and].push({ [f.value.toLowerCase()]: true });
        } else {
          relatedModel.where = {
            [Op.and]: [{ [f.value.toLowerCase()]: true }],
          };
        }
        return;
      }
      if (parentModel.where && parentModel.where[f.column]) {
        parentModel.where[f.column][Op.or].push(f.value);
      } else {
        parentModel.where = { [f.column]: { [Op.or]: [f.value] } };
      }
      return;
    }
    if (where[f.column]) {
      where[f.column][Op.or].push(f.value);
    } else {
      where[f.column] = { [Op.or]: [f.value] };
    }
  });
};
