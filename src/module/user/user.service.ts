import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheTtl } from 'src/configs/cache';
import CryptoHelper from 'src/helpers/crypto-helper';
import { UserPassword } from './entities/user-password.entity';
import UserType from './enums/user-type';
import SettingDashboardDto from '../auth/dto/setting-dashboard.dto';
import CreateUserDto from './dto/create-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(UserPassword)
        private userPasswordRepo: Repository<UserPassword>,

        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async findOneById(id: number): Promise<User | null> {
        if (!id) {
            throw new BadRequestException("Param USER ID is required");
        }

        return this.userRepo.findOneBy({ id });
    }

    async findOneByResetToken(resetPasswordToken: string): Promise<User | null> {
        return this.userRepo.findOneBy({ resetPasswordToken });
    }

    async findOneByEmail(email: string, options?: { useCache?: boolean }): Promise<User | null> {
        const key = `findOneByEmail:${email}`;
        if (options?.useCache) {
            const cache = await this.cacheManager.get<User>(key);
            if (cache) {
                return cache;
            }
        }

        const user = await this.userRepo.findOne({
            where: { email },
            relations: {                
                password: true,                
            }
        });

        if (options?.useCache) {
            this.cacheManager.set(key, user, CacheTtl.TenMinute);
        }

        return user;
    }

    setResetPasswordToken(userId: number, resetPasswordToken: string) {
        return this.userRepo.update({ id: userId }, {
            resetPasswordToken
        });
    }

    clearResetPasswordToken(userId: number) {
        return this.userRepo.update({ id: userId }, {
            resetPasswordToken: null
        });
    }

    async changePassword(userId: number, password: string, confirmPassword: string) {
        if (password != confirmPassword) {
            throw new BadRequestException("The passwords entered do not match. Please try again.");
        }

        password = await CryptoHelper.encrypt(password);

        return this.userPasswordRepo.update({ user: { id: userId} }, {
            password,
        });
    }

    async createUser(createUserDto: CreateUserDto) {
        const checkUserExists = await this.userRepo.findOne({ where: { email: createUserDto.email } })
        if (checkUserExists) {
            throw new BadRequestException(`User with email ${createUserDto.email} is exists`)    
        }

        const user = await this.userRepo.save({
            email: createUserDto.email,
            userType: UserType.SuperAdmin,
            isActive: true
        });

        const userPassword = await this.userPasswordRepo.save({
            password: await CryptoHelper.encrypt(createUserDto.password),
            user: user,
        });

        return {
            user,
            userPassword,
        }
    }

    setUserType(userId: number, userType: UserType) {
        return this.userRepo.update({ id: userId }, {
            userType,
        });
    }

   
}
