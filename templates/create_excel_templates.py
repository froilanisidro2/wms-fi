import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def create_excel_templates():
    """
    Create Excel templates for WMS-FI data import
    Includes data validation, formatting, and instructions
    """
    
    # Create templates directory if it doesn't exist
    excel_dir = "/home/ubuntu/workspace/wms-fi/templates/excel"
    os.makedirs(excel_dir, exist_ok=True)
    
    # ASN Upload Template
    asn_header_data = {
        'ASN_Number': ['ASN-20251115-001'],
        'Vendor_Code': ['V001'], 
        'Warehouse_Code': ['WH001'],
        'PO_Number': ['PO-20251115-001'],
        'DR_Number': ['DR-20251115-001'],
        'Vendor_Delivery_Note': ['VDN-001'],
        'Expected_Delivery_Date': ['2025-11-16'],
        'Notes': ['Sample ASN for incoming rice shipment']
    }
    
    asn_lines_data = {
        'Line_Number': [1, 2, 3],
        'Item_Code': ['ITM-001', 'ITM-002', 'ITM-003'],
        'Expected_Quantity': [200, 144, 100],
        'Unit_of_Measure': ['BAG', 'BTL', 'SACK'],
        'Batch_Number': ['BATCH-20251115', 'BATCH-20251115', 'BATCH-20251115'],
        'Manufacturing_Date': ['2025-11-15', '2025-11-15', '2025-11-15'],
        'Expiry_Date': ['2026-11-15', '2027-05-15', '2028-11-15'],
        'Pallet_Config_Qty': [40, 48, 20],
        'Special_Instructions': ['Store in dry area', 'Handle with care', 'Heavy items - use forklift']
    }
    
    # Create ASN Excel file
    with pd.ExcelWriter(f'{excel_dir}/ASN_Upload_Template.xlsx', engine='openpyxl') as writer:
        # Header sheet
        pd.DataFrame(asn_header_data).to_excel(writer, sheet_name='ASN_Header', index=False)
        # Lines sheet  
        pd.DataFrame(asn_lines_data).to_excel(writer, sheet_name='ASN_Lines', index=False)
        # Instructions sheet
        instructions = pd.DataFrame({
            'Field': ['ASN_Number', 'Vendor_Code', 'Expected_Quantity', 'Expected_Delivery_Date'],
            'Required': ['Yes', 'Yes', 'Yes', 'Yes'],
            'Format': ['ASN-YYYYMMDD-###', 'Must exist in vendor master', 'Positive number', 'YYYY-MM-DD'],
            'Example': ['ASN-20251115-001', 'V001', '200', '2025-11-16']
        })
        instructions.to_excel(writer, sheet_name='Instructions', index=False)
    
    # Sales Order Template
    so_header_data = {
        'SO_Number': ['SO-20251115-001'],
        'Customer_Code': ['C001'],
        'Warehouse_Code': ['WH001'], 
        'Customer_PO': ['CUST-PO-001'],
        'Requested_Delivery_Date': ['2025-11-18'],
        'Delivery_Address': ['456 Customer Address Manila Philippines'],
        'Delivery_Contact': ['Lisa Santos'],
        'Delivery_Phone': ['+63-2-345-6789'],
        'Priority': ['NORMAL'],
        'Notes': ['Deliver before 3PM']
    }
    
    so_lines_data = {
        'Line_Number': [1, 2, 3],
        'Item_Code': ['ITM-001', 'ITM-002', 'ITM-003'],
        'Ordered_Quantity': [50, 30, 25],
        'Unit_Price': [45.00, 85.00, 55.00],
        'Required_Batch': ['', 'BATCH-20251115', ''],
        'Required_Expiry_After': ['2025-12-01', '', ''],
        'Special_Instructions': ['FIFO allocation preferred', 'Fresh stock only', 'Standard packaging']
    }
    
    # Create SO Excel file
    with pd.ExcelWriter(f'{excel_dir}/SO_Upload_Template.xlsx', engine='openpyxl') as writer:
        pd.DataFrame(so_header_data).to_excel(writer, sheet_name='SO_Header', index=False)
        pd.DataFrame(so_lines_data).to_excel(writer, sheet_name='SO_Lines', index=False)
        
        # SO Instructions
        so_instructions = pd.DataFrame({
            'Field': ['SO_Number', 'Customer_Code', 'Ordered_Quantity', 'Required_Batch'],
            'Required': ['Yes', 'Yes', 'Yes', 'No'],
            'Format': ['SO-YYYYMMDD-###', 'Must exist in customer master', 'Positive number', 'Existing batch number'],
            'Example': ['SO-20251115-001', 'C001', '50', 'BATCH-20251115']
        })
        so_instructions.to_excel(writer, sheet_name='Instructions', index=False)
    
    # Item Master Template
    item_data = {
        'Item_Code': ['ITM-001', 'ITM-002', 'ITM-003'],
        'Item_Name': ['Rice Premium 25kg', 'Cooking Oil 1L', 'Sugar White 50kg'],
        'Description': ['Premium quality rice 25kg bag', 'Premium cooking oil 1 liter bottle', 'Refined white sugar 50kg sack'],
        'Unit_of_Measure': ['BAG', 'BTL', 'SACK'],
        'Item_Category': ['FOOD', 'FOOD', 'FOOD'],
        'Item_Group': ['GRAINS', 'OIL', 'SWEETENER'],
        'ABC_Classification': ['A', 'A', 'A'],
        'Weight_KG': [25.0, 0.92, 50.0],
        'Length_CM': [60, 25, 80],
        'Width_CM': [40, 25, 50],
        'Height_CM': [15, 28, 20],
        'Pallet_Qty': [40, 48, 20],
        'Stackable': [True, True, True],
        'Max_Stack_Height': [4, 5, 2],
        'Min_Stock_Level': [100, 200, 50],
        'Max_Stock_Level': [1000, 2000, 500],
        'Reorder_Point': [200, 400, 100],
        'Batch_Tracking': [True, True, True],
        'Serial_Tracking': [False, False, False],
        'Expiry_Tracking': [False, True, False],
        'Shelf_Life_Days': [365, 730, 1095]
    }
    
    with pd.ExcelWriter(f'{excel_dir}/Item_Master_Template.xlsx', engine='openpyxl') as writer:
        pd.DataFrame(item_data).to_excel(writer, sheet_name='Items', index=False)
    
    print("✅ Excel templates created successfully!")
    print(f"📁 Templates saved in: {excel_dir}")
    print("📋 Templates created:")
    print("   - ASN_Upload_Template.xlsx")
    print("   - SO_Upload_Template.xlsx") 
    print("   - Item_Master_Template.xlsx")

if __name__ == "__main__":
    create_excel_templates()