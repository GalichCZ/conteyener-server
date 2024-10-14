import { Transaction } from 'sequelize';
import GError from '../error-handler/GError';

export const getEntity = async <E>(
  entity_id: string,
  entityName: string,
  entityRepository: any,
  methodName: string,
  serviceName: string,
  transaction?: Transaction
): Promise<E> => {
  const entity = await entityRepository.findById(entity_id, transaction);
  if (!entity) {
    throw new GError({
      message: `${entityName} does not exist`,
      status: 400,
      methodName,
      serviceName,
    });
  }
  return entity;
};
