{
    "name": "HR AI Assistant",
    "version": "1.0",
    "category": "Human Resources",
    "summary": "AI Assistant for Odoo HRMS",
    "author": "Monika",
    "depends": [
        "base",
        "web",
        "hr"
    ],
    "data": [
        "security/ir.model.access.csv",
        "views/ai_document_views.xml",
        "views/ai_assistant_menu.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "hr_ai_assistant/static/src/js/ai_chat.js",
            "hr_ai_assistant/static/src/xml/ai_chat.xml",
            "hr_ai_assistant/static/src/css/ai_chat.css",
        ],
    },
    "installable": True,
    "application": True,
}