import { User } from './user';

export type ActivationNotification = {
  user: User;
  link: string;
};
