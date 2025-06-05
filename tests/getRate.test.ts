import axios from 'axios';
import handler from '../server/api/rate/getRate.get';
import { clearCache } from '../server/utils/localCache';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getRate handler', () => {
  const html = `
    <div class="taR font16 mgt30">2024-06</div>
    <table class="tbl"><tbody>
      <tr><td>Bank1</td><td>1%</td><td>0.5%</td></tr>
      <tr><td>Bank2</td><td>2%</td><td>1.0%</td></tr>
    </tbody></table>
  `;

  beforeEach(() => {
    clearCache();
    mockedAxios.get.mockResolvedValue({ data: html });
  });

  test('parses html and caches response', async () => {
    const result = await handler({} as any);
    expect(result).toEqual({
      period: '2024-06',
      bank: [
        { name: 'Bank1', rate: '1%', call: '0.5%' },
        { name: 'Bank2', rate: '2%', call: '1.0%' },
      ],
    });
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    const cached = await handler({} as any);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(cached).toEqual(result);
  });
});
