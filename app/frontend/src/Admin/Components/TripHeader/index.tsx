import React from 'react'
import Button from '../../../Common/Components/Button'
import { default as Select } from 'react-dropdown-select'
import { MODAL_TYPE } from '../../Utils/adminTypes'
import { IProps, IState, COLOR, ITerritory } from './types'
import data from './data'
import './styles.scss'

class TripHeader extends React.Component<IProps, IState> {

  readonly state: IState = {
    selectedColor: COLOR.VIOLET
  }

  handleFiltersChange = (territories: ITerritory[], changeFilter: (filters: string[]) => void) => {
    const filters: string[] = []

    territories.map(territory => {
        this.setState({selectedColor: COLOR.VIOLET})
        filters.push(territory.label)
    })

   changeFilter(filters)
  }
  
  handleFiltersFromChange = (territories: ITerritory[]) => {
    this.handleFiltersChange(territories, this.props.changeFilterFrom)
  }

  handleFiltersToChange = (territories: ITerritory[]) => {
    this.handleFiltersChange(territories, this.props.changeFilterTo)
  }

  render() {
    const {
      selectedColor
    } = this.state
  
    const {
      title,
      heading,
      modal,
      handleOpenModal,
      filterFrom,
      filterTo
    } = this.props

    return (
      <div className="spon-admin-trip-header">
        
        <div className="spon-admin-trip-header__inner">
          <h1 className="spon-admin-trip-header__heading">{title}</h1>
        </div> 

        <div className="spon-admin-trip-header__select">
          <div className="spon-admin-trip-header__select__From">
            <Select  className="spon-admin-trip-header__select__From"
                  multi
                  placeholder={'From'}
                  options={data} 
                  value={filterFrom} 
                  onChange={this.handleFiltersFromChange}
                  color={selectedColor}
                  clearable
                >
            </Select>
          </div>
            <div className="spon-admin-trip-header__select__To">
              <Select className="spon-admin-trip-header__select__To"
                  multi
                  placeholder={'To'} 
                  options={data} 
                  value={filterTo} 
                  onChange={this.handleFiltersToChange}
                  color={selectedColor}
                  clearable
                >  
              </Select>
            </div>
          </div>

        {(handleOpenModal && heading && modal) ? (
          <Button
            className="spon-admin-trip-header__add-button"
            variant="blue"
            icon="plus"
            text="ADD NEW"
            onClick={() => handleOpenModal(modal, heading)}
          />
        ) : handleOpenModal ? (
            <Button
              className="spon-admin-trip-header__add-button"
              variant="blue"
              icon="plus"
              text="ADD NEW"
              onClick={() => handleOpenModal(MODAL_TYPE.ADD_TRIP, 'Create trip')}
            />
        ) : null}

      </div>
    )
  }
}
export default TripHeader
