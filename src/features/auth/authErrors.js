export function getApiErrorMessage(error, fallbackMessage) {
  if (!error?.response && error?.message === 'Network Error') {
    return 'Khong ket noi duoc API. Hay kiem tra backend dang chay va khoi dong lai frontend dev server.'
  }

  const responseData = error?.response?.data

  if (responseData?.errors && typeof responseData.errors === 'object') {
    const firstErrorList = Object.values(responseData.errors).find(
      (value) => Array.isArray(value) && value.length > 0,
    )
    if (firstErrorList) {
      return firstErrorList[0]
    }
  }

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData
  }

  if (responseData?.detail) {
    return responseData.detail
  }

  if (responseData?.title) {
    return responseData.title
  }

  if (responseData?.message) {
    return responseData.message
  }

  if (error?.message) {
    return error.message
  }

  return fallbackMessage
}

