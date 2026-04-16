import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import { Link as RouterLink } from 'react-router-dom'

const initialForm = {
  email: '',
  password: '',
}

const initialTouched = {
  email: false,
  password: false,
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

  return ''
}

function LoginPage() {
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState(initialTouched)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState({
    open: false,
    severity: 'error',
    message: '',
  })

  const errors = useMemo(
    () => ({
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    }),
    [form],
  )

  const isFormValid = Object.values(errors).every((error) => !error)

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
      email: true,
      password: true,
    })

    if (!isFormValid) {
      setNotification({
        open: true,
        severity: 'error',
        message: 'Vui long kiem tra lai thong tin dang nhap.',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          const wrongEmail = form.email.toLowerCase().includes('wrong')
          const wrongPassword = form.password !== '12345678'
          if (wrongEmail || wrongPassword) {
            reject(new Error('Email hoac mat khau khong chinh xac.'))
            return
          }

          resolve()
        }, 800)
      })

      setNotification({
        open: true,
        severity: 'success',
        message: 'Dang nhap thanh cong.',
      })
      setForm(initialForm)
      setTouched(initialTouched)
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: error.message || 'Dang nhap that bai. Vui long thu lai.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'grid', placeItems: 'center', py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleSubmit} noValidate>
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

            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mt: 1 }}>
              Dang nhap
            </Typography>
            <Typography color="text.secondary">Dang nhap de tiep tuc su dung InteractHub.</Typography>
          </Stack>

          <Stack spacing={1.5}>
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
            <TextField
              label="Mat khau"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password ? errors.password || ' ' : ' '}
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label={showPassword ? 'An mat khau' : 'Hien mat khau'}
                      >
                        {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Dang dang nhap...' : 'Dang nhap'}
          </Button>

          <Typography textAlign="center" color="text.secondary">
            Chua co tai khoan?{' '}
            <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
              Dang ky ngay
            </Link>
          </Typography>
        </Stack>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
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

export default LoginPage
