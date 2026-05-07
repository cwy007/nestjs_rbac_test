import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.entityManager.findOne(User, {
      where: { username: userLoginDto.username },
      relations: ['roles'],
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.password !== userLoginDto.password) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async findRolesByRoleIds(roleIds: number[]) {
    const roles = await this.entityManager.find(Role, {
      where: { id: In(roleIds) },
      relations: ['permissions'],
    });
    return roles;
  }

  async initData() {
    const user1 = new User();
    user1.username = 'user111';
    user1.password = 'password111';

    const user2 = new User();
    user2.username = 'user222';
    user2.password = 'password222';

    const user3 = new User();
    user3.username = 'user333';
    user3.password = 'password333';

    const role1 = new Role();
    role1.name = 'admin';

    const role2 = new Role();
    role2.name = 'normal';

    const permission1 = new Permission();
    permission1.name = 'create_aaa';
    permission1.desc = 'aaa创建权限';

    const permission2 = new Permission();
    permission2.name = 'delete_aaa';
    permission2.desc = 'aaa删除权限';

    const permission3 = new Permission();
    permission3.name = 'update_aaa';
    permission3.desc = 'aaa更新权限';

    const permission4 = new Permission();
    permission4.name = 'query_aaa';
    permission4.desc = 'aaa查询权限';

    const permission5 = new Permission();
    permission5.name = 'create_bbb';
    permission5.desc = 'bbb创建权限';

    const permission6 = new Permission();
    permission6.name = 'delete_bbb';
    permission6.desc = 'bbb删除权限';

    const permission7 = new Permission();
    permission7.name = 'update_bbb';
    permission7.desc = 'bbb更新权限';

    const permission8 = new Permission();
    permission8.name = 'query_bbb';
    permission8.desc = 'bbb查询权限';

    role1.permissions = [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ];
    role2.permissions = [permission1, permission2, permission3, permission4];

    user1.roles = [role1];
    user2.roles = [role2];
    user3.roles = [role2];

    await this.entityManager.save(Permission, [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8,
    ]);
    await this.entityManager.save(Role, [role1, role2]);
    await this.entityManager.save(User, [user1, user2, user3]);
  }
}
