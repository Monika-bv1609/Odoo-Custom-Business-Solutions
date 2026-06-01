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

    async sendMessage() {

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

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/ask-hr",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question: userMessage,
                    }),
                }
            );

            const data = await response.json();

            this.state.messages.push({
                sender: "ai",
                text: data.answer,
            });

            this.scrollToBottom();

        } catch (error) {

            this.state.messages.push({
                sender: "ai",
                text: "Unable to connect to HR Agent.",
            });

            console.error(error);
        }
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