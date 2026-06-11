/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { session } from "@web/session";

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
                    text: "Hi! I am your HR AI Assistant."
                }
            ],
        });
    }

    toggleChat() {
        this.state.open = !this.state.open;
    }

    onKeyDown(ev) {

        if (
            ev.key === "Enter"
            && !this.state.loading
        ) {
            this.sendMessage();
        }
    }

    async sendMessage() {

        if (
            !this.state.message.trim()
            || this.state.loading
        ) {
            return;
        }

        this.state.loading = true;

        const userMessage = this.state.message;

        this.state.messages.push({
            id: Date.now(),
            sender: "user",
            text: userMessage,
        });

        this.state.message = "";

        this.scrollToBottom();

        const typingId = Date.now() + 100;

        this.state.messages.push({
            id: typingId,
            sender: "ai",
            text: "Thinking..."
        });

        this.scrollToBottom();

        try {

            const currentUser = session
                .storeData["res.partner"]
                .find(
                    partner =>
                        partner.active === true
                );

            const response = await fetch(
                "http://127.0.0.1:8000/ask-hr",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question: userMessage,
                        user_id: currentUser.userId,
                    }),
                }
            );

            const data = await response.json();

            const index =
                this.state.messages.findIndex(
                    m => m.id === typingId
                );

            if (index !== -1) {

                this.state.messages[index] = {

                    id: typingId,

                    sender: "ai",

                    text: data.answer
                };
            }

            this.scrollToBottom();

        } catch (error) {

            const index =
                this.state.messages.findIndex(
                    m => m.id === typingId
                );

            if (index !== -1) {

                this.state.messages[index] = {

                    id: typingId,

                    sender: "ai",

                    text:
                        "Unable to connect to HR Agent."
                };
            }

            console.error(error);

            this.scrollToBottom();

        } finally {

            this.state.loading = false;
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

        }, 50);
    }
}

AIChat.template = "hr_ai_assistant.AIChat";

registry.category("main_components").add(
    "hr_ai_assistant.AIChat",
    {
        Component: AIChat,
    }
);