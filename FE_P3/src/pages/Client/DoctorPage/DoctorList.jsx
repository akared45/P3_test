import React from 'react';
import {
  Box, Typography, Grid, Paper, Skeleton
} from '@mui/material';
import DoctorCard from './DoctorCard';

const DoctorList = ({
  filteredDoctors,
  totalDoctors,  // NHẬN THÊM PROP NÀY
  loading,
  handleOpenBooking,
  handleClearFilters,
  searchTerm,
  selectedSpec,
  selectedDays,
  experienceRange,
  isMobile,
  page,
  itemsPerPage
}) => {
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = Math.min(page * itemsPerPage, totalDoctors);

  return (
    <>
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2 
      }}>
        <Box>
          <Typography variant="body1" color="text.secondary">
            Tìm thấy <b>{totalDoctors}</b> bác sĩ phù hợp
          </Typography>
          {totalDoctors > itemsPerPage && (
            <Typography variant="caption" color="text.secondary">
              Hiển thị {startIndex}-{endIndex} trên {totalDoctors} kết quả
            </Typography>
          )}
        </Box>
        
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {(searchTerm || selectedSpec !== "all" || selectedDays.length > 0 || experienceRange[0] > 0 || experienceRange[1] < 50) && (
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', fontWeight: 600 }}
                onClick={handleClearFilters}
              >
                Xóa bộ lọc
              </Typography>
            )}
          </Box>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Grid item xs={12} sm={6} lg={4} key={idx}>
              <Paper sx={{ 
                height: 400, 
                borderRadius: 4, 
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <Skeleton variant="circular" width={80} height={80} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="80%" height={30} />
                <Skeleton variant="text" width="60%" sx={{ mb: 3 }} />
                <Skeleton variant="rectangular" width="100%" height={150} sx={{ borderRadius: 3 }} />
              </Paper>
            </Grid>
          ))
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} lg={4} key={doctor.id}>
              <DoctorCard 
                doctor={doctor} 
                onBook={handleOpenBooking} 
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ 
              textAlign: "center", 
              py: 10, 
              width: "100%", 
              bgcolor: 'white', 
              borderRadius: 4,
              border: '1px solid #ececec'
            }}>
              <img 
                src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png" 
                alt="No result" 
                style={{ width: 120, opacity: 0.5 }} 
              />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
                Không tìm thấy bác sĩ nào khớp với bộ lọc.
              </Typography>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer', fontWeight: 600 }}
                onClick={handleClearFilters}
              >
                Xóa tất cả bộ lọc
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default DoctorList;