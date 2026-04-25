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
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../../features/auth/hooks/useAuthMutations'
import { getApiErrorMessage } from '../../../features/auth/authErrors'

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

function LoginPage() {
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState(initialTouched)
  const [showPassword, setShowPassword] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const loginMutation = useLoginMutation()
  const navigate = useNavigate()
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

    try {
      await loginMutation.mutateAsync({
        email: form.email,
        password: form.password,
      })

      setNotification({
        open: true,
        severity: 'success',
        message: 'Đăng nhập thành công.',
      })
      setForm(initialForm)
      setTouched(initialTouched)
      navigate('/home', { replace: true })
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Đăng nhập thất bại. Vui lòng thử lại.'),
      })
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
              Đăng nhập
            </Typography>
            <Typography color="text.secondary">Đăng nhập để tiếp tục sử dụng InteractHub.</Typography>
          </Stack>

          <Stack spacing={1.5}>
            <TextField
              label="Địa chỉ email"
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
              <Link component="button" type="button" underline="hover" onClick={handleOpenForgotPassword}>
                Quên mật khẩu?
              </Link>
            </Stack>
          </Stack>

          <Button type="submit" variant="contained" size="large" fullWidth disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>

          <Typography textAlign="center" color="text.secondary">
            Chưa có tài khoản?{' '}
            <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
              Đăng ký ngay
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

export default LoginPage
