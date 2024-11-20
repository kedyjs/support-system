import { Box, CircularProgress } from '@mui/material';

function LoadingSpinner() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export default LoadingSpinner; 