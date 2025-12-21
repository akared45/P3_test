import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, TextField, Table, 
    TableBody, TableCell, TableHead, TableRow, Button, InputAdornment 
} from '@mui/material';
import { Search } from '@mui/icons-material';

const MedicationListDialog = ({ open, onClose, onSelect, medicationList }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMeds = medicationList.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.genericName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Danh mục thuốc hệ thống</DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    placeholder="Tìm theo tên hoặc hoạt chất..."
                    size="small"
                    sx={{ mb: 2 }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>)
                    }}
                />
                <Table size="small">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Tên thuốc</TableCell>
                            <TableCell>Hoạt chất</TableCell>
                            <TableCell align="right">Chọn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMeds.map((med) => (
                            <TableRow key={med.id} hover>
                                <TableCell><b>{med.name}</b></TableCell>
                                <TableCell>{med.genericName}</TableCell>
                                <TableCell align="right">
                                    <Button size="small" variant="contained" onClick={() => onSelect(med)}>
                                        Chọn
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
};
export default MedicationListDialog;