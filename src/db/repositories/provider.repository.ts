import { IProviderRepository } from './interfaces';
import { ProviderInput, ProviderOutput } from '../models/Provider.model';
import { ProviderModel } from '../models';

class ProviderRepository implements IProviderRepository {
  async create(providerInput: ProviderInput): Promise<ProviderOutput> {
    const provider = await ProviderModel.create(providerInput);
    return provider.toJSON() as ProviderOutput;
  }

  async update(
    id: string,
    providerInput: Partial<ProviderInput>
  ): Promise<ProviderOutput | null> {
    const provider = await ProviderModel.findByPk(id);
    if (!provider) {
      return null;
    }

    await provider.update(providerInput);
    return provider.toJSON() as ProviderOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await ProviderModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<ProviderOutput | null> {
    const provider = await ProviderModel.findByPk(id);
    if (!provider) {
      return null;
    }

    return provider.toJSON() as ProviderOutput;
  }

  async findAll(): Promise<ProviderOutput[]> {
    const providers = await ProviderModel.findAll();
    return providers.map((provider) => provider.toJSON() as ProviderOutput);
  }
}

export default ProviderRepository;
