import axios from 'axios';
import handler from '../server/api/rate/getStdRate.get';
import { clearCache } from '../server/utils/localCache';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getStdRate handler', () => {
  const html = `
    <table class="fixed"><tbody>
      <tr><td>2024</td><td>01.01</td><td>3.5</td></tr>
    </tbody></table>
  `;

  beforeEach(() => {
    clearCache();
    mockedAxios.get.mockResolvedValue({ data: html });
  });

  test('parses html and caches response', async () => {
    const result = await handler({} as any);
    expect(result).toEqual({
      items: [
        { date: '2024년 01.01', rate: '3.5' },
      ],
    });
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    const cached = await handler({} as any);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(cached).toEqual(result);
  });
});
