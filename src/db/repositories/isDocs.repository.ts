import { IsDocsModel } from '../models';
import { IsDocsInput, IsDocsOutput } from '../models/IsDoc.model';
import { IIsDocsRepository } from './interfaces/isDocs-repository.interface';
import { Op, Transaction } from 'sequelize';

class IsDocsRepository implements IIsDocsRepository {
  async create(input: IsDocsInput): Promise<IsDocsOutput> {
    const isDocs = await IsDocsModel.create(input);
    return isDocs.toJSON() as IsDocsOutput;
  }

  async update(
    id: string,
    input: Partial<IsDocsInput>
  ): Promise<IsDocsOutput | null> {
    const isDocs = await IsDocsModel.findByPk(id);
    if (!isDocs) {
      return null;
    }

    await isDocs.update(input);
    return isDocs.toJSON() as IsDocsOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await IsDocsModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async deleteByOrderNumberIds(
    orderNumberIds: string[],
    transaction?: Transaction
  ): Promise<boolean> {
    const options = transaction ? { transaction } : {};
    const deletedCount = await IsDocsModel.destroy({
      where: { order_id: { [Op.in]: orderNumberIds } },
      ...options,
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<IsDocsOutput | null> {
    const isDocs = await IsDocsModel.findByPk(id);
    if (!isDocs) {
      return null;
    }

    return isDocs.toJSON() as IsDocsOutput;
  }

  async findAll(): Promise<IsDocsOutput[]> {
    const isDocsList = await IsDocsModel.findAll();
    return isDocsList.map((isDocs) => isDocs.toJSON() as IsDocsOutput);
  }

  async createIsDocs(
    orderNumberIds: string[],
    transaction?: Transaction
  ): Promise<IsDocsOutput[]> {
    const options = transaction ? { transaction } : {};

    const isDocsList = await IsDocsModel.bulkCreate(
      orderNumberIds.map((id) => ({
        pi: false,
        ci: false,
        pl: false,
        ss_ds: false,
        contract_agrees: false,
        cost_agrees: false,
        instructions: false,
        ed: false,
        co: false,
        bill: false,
        ready_to_process: false,
        link_to_docs: null,
        order_id: id,
      })),
      options
    );
    return isDocsList.map((isDocs) => isDocs.toJSON() as IsDocsOutput);
  }
}

export default IsDocsRepository;
