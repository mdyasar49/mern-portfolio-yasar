const fs = require('fs');
const path = require('path');
const Contact = require('../models/Contact');
const { sendContactAlert, sendAcknowledgmentEmail } = require('../services/emailService');
const asyncHandler = require('../middleware/asyncHandler');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const contactsFile = path.join(__dirname, '../contacts.json');

/**
 * Saves contact to local JSON backup.
 */
// Define a helper function to save a contact to the local JSON file
const saveLocalContact = (contact) => {
  // Start a try block to gracefully catch any errors while reading or writing the file
  try {
    // Initialize an empty array to hold our contacts
    let contacts = [];
    // Check if the contacts.json file already exists on the disk
    if (fs.existsSync(contactsFile)) {
      // Read the contents of the existing JSON file
      const content = fs.readFileSync(contactsFile, 'utf-8');
      // Parse the JSON string back into a JavaScript array (or empty array if empty)
      contacts = JSON.parse(content || '[]');
    }

    // Create a new entry object making sure it has a unique ID and proper date format
    const localEntry = {
      // Copy all existing properties from the incoming contact object
      ...contact,
      // Use the existing ID or generate a fallback unique local ID using timestamp and random string
      _id: contact._id || `LOCAL_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      // Ensure the creation date is stored as a standard ISO string
      createdAt:
        contact.createdAt instanceof Date ? contact.createdAt.toISOString() : contact.createdAt,
    };

    // Add the new contact entry to the VERY BEGINNING of the array (most recent first)
    contacts.unshift(localEntry);
    // Write the updated array back to the JSON file, keeping only the 100 most recent entries to prevent massive files
    fs.writeFileSync(contactsFile, JSON.stringify(contacts.slice(0, 100), null, 2));
    // Catch any errors during the file operations
    } catch (e) {
    logger.error('Local contact backup failed:', e);
  }
};

/**
 * Simple XSS protection by stripping HTML tags.
 */
const cleanse = (str = '') => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>?/gm, '')
    .trim();
};

/**
 * Handles contact form submissions.
 */
exports.submitContactForm = asyncHandler(async (req, res, next) => {
  const name = cleanse(req.body.name);
  const email = cleanse(req.body.email);
  const profession = cleanse(req.body.profession || 'Independent Professional');
  const subject = cleanse(req.body.subject || 'No Subject');
  const message = cleanse(req.body.message);

  // Validate that the required fields are provided
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Please provide all required fields.' });
  }

  // Package the cleansed data
  const contactData = { name, email, profession, subject, message, createdAt: new Date() };
  logger.info(`New contact message from: ${name}`);

  // Step 1. Persist to MongoDB if connected
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      await Contact.create(contactData);
    } catch (e) {
      logger.error('DB save failed for contact:', e);
    }
  }

  // Step 2. Persist to Local JSON backup
  saveLocalContact(contactData);

  // Step 3. Dispatch Email Alert to Admin (Non-blocking)
  sendContactAlert(contactData).catch((error) =>
    logger.error('Admin email alert failed:', error)
  );

  // Send acknowledgment email to sender (non-blocking)
  sendAcknowledgmentEmail(contactData).catch((error) =>
    logger.error('Acknowledgment email failed:', error)
  );

  // Respond back to the frontend
  res.status(200).json({
    success: true,
    message: 'Your message has been sent successfully.',
  });

  // Emit real-time update
  const io = req.app.get('io');
  if (io) io.emit('newInquiry', contactData);
});

/**
 * Get all contact messages.
 */
exports.getContacts = asyncHandler(async (req, res, next) => {
  let contacts = [];

  // Priority 1: Fetch from MongoDB if connected
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      contacts = await Contact.find().sort({ createdAt: -1 });
    } catch (e) {
      logger.error('DB fetch failed for contacts:', e);
    }
  }

  // Priority 2: If DB returned nothing or is disconnected, use local JSON backup
  if (contacts.length === 0 && fs.existsSync(contactsFile)) {
    try {
      const content = fs.readFileSync(contactsFile, 'utf-8');
      contacts = JSON.parse(content || '[]');
    } catch (e) {
      logger.error('Local contacts read failed:', e);
    }
  }

  res.status(200).json({
    success: true,
    count: contacts.length,
    payload: contacts,
  });
});
