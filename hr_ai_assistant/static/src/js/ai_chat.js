/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { session } from "@web/session";

export class AIChat extends Component {

    setup() {
        this.state = useState({
            open: false,
            message: "",
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

        if (ev.key === "Enter") {

            this.sendMessage();
        }
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
        });

        this.state.message = "";

        this.scrollToBottom();

        try {

            const currentUser = session
                .storeData["res.partner"]
                .find(
                    partner =>
                        partner.active === true
                );

            console.log(
                "CURRENT USER:",
                currentUser
            );

            console.log(
                "USER ID:",
                currentUser.userId
            );

            const response = await fetch(
                "http://127.0.0.1:8001/ask-hr",
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

            console.log("FULL RESPONSE:", data);
            alert(JSON.stringify(data));

            this.state.messages.push({
                id: Date.now() + 1,
                sender: "ai",
                text: data.answer,
            });

            this.scrollToBottom();

        } catch (error) {

            this.state.messages.push({
                id: Date.now() + 2,
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