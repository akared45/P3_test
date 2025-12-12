import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MuiModal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Modal = ({ open, onClose, title, message, onConfirm }) => {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {title}
        </Typography>

        <Typography sx={{ mb: 3 }}>{message}</Typography>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>

          <Button variant="contained" color="error" onClick={onConfirm}>
            Đồng ý
          </Button>
        </div>
      </Box>
    </MuiModal>
  );
};

export default Modal;
