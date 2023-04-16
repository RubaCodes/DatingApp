import { User } from './user';

export class userParams {
  gender: string;
  minAge = 18;
  maxAge = 99;
  pageSize = 5;
  pageNumber = 1;
  orderBy = 'lastActive';
  /**
   *
   */
  constructor(user: User) {
    this.gender = user.gender == 'female' ? 'male' : 'female';
  }
}
