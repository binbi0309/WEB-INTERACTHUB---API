import { useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import KeyRoundedIcon from '@mui/icons-material/KeyRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import { Link as RouterLink } from 'react-router-dom'
import { useRegisterMutation } from '../../../features/auth/hooks/useAuthMutations'
import { getApiErrorMessage } from '../../../features/auth/authErrors'

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
  if (!value.trim()) return 'Vui lòng nhập họ và tên.'
  if (value.trim().length < 2) return 'Họ và tên phải có ít nhất 2 ký tự.'
  return ''
}

function validateEmail(value) {
  if (!value.trim()) return 'Vui lòng nhập địa chỉ email.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) return 'Email không đúng định dạng.'
  return ''
}

function validatePassword(value) {
  if (!value) return 'Vui lòng nhập mật khẩu.'
  if (value.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.'
  return ''
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Vui lòng nhập lại mật khẩu.'
  if (password !== confirmPassword) return 'Mật khẩu nhập lại không khớp.'
  return ''
}

function getPasswordChecks(password, confirmPassword) {
  return [
    { label: '8+ ký tự', valid: password.length >= 8 },
    { label: 'Một chữ số', valid: /\d/.test(password) },
    {
      label: 'Khớp nhau',
      valid: confirmPassword.length > 0 && password === confirmPassword,
      invalid: confirmPassword.length > 0 && password !== confirmPassword,
    },
  ]
}

function MobileRegisterPage() {
  const [form, setForm] = useState(initialForm)
  const [touched, setTouched] = useState(initialTouched)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const registerMutation = useRegisterMutation()
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
    setForm((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleBlur = (event) => {
    const { name } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleCloseNotification = (_, reason) => {
    if (reason === 'clickaway') return
    setNotification((prev) => ({ ...prev, open: false }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true })

    if (!isFormValid) {
      setNotification({
        open: true,
        severity: 'error',
        message: 'Vui lòng kiểm tra lại thông tin đăng ký.',
      })
      return
    }

    try {
      await registerMutation.mutateAsync({
        email: form.email,
        password: form.password,
      })

      setNotification({
        open: true,
        severity: 'success',
        message: 'Đăng ký thành công. Bạn có thể đăng nhập ngay.',
      })
      setForm(initialForm)
      setTouched(initialTouched)
    } catch (error) {
      setNotification({
        open: true,
        severity: 'error',
        message: getApiErrorMessage(error, 'Đăng ký thất bại. Vui lòng thử lại.'),
      })
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F3F4F6', px: 2.5, py: 4 }}>
      <Stack spacing={2.5} sx={{ maxWidth: 430, mx: 'auto' }}>
        <Stack alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2.5,
              backgroundColor: '#6B7280',
              color: '#FFFFFF',
              display: 'grid',
              placeItems: 'center',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            *
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Bắt đầu hành trình của bạn
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            Kết nối, chia sẻ và phát triển cùng cộng đồng chuyên nghiệp.
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ borderRadius: 5, p: 3, border: '1px solid', borderColor: 'rgba(0,0,0,0.08)' }}>
          <Stack component="form" spacing={1.5} onSubmit={handleSubmit} noValidate>
            <TextField
              label="Họ tên"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullName && Boolean(errors.fullName)}
              helperText={touched.fullName ? errors.fullName || ' ' : ' '}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRoundedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email ? errors.email || ' ' : ' '}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRoundedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
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

            <TextField
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword ? errors.confirmPassword || ' ' : ' '}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyRoundedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        edge="end"
                        aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showConfirmPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ py: 0.5 }}>
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
                  size="small"
                  color={item.invalid ? 'error' : item.valid ? 'primary' : 'default'}
                  variant={item.valid || item.invalid ? 'filled' : 'outlined'}
                />
              ))}
            </Stack>

            <Button type="submit" fullWidth size="large" variant="contained" disabled={registerMutation.isPending} sx={{ borderRadius: 3, py: 1.25 }}>
              {registerMutation.isPending ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
          </Stack>
        </Paper>

        <Typography textAlign="center" color="text.secondary">
          Đã có tài khoản?{' '}
          <Link component={RouterLink} to="/login" underline="hover" fontWeight={700}>
            Đăng nhập ngay
          </Link>
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center">
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Điều khoản
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Bảo mật
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Hỗ trợ
          </Typography>
        </Stack>
      </Stack>

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

export default MobileRegisterPage
