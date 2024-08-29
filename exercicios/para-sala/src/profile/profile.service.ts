import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../user/entities/user.entity';
import { ProfileResponseDto } from './dto/profile-response-dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async create(
    createProfileDto: CreateProfileDto,
  ): Promise<ProfileResponseDto> {
    const { userId, ...profileData } = createProfileDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newProfile = this.profileRepository.create(profileData);
    newProfile.user = user;

    await this.profileRepository.save(newProfile);
    user.profile = newProfile;
    await this.userRepository.save(user);

    return new ProfileResponseDto(newProfile);
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.findOne(id);

    if (updateProfileDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateProfileDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateProfileDto.userId} not found`,
        );
      }
      profile.user = user;
    }

    if (updateProfileDto.minibio) {
      profile.minibio = updateProfileDto.minibio;
    }

    if (updateProfileDto.avatar) {
      profile.avatar = updateProfileDto.avatar;
    }

    return this.profileRepository.save(profile);
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findOne(id);
    await this.profileRepository.remove(profile);
  }
}
