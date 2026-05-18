import React from "react";
import SupportRequestForm from "../components/SupportRequestForm";

const SendMessage = () => {
    return (
        <SupportRequestForm
            eyebrow="Contact"
            title="Send a message"
            description="Questions, bug reports, or partnership ideas can go here. We’ll email it to the team."
            submitLabel="Send message"
            type="message"
            defaultSubject="Question for LeetQuest"
            accent="orange"
            hint="Use this page when you want to contact the team directly about the product or your account."
        />
    );
};

export default SendMessage;
