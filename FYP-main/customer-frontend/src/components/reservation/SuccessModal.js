import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #F49300',
    boxShadow: 24,
    p: 4,
};

export default function SuccessModal({ openSuccessModal, setOpenModal }) {
    const handleClose = () => setOpenModal(false);

    return (
    <div>
        <Modal
            open={openSuccessModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Thank you for booking with us!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Check your inbox for the confirmation email
            </Typography>
        </Box>
        </Modal>
    </div>
    );
}