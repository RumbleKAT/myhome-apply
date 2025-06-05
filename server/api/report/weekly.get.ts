import { defineEventHandler, getQuery } from 'h3';
import moment from 'moment';
import { Home } from '~/server/model/schemas/Home.schema';

export default defineEventHandler(async (event) => {
  const { category = 'APT' } = getQuery(event);

  const start = moment().startOf('week').format('YYYY-MM-DD');
  const end = moment().endOf('week').add(1, 'day').format('YYYY-MM-DD');

  let list;
  if (category === 'APT') {
    list = await Home.find({
      CATEGORY: category,
      RCEPT_BGNDE: { $gte: new Date(start), $lt: new Date(end) }
    });
  } else {
    list = await Home.find({
      CATEGORY: category,
      SUBSCRPT_RCEPT_BGNDE: { $gte: new Date(start), $lt: new Date(end) }
    });
  }

  const htmlList = '<ul>' +
    list.map((item:any) => {
      const date = item.RCEPT_BGNDE || item.SUBSCRPT_RCEPT_BGNDE;
      return `<li>${item.HOUSE_NM} - ${moment(date).format('YYYY-MM-DD')}</li>`;
    }).join('') + '</ul>';

  event.node.res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return htmlList;
});
