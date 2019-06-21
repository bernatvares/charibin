export enum ADMIN_ROUTING {
  MAIN = '/admin',
  LOGIN = '/login',
  TRIPS = '/trips',
  TICKETS = '/tickets',
  ORDERS = '/orders'
}

export const ERRORS = {
  TRIP_FETCH: `Cant't fetch trip list`,
  TRIP_DELETE: 'Error when delete trip ',
  TRIP_ADD: 'Error when submit form',
  TRIP_EDIT: 'Error when edit trip',
  TICKET_ADD: 'Error when add ticket',
  TICKET_FETCH: `Can't fetch tickets list`,
  TICKET_DELETE: 'Error when delete ticket',
  TICKET_EDIT: 'Error when edit ticket',
  ORDERS_FETCH: `Can't fetch orders list`,
  ORDERS_EDIT: 'Error when edit order',
  DEFAULT: 'Error'
}

export const SUCCESS = {
  TRIP_ADD: 'Trip added successfully',
  TRIP_EDIT: 'Trip edited successfully',
  TRIP_DELETE: 'Trip deleted successfully',
  TICKET_ADD: 'Ticket added successfully',
  TICKET_EDIT: 'Trip edited successfully',
  TICKET_DELETE: 'Ticket deleted successfully',
  ORDER_UPDATE: 'Order update successfully',
  DEFAULT: 'Success'
}

export const DEFULT_TICKET_DATA = {
  _id: '',
  trip: { _id: '', name: '', departure: '', destination: '' },
  direction: '',
  quantity: 0,
  soldTickets: 0,
  reservedQuantity: 0,
  type: '',
  date: {
    start: '',
    end: ''
  },
  active: false
}

export const DEFAULT_TRIP_DATA = {
  _id: '',
  active: false,
  deselectionPrice: 0,
  discount: 0,
  duration: 0,
  fake: false,
  name: '',
  photo: '',
  price: 0,
  type: '',
  departure: '',
  destination: ''
}
