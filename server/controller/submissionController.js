const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const Submission = require("../models/submission");
const AuditLog = require("../models/auditlog");
const xss = require("xss");

// Generate a random receipt code
const generateReceiptCode = () => {
  const code = uuidv4().split("-").join("").substring(0, 12).toUpperCase();
  return `CLOAKK-${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
};

/**
 * @desc    Create a new submission
 * @route   POST /api/submissions
 * @access  Public (Time-restricted)
 */
const createSubmission = asyncHandler(async (req, res) => {
  const { textMessage } = req.body;

  if (!textMessage) {
    res.status(400);
    throw new Error("Text message is required");
  }
  // Sanitize input to prevent XSS
  const sanitizedTextMessage = xss(textMessage);

  const submissionData = {
    textMessage: sanitizedTextMessage,
    receiptCode: generateReceiptCode(),
  };

  if (req.file) {
    submissionData.file = {
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
    };
  }

  const submission = await Submission.create(submissionData);

  res.status(201).json({
    message: "Submission received successfully.",
    receiptCode: submission.receiptCode,
  });
});

/**
 * @desc    Get all submissions for admin
 * @route   GET /api/submissions
 * @access  Private (Admin only)
 */
const getAllSubmissions = asyncHandler(async (req, res) => {
  const { viewed, flagged, search } = req.query;

  let query = { isDeleted: false };

  if (viewed) query.isViewed = viewed === "true";
  if (flagged && flagged !== "all") query.isFlagged = flagged;
  if (search) query.textMessage = { $regex: search, $options: "i" };
  //   if (search) query.receiptCode = { $regex: search, $options: "CLOAKK" };

  const submissions = await Submission.find(query).sort({ createdAt: -1 });
  res.status(200).json(submissions);
});

/**
 * @desc    Move a submission to the bin (soft delete)
 * @route   DELETE /api/submissions/:id
 * @access  Private (Admin only)
 */
const deleteSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error("Submission not found");
  }

  submission.isDeleted = true;
  submission.deletedBy = req.admin.id;
  submission.deletedAt = Date.now();
  await submission.save();

  await AuditLog.create({
    adminId: req.admin.id,
    action: "Deleted submission",
    submissionId: submission._id,
  });

  res.status(200).json({ message: "Submission moved to bin" });
});

/**
 * @desc    Get all submissions in the bin
 * @route   GET /api/submissions/bin
 * @access  Private (Admin only)
 */
const getDeletedSubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ isDeleted: true })
    .populate("deletedBy", "username")
    .sort({ deletedAt: -1 });
  res.status(200).json(submissions);
});

module.exports = {
  createSubmission,
  getAllSubmissions,
  deleteSubmission,
  getDeletedSubmissions,
};
