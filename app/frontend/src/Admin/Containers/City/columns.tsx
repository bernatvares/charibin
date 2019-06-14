import React from 'react'
import { RowRenderProps } from 'react-table'
import Switch from 'src/Admin/Components/Switch';
import Button from 'src/Common/Components/Button';
import './style.scss'

let count: number = 0;

export const columns = (
  openDeleteModal: (id: string) => void,
  openEditModal: (id: string) => void,
  changeActiveState: (id: string, checkend: boolean) => void
  //redirectToCreateCity: (city: { _id: string; name: string }) => void
) => [
  {
    Header: 'City',
    accessor: 'name'
  },
  {
    Header: 'Country',
    accessor: 'country',
   
  },
  {
    Header: 'Key words',
    accessor: 'tags',
    Cell: (props: RowRenderProps) => (
     
      props.value.map((tag: any) => {
          const length: number = props.value.length;
          if (count <= length) {
            count++;
            return (<React.Fragment key ={tag}>{tag + '; '}</React.Fragment >);
          } else {
            return (<React.Fragment key ={tag}>{tag}</React.Fragment >);
          }
      })
    )
  },
  {
    Header: 'Photo',
    accessor: 'photo',
    Cell: (props: RowRenderProps) => (
      <div className="spon-table__photo">        
        <img src={props.value} alt="Avatar photo"/>
      </div>
    )
  },
  {
    Header: 'Modify',
    accessor: 'isModify',
    Cell: (props: RowRenderProps) => (
 
        <Button
          text = "modify"
          variant = "adminPrimary"
          icon = "pencil"
          disabled = {!(props.value)}
          onClick={() => openEditModal(props.row._original._id)}
        />
     
      )
  },

  {
    Header: 'Enable',
    accessor: 'enable',
    Cell: (props: RowRenderProps) => (
        <Switch
          checked = {true}
          onChange = {() => changeActiveState(props.row._original.id,props.value)}
        />)
  },

  {
    Header: 'Delete',
    accessor: 'delete',
    Cell: (props: RowRenderProps) => (
      <Button
        text = "delete"
        icon = "trash"
        variant = "adminPrimary"
        onClick={() => openDeleteModal(props.row._original._id)}
      />
    )
  },
]
