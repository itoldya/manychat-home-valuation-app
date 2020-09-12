'use strict';

const Zillow = require('node-zillow');
const request = require('supertest');
const app = require('./app');
const SuccessResponseJson = require('./data/0_response.json');
const FailResponseJson = require('./data/508_response');

describe('test /get_valuation_by_address_and_zip', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should handle case when citystatezip not passed', async () => {
    const res = await request(app)
      .post('/get_valuation_by_address_and_zip?zwsid=123')
      .send({ address: '2114 Bigelow Ave' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      code: '400',
      response_text: 'Error: "Custom Field for city + state or zip" has no value',
    });
  });
  it('should handle case when address not passed', async () => {
    const res = await request(app)
      .post('/get_valuation_by_address_and_zip?zwsid=123')
      .send({ citystatezip: 'Seattle, WA' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      code: '400',
      response_text: 'Error: "Custom Field for address" has no value',
    });
  });
  it('should handle case when zwsid not passed', async () => {
    const res = await request(app)
      .post('/get_valuation_by_address_and_zip')
      .send({ citystatezip: 'Seattle, WA' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      code: '400',
      response_text:
        'Error: "Zillow Web Services ID" is required param. Please make sure its filled in in the application settings.',
    });
  });
  it('should handle Zillow success response', async () => {
    jest.spyOn(Zillow.prototype, 'get').mockImplementation(() => SuccessResponseJson);

    const res = await request(app)
      .post('/get_valuation_by_address_and_zip?zwsid=123')
      .send({ address: '2114 Bigelow Ave', citystatezip: 'Seattle, WA' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      address_city: 'Seattle',
      address_latitude: '47.637934',
      address_longitude: '-122.347936',
      address_state: 'WA',
      address_street: '2114 Bigelow Ave N',
      address_zipcode: '98109',
      code: '0',
      links_comparables: 'http://www.zillow.com/homes/comps/48749425_zpid/',
      links_graphs_and_data:
        'http://www.zillow.com/homedetails/2114-Bigelow-Ave-N-Seattle-WA-98109/48749425_zpid/#charts-and-data',
      links_home_details: 'http://www.zillow.com/homedetails/2114-Bigelow-Ave-N-Seattle-WA-98109/48749425_zpid/',
      links_map_this_home: 'http://www.zillow.com/homes/48749425_zpid/',
      response_text: 'Request successfully processed',
      zestimate_amount_currency: 'USD',
      zestimate_amount_formatted: '$2,070,570',
      zestimate_amount_value: '2070570',
      zestimate_last_updated: '09/08/2020',
      zestimate_valuation_range_high_currency: 'USD',
      zestimate_valuation_range_high_formatted: '$2,194,804',
      zestimate_valuation_range_high_value: '2194804',
      zestimate_valuation_range_low_currency: 'USD',
      zestimate_valuation_range_low_formatted: '$1,925,630',
      zestimate_valuation_range_low_value: '1925630',
      zpid: '48749425',
    });
  });
  it('should handle Zillow fail response', async () => {
    jest.spyOn(Zillow.prototype, 'get').mockImplementation(() => FailResponseJson);

    const res = await request(app)
      .post('/get_valuation_by_address_and_zip?zwsid=123')
      .send({ address: '2114 Bigelow Ave', citystatezip: 'Seattle, WA' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      code: '508',
      response_text: 'Error: no exact match found for input address',
    });
  });
  it('should handle internal error', async () => {
    jest.spyOn(Zillow.prototype, 'get').mockImplementation(() => {
      throw 'foo';
    });

    const res = await request(app)
      .post('/get_valuation_by_address_and_zip?zwsid=123')
      .send({ address: '2114 Bigelow Ave', citystatezip: 'Seattle, WA' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      code: '500',
      response_text: 'Error: Internal Error',
    });
  });
});
