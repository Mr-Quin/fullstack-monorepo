import { Chip, Tooltip } from '@mui/material'

export const UidCell = ({ uid, name }: { uid?: NumberOrString; name?: string }) => {
    return name !== undefined ? (
        <Tooltip title={name}>
            <Chip label={uid ?? '?'} sx={{ borderRadius: 2 }} variant={'filled'} size={'small'} />
        </Tooltip>
    ) : (
        <Chip label={uid ?? '?'} sx={{ borderRadius: 2 }} variant={'filled'} size={'small'} />
    )
}
