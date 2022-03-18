export const tryCatch = async <T>(callback: () => T) => {
    try {
        return [await callback(), null] as const
    } catch (error: any) {
        return [null, error] as const
    }
}

export const tryCatchSync = <T>(callback: () => T) => {
    try {
        return [callback(), null] as const
    } catch (error: any) {
        return [null, error] as const
    }
}
