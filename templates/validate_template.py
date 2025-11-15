#!/usr/bin/env python3
"""
WMS-FI Template Validator
Validates CSV template data before importing to the database
"""

import pandas as pd
import re
from datetime import datetime
import argparse
import sys

class WMSTemplateValidator:
    """Validator for WMS-FI CSV templates"""
    
    def __init__(self):
        self.errors = []
        self.warnings = []
        self.info = []
        
        # Philippine phone regex
        self.phone_pattern = r'^\+63-\d{1,4}-\d{3}-\d{4}$'
        # Philippine TIN regex
        self.tin_pattern = r'^\d{3}-\d{3}-\d{3}-\d{3}$'
        # Email regex
        self.email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        # Date regex
        self.date_pattern = r'^\d{4}-\d{2}-\d{2}$'
    
    def validate_asn(self, file_path):
        """Validate ASN upload template"""
        try:
            df = pd.read_csv(file_path)
            
            # Required columns for ASN
            required_cols = [
                'ASN_Number', 'Vendor_Code', 'Warehouse_Code', 
                'Expected_Delivery_Date', 'Line_Number', 'Item_Code', 
                'Expected_Quantity', 'Unit_of_Measure'
            ]
            
            self._validate_required_columns(df, required_cols, 'ASN')
            self._validate_asn_specific(df)
            
        except Exception as e:
            self.errors.append(f"File read error: {str(e)}")
    
    def validate_so(self, file_path):
        """Validate Sales Order upload template"""
        try:
            df = pd.read_csv(file_path)
            
            required_cols = [
                'SO_Number', 'Customer_Code', 'Warehouse_Code',
                'Requested_Delivery_Date', 'Line_Number', 'Item_Code',
                'Ordered_Quantity'
            ]
            
            self._validate_required_columns(df, required_cols, 'SO')
            self._validate_so_specific(df)
            
        except Exception as e:
            self.errors.append(f"File read error: {str(e)}")
    
    def validate_item_master(self, file_path):
        """Validate Item Master template"""
        try:
            df = pd.read_csv(file_path)
            
            required_cols = [
                'Item_Code', 'Item_Name', 'Unit_of_Measure',
                'Batch_Tracking', 'Serial_Tracking', 'Expiry_Tracking'
            ]
            
            self._validate_required_columns(df, required_cols, 'Item Master')
            self._validate_item_specific(df)
            
        except Exception as e:
            self.errors.append(f"File read error: {str(e)}")
    
    def validate_vendor_master(self, file_path):
        """Validate Vendor Master template"""
        try:
            df = pd.read_csv(file_path)
            
            required_cols = ['Vendor_Code', 'Vendor_Name', 'Active']
            
            self._validate_required_columns(df, required_cols, 'Vendor Master')
            self._validate_vendor_specific(df)
            
        except Exception as e:
            self.errors.append(f"File read error: {str(e)}")
    
    def _validate_required_columns(self, df, required_cols, template_type):
        """Check if required columns exist"""
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            self.errors.append(f"{template_type}: Missing required columns: {missing_cols}")
        
        # Check for empty required fields
        for col in required_cols:
            if col in df.columns:
                empty_rows = df[df[col].isna() | (df[col] == '')].index.tolist()
                if empty_rows:
                    self.errors.append(f"{template_type}: Empty values in required field '{col}' at rows: {empty_rows}")
    
    def _validate_asn_specific(self, df):
        """ASN specific validations"""
        for idx, row in df.iterrows():
            # ASN Number format
            if 'ASN_Number' in df.columns and pd.notna(row['ASN_Number']):
                if not re.match(r'^ASN-\d{8}-\d+$', str(row['ASN_Number'])):
                    self.errors.append(f"Row {idx+1}: Invalid ASN number format. Use ASN-YYYYMMDD-###")
            
            # Expected Quantity must be positive
            if 'Expected_Quantity' in df.columns and pd.notna(row['Expected_Quantity']):
                try:
                    qty = float(row['Expected_Quantity'])
                    if qty <= 0:
                        self.errors.append(f"Row {idx+1}: Expected quantity must be positive")
                except ValueError:
                    self.errors.append(f"Row {idx+1}: Expected quantity must be numeric")
            
            # Date validation
            if 'Expected_Delivery_Date' in df.columns and pd.notna(row['Expected_Delivery_Date']):
                if not re.match(self.date_pattern, str(row['Expected_Delivery_Date'])):
                    self.errors.append(f"Row {idx+1}: Invalid date format. Use YYYY-MM-DD")
                else:
                    try:
                        date_obj = datetime.strptime(str(row['Expected_Delivery_Date']), '%Y-%m-%d')
                        if date_obj.date() < datetime.now().date():
                            self.warnings.append(f"Row {idx+1}: Delivery date is in the past")
                    except ValueError:
                        self.errors.append(f"Row {idx+1}: Invalid date value")
    
    def _validate_so_specific(self, df):
        """Sales Order specific validations"""
        for idx, row in df.iterrows():
            # SO Number format
            if 'SO_Number' in df.columns and pd.notna(row['SO_Number']):
                if not re.match(r'^SO-\d{8}-\d+$', str(row['SO_Number'])):
                    self.errors.append(f"Row {idx+1}: Invalid SO number format. Use SO-YYYYMMDD-###")
            
            # Ordered Quantity must be positive
            if 'Ordered_Quantity' in df.columns and pd.notna(row['Ordered_Quantity']):
                try:
                    qty = float(row['Ordered_Quantity'])
                    if qty <= 0:
                        self.errors.append(f"Row {idx+1}: Ordered quantity must be positive")
                except ValueError:
                    self.errors.append(f"Row {idx+1}: Ordered quantity must be numeric")
            
            # Unit Price validation
            if 'Unit_Price' in df.columns and pd.notna(row['Unit_Price']):
                try:
                    price = float(row['Unit_Price'])
                    if price < 0:
                        self.errors.append(f"Row {idx+1}: Unit price cannot be negative")
                except ValueError:
                    self.errors.append(f"Row {idx+1}: Unit price must be numeric")
    
    def _validate_item_specific(self, df):
        """Item Master specific validations"""
        for idx, row in df.iterrows():
            # ABC Classification
            if 'ABC_Classification' in df.columns and pd.notna(row['ABC_Classification']):
                if str(row['ABC_Classification']).upper() not in ['A', 'B', 'C']:
                    self.errors.append(f"Row {idx+1}: ABC Classification must be A, B, or C")
            
            # Weight validation
            if 'Weight_KG' in df.columns and pd.notna(row['Weight_KG']):
                try:
                    weight = float(row['Weight_KG'])
                    if weight <= 0:
                        self.errors.append(f"Row {idx+1}: Weight must be positive")
                except ValueError:
                    self.errors.append(f"Row {idx+1}: Weight must be numeric")
            
            # Boolean fields validation
            boolean_fields = ['Batch_Tracking', 'Serial_Tracking', 'Expiry_Tracking', 'Stackable']
            for field in boolean_fields:
                if field in df.columns and pd.notna(row[field]):
                    if str(row[field]).upper() not in ['TRUE', 'FALSE', '1', '0']:
                        self.errors.append(f"Row {idx+1}: {field} must be TRUE or FALSE")
    
    def _validate_vendor_specific(self, df):
        """Vendor Master specific validations"""
        for idx, row in df.iterrows():
            # Phone validation
            if 'Phone' in df.columns and pd.notna(row['Phone']):
                if not re.match(self.phone_pattern, str(row['Phone'])):
                    self.warnings.append(f"Row {idx+1}: Phone format should be +63-XX-XXX-XXXX")
            
            # Email validation
            if 'Email' in df.columns and pd.notna(row['Email']):
                if not re.match(self.email_pattern, str(row['Email'])):
                    self.errors.append(f"Row {idx+1}: Invalid email format")
            
            # TIN validation
            if 'TIN' in df.columns and pd.notna(row['TIN']):
                if not re.match(self.tin_pattern, str(row['TIN'])):
                    self.warnings.append(f"Row {idx+1}: TIN format should be XXX-XXX-XXX-XXX")
    
    def get_results(self):
        """Return validation results"""
        return {
            'errors': self.errors,
            'warnings': self.warnings, 
            'info': self.info,
            'is_valid': len(self.errors) == 0
        }
    
    def print_results(self):
        """Print validation results to console"""
        print("\n" + "="*60)
        print("WMS-FI TEMPLATE VALIDATION RESULTS")
        print("="*60)
        
        if self.errors:
            print(f"\n❌ CRITICAL ERRORS ({len(self.errors)}):")
            for i, error in enumerate(self.errors, 1):
                print(f"   {i}. {error}")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS ({len(self.warnings)}):")
            for i, warning in enumerate(self.warnings, 1):
                print(f"   {i}. {warning}")
        
        if self.info:
            print(f"\nℹ️  INFORMATION ({len(self.info)}):")
            for i, info in enumerate(self.info, 1):
                print(f"   {i}. {info}")
        
        print(f"\n{'='*60}")
        if len(self.errors) == 0:
            print("✅ VALIDATION PASSED - Ready for import!")
        else:
            print("❌ VALIDATION FAILED - Please fix errors before importing")
        print(f"{'='*60}")

def main():
    parser = argparse.ArgumentParser(description='Validate WMS-FI CSV templates')
    parser.add_argument('file', help='CSV file to validate')
    parser.add_argument('--type', choices=['asn', 'so', 'item', 'vendor', 'customer'], 
                       help='Template type', required=True)
    
    args = parser.parse_args()
    
    validator = WMSTemplateValidator()
    
    # Route to appropriate validation method
    if args.type == 'asn':
        validator.validate_asn(args.file)
    elif args.type == 'so':
        validator.validate_so(args.file)
    elif args.type == 'item':
        validator.validate_item_master(args.file)
    elif args.type == 'vendor':
        validator.validate_vendor_master(args.file)
    
    validator.print_results()
    
    # Exit with error code if validation failed
    results = validator.get_results()
    sys.exit(0 if results['is_valid'] else 1)

if __name__ == "__main__":
    main()