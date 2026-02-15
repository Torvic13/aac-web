import Contact from "../models/Contact.js";

export async function createContact(req, res) {
  try {
    const { nombre, correo, celular, mensaje } = req.body;

    if (!nombre || !correo || !mensaje) {
      return res.status(400).json({
        ok: false,
        message: "Faltan campos obligatorios: nombre, correo, mensaje",
      });
    }

    const doc = await Contact.create({ nombre, correo, celular, mensaje });

    return res.status(201).json({
      ok: true,
      message: "Contacto guardado ✅",
      contact: doc,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

export async function getContacts(req, res) {
  try {
    // últimos primero
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json({ ok: true, contacts });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Error del servidor" });
  }
}

export async function getContactById(req, res) {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ ok: false, message: "No encontrado" });
    }

    return res.json({ ok: true, contact });
  } catch (err) {
    return res.status(400).json({ ok: false, message: "ID inválido" });
  }
}

export async function updateContact(req, res) {
  try {
    const { id } = req.params;

    // solo permitimos actualizar campos seguros
    const allowed = ["leido"];
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }

    const updated = await Contact.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ ok: false, message: "No encontrado" });
    }

    return res.json({ ok: true, message: "Actualizado ✅", contact: updated });
  } catch (err) {
    return res.status(400).json({ ok: false, message: "ID inválido" });
  }
}

export async function deleteContact(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ ok: false, message: "No encontrado" });
    }

    return res.json({ ok: true, message: "Eliminado ✅" });
  } catch (err) {
    return res.status(400).json({ ok: false, message: "ID inválido" });
  }
}
