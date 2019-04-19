import Fb from 'fb';
import Github from '@octokit/rest';
import { google } from 'googleapis';
import axios from 'axios';

const { GOOGLE_API, GOOGLE_SECRET } = process.env;

if (!GOOGLE_API || !GOOGLE_SECRET) {
  const error = new Error('InvalidGoogleEnvError');
  error.message = 'GoogleEnv is missing.';
  throw error;
}

export interface Profile {
  id?: number | string;
  thumbnail?: string;
  email?: string;
  name?: string;
}

const getProfile = {
  github(accessToken: string): Promise<Profile> {
    const github = new Github();
    github.authenticate({
      type: 'token',
      token: accessToken
    });
    return new Promise((resovle, reject) => {
      github.users
        .getAuthenticated({})
        .then(res => {
          const { id, avatar_url: thumbnail, email, name } = res.data;
          const profile = {
            id,
            thumbnail,
            email,
            name
          };
          resovle(profile);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  naver(accessToken: string): Promise<Profile> {
    return new Promise((resolve, reject) => {
      axios
        .get('https://openapi.naver.com/v1/nid/me', {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })
        .then(res => {
          const { id, name, email, profile_image: thumbnail } = res.data;
          const profile = {
            id,
            name,
            email,
            thumbnail
          };
          resolve(profile);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  facebook(accessToken: string): Promise<Profile> {
    return new Promise((resolve, reject) => {
      Fb.api(
        '/me',
        'post',
        {
          fields: ['name', 'email', 'picture'],
          access_token: accessToken
        },
        res => {
          if (!res) {
            const error = new Error('InvalidAuthError');
            error.message = 'The auth value does not exist.';
            reject(error);
            return;
          }
          const profile = {
            id: res.id,
            name: res.name,
            email: res.email || null,
            thumbnail: res.picture.data.url
          };
          resolve(profile);
        }
      );
    });
  },
  google(accessToken: string): Promise<Profile> {
    const plus = google.plus({
      version: 'v1',
      auth: GOOGLE_SECRET,
      params: {
        access_token: accessToken
      }
    });
    return new Promise((resolve, reject) => {
      plus.people.get(
        {
          auth: GOOGLE_API,
          userId: 'me'
        },
        (err, auth) => {
          if (err) {
            reject(err);
            return;
          }
          if (typeof auth === 'undefined' || !auth) return;
          const {
            data: { id, image, emails, displayName }
          } = auth;
          const profile = {
            id,
            thumbnail: image && image.url,
            email: emails && emails[0].value,
            name: displayName && displayName.split(' (')[0]
          };
          resolve(profile);
        }
      );
    });
  }
};

export default function getSocialProfile(provider: string, accessToken: string): Promise<Profile> {
  return getProfile[provider](accessToken);
}
