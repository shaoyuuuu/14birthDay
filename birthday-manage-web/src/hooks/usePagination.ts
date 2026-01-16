import { ref, computed, type Ref } from 'vue'
import { PAGINATION_CONFIG } from '@/config'

interface UsePaginationOptions {
  defaultPageSize?: number
  pageSizeOptions?: number[]
}

interface UsePaginationReturn {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  pageSizeOptions: number[]
  offset: Ref<number>
  handlePageChange: (page: number) => void
  handleSizeChange: (size: number) => void
  reset: () => void
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    defaultPageSize = PAGINATION_CONFIG.defaultPageSize,
    pageSizeOptions = [...PAGINATION_CONFIG.pageSizeOptions],
  } = options

  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)

  const offset = computed(() => (currentPage.value - 1) * pageSize.value)

  const handlePageChange = (page: number) => {
    currentPage.value = page
  }

  const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
  }

  const reset = () => {
    currentPage.value = 1
    pageSize.value = defaultPageSize
    total.value = 0
  }

  return {
    currentPage,
    pageSize,
    total,
    pageSizeOptions,
    offset,
    handlePageChange,
    handleSizeChange,
    reset,
  }
}
