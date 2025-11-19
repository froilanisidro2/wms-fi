                <tbody>
                  {asnGridData.map((row, rowIndex) => (
                    <tr key={row.ID} style={{ backgroundColor: rowIndex % 2 === 0 ? '#fafafa' : 'white' }}>
                      {/* ID */}
                      <td><input type="number" value={row.ID || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ID: parseInt(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* ASN Code */}
                      <td><input type="text" value={row.ASN_CODE || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ASN_CODE: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* ASN Status */}
                      <td><select value={row.ASN_STATUS || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ASN_STATUS: e.target.value };
                        setAsnGridData(newData);
                      }} style={{ width: '100%', border: 'none', padding: '2px' }}>
                        <option value="">-</option>
                        <option value="Draft">Draft</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Receiving">Receiving</option>
                        <option value="Complete">Complete</option>
                        <option value="On Hold">On Hold</option>
                      </select></td>
                      
                      {/* Supplier */}
                      <td><input type="text" value={row.SUPPLIER || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, SUPPLIER: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* PO No */}
                      <td><input type="text" value={row.PO_NO || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, PO_NO: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Create Time */}
                      <td><input type="text" value={row.CREATE_TIME || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, CREATE_TIME: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Update Time */}
                      <td><input type="text" value={row.UPDATE_TIME || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, UPDATE_TIME: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Code */}
                      <td><input type="text" value={row.ITEM_CODE || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ITEM_CODE: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Description */}
                      <td><input type="text" value={row.ITEM_DESCRIPTION || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ITEM_DESCRIPTION: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Qty (KG) */}
                      <td><input type="number" step="0.01" value={row.ITEM_QTY_KG || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ITEM_QTY_KG: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* UOM */}
                      <td><select value={row.UOM || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, UOM: e.target.value };
                        setAsnGridData(newData);
                      }} style={{ width: '100%', border: 'none', padding: '2px' }}>
                        <option value="">-</option>
                        <option value="KG">KG</option>
                        <option value="L">L</option>
                        <option value="PCS">PCS</option>
                        <option value="BOX">BOX</option>
                        <option value="CASE">CASE</option>
                      </select></td>
                      
                      {/* Actual Qty */}
                      <td><input type="number" step="0.01" value={row.ACTUAL_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ACTUAL_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Weight (KG) */}
                      <td><input type="number" step="0.01" value={row.ITEM_WEIGHT_KG || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ITEM_WEIGHT_KG: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Pallet Config */}
                      <td><input type="text" value={row.PALLET_CONFIG || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, PALLET_CONFIG: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Pallet ID */}
                      <td><input type="text" value={row.PALLET_ID || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, PALLET_ID: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* MFG Date */}
                      <td><input type="date" value={row.MFG_DATE || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, MFG_DATE: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* EXP Date */}
                      <td><input type="date" value={row.EXP_DATE || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, EXP_DATE: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Batch No */}
                      <td><input type="text" value={row.BATCH_NO || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, BATCH_NO: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Sorted Qty */}
                      <td><input type="number" step="0.01" value={row.SORTED_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, SORTED_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Shortage Qty */}
                      <td><input type="number" step="0.01" value={row.SHORTAGE_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, SHORTAGE_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* More Qty */}
                      <td><input type="number" step="0.01" value={row.MORE_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, MORE_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Damage Qty */}
                      <td><input type="number" step="0.01" value={row.DAMAGE_QTY || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, DAMAGE_QTY: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Volume */}
                      <td><input type="number" step="0.001" value={row.ITEM_VOLUME || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ITEM_VOLUME: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Item Cost */}
                      <td><input type="number" step="0.01" value={row.ITEM_COST || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, ITEM_COST: parseFloat(e.target.value) || 0 };
                        setAsnGridData(newData);
                      }} /></td>
                      
                      {/* Goods Remarks */}
                      <td><input type="text" value={row.GOODS_REMARKS || ''} onChange={(e) => {
                        const newData = [...asnGridData];
                        newData[rowIndex] = { ...row, GOODS_REMARKS: e.target.value };
                        setAsnGridData(newData);
                      }} /></td>
                    </tr>
                  ))}
                </tbody>