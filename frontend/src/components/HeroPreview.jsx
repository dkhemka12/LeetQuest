import React from "react";
const HeroPreview = () => {
    return (
        <div className="mx-auto mt-12 w-full max-w-3xl">
            <div className="relative rounded-xl border border-border bg-dark-gray p-4 shadow-2xl">
                <div className="absolute left-0 top-0 h-full w-full rounded-xl bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                    <span className="h-3 w-3 rounded-full bg-red" />
                    <span className="h-3 w-3 rounded-full bg-yellow" />
                    <span className="h-3 w-3 rounded-full bg-green" />
                </div>
                <div className="flex flex-col gap-3 text-left">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-light-gray" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-light-gray" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-light-gray" />
                </div>
            </div>
        </div>
    );
};

export default HeroPreview;