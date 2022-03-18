import { GridRowId } from '@mui/x-data-grid'
import { fetchApi } from '../api/fetchApi'
import { CreateUserDto, UserDetailEntity, UserEntity } from '../api/user.service'
import useStore, { setSnackbar } from '../store/globalStore'

export const getAllUsers = async (): Promise<UserEntity[]> => {
    useStore.setState({ isLoading: true })
    const res = await fetchApi('/users')
    useStore.setState({ isLoading: false })

    if (res.error) {
        throw new Error(res.message)
    }

    const users = res.data.map((user) => {
        return {
            ...user,
            id: user.user_id,
        }
    }) as UserEntity[]

    useStore.setState({ users })

    return users
}

export const getQualifiedUsers = async (): Promise<UserEntity[]> => {
    const res = await fetchApi('/users?qualified=true')

    return res.data
}

export const getUserDetails = async (id: NumberOrString): Promise<UserDetailEntity> => {
    const res = await fetchApi(`/users/${id}`)

    if (res.error) {
        throw new Error(res.message)
    }

    return res.data as UserDetailEntity
}

export const createUser = async (data: CreateUserDto) => {
    const res = await fetchApi('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (res.error) {
        throw new Error(res.message)
    }

    setSnackbar({
        message: `Created user id ${res.data.insertId}`,
        type: 'success',
    })

    return getAllUsers()
}

export const updateUser = async (id: number | string, data: CreateUserDto) => {
    const res = await fetchApi(`/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (res.error) {
        setSnackbar({
            message: res.message,
            type: 'error',
        })
        throw new Error(res.message)
    }

    setSnackbar({
        message: `Updated user id ${id}`,
        type: 'success',
    })

    return getAllUsers()
}

export const removeUsers = async (ids: GridRowId[]) => {
    const res = await fetchApi(`/users`, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_ids: ids,
        }),
        method: 'DELETE',
    })

    if (res.error) {
        throw new Error(res.message)
    }

    if (res.data.affectedRows === 0) {
        setSnackbar({
            message: `User already deleted`,
            type: 'error',
        })
    } else {
        setSnackbar({
            message: `Deleted ${res.data.affectedRows} ${
                res.data.affectedRows === 1 ? 'user' : 'users'
            }`,
            type: 'success',
        })
    }

    await getAllUsers()
}

export const setUser = (id: number, newUser: UserEntity) => {
    useStore.setState((state) => {
        const oldUser = state.users.find((user) => user.user_id === id)
        Object.assign(oldUser, newUser)
        state.users = [...state.users]
    })
}

const userNameRegex = /^[a-zA-Z0-9]+$/

export const validateUsername = (username: any) => {
    if (!username) return username
    if (typeof username !== 'string') {
        throw new Error('username must be a string')
    } else if (username.length > 20) {
        throw new Error('username cannot be longer than 20 characters')
    } else if (!userNameRegex.test(username)) {
        throw new Error('username cannot contain special characters')
    }
    return username
}
