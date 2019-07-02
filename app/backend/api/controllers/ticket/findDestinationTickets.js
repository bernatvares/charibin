'use strict';

const { TicketService, Valid } = require('../../services');

module.exports = app => {
  app.get('/ticket/destination/:departure/:destination', ({ params: { departure, destination }, token: { role } }, res) => {
    console.log('first')
    console.log('Out', departure, destination)
    Valid.onCreate({ departure, destination }, 'TicketGetDestination', role)
      .then(({ departure, destination }) => TicketService.findDestinationTickets(departure, destination))
      .then(res.ok)
      .catch(res.error);
  });
};
