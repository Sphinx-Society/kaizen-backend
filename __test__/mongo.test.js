const DBManager = require('./dbManager');

describe('Connect to MongoDB and try CRUD operations', () => {
  const dbManager = new DBManager();

  afterAll(() => dbManager.stop());
  beforeAll(() => dbManager.start());

  it('Should insert a document into collection', async () => {
    const users = await dbManager.db.collection('test');

    const mockUser = { _id: 'some-user-id' };
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({ _id: 'some-user-id' });
    expect(insertedUser).toEqual(mockUser);
  });

  it('Should find a document into collection', async () => {
    const users = await dbManager.db.collection('test');

    const mockUser = { _id: 'some-user-id' };

    const searchedUser = await users.findOne({ _id: 'some-user-id' });
    expect(searchedUser).toEqual(mockUser);
  });

  it('Should update a document into collection', async () => {
    const users = await dbManager.db.collection('test');

    const mockUser = { _id: 'some-user-id', name: 'John Doe' };
    await users.updateOne({ _id: mockUser._id }, { $set: { name: mockUser.name } }, { upsert: false });

    const insertedUser = await users.findOne({ _id: 'some-user-id' });
    expect(insertedUser).toEqual(mockUser);
  });

  it('Should delete a document into collection', async () => {
    const users = await dbManager.db.collection('test');

    const mockUser = { _id: 'some-user-id' };
    await users.deleteOne({ _id: mockUser._id });

    const deletedUser = await users.findOne({ _id: 'some-user-id' });
    expect(deletedUser).toBeNull();
  });
});
