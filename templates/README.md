# WMS-FI Import Templates

This directory contains all the data import templates for the Philippine Warehouse Management System (WMS-FI).

## 📋 Available Templates

### Core Templates
| Template | Description | Purpose |
|----------|-------------|---------|
| `ASN_Upload_Template.csv` | Advance Ship Notice | Inbound shipment notifications |
| `SO_Upload_Template.csv` | Sales Order | Outbound customer orders |
| `Item_Master_Upload_Template.csv` | Item Master Data | Product information management |
| `Vendor_Master_Upload_Template.csv` | Vendor Master Data | Supplier information |
| `Customer_Master_Upload_Template.csv` | Customer Master Data | Customer information |

### Documentation
| File | Description |
|------|-------------|
| `Template_Validation_Rules.md` | Complete validation rules and requirements |
| `Sample_Data.csv` | Sample data for testing and training |
| `create_excel_templates.py` | Script to generate Excel templates |

## 🚀 Quick Start

### 1. Download Templates
Choose the appropriate template for your data import:
- For receiving goods: Use **ASN_Upload_Template.csv**
- For shipping orders: Use **SO_Upload_Template.csv**
- For product setup: Use **Item_Master_Upload_Template.csv**

### 2. Fill Template
1. Open the CSV file in Excel or Google Sheets
2. Fill in your data following the format shown
3. Required fields are marked with `*`
4. Follow validation rules in `Template_Validation_Rules.md`

### 3. Validate Data
Before uploading, ensure:
- ✅ All required fields are filled
- ✅ Data formats match requirements
- ✅ Reference codes exist (vendor codes, item codes, etc.)
- ✅ Dates are in YYYY-MM-DD format
- ✅ No special characters in code fields

### 4. Upload to WMS
1. Save file as CSV (UTF-8 encoding)
2. Log into WMS system
3. Navigate to appropriate upload section
4. Select your CSV file
5. Review validation results
6. Confirm import if no errors

## 📊 Philippine WMS Process Flow

### Inbound Process (ASN)
```
ASN Upload → Receiving Checklist → Physical Receiving → 
Putaway → Pallet Tags → Gate Pass → Receipt Confirmation
```

### Outbound Process (SO)  
```
SO Upload → Allocation (FEFO/FIFO) → Pick List → 
Picking → Pick Confirmation → Issuance Gate Pass → 
Loading Checklist → Dispatch
```

## 🇵🇭 Philippine Compliance Features

### Regulatory Requirements
- **DOH Compliance**: Food item expiry tracking and batch management
- **BIR Requirements**: Complete TIN validation and tax reporting
- **DTI Standards**: Product labeling and description requirements
- **FDA Regulations**: Expiration date management for consumables

### Local Business Practices
- **Philippine Address Format**: Complete barangay/city/province addressing
- **TIN Format**: XXX-XXX-XXX-XXX validation
- **Phone Numbers**: +63 country code with area codes
- **Currency**: PHP (Philippine Peso) for all monetary values
- **Measurements**: Metric system (KG, CM, CBM)

## 📝 Template Specifications

### File Format Requirements
- **Type**: CSV (Comma Separated Values)
- **Encoding**: UTF-8
- **Date Format**: YYYY-MM-DD (ISO 8601)
- **Decimal**: Period (.) separator
- **Boolean**: TRUE/FALSE
- **Max File Size**: 10MB
- **Max Records**: 10,000 per file

### Common Fields

#### Required Fields (*)
- Document numbers (ASN_Number, SO_Number, etc.)
- Entity codes (Vendor_Code, Customer_Code, Item_Code)
- Quantities and dates
- Basic identification information

#### Optional Fields
- Additional descriptions and notes
- Special handling instructions
- Extended contact information
- Custom configuration parameters

## 🛠️ Advanced Features

### Allocation Strategies
- **FIFO**: First In, First Out (default)
- **FEFO**: First Expired, First Out (for perishables)
- **Batch Specific**: Allocate specific batch numbers
- **Location Directed**: Specific storage locations

### Inventory Tracking
- **Batch Tracking**: Manufacturing batch management
- **Serial Tracking**: Individual unit tracking
- **Expiry Tracking**: Shelf life and expiration management
- **Quality Status**: Quality control integration

### Document Generation
- **Pallet Tags**: Physical labels for pallets
- **Gate Passes**: Entry/exit authorization
- **Pick Lists**: Picking instructions
- **Loading Checklists**: Shipping verification

## 🔧 Troubleshooting

### Common Issues
| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid vendor code" | Code doesn't exist in system | Check vendor master data |
| "Date format error" | Wrong date format | Use YYYY-MM-DD format |
| "Quantity validation failed" | Negative or zero quantity | Enter positive numbers |
| "Batch not found" | Batch doesn't exist in inventory | Verify batch number |

### Validation Levels
- **Critical**: Must fix before import
- **Warning**: Import allowed with notification  
- **Info**: Successful import information

## 📞 Support

### Contact Information
- **System Admin**: admin@wms-fi.com
- **User Support**: support@wms-fi.com
- **Technical Issues**: tech@wms-fi.com

### Resources
- User Manual: Available in WMS system
- Training Videos: Company intranet
- FAQ: System help section
- Philippine WMS Standards: DOH/DTI/BIR guidelines

---

**Note**: This WMS system is designed specifically for Philippine warehouse operations and complies with local regulatory requirements. All templates include Philippine-specific validations and business rules.