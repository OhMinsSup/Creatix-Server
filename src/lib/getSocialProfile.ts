import axios from 'axios';
import Fb from 'fb';
import Github from '@octokit/rest';
import { google } from 'googleapis';
import { Profile } from '../typings/common';

const getProfile = {
  naver(accessToken: string) {
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
    const people = google.people({
      version: 'v1'
    });
    return new Promise((resolve, reject) => {
      people.people
        .get({
          resourceName: 'people/me',
          access_token: accessToken,
          personFields: 'names,emailAddresses,photos,metadata'
        })
        .then(res => {
          const { names, photos, emailAddresses, metadata } = res.data;
          if (
            typeof names === 'undefined' ||
            typeof photos === 'undefined' ||
            typeof emailAddresses === 'undefined' ||
            typeof metadata === 'undefined'
          ) {
            const error = new Error('InvalidAuthError');
            error.message = 'The auth value undefined';
            reject(error);
            return;
          }
          const meta = metadata.sources;

          if (typeof meta === 'undefined') {
            const error = new Error('InvalidAuthError');
            error.message = 'The auth value undefined';
            reject(error);
            return;
          }

          const id = meta[0].id;
          const name = names[0].displayNameLastFirst;
          const photo = photos[0].url;
          const email = emailAddresses[0].value;
          const profile = {
            id: id,
            name: name,
            email: email,
            thumbnail: photo
          };
          resolve(profile);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

export default function getSocialProfile(provider: string, accessToken: string) {
  return getProfile[provider](accessToken);
}
