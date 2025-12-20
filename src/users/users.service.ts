import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/db';
import { Model } from 'mongoose';
import { updateUserDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return {
      message: 'User Found Successfully',
      user,
    };
  }

  async update(id: string, updateUserDto: updateUserDto) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userModel.findByIdAndUpdate(id, {
      role: updateUserDto.role,
    });

    return {
      message: 'User Updated Successfully',
      user,
    };
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userModel.deleteOne(user._id);

    return {
      message: 'User Deleted Successfully',
      user,
    };
  }
}
