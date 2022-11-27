import React from 'react';
import {
    List,
    ListItemText,
    ListItemButton,
    SxProps,
    Box
} from '@mui/material';

export function SelectableList(props: {
    items: any[];
    text_sx?: SxProps;
    list_sx?: SxProps;
    setSelectedItem?: React.Dispatch<React.SetStateAction<any>>;
}) {
    const [selectedIndex, setSelectedIndex] = React.useState<number>(-1);

    const handleIndexChange = () => {
        //Update the parent if requested (prop was passed in)
        if (props.setSelectedItem) {
            const item =
                selectedIndex >= 0 ? props.items[selectedIndex] ?? '' : '';
            props.setSelectedItem(item);
        }
    };

    //Clears selection on items change
    React.useEffect(() => {
        setSelectedIndex(-1);
    }, [props.items]);

    React.useEffect(() => {
        handleIndexChange();
    }, [selectedIndex]);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number
    ) => {
        if (selectedIndex === index) {
            setSelectedIndex(-1);
        } else {
            setSelectedIndex(index);
        }
    };

    const showList = () => {
        if (props.items) {
            return props.items?.map((item, i) => {
                return (
                    <ListItemButton
                        key={i}
                        selected={selectedIndex === i}
                        onClick={(event) => handleListItemClick(event, i)}
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
                width: 1,
                ...props.list_sx
            }}
        >
            {showList()}
        </List>
    );
}
