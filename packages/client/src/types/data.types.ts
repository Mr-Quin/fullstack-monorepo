declare global {
    type WithId<T> = { id: string | number } & T
    type ExcludeId<T> = Omit<T, 'id'> & { id?: never }
    type DataInput<T> = Omit<T, 'id' | 'createdAt'>
    type PartialData<T> = ExcludeId<Partial<T>>
    type Data = Record<string, any>
    type NumberOrString = number | string
}

export {}
