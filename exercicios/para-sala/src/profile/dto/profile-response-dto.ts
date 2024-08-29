import { Profile } from '../entities/profile.entity';

export class ProfileResponseDto {
  id: string;
  minibio?: string;
  avatar?: string;

  constructor(profile: Profile) {
    this.id = profile.id;
    this.minibio = profile.minibio;
    this.avatar = profile.avatar;
  }
}
