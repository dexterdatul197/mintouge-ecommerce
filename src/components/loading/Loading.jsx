import clsx from "clsx";
import React from 'react';

export default ({ classes, styles }) => (
    <div
        style={styles}
        className={clsx("d-flex justify-content-center align-items-center h-100", classes)}
    >
        <div className="spinner-border text-active" role="status" />
    </div>
);