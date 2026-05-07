import {
  UpdateDateColumn,
  Entity,
  CreateDateColumn,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
  comment: '角色表',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true,
    comment: '角色名称',
  })
  name: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission_relation',
  })
  permissions: Permission[];
}
