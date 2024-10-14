import { IBaseRepository } from './base-repository.interface';
import {
  ContainerTypeInput,
  ContainerTypeOutput,
} from '../../models/ContainerType.model';

export interface IContainerTypeRepository
  extends IBaseRepository<ContainerTypeInput, ContainerTypeOutput> {}
