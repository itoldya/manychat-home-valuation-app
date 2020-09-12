'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const asyncHandler = require('express-async-handler');
const Zillow = require('node-zillow');
const get = require('lodash.get');
const currencyFormatter = require('currency-formatter');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(
  '/get_valuation_by_address_and_zip',
  asyncHandler(async (req, res) => {
    const { citystatezip, address } = req.body;
    const { zwsid } = req.query;

    if (!zwsid) {
      return res.send({
        code: '400',
        response_text:
          'Error: "Zillow Web Services ID" is required param. Please make sure its filled in in the application settings.',
      });
    }
    if (!citystatezip) {
      return res.send({ code: '400', response_text: 'Error: "Custom Field for city + state or zip" has no value' });
    }
    if (!address) {
      return res.send({ code: '400', response_text: 'Error: "Custom Field for address" has no value' });
    }

    const zillow = new Zillow(zwsid);
    const result = await zillow.get('GetSearchResults', { address, citystatezip });

    const firstResult = get(result, 'response.results.result[0]');

    const response = {
      code: get(result, 'message.code'),
      response_text: get(result, 'message.text'),
      zpid: get(firstResult, 'zpid[0]'),

      links_home_details: get(firstResult, 'links[0].homedetails[0]'),
      links_graphs_and_data: get(firstResult, 'links[0].graphsanddata[0]'),
      links_map_this_home: get(firstResult, 'links[0].mapthishome[0]'),
      links_comparables: get(firstResult, 'links[0].comparables[0]'),

      address_street: get(firstResult, 'address[0].street[0]'),
      address_zipcode: get(firstResult, 'address[0].zipcode[0]'),
      address_city: get(firstResult, 'address[0].city[0]'),
      address_state: get(firstResult, 'address[0].state[0]'),
      address_latitude: get(firstResult, 'address[0].latitude[0]'),
      address_longitude: get(firstResult, 'address[0].longitude[0]'),

      zestimate_last_updated: get(firstResult, 'zestimate[0]["last-updated"][0]'),

      zestimate_amount_value: get(firstResult, 'zestimate[0].amount[0]._'),
      zestimate_amount_currency: get(firstResult, 'zestimate[0].amount[0]["$"].currency'),

      zestimate_valuation_range_low_value: get(firstResult, 'zestimate[0].valuationRange[0].low[0]._'),
      zestimate_valuation_range_low_currency: get(firstResult, 'zestimate[0].valuationRange[0].low[0]["$"].currency'),
      zestimate_valuation_range_high_value: get(firstResult, 'zestimate[0].valuationRange[0].high[0]._'),
      zestimate_valuation_range_high_currency: get(firstResult, 'zestimate[0].valuationRange[0].high[0]["$"].currency'),
    };

    if (firstResult) {
      response.zestimate_amount_formatted = '';
      response.zestimate_valuation_range_low_formatted = '';
      response.zestimate_valuation_range_high_formatted = '';
    }

    if (response.zestimate_amount_value && response.zestimate_amount_currency) {
      response.zestimate_amount_formatted = currencyFormatter.format(response.zestimate_amount_value, {
        code: response.zestimate_amount_currency,
        precision: 0,
      });
    }
    if (response.zestimate_valuation_range_low_value && response.zestimate_valuation_range_low_currency) {
      response.zestimate_valuation_range_low_formatted = currencyFormatter.format(
        response.zestimate_valuation_range_low_value,
        { code: response.zestimate_valuation_range_low_currency, precision: 0 },
      );
    }
    if (response.zestimate_valuation_range_high_value && response.zestimate_valuation_range_high_currency) {
      response.zestimate_valuation_range_high_formatted = currencyFormatter.format(
        response.zestimate_valuation_range_high_value,
        { code: response.zestimate_valuation_range_high_currency, precision: 0 },
      );
    }

    res.send(response);
  }),
);

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.send({
    code: '500',
    response_text: 'Error: Internal Error',
  });
});

module.exports = app;
