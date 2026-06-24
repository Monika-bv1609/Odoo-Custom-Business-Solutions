import base64
import requests
from io import BytesIO

from odoo import models, fields, api
import logging

_logger = logging.getLogger(__name__)


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


    def _send_pdf_to_rag(self):
        _logger.info("======= INSIDE _send_pdf_to_rag")
        self.ensure_one()

        if not self.attachment:
            return

        pdf_content = base64.b64decode(
            self.attachment
        )

        files = {
            "files": (
                self.filename,
                BytesIO(pdf_content),
                "application/pdf"
            )
        }

        _logger.info("UPLOADING PDF TO RAG")
        _logger.info("FILE NAME = %s", self.filename)
        _logger.info("URL = http://127.0.0.1:8001/read-pdf")

        response = requests.post(
            "http://127.0.0.1:8001/read-pdf",
            files={
                "files": (
                    self.filename,
                    BytesIO(pdf_content),
                    "application/pdf"
                )
            },
            data={
                "policy_type": self.document_type
            },
            timeout=60
        )

        response.raise_for_status()

        return response.json()


    @api.model_create_multi
    def create(self, vals_list):
        _logger.info("/////// INSIDE CREATE")

        records = super().create(vals_list)

        for record in records:
            try:
                record._send_pdf_to_rag()
            except Exception as e:
                _logger.exception(
                    "RAG upload failed for document %s",
                    record.id
                )

        return records


    def write(self, vals):

        result = super().write(vals)

        if "attachment" in vals:

            for record in self:
                try:
                    record._send_pdf_to_rag()
                except Exception as e:
                    _logger.exception(
                        "RAG update failed for document %s",
                        record.id
                    )

        return result
    
    def _delete_from_rag(self):

        self.ensure_one()

        response = requests.delete(
            "http://127.0.0.1:8001/delete-pdf",
            params={
                "filename": self.filename
            },
            timeout=60
        )

        response.raise_for_status()

        return response.json()
    

    def unlink(self):

        for record in self:
            try:
                record._delete_from_rag()
            except Exception:
                _logger.exception(
                    "Failed to delete vectors for %s",
                    record.filename
                )

        return super().unlink()
