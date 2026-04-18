import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
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
    return 'Vui lòng nhập địa chỉ email.'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return 'Email không đúng định dạng.'
  }

  return ''
}

function validatePassword(value) {
  if (!value) {
    return 'Vui lòng nhập mật khẩu.'
  }

  return ''
}

function MobileLoginPage() {
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState(initialTouched)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
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
        message: 'Vui lòng kiểm tra lại thông tin đăng nhập.',
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
            reject(new Error('Email hoặc mật khẩu không chính xác.'))
            return
          }

          resolve()
        }, 800)
      })

      setNotification({
        open: true,
        severity: 'success',
        message: 'Đăng nhập thành công.',
      })
      setForm(initialForm)
      setTouched(initialTouched)
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: error.message || 'Đăng nhập thất bại. Vui lòng thử lại.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenForgotPassword = () => {
    setForgotEmail(form.email)
    setIsForgotOpen(true)
  }

  const handleCloseForgotPassword = () => {
    setIsForgotOpen(false)
  }

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault()

    const emailError = validateEmail(forgotEmail)
    if (emailError) {
      setNotification({
        open: true,
        severity: 'error',
        message: emailError,
      })
      return
    }

    setIsForgotOpen(false)
    setNotification({
      open: true,
      severity: 'success',
      message: 'Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email.',
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F3F4F6', px: 2.5, py: 4 }}>
      <Stack spacing={2.5} sx={{ maxWidth: 430, mx: 'auto' }}>
        <Stack alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              backgroundColor: '#6B7280',
              color: '#FFFFFF',
              display: 'grid',
              placeItems: 'center',
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            *
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            InteractHub
          </Typography>
          <Typography sx={{ letterSpacing: 1, color: '#4B5563' }}>KẾT NỐI & TƯƠNG TÁC</Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{ borderRadius: 5, p: 3, border: '1px solid', borderColor: 'rgba(0,0,0,0.08)' }}
        >
          <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              placeholder="example@interacthub.vn"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email ? errors.email || ' ' : ' '}
              fullWidth
            />

            <Box>
              <TextField
                label="Mật khẩu"
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
                          aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: -0.5 }}>
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  color="primary.main"
                  sx={{ fontWeight: 700 }}
                  onClick={handleOpenForgotPassword}
                >
                  Quên mật khẩu?
                </Link>
              </Stack>
            </Box>

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              disabled={isSubmitting}
              sx={{ borderRadius: 3, py: 1.25 }}
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Stack>
        </Paper>

        <Typography textAlign="center" color="text.secondary">
          Chưa có tài khoản?{' '}
          <Link component={RouterLink} to="/mobile/register" underline="hover" fontWeight={700}>
            Đăng ký ngay
          </Link>
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center">
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Bảo mật
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Điều khoản
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Hỗ trợ
          </Typography>
        </Stack>
      </Stack>

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

      <Dialog open={isForgotOpen} onClose={handleCloseForgotPassword} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleForgotPasswordSubmit}>
          <DialogTitle>Quên mật khẩu</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Địa chỉ email"
              type="email"
              fullWidth
              value={forgotEmail}
              onChange={(event) => setForgotEmail(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForgotPassword} color="inherit">
              Hủy
            </Button>
            <Button type="submit" variant="contained">
              Gửi yêu cầu
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}

export default MobileLoginPage
