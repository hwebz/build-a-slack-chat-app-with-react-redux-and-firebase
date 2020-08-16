import React from 'react';
import { Divider } from 'semantic-ui-react';

const ColorList = ({ colors, setColors }) => {

    return colors.map((color, idx) => (
        <React.Fragment key={idx}>
            <Divider />
            <div className="color__container" onClick={() => setColors(color.primary, color.secondary)}>
                <div className="color__square" style={{ background: color.primary}}>
                    <div className="color__overlay" style={{ background: color.secondary }}></div>
                </div>
            </div>
        </React.Fragment>
    ))
}

export default ColorList;