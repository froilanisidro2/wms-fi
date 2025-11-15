# WMS-FI Template Validation Rules
# Comprehensive validation rules for all upload templates

## GENERAL FORMATTING RULES

### File Format Requirements:
- File Type: CSV (Comma Separated Values)
- Encoding: UTF-8
- Line Ending: Windows (CRLF) or Unix (LF)
- Column Separator: Comma (,)
- Text Qualifier: Double quotes (") for text containing commas
- Date Format: YYYY-MM-DD (ISO 8601)
- Boolean Values: TRUE/FALSE (case insensitive)
- Decimal Separator: Period (.)
- Max File Size: 10MB
- Max Records: 10,000 per file

### Required Field Validation:
- Fields marked with * are mandatory
- Cannot be blank/null/empty
- Must contain valid data according to field type

## FIELD-SPECIFIC VALIDATION RULES

### Text Fields:
- Item_Code: 3-50 characters, alphanumeric with hyphens allowed
- Names: 1-200 characters, Unicode supported for Filipino names
- Addresses: 1-500 characters, complete Philippine address format
- Phone: +63-xx-xxx-xxxx format or +63-9xx-xxx-xxxx for mobile
- Email: Valid email format (RFC 5322 compliant)

### Numeric Fields:
- Quantities: Positive decimal numbers, up to 3 decimal places
- Weights: Positive decimal numbers in KG
- Dimensions: Positive decimal numbers in CM
- Prices: Positive decimal numbers in PHP, up to 2 decimal places
- Credit Limits: Positive decimal numbers in PHP

### Date Fields:
- Format: YYYY-MM-DD
- Cannot be in the past (for delivery dates)
- Manufacturing date cannot be future
- Expiry date must be after manufacturing date
- Shelf life must be positive integer (days)

### Code Fields:
- Must exist in reference tables
- Case sensitive
- No special characters except hyphens
- Must be active records

### Philippine-Specific Validations:
- TIN: XXX-XXX-XXX-XXX format (12 digits with hyphens)
- Phone: Must start with +63 country code
- Address: Must include barangay/city/province for complete address
- Currency: All amounts in PHP (Philippine Peso)

## BUSINESS RULE VALIDATIONS

### Inventory Rules:
- Expected quantities must not exceed item max stock level
- Ordered quantities must not exceed available inventory
- Batch numbers must exist if batch tracking is enabled
- Expiry dates required if expiry tracking is enabled
- Serial numbers must be unique if serial tracking is enabled

### Allocation Rules:
- FIFO: First In, First Out - oldest stock allocated first
- FEFO: First Expired, First Out - shortest expiry allocated first
- Batch-specific: Only specified batch allocated
- Cannot allocate more than available quantity
- Cannot allocate expired inventory

### Financial Rules:
- Credit limit cannot be exceeded
- Payment terms must match customer agreement
- Unit prices must be positive
- Line totals must equal quantity × unit price

### Operational Rules:
- Delivery dates must allow sufficient lead time
- Warehouse capacity limits respected
- Pallet configuration must match item master
- Special handling requirements noted
- Priority levels properly assigned

## ERROR HANDLING

### Validation Levels:
1. **Critical Errors**: Prevent import, must be fixed
   - Missing required fields
   - Invalid data types
   - Non-existent reference codes
   - Business rule violations

2. **Warnings**: Allow import with notification
   - Recommended field missing
   - Unusual quantities
   - Near expiry dates
   - Credit limit approaching

3. **Information**: Import successful, FYI
   - Duplicate prevention
   - Data updates
   - New records created

### Error Report Format:
- Row number with error
- Column name with issue
- Error description
- Suggested correction
- Impact level (Critical/Warning/Info)

## TEMPLATE USAGE GUIDELINES

### Data Preparation:
1. Download template from WMS system
2. Fill required fields first
3. Validate data in Excel before upload
4. Save as CSV UTF-8 format
5. Upload through web interface

### Best Practices:
- Use consistent naming conventions
- Maintain data integrity across templates
- Validate references before upload
- Test with small batches first
- Keep backup of original data
- Review error reports carefully

### Philippine WMS Compliance:
- Follow DOH guidelines for food items
- Comply with BIR tax requirements
- Use standard Philippine address format
- Include TIN for all business entities
- Follow DTI labeling requirements
- Respect FDA expiry date regulations