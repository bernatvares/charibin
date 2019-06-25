import React from 'react'
import Button from '../../../Common/Components/Button'

import { MODAL_TYPE } from '../../Utils/adminTypes'
import { IProps } from './types'
import './styles.scss'
import Switch from '../Switch';


const Header: React.SFC<IProps> = ({
  title,
  query, // à enlever
  heading,
  modal,
  handleToggle,
  enable,
  handleSearch, // à enlever
  handleOpenModal
}) => {
  return (
    <div className="spon-admin-header">
      <div className="spon-admin-header__inner">
        <h1 className="spon-admin-header__heading">{title}</h1>
      </div> 

     <div>Ative Users  

        {handleToggle ? (
        
        <Switch

        checked={enable ? enable : false}
        onChange={() => {
          handleToggle()
        }} // mettre en une ligne sur onChange
        
        />
) : null} {/** indentation */}

      </div>

      {(handleOpenModal && heading && modal) ? (
        <Button
          className="spon-admin-header__add-button"
          variant="blue"
          icon="plus"
          text="ADD NEW"
          onClick={() => handleOpenModal(modal, heading)}
        />
      ) : handleOpenModal ? (
          <Button
            className="spon-admin-header__add-button"
            variant="blue"
            icon="plus"
            text="ADD NEW"
            onClick={() => handleOpenModal(MODAL_TYPE.ADD_TRIP, 'Create trip')}
          />
      ):null}
  


    </div>
  )
}
export default Header
