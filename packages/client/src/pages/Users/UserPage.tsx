import { GridColDef } from '@mui/x-data-grid'
import { useEffect } from 'react'
import shallow from 'zustand/shallow'
import { getAllUsers, removeUsers } from '../../actions/user.action'
import { UserEntity } from '../../api/user.service'
import FormPage from '../../components/FormPage/FormPage'
import useStore from '../../store/globalStore'
import UserForm from './UserForm'

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
    },
    {
        field: 'username',
        headerName: 'Username',
        width: 170,
    },
    {
        field: 'created_at',
        headerName: 'Created At',
        width: 120,
        valueFormatter: (params) => {
            return new Date(params.value as string).toLocaleDateString()
        },
    },
]

const UserPage = () => {
    const userData = useStore((state) => state.users, shallow)

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <FormPage<UserEntity>
            title={'Manage users'}
            renderFormComponent={(formProps) => <UserForm {...formProps} type={'create'} />}
            renderEditFormComponent={(formProps) => <UserForm {...formProps} type={'update'} />}
            dataGridProps={{
                columns,
                rows: userData,
            }}
            onDelete={removeUsers}
            buttonProps={{
                dialogButtonLabel: 'Add user',
            }}
        />
    )
}

export default UserPage
