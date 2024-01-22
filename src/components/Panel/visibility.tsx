// import {FormControlLabel, FormGroup, Switch } from "@mui/material";
// import { ChangeEvent, useState } from "react";
//
// export default function VisibilityPanel() {
//
//     const [state, setState] = useState({
//         gilad: true,
//         jason: false,
//         antoine: true,
//     });
//
//     const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//         setState({ ...state, [event.target.name]: event.target.checked });
//     };
//     return <div>
//         <FormGroup>
//             <FormControlLabel
//                 control={<Switch checked={state.gilad} onChange={handleChange} name="gilad" />}
//                 label="hide on desktop"
//             />
//             <FormControlLabel
//                 control={<Switch checked={state.jason} onChange={handleChange} name="jason" />}
//                 label="hide on tablet"
//             />
//             <FormControlLabel
//                 control={<Switch checked={state.antoine} onChange={handleChange} name="antoine" />}
//                 label="hide on mobile"
//             />
//         </FormGroup>
//     </div>
//
// }

import {List, ListItem, ListItemSecondaryAction, ListItemText, Switch} from '@mui/material';
import React from 'react';


export default function Visibility() {
    // @ts-ignore
    const [checked, setChecked] = React.useState(['wifi']);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <List>
            <ListItem>
                <ListItemText primary="HIDE ON DESKTOP"/>
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={handleToggle('desktop')}
                        checked={checked.indexOf('desktop') !== -1}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText primary="HIDE ON TABLET"/>
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={handleToggle('tablet')}
                        checked={checked.indexOf('tablet') !== -1}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText primary="HIDE ON MOBILE"/>
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={handleToggle('mobile')}
                        checked={checked.indexOf('mobile') !== -1}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    );
}
