import { openConnection, closeConnection, getCache } from "../../server/utils/Cache";

describe('Caching  list test',()=>{
  beforeAll(async()=>{
    await openConnection();
  });  

  test('import APT data', async()=>{
    const data = await getCache('APT');
    console.log(data.length);
    expect(data.length > 0).toBe(true);
  });

  test('import NonApt data', async()=>{
    const data = await getCache('NonApt');
    console.log(data.length);
    expect(data.length > 0).toBe(true);
  });

  afterAll(async()=>{
    await closeConnection();
  });
})
