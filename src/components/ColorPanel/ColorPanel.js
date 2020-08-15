import React from 'react';
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';

const ColorPanel = () => {
    return (
        <Sidebar
            as={Menu}
            icon="labaled"
            inverted
            vertical
            visible
            width="very thin"
        >
            <Divider />
            <Button icon="add" size="small" color="blue" />
        </Sidebar>
    )
}

export default ColorPanel;