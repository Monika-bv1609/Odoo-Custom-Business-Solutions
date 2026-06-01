/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class AIChat extends Component {

    setup() {

        this.state = useState({

            open: false,

            message: "",

            loading: false,

            messages: [

                {
                    id: 1,
                    sender: "ai",
                    text:
                        "Hi! I can help with Employee Count, Employee Search and Leave Information.",
                    timestamp: new Date().toISOString(),
                },

            ],
        });
    }

    toggleChat() {

        this.state.open = !this.state.open;

        this.scrollToBottom();
    }

    onKeyDown(ev) {

        if (ev.key === "Enter") {

            this.sendMessage();
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

    async sendMessage() {

        if (!this.state.message.trim()) {
            return;
        }

        const userMessage = this.state.message;

        this.state.messages.push({

            id: Date.now(),

            sender: "user",

            text: userMessage,

            timestamp:
                new Date().toISOString(),
        });

        this.state.message = "";

        this.scrollToBottom();

        this.state.loading = true;

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/ask-hr",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        question:
                            userMessage,
                    }),
                }
            );

            const data =
                await response.json();

            this.state.loading = false;

            this.state.messages.push({

                id: Date.now(),

                sender: "ai",

                text: data.answer,

                timestamp:
                    new Date().toISOString(),
            });

            this.scrollToBottom();

        } catch (error) {

            this.state.loading = false;

            this.state.messages.push({

                id: Date.now(),

                sender: "ai",

                text:
                    "Unable to connect to HR Agent.",

                timestamp:
                    new Date().toISOString(),
            });

            console.error(error);

            this.scrollToBottom();
        }
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

AIChat.template =
    "hr_ai_assistant.AIChat";

registry.category(
    "main_components"
).add(
    "hr_ai_assistant.AIChat",
    {
        Component: AIChat,
    }
);