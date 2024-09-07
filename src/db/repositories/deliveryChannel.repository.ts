import { IDeliveryChannelRepository } from './interfaces';
import {
  DeliveryChannelInput,
  DeliveryChannelOutput,
} from '../models/DeliveryChannel.model';
import { DeliveryChannelModel } from '../models';

class DeliveryChannelRepository implements IDeliveryChannelRepository {
  async create(
    providerInput: DeliveryChannelInput
  ): Promise<DeliveryChannelOutput> {
    const provider = await DeliveryChannelModel.create(providerInput);
    return provider.toJSON() as DeliveryChannelOutput;
  }

  async update(
    id: string,
    providerInput: Partial<DeliveryChannelInput>
  ): Promise<DeliveryChannelOutput | null> {
    const provider = await DeliveryChannelModel.findByPk(id);
    if (!provider) {
      return null;
    }

    await provider.update(providerInput);
    return provider.toJSON() as DeliveryChannelOutput;
  }

  async delete(id: string): Promise<boolean> {
    const deletedCount = await DeliveryChannelModel.destroy({
      where: { id },
    });

    return deletedCount > 0;
  }

  async findById(id: string): Promise<DeliveryChannelOutput | null> {
    const provider = await DeliveryChannelModel.findByPk(id);
    if (!provider) {
      return null;
    }

    return provider.toJSON() as DeliveryChannelOutput;
  }

  async findAll(): Promise<DeliveryChannelOutput[]> {
    const providers = await DeliveryChannelModel.findAll();
    return providers.map(
      (provider) => provider.toJSON() as DeliveryChannelOutput
    );
  }
}
