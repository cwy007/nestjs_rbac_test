import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity({
  comment: '用户表'
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true,
    comment: '用户名'
  })
  username: string;

  @Column({
    length: 100,
    comment: '密码'
  })
  password: string;

  @CreateDateColumn({
    comment: '创建时间'
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间'
  })
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role_relation',
  })
  roles: Role[];
}
