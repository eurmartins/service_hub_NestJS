import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ProfDescription } from '../values-objects/provider.values-objects/profdescription.values-objects';

@Entity()
export class Provider {
  @PrimaryColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

  @Column()
  name: string;

  @Column({ unique: true })
  private _prof_description: string;

  get prof_description(): ProfDescription {
    return new ProfDescription(this._prof_description);
  }

  set prof_description(prof: ProfDescription) {
    this._prof_description = prof.value;
  }
}
