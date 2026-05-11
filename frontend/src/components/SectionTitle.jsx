import React from "react";
const SectionTitle = ({ eyebrow, title, description, action }) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
                {eyebrow ? (
                    <p className="text-sm uppercase tracking-[0.3em] text-text-muted">{eyebrow}</p>
                ) : null}
                <h2 className="mt-2 text-2xl font-bold text-text-main md:text-3xl">{title}</h2>
                {description ? (
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted md:text-base">
                        {description}
                    </p>
                ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
};

export default SectionTitle;