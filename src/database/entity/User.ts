import {
  Entity,
  PrimaryGeneratedColumn,
  Index,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  getRepository,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import AuthToken from './AuthToken';
import { generateToken } from '../../lib/token';
import { hash } from '../../lib/utils';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column({ unique: true, type: 'varchar' })
  public username: string;

  @Index()
  @Column({ unique: true, type: 'varchar' })
  public email: string;

  @Column('varchar')
  public password: string;

  @Column('timestampz')
  @CreateDateColumn()
  public created_at: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  public updated_at: Date;

  public comparePassword(password: string): boolean {
    const hashedPassword = hash(password);
    return this.password === hashedPassword;
  }

  @BeforeInsert()
  @BeforeUpdate()
  public savePassword(): void {
    if (this.password) {
      const hashedPassword = hash(this.password);
      this.password = hashedPassword;
    }
  }

  public async generateUserToken() {
    const authToken = new AuthToken();
    authToken.fk_user_id = this.id;
    await getRepository(AuthToken).save(authToken);
    // refresh token is valid for 30days
    const refreshToken = await generateToken(
      {
        user_id: this.id,
        token_id: authToken.id
      },
      {
        subject: 'refresh_token',
        expiresIn: '30d'
      }
    );

    const accessToken = await generateToken(
      {
        user_id: this.id
      },
      {
        subject: 'access_token',
        expiresIn: '1h'
      }
    );

    return {
      refreshToken,
      accessToken
    };
  }

  public async refreshUserToken(
    tokenId: string,
    refreshTokenExp: number,
    originalRefreshToken: string
  ) {
    const now = new Date().getTime();
    const diff = refreshTokenExp * 1000 - now;
    console.log('refreshing..');
    let refreshToken = originalRefreshToken;
    // renew refresh token if remaining life is less than 15d
    if (diff < 1000 * 60 * 60 * 24 * 15) {
      console.log('refreshing refreshToken');
      refreshToken = await generateToken(
        {
          user_id: this.id,
          token_id: tokenId
        },
        {
          subject: 'refresh_token',
          expiresIn: '30d'
        }
      );
    }
    const accessToken = await generateToken(
      {
        user_id: this.id
      },
      {
        subject: 'access_token',
        expiresIn: '1h'
      }
    );
    return { refreshToken, accessToken };
  }
}

export default User;
