import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { Box, keyframes, styled, Typography } from '@mui/material'
import useStore from '../store/globalStore'

const myKeyframe = keyframes`
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.7);
  }
  70% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1.3);
  }
`

const StyledHeart = styled('span')(() => ({
    cursor: 'pointer',
    display: 'inline-block',
    '&:hover': {
        animation: `${myKeyframe} 0.7s ease forwards`,
    },
}))

const Footer = () => {
    const connection = useStore((state) => state.connection)
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                pb: 3,
                height: 64,
                color: 'text.secondary',
            }}
            component={'footer'}
        >
            <Box
                sx={{
                    flexGrow: 1,
                    ml: 2,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <FiberManualRecordIcon
                    fontSize={'small'}
                    sx={{
                        mr: 1,
                        color: connection.isConnected ? 'success.dark' : 'error.dark',
                    }}
                />
                {connection.numConnected}
            </Box>
            <Box>
                <Typography>
                    Made with{' '}
                    <StyledHeart role={'img'} aria-label={'heart'}>
                        ❤️
                    </StyledHeart>
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
        </Box>
    )
}

export default Footer
