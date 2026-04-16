import Button from '@mui/material/Button'

function PrimaryButton({ children, ...props }) {
  return (
    <Button variant="contained" color="primary" {...props}>
      {children}
    </Button>
  )
}

export default PrimaryButton
