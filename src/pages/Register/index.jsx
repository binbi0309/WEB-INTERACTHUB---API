import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import { Link as RouterLink } from 'react-router-dom'

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const initialTouched = {
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
}

function validateFullName(value) {
  if (!value.trim()) {
    return 'Vui long nhap ho va ten.'
  }

  if (value.trim().length < 2) {
    return 'Ho va ten phai co it nhat 2 ky tu.'
  }

  return ''
}

function validateEmail(value) {
  if (!value.trim()) {
    return 'Vui long nhap dia chi email.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return 'Email khong dung dinh dang.'
  }

  return ''
}

function validatePassword(value) {
  if (!value) {
    return 'Vui long nhap mat khau.'
  }

  if (value.length < 8) {
    return 'Mat khau phai co it nhat 8 ky tu.'
  }

  return ''
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Vui long nhap lai mat khau.'
  }

  if (password !== confirmPassword) {
    return 'Mat khau nhap lai khong khop.'
  }

  return ''
}

function getPasswordChecks(password, confirmPassword) {
  return [
    {
      label: '8+ ky tu',
      valid: password.length >= 8,
    },
    {
      label: 'Mot chu so',
      valid: /\d/.test(password),
    },
    {
      label: 'Khop nhau',
      valid: confirmPassword.length > 0 && password === confirmPassword,
      invalid: confirmPassword.length > 0 && password !== confirmPassword,
    },
  ]
}

function RegisterPage() {
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState(initialTouched)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    severity: 'success',
    message: '',
  })

  const errors = useMemo(
    () => ({
      fullName: validateFullName(form.fullName),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    }),
    [form],
  )

  const isFormValid = Object.values(errors).every((error) => !error)
  const passwordChecks = getPasswordChecks(form.password, form.confirmPassword)

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const handleBlur = (event) => {
    const { name } = event.target

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const handleCloseNotification = (_, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setNotification((prev) => ({
      ...prev,
      open: false,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    if (!isFormValid) {
      setNotification({
        open: true,
        severity: 'error',
        message: 'Vui long kiem tra lai thong tin dang ky.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (form.email.toLowerCase().includes('fail') || form.email.toLowerCase().includes('exists')) {
            reject(new Error('Email nay da ton tai hoac khong the dang ky.'))
            return
          }

          resolve()
        }, 900)
      })

      setNotification({
        open: true,
        severity: 'success',
        message: 'Dang ky thanh cong. Vui long kiem tra hop thu de xac minh email.',
      })
      setForm(initialForm)
      setTouched(initialTouched)
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: error.message || 'Dang ky that bai. Vui long thu lai.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
      }}
    >
      <Grid container spacing={0} sx={{ borderRadius: 6, overflow: 'hidden', boxShadow: 8 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: '100%',
              minHeight: { xs: 320, md: 760 },
              p: { xs: 4, md: 8 },
              color: '#FFFFFF',
              background:
                'radial-gradient(circle at 50% 70%, rgba(89, 117, 150, 0.25), transparent 30%), linear-gradient(180deg, #2B2B2B 0%, #111111 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Stack spacing={3} sx={{ maxWidth: 440, mt: { xs: 4, md: 8 } }}>
              <Typography variant="h2" component="h1" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                Tham gia Cong dong Nha sang tao.
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.78)', lineHeight: 1.6 }}>
                Mot he sinh thai chuyen nghiep duoc thiet ke de ket noi, minh bach va phat trien
                ben vung. Bat dau hanh trinh cua ban voi InteractHub.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 4, flexWrap: 'wrap' }}>
              <Paper
                elevation={0}
                sx={{
                  px: 2.5,
                  py: 2,
                  minWidth: 140,
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                  12k+
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                  Thanh vien
                </Typography>
              </Paper>
              <Paper
                elevation={0}
                sx={{
                  px: 2.5,
                  py: 2,
                  minWidth: 140,
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                  4.9/5
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.78)' }}>
                  Do tin cay
                </Typography>
              </Paper>
            </Stack>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              minHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.paper',
              p: { xs: 3, sm: 5, md: 7 },
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 440 }}>
              <Stack spacing={4} component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1.5,
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                      }}
                    >
                      I
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      InteractHub
                    </Typography>
                  </Stack>
                  <Typography variant="h3" component="h2" sx={{ mt: 3, fontWeight: 700 }}>
                    Tao tai khoan
                  </Typography>
                  <Typography color="text.secondary">
                    Nhap thong tin chi tiet de bat dau tham gia.
                  </Typography>
                </Stack>

                <Stack spacing={2.5}>
                  <TextField
                    label="Ho va ten"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName ? errors.fullName || ' ' : ' '}
                    fullWidth
                  />
                  <TextField
                    label="Dia chi email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email ? errors.email || ' ' : ' '}
                    fullWidth
                  />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Mat khau"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password ? errors.password || ' ' : ' '}
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        label="Nhap lai mat khau"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword ? errors.confirmPassword || ' ' : ' '}
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {passwordChecks.map((item) => (
                      <Chip
                        key={item.label}
                        icon={
                          item.invalid ? (
                            <ErrorRoundedIcon />
                          ) : item.valid ? (
                            <CheckCircleRoundedIcon />
                          ) : (
                            <RadioButtonUncheckedRoundedIcon />
                          )
                        }
                        label={item.label}
                        color={item.invalid ? 'error' : item.valid ? 'primary' : 'default'}
                        variant={item.valid || item.invalid ? 'filled' : 'outlined'}
                        sx={{ justifyContent: 'flex-start' }}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Button type="submit" size="large" variant="contained" disabled={isSubmitting} fullWidth>
                  {isSubmitting ? 'Dang xu ly...' : 'Dang ky tai khoan'}
                </Button>

                <Typography textAlign="center" color="text.secondary">
                  Da co tai khoan?{' '}
                  <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
                    Dang nhap tai day
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default RegisterPage
