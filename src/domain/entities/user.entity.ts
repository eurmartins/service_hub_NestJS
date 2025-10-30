import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Email } from '../values-objects/user.values-objects/email.values-objects';
import { HashPassword } from '../values-objects/user.values-objects/hashpassword.values-objects';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  private _email: string;

  @Column()
  private _hashPassword: string;

  @Column({ default: true })
  ativo: boolean;

  get email(): Email {
    return new Email(this._email);
  }

  set email(email: Email) {
    this._email = email.toString();
  }

  get hashPassword(): HashPassword {
    return new HashPassword(this._hashPassword);
  }

  set hashPassword(hashPassword: HashPassword) {
    this._hashPassword = hashPassword.toString();
  }
}
