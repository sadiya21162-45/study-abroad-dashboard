'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import { useUserStore } from '@/store/userStore';

export default function UsersPage() {
  const router = useRouter();
  const {
    users,
    loading,
    error,
    total,
    skip,
    limit,
    fetchUsers,
    searchUsers,
  } = useUserStore();

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchUsers(page * limit, limit);
  }, [page, limit, fetchUsers]);

  const handleSearch = useCallback((query: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query);
      } else {
        fetchUsers(0, limit);
      }
    }, 500);

    setSearchTimeout(timeout);
  }, [searchUsers, fetchUsers, limit]);

  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleViewUser = useCallback((id: number) => {
    router.push(`/users/${id}`);
  }, [router]);

  const memoizedUsers = useMemo(() => users, [users]);

  if (error) {
    return (
      <ProtectedRoute>
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Users Management
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Desktop Table View */}
            <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {memoizedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.company.name}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleViewUser(user.id)}
                          color="primary"
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Mobile Card View */}
            <Grid container spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>
              {memoizedUsers.map((user) => (
                <Grid item xs={12} key={user.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        {`${user.firstName} ${user.lastName}`}
                      </Typography>
                      <Typography color="textSecondary">{user.email}</Typography>
                      <Typography>Gender: {user.gender}</Typography>
                      <Typography>Phone: {user.phone}</Typography>
                      <Typography>Company: {user.company.name}</Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewUser(user.id)}
                          fullWidth
                        >
                          View Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={limit}
              rowsPerPageOptions={[10]}
            />
          </>
        )}
      </Container>
    </ProtectedRoute>
  );
}