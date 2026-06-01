/** @odoo-module **/

import { Component, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class AIChat extends Component {
    setup() {
        this.state = useState({
            open: false,
        });
    }

    toggleChat() {
        this.state.open = !this.state.open;
    }
}

AIChat.template = "hr_ai_assistant.AIChat";

registry.category("main_components").add(
    "hr_ai_assistant.AIChat",
    {
        Component: AIChat,
    }
);