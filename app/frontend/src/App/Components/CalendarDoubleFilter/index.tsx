import React from 'react'
import ReactCalendar from 'react-calendar'
import moment from 'moment'
import arrow from '../../../Common/Utils/Media/arrow.svg'
import './styles.scss'
import { IProps, IState } from './types'
import { debounce } from 'lodash';
import Button from 'src/Common/Components/Button';

export default class CalendarDoubleFilter extends React.Component<IProps, IState> {
  readonly state: IState = {
    startDate: new Date(),
    startFillingEndRange: false,
    isSelectRange: true,
    //tempDate: new Date()
  }

  handleClickSelectRange = (date: Date) => {
    if (!this.state.startFillingEndRange) {
      this.setState({ startFillingEndRange: true, startDate: date, isSelectRange: true })
    }
  }

  handleChangeEvent = (v: [Date, Date]) => {
    this.props.onChange && this.props.onChange(v)
    this.setState({ startFillingEndRange: false })
  }

  handleDisableDays = (props: { date: Date }) => {
    const { startDates, endDates } = this.props
    const dateString = moment(props.date).format('YYYY-MM-DD')
    if (startDates && !this.state.startFillingEndRange) {
      return !startDates.includes(dateString)
    } else if (endDates && this.state.startFillingEndRange) {
      const filteredEndDates = endDates.filter(
        (date: string) => !moment(date).isBefore(this.state.startDate)
      )
      return !filteredEndDates.includes(dateString)
    }

    return false
  }

  setSelectRange = (value: boolean) => {
    this.setState({isSelectRange: value})
  }

  render() {
    const debouncedChange = debounce(
        ({ activeStartDate, view }: { activeStartDate: Date; view: string }) => {
          console.log("activeStartDate\n", activeStartDate, 
          "this.state.startFillingEndRange", this.state.startFillingEndRange)
          if (view === 'month' && !this.state.startFillingEndRange) {
            console.log("in")
            this.props.handleChangeDate(activeStartDate)
          }
        },
        300
    )
    
    const {isSelectRange} = this.state

    return (
      <div className="calendar">
        <div className="spon-sidebar">
        <ReactCalendar
          locale="en-GB"
          calendarType="ISO 8601"
          formatMonthYear={value =>
            moment(value)
              .format('MMMM YYYY')
              .toUpperCase()
          }
          minDetail="year"
          nextLabel={<img src={arrow} className="calendar-arrow_next" />}
          prevLabel={<img src={arrow} className="calendar-arrow_prev" />}
          //value={this.props.selectedDate}
          //activeStartDate={this.props.selectedDate}
          //onClickMonth={this.props.handleChangeDate}
          onActiveDateChange={debouncedChange}

          value={this.props.value}
          onClickDay={this.handleClickSelectRange}
          onChange={this.handleChangeEvent}
          selectRange={isSelectRange}
          tileDisabled={this.handleDisableDays}
        />
         </div>
         <Button
            text="clear dates"
            variant="gray"
            icon="cross"
            onClick={this.props.clearCalendar}
          />
      </div>
    )
  }
}
