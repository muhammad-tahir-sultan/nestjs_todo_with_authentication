import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { loginDTO, registerDTO } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/db';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: registerDTO) {
    const { name, email, password, role } = dto;
    const userExist = await this.userModel.findOne({ email });

    if (userExist) {
      throw new ConflictException('Email Already in Use.');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'User Created Successfully.',
      userId: user._id,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async login(dto: loginDTO) {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid Credentials.');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
