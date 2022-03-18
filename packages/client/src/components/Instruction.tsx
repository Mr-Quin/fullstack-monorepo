import { Alert, Collapse, darken, styled } from '@mui/material'
import { useEffect, useState } from 'react'

const InstructionAlert = styled(Alert)(({ theme }) => ({
    backgroundColor: darken(theme.palette.background.paper, 0.3),
}))

const Instruction = () => {
    const [alertOpen, setAlertOpen] = useState(false)

    // Open alert on mount, with a delay to grab attention
    useEffect(() => {
        const timer = setTimeout(() => {
            setAlertOpen(true)
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <Collapse in={alertOpen}>
            <InstructionAlert severity={'info'} onClose={() => setAlertOpen(false)}>
                <div>
                    To edit a row, double click it in the table. Greyed-out rows cannot be edited.
                </div>
                <div>
                    To sort and filter, use the filter button above the table or hover over the
                    column title and click the 3 dots to display a drop-down menu.
                </div>
            </InstructionAlert>
        </Collapse>
    )
}

export default Instruction
