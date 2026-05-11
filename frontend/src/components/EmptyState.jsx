import React from "react";
const EmptyState = ({ title, description, action }) => {
    return (
        <div className="rounded-2xl border border-dashed border-border bg-dark-gray/60 p-6 text-center">
            <h3 className="text-lg font-semibold text-text-main">{title}</h3>
            <p className="mt-2 text-sm text-text-muted">{description}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
};

export default EmptyState;