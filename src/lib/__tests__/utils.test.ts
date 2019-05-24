import faker from 'faker';
import {
  escapeForUrl,
  generateSlugId,
  checkEmpty,
  invalidText,
  invalidUrlSlug,
  filterUnique,
  checkPostOwnship
} from '../utils';

describe('Utils Function testing', () => {
  it('Url Slug EscapeForUrl', () => {
    const url = `${faker.name.title()} ${generateSlugId()}`;
    expect(escapeForUrl(url)).toEqual(escapeForUrl(url));
  });

  it('GenerateSlugID', () => {
    const url = generateSlugId();
    expect(url).toEqual(url);
  });

  it('CheckEmpty Empty Value', () => {
    expect(checkEmpty('')).toEqual(true);
  });

  it('CheckEmpty NotEmpty Value', () => {
    expect(checkEmpty('veloss')).toEqual(false);
  });

  it('InvalidText', () => {
    const title = '제목';
    const thumbnail = [faker.image.imageUrl(), faker.image.imageUrl(), faker.image.imageUrl()];
    expect(invalidText(title, thumbnail)).toEqual(true);
  });

  it('InvalidUrlSlug True', () => {
    const url = `${faker.name.title()} ${generateSlugId()}`;
    expect(invalidUrlSlug(url)).toEqual(true);
  });

  it('InvalidUrlSlug False', () => {
    const url = '';
    expect(invalidUrlSlug(url)).toEqual(false);
  });

  it('FilterUnique', () => {
    expect(filterUnique(['veloss', 'test', 'test', 'jest'])).toEqual(['veloss', 'test', 'jest']);
  });

  it('CheckPostOwnShip True', () => {
    const fk_user_id = '1';
    const user_id = '1';
    expect(checkPostOwnship(fk_user_id, user_id)).toEqual(true);
  });

  it('CheckPostOwnShip False', () => {
    const fk_user_id = '0';
    const user_id = '1';
    expect(checkPostOwnship(fk_user_id, user_id)).toEqual(false);
  });
});
