import { User } from './user';

export type PasswordChangeNotification = {
  user: User;
  link: string;
};
