import { jest } from '@jest/globals'
import handler from '../server/api/report/weekly.get'
import { Home } from '../server/model/schemas/Home.schema'

jest.mock('../server/model/schemas/Home.schema')

const mockRes = { setHeader: jest.fn() }

describe('weekly report handler', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('returns html list', async () => {
    const date = new Date()
    ;(Home.find as jest.Mock).mockResolvedValue([
      { HOUSE_NM: 'Test A', RCEPT_BGNDE: date },
      { HOUSE_NM: 'Test B', RCEPT_BGNDE: date }
    ])

    const html = await handler({ node: { res: mockRes } } as any)
    expect(html).toContain('<ul>')
    expect(html).toContain('Test A')
    expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html; charset=utf-8')
  })
})
