const { body, validationResult } = require("express-validator")
const sanitizeHtml = require("sanitize-html")

const validateIcon = [
  body("svg")
    .trim()
    .notEmpty()
    .withMessage("SVG code cannot be empty")
    .bail()
    .matches(/^<svg[\s\S]*<\/svg>$/i)
    .withMessage("Invalid SVG format")
    .customSanitizer((value) =>
      sanitizeHtml(value, {
        allowedTags: false,
        disallowedTagsMode: "discard",
        disallowedTags: ["script", "style"],
        allowedAttributes: false,
        exclusiveFilter: (frame) => {
          for (let attr in frame.attribs) {
            if (/^on/i.test(attr)) return true // remove event handlers
          }
          return false
        },
      })
    ),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  },
]

const validateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Category name cannot exceed 255 characters"),

  (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      req.errors = result.array()
    }
    next()
  },
]

const validateItem = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Item name is required")
    .isLength({ max: 255 })
    .withMessage("Item name cannot exceed 255 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative integer"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.errors = errors.array()
    }
    next()
  },
]

module.exports = { validateIcon, validateCategory, validateItem }
