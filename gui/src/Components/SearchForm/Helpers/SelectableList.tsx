import React from 'react';
import { List, ListItemText, ListItemButton, SxProps } from '@mui/material';

export function SelectableList(props: {
    items: any[];
    text_sx?: SxProps;
    list_sx?: SxProps;
    onItemSelect?: (item: any) => void;
    clearSelected?: boolean;
}) {
    const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

    React.useEffect(() => {
        if (props.clearSelected) {
            setSelectedIndex(-1);
        }
    }, [props.clearSelected]);

    const handleListItemClick = (index: number) => {
        const _index = selectedIndex === index ? -1 : index;
        setSelectedIndex(_index);
        //Update the parent if requested (prop was passed in)
        if (props.onItemSelect) {
            const item = _index >= 0 ? props.items[_index] ?? '' : '';
            props.onItemSelect(item);
        }
    };

    const showList = () => {
        if (props.items) {
            return props.items?.map((item, i) => {
                return (
                    <ListItemButton
                        key={i}
                        selected={selectedIndex === i}
                        sx={{}}
                        onClick={() => handleListItemClick(i)}
                        classes={{ selected: '{backgroundColor:"red"}' }}
                    >
                        <ListItemText
                            primary={item}
                            sx={{ textAlign: 'center', ...props.text_sx }}
                        />
                    </ListItemButton>
                );
            });
        } else {
            return;
        }
    };
    return (
        <List
            sx={{
                overflow: 'auto',
                maxHeight: '100%',
                width: 1,
                ...props.list_sx
            }}
        >
            {showList()}
        </List>
    );
}
