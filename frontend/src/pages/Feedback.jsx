import React from "react";
import SupportRequestForm from "../components/SupportRequestForm";

const feedbackCategories = [
    "Bug report",
    "Feature request",
    "Design feedback",
    "Performance",
    "Other",
];

const Feedback = () => {
    return (
        <SupportRequestForm
            eyebrow="Feedback"
            title="Share your feedback"
            description="Tell us what feels great, what feels rough, and what should change next. We’ll receive it by email."
            submitLabel="Send feedback"
            type="feedback"
            defaultSubject="LeetQuest feedback"
            includeCategory
            includeRating
            categoryOptions={feedbackCategories}
            accent="green"
            hint="Rate your overall experience and choose a category so we can triage it faster."
        />
    );
};

export default Feedback;
