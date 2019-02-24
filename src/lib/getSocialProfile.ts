import Fb from 'fb';
import Google from 'googleapis';
import { Profile } from '../typings/common';

const getProfile = {
  facebook(accessToken: string): Promise<Profile> {
    return new Promise((resolve, reject) => {
      Fb.api(
        '/me',
        'post',
        {
          fields: ['name', 'email', 'picture'],
          access_token: accessToken
        },
        auth => {
          if (!auth) {
            const error = new Error('InvalidAuthError');
            error.message = 'The auth value does not exist.';
            reject(error);
            return;
          }
          const profile = {
            id: auth.id,
            name: auth.name,
            email: auth.email || null,
            thumbnail: auth.picture.data.url
          };
          resolve(profile);
        }
      );
    });
  },
  google(accessToken: string) {}
};

export default function getSocialProfile(provider: string, accessToken: string) {
  return getProfile[provider](accessToken);
}
