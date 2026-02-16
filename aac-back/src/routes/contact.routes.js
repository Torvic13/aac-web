import { Router } from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// Público (formulario landing)
router.post("/contact", createContact);

// Protegido (admin) -> SOLO con JWT
router.get("/contacts", requireAuth, getContacts);
router.get("/contacts/:id", requireAuth, getContactById);
router.patch("/contacts/:id", requireAuth, updateContact);
router.delete("/contacts/:id", requireAuth, deleteContact);

export default router;
