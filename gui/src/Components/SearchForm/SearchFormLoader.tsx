import { Box, Paper, Skeleton } from '@mui/material';
import React from 'react';

export default function SearchFormLoader() {
    return (
        <Box
            sx={{
                alignItems: 'center',
                padding: 10,
                display: 'flex',
                flexFlow: 'column'
            }}
        >
            <Paper
                elevation={20}
                sx={{
                    width: 0.6,
                    alignItems: 'center',
                    textAlign: 'center',
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingBottom: 10,
                    display: 'flex',
                    flexFlow: 'column'
                }}
            >
                <h1>SearchForm</h1>
                <hr style={{ width: '100%' }} />
                <Box sx={{ display: 'flex', width: '100%', gap: '20px' }}>
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        animation={'wave'}
                        height={300}
                    />
                    <Skeleton
                        sx={{
                            display: { xs: 'none', md: 'block', lg: 'block' }
                        }}
                        variant="rounded"
                        width={'100%'}
                        animation={'wave'}
                        height={300}
                    />
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'none', lg: 'flex' },
                            flexFlow: 'column',
                            gap: '20px'
                        }}
                        width={'100%'}
                        height={300}
                    >
                        <Skeleton
                            sx={{
                                display: { xs: 'none', md: 'none', lg: 'block' }
                            }}
                            variant="rounded"
                            width={'100%'}
                            animation={'wave'}
                            height={'100%'}
                        />
                        <Skeleton
                            sx={{
                                display: { xs: 'none', md: 'none', lg: 'block' }
                            }}
                            variant="rounded"
                            width={'100%'}
                            animation={'wave'}
                            height={'100%'}
                        />
                    </Box>
                    <Skeleton
                        sx={{
                            display: { xs: 'none', md: 'none', lg: 'block' }
                        }}
                        variant="rounded"
                        width={'100%'}
                        animation={'wave'}
                        height={300}
                    />
                    <Skeleton
                        sx={{
                            display: { xs: 'none', md: 'none', lg: 'block' }
                        }}
                        variant="rounded"
                        width={'100%'}
                        animation={'wave'}
                        height={300}
                    />
                </Box>
            </Paper>
        </Box>
    );
}
