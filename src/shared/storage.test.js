import {
  addItem,
  removeItem,
  removeItems,
  getItem,
  existValue,
} from './storage';

describe('Management of localstorage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('addItem', () => {
    it('should add item with string value', () => {
      const key = 'key';
      const value = 'value';

      addItem(key, value);

      expect(localStorage.setItem).toBeCalledTimes(1);
      expect(localStorage.setItem).toBeCalledWith(key, value);
    });

    it('should add item with json value', () => {
      const key = 'key';
      const value = { test: 'pouetpouetlol' };

      addItem(key, value);

      expect(localStorage.setItem).toBeCalledTimes(1);
      expect(localStorage.setItem).toBeCalledWith(key, JSON.stringify(value));
    });
  });

  describe('removeItem', () => {
    it('should remove item with key', () => {
      const key = 'key';

      removeItem(key);

      expect(localStorage.removeItem).toBeCalledTimes(1);
      expect(localStorage.removeItem).toBeCalledWith(key);
    });
  });

  describe('removeItems', () => {
    it('should remove many items with keys', () => {
      const keys = ['key1', 'key2'];

      removeItems(keys);

      expect(localStorage.removeItem).toBeCalledTimes(2);
      expect(localStorage.removeItem).toBeCalledWith('key1');
      expect(localStorage.removeItem).toBeCalledWith('key2');
    });
  });

  describe('removeValueFromKey', () => {
    it('should ', () => {
      const items = ['item'];
      const item = 'item';

      const exist = existValue(items, item);

      expect(exist).toBe(true);
    });

    it("should check if value doesn't exist", () => {
      const items = ['item'];
      const item = 'item2';

      const exist = existValue(items, item);

      expect(exist).toBe(false);
    });
  });

  describe('existValue', () => {
    it('should check if value exist', () => {
      const items = ['item'];
      const item = 'item';

      const exist = existValue(items, item);

      expect(exist).toBe(true);
    });

    it("should check if value doesn't exist", () => {
      const items = ['item'];
      const item = 'item2';

      const exist = existValue(items, item);

      expect(exist).toBe(false);
    });
  });
});
