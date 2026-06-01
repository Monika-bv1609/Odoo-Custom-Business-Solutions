/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class AIChat extends Component {

    setup() {
        this.state = useState({
            open: false,
            message: "",
            messages: [],
        });
    }

    toggleChat() {
        this.state.open = !this.state.open;
    }

    sendMessage() {

        if (!this.state.message.trim()) {
            return;
        }

        const userMessage = this.state.message;

        this.state.messages.push({
            sender: "user",
            text: userMessage,
        });

        this.state.message = "";

        this.scrollToBottom();

        setTimeout(() => {

            this.state.messages.push({
                sender: "ai",
                text: "This is a dummy AI response.",
            });

            this.scrollToBottom();

        }, 300);
    }

    scrollToBottom() {

        setTimeout(() => {

            const container = document.querySelector(
                ".ai-chat-messages"
            );

            if (container) {
                container.scrollTop =
                    container.scrollHeight;
            }

        }, 0);
    }
}

AIChat.template = "hr_ai_assistant.AIChat";

registry.category("main_components").add(
    "hr_ai_assistant.AIChat",
    {
        Component: AIChat,
    }
);