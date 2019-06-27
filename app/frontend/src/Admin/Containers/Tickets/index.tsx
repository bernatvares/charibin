import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import Sidebar from '../../Components/Sidebar'
import Agenda from '../../Components/Agenda'
import Modal from '../../Components/Modal'
import TicketModal from '../../Components/TicketModal'
import DeleteModal from '../../Components/DeleteModal'

import withToast from '../../../Common/HOC/withToast'
import { Selectors, Actions } from '../../../Common/Redux/Services/adminTickets'
import {
  createTicket,
  getTickets,
  getTripNames,
  getSingleTicket,
  deleteTicket,
  editTicket
} from '../../Utils/api'
import { MODAL_TYPE, /*ICity*/ } from '../../Utils/adminTypes'
import { ITicket } from '../../../Common/Utils/globalTypes'
import { getToken } from '../../../Common/Utils/helpers'
import { ERRORS, SUCCESS, DEFULT_TICKET_DATA } from '../../Utils/constants'
import { IStore } from '../../../Common/Redux/types'
import { IState, IProps, IEditedData } from './types'
import './styles.scss'


class TicketsContainer extends React.Component<
  RouteComponentProps<{ tripName: string }> & IProps,
  IState
> {
  readonly state: IState = {
    tickets: [],
    destinations: [],
    isLoading: false,
    isModalLoading: false,
    isError: false,
    modal: {
      id: '',
      type: null,
      heading: '',
      data: DEFULT_TICKET_DATA,
      trip: null
    },
    calendarFilter: {
      start: undefined,
      end: undefined
    }

  }

  private modal = React.createRef<Modal>()

  componentDidUpdate(prevProps: IProps) {
    if (prevProps.selectedDate !== this.props.selectedDate) {
      this.handleFetchTicketsByDate(this.props.selectedDate)
    }
  }

  componentDidMount() {
    const { selectedDate } = this.props
    const { state } = this.props.location

    this.handleFetchTicketsByDate(selectedDate)
    this.handleFetchDestination()

    if (state && state.trip) {
      const tripFromState = state.trip

      this.setState(
        (state: IState) => ({
          ...state,
          modal: {
            ...state.modal,
            type: MODAL_TYPE.ADD_TICKET,
            trip: tripFromState
          }
        }),
        () => {
          this.modal.current!.open()
        }
      )
    }
  }

  handleCloseModal = () => {
    this.setState({ isModalLoading: false })
    this.modal.current!.close()
  }

  handleFetchDestination = () => {
    const token = getToken()

    getTripNames(token)
      .then(({ data }) => {
        console.log('data', data)
        const cityNames = data.map((item: any) => ({
          _id: item._id,
          departure: item.departure,
          destination: item.destination
        }))
        console.log('cityNames', cityNames)
        this.props.changeFilters(cityNames)
        this.setState({ destinations: cityNames })
      })
      .catch(err => {
        this.props.showError(err)
      })
  }

  handleFetchTicketsByTwoDates = ([startDate, endDate] : [Date, Date]) => {
    this.handleFetchTicketsByDate(startDate, endDate)
  }

  handleFetchTicketsByDate = (initialDate: Date, finalDate?: Date) => {
    const token = getToken()

    const startDate = finalDate ? moment(initialDate).format('x') : 
      moment(initialDate)
      .startOf('month')
      .format('x')
    const endDate = finalDate ? moment(finalDate).format('x') : 
      moment(initialDate)
      .endOf('month')
      .format('x')

    this.setState({ isLoading: true, isError: false })
    getTickets(startDate, endDate, token)
      .then(res => {
        this.setState({ isLoading: false, tickets: res.data })
      })
      .catch(err => {
        this.setState({ isLoading: false, isError: true })
        this.props.showError(err, ERRORS.TICKET_FETCH)
      })
  }

  handleOpenModal = (type: MODAL_TYPE, heading: string, id: string = '') => {
    this.setState(
      (state: IState) => ({ modal: { ...state.modal, heading, type, id } }),
      () => {
        this.modal.current!.open()
      }
    )
  }

  handleAddTicket = (
    ticketData: Pick<
      ITicket,
      Exclude<keyof ITicket, 'trip' | '_id' | 'date'>
    > & {
      trip: string
      date: {
        start: number
        end: number
      }
      repeat?: {
        dateEnd: number
        days: number[]
      }
    }
  ) => {
    const token = getToken()

    this.setState({ isModalLoading: true })
    return createTicket(ticketData, token)
      .then(res => {
        let message = ''
        if (res.data.updated) {
          /*tu pourrais faire SUCCESS.TICKET_OVERRIGHT  */
          message = 'Tickets was overright'
        } else if (!res.data.updated && res.data.dates) {
          /*tu pourrais faire SUCCESS.TICKET_UPDATED  */
          message = 'Ticket was updated'
        } else {
          message = SUCCESS.TICKET_ADD
        }

        this.props.showSuccess(message)
        this.handleCloseModal()
        this.handleFetchTicketsByDate(this.props.selectedDate)

        return Promise.resolve()
      })
      .catch(err => {
        this.setState({ isModalLoading: false })
        this.props.showError(err, ERRORS.TICKET_FETCH)

        return Promise.reject()
      })
  }

  handleOpenEditModal = (id: string) => {
    const token = getToken()

    getSingleTicket(id, token)
      .then(({ data }) => {
        const newData = {
          _id: data.trip._id,
          departure: data.trip.departure,
          destination: data.trip.destination
        } 
        console.log('newData', newData)
        console.log('data', data)
        data.trip = newData; 
        //data.date = new Date()
        //console.log('data.modal.trip', data.modal.trip)
        this.setState(
          (state: IState) => ({
            ...state,
            modal: {
              ...state.modal,
              data
            }
          }),
          () => {
            this.handleOpenModal(MODAL_TYPE.EDIT_TICKET, 'Edit ticket', id)
          }
        )
        console.log('modal.data', this.state.modal.data)
      })
      .catch(err => {
        this.handleCloseModal()
        this.props.showError(err, ERRORS.TICKET_FETCH)
      })
  }

  handleDeleteTicket = () => {
    const {
      modal: { id }
    } = this.state
    const { selectedDate } = this.props
    const token = getToken()

    deleteTicket(id, token)
      .then(() => {
        this.handleCloseModal()
        this.props.showSuccess(SUCCESS.TICKET_DELETE)
        this.handleFetchTicketsByDate(selectedDate)
      })
      .catch(err => {
        this.modal.current!.close()
        this.props.showError(err, ERRORS.TICKET_DELETE)
      })
  }

  handleEditTicket = (editedDate: IEditedData) => {
    const token = getToken()
    const {
      modal: { id }
    } = this.state

    this.setState({ isModalLoading: true })
    return editTicket(editedDate, id, token)
      .then(() => {
        this.handleCloseModal()
        this.props.showSuccess(SUCCESS.TICKET_EDIT)
        this.handleFetchTicketsByDate(this.props.selectedDate)
      })
      .catch(err => {
        this.setState({ isModalLoading: false, isError: true })
        this.modal.current!.close()
        this.props.showError(err, ERRORS.TICKET_EDIT)
      })
  }

  handleChangeActiveState = (id: string, isActive: boolean) => {
    const token = getToken()

    editTicket({ active: isActive }, id, token)
      .then(({ data }) => {
        this.handleCloseModal()
        this.props.showSuccess(SUCCESS.TICKET_EDIT)
        const updatedTickets = this.state.tickets.map((ticket: ITicket) => {
          if (ticket._id === data._id) {
            return data
          }

          return ticket
        })

        this.setState({
          tickets: updatedTickets
        })

        return Promise.resolve()
      })
      .catch(err => {
        this.props.showError(err, ERRORS.TICKET_EDIT)

        return Promise.reject()
      })
  }

  handleRestartModalType = () => {
    this.setState({
      modal: {
        id: '',
        type: null,
        heading: '',
        data: DEFULT_TICKET_DATA,
        trip: null
      }
    })
  }

  render() {
    const {
      tickets,
      modal,
      isLoading,
      isModalLoading,
      isError,
      destinations,
      calendarFilter
    } = this.state
    const {
      filters,
      filterFrom,
      filterTo,
      selectedDate,
      changeFilterFrom,
      changeFilterTo,
      changeSelectedDate
    } = this.props

    return (
      <div className="spon-tickets">
        <div className="spon-tickets__content">
          <Sidebar
            filterFrom={filterFrom}
            filterTo={filterTo}
            selectedDate={selectedDate}
            changeFilterFrom={changeFilterFrom}
            changeFilterTo={changeFilterTo}
            changeSelectedDate={changeSelectedDate}
            calendarFilter={calendarFilter}
            onChange={this.handleFetchTicketsByTwoDates}
            handleFetchTicketsByDate={this.handleFetchTicketsByDate}
          />
          <Agenda
            tickets={tickets}
            filterFrom={filterFrom}
            filterTo={filterTo}
            openEditModal={this.handleOpenEditModal}
            openModal={this.handleOpenModal}
            loading={isLoading}
            error={isError}
            changeActiveState={this.handleChangeActiveState}
            retry={() => this.handleFetchTicketsByDate(selectedDate)}
            filters={filters}
          />
        </div>

        <Modal
          title={modal.heading}
          ref={this.modal}
          restartModalType={this.handleRestartModalType}>
          {modal.type === MODAL_TYPE.ADD_TICKET ? (
            <TicketModal
              tripSelected={modal.trip ? modal.trip : null}
              destinations={destinations}
              isLoading={isModalLoading}
              closeModal={this.handleCloseModal}
              handleSubmit={this.handleAddTicket}
            />
          ) : null}

          {modal.type === MODAL_TYPE.EDIT_TICKET ? (
            <TicketModal
              destinations={destinations}
              editDate={modal.data}
              isLoading={isModalLoading}
              closeModal={this.handleCloseModal}
              handleEditTicket={this.handleEditTicket}
            />
          ) : null}

          {modal.type === MODAL_TYPE.DELETE_TICKET ? (
            <DeleteModal
              closeModal={this.handleCloseModal}
              deleteItem={this.handleDeleteTicket}
            />
          ) : null}
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  filters: Selectors.selectFilters(state),
  filterFrom: Selectors.selectFilterFrom(state),
  filterTo: Selectors.selectFilterTo(state),
  selectedDate: Selectors.selectSelectedDate(state),
})

export default connect(
  mapStateToProps,
  Actions
)(withToast(TicketsContainer))
