from odoo import models, fields


class AIDocument(models.Model):
    _name = "ai.document"
    _description = "AI Knowledge Base Document"

    name = fields.Char(
        required=True
    )

    document_type = fields.Selection(
        [
            ("policy", "Policy"),
            ("handbook", "Handbook"),
            ("wfh", "WFH"),
            ("travel", "Travel"),
            ("other", "Other"),
        ],
        default="policy",
        required=True
    )

    attachment = fields.Binary(
        string="PDF File",
        attachment=True,
        required=True
    )

    filename = fields.Char(
        string="Filename"
    )

    active = fields.Boolean(
        default=True
    )