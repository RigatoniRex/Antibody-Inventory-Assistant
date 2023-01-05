import { Box, Button, Skeleton } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';

export default function CatFact(props: { update: boolean }) {
    const [catFact, setCatFact] = React.useState('');

    function updateCatFact() {
        axios
            .get('https://catfact.ninja/fact')
            .then((res) => setCatFact(res.data.fact));
    }

    useEffect(() => {
        if (props.update) updateCatFact();
    }, [props.update]);

    return (
        <Box sx={{ maxWidth: 800, width: '85vw' }}>
            <hr style={{ maxWidth: 800, width: '85vw' }} />
            <Box sx={{ display: 'flex', flexFlow: 'row', gap: 2 }}>
                <h2>{'Cat Fact'}</h2>
                <Button
                    onClick={updateCatFact}
                    sx={{ height: 0.5, alignSelf: 'center' }}
                    variant="outlined"
                >
                    Update
                </Button>
            </Box>
            {!catFact ? (
                <Skeleton variant="rounded" height={100} />
            ) : (
                <h3>{`"${catFact}"`}</h3>
            )}
        </Box>
    );
}
