import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const reports = [
  {
    id: 'REP-902',
    reporter: 'alex_mod',
    reason: 'Vi phạm ngôn từ thù ghét',
    excerpt:
      '“Đây là một ví dụ về nội dung có khả năng gây hại đã bị hệ thống gắn cờ vì vi phạm nguyên tắc cộng đồng liên quan đến ngôn từ xúc phạm.”',
    createdAt: '14 phút trước',
    severity: 'Nghiêm trọng',
  },
  {
    id: 'REP-899',
    reporter: 'System Bot #09',
    reason: 'Hoạt động spam nghi vấn',
    excerpt:
      '“Liên kết đáng ngờ được gửi lặp lại trong nhiều bình luận, tần suất bất thường và nội dung gần như giống hệt nhau.”',
    createdAt: '2 giờ trước',
    severity: 'Trung bình',
  },
  {
    id: 'REP-895',
    reporter: 'sarah_qc',
    reason: 'Nội dung gây hiểu lầm',
    excerpt:
      '“Bài viết chứa thông tin chưa được xác thực và có thể dẫn người dùng đến nhận định sai về một sự kiện đang diễn ra.”',
    createdAt: '5 giờ trước',
    severity: 'Cần xem xét',
  },
]

function severityColor(level) {
  if (level === 'Nghiêm trọng') return 'error'
  if (level === 'Trung bình') return 'warning'
  return 'default'
}

function ReportCard({ report }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar sx={{ width: 34, height: 34 }}>{report.reporter[0].toUpperCase()}</Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{report.reason}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Báo cáo bởi @{report.reporter} • {report.createdAt}
                </Typography>
              </Box>
            </Stack>
            <Chip label={report.severity} color={severityColor(report.severity)} size="small" />
          </Stack>

          <Box sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', backgroundColor: '#FAFAFA' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {report.excerpt}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" variant="outlined" color="inherit">
              Bỏ qua
            </Button>
            <Button size="small" variant="contained">
              Duyệt
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

function AdminModerationPage() {
  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        Moderation
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        Xem xét và xử lý các nội dung bị báo cáo để giữ an toàn cho cộng đồng.
      </Typography>

      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' }, gap: 2.5 }}>
        <Stack spacing={2}>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </Stack>

        <Stack spacing={2}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Tổng quan kiểm duyệt
              </Typography>
              <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Báo cáo chờ xử lý</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{reports.length}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Mức nghiêm trọng</Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {reports.filter((item) => item.severity === 'Nghiêm trọng').length}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Xử lý hôm nay</Typography>
                  <Typography sx={{ fontWeight: 700 }}>18</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, backgroundColor: '#1F2937', color: '#FFFFFF' }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700 }}>Gợi ý xử lý nhanh</Typography>
              <Typography sx={{ mt: 1, color: 'rgba(255,255,255,0.78)' }}>
                Ưu tiên duyệt các báo cáo có mức nghiêm trọng trước, sau đó xử lý các báo cáo spam lặp lại.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  )
}

export default AdminModerationPage
